import { toDateTimeLocalValue } from "@/lib/date/periods";
import type { SlipDraft } from "./slip-processor";

const bankPatterns: Array<[string, RegExp]> = [
  ["KBank", /(kbank|kplus|k\s*plus|kasikorn|กสิกร)/i],
  ["SCB", /(scb|ไทยพาณิชย์)/i],
  ["Krungthai", /(krungthai|กรุงไทย)/i],
  ["Bangkok Bank", /(bangkok\s*bank|กรุงเทพ|bualuang)/i],
  ["Krungsri", /(krungsri|กรุงศรี|bank\s+of\s+ayudhya|\bbay\b)/i],
  ["ttb", /\bttb\b|tmbthanachart|ทีเอ็มบีธนชาต|ทหารไทย|ธนชาต|\btmb\b/i],
];

const thaiMonthMap: Record<string, number> = {
  "ม.ค.": 1, "มกราคม": 1,
  "ก.พ.": 2, "กุมภาพันธ์": 2,
  "มี.ค.": 3, "มีนาคม": 3,
  "เม.ย.": 4, "เมษายน": 4,
  "พ.ค.": 5, "พฤษภาคม": 5,
  "มิ.ย.": 6, "มิถุนายน": 6,
  "ก.ค.": 7, "กรกฎาคม": 7,
  "ส.ค.": 8, "สิงหาคม": 8,
  "ก.ย.": 9, "กันยายน": 9,
  "ต.ค.": 10, "ตุลาคม": 10,
  "พ.ย.": 11, "พฤศจิกายน": 11,
  "ธ.ค.": 12, "ธันวาคม": 12,
};

// Matches: "3 มิ.ย. 2568 เวลา 14:23" or "3 มิถุนายน 2025 09:15"
const THAI_DATE_RE =
  /(\d{1,2})\s+(ม\.ค\.|ก\.พ\.|มี\.ค\.|เม\.ย\.|พ\.ค\.|มิ\.ย\.|ก\.ค\.|ส\.ค\.|ก\.ย\.|ต\.ค\.|พ\.ย\.|ธ\.ค\.|มกราคม|กุมภาพันธ์|มีนาคม|เมษายน|พฤษภาคม|มิถุนายน|กรกฎาคม|สิงหาคม|กันยายน|ตุลาคม|พฤศจิกายน|ธันวาคม)\s+(\d{4})(?:[^\d\n]{0,10}(\d{1,2}):(\d{2}))?/;

export function parseSlipText(rawText: string): SlipDraft {
  const text = rawText.replace(/\r/g, "\n");
  const bank = bankPatterns.find(([, pattern]) => pattern.test(text))?.[0];

  return {
    amount: detectAmount(text),
    occurred_at: detectDateTime(text),
    receiver_name: detectReceiver(text),
    merchant_name: detectMerchant(text),
    bank_name: bank,
    reference_id: detectReference(text),
    raw_text: rawText,
  };
}

function detectAmount(text: string): string | undefined {
  // Priority 1: labeled by amount keyword — most reliable path
  const labeled = text.match(
    /(?:amount|total|จำนวนเงิน|ยอดเงิน|ยอดโอน|ยอดชำระ|โอนเงิน)\s*[:/]?\s*(?:฿|THB)?\s*([0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]{2})?)/i
  );
  if (labeled?.[1]) return labeled[1].replace(/,/g, "");

  // Priority 2: currency symbol immediately before a number
  const currencyFirst = text.match(
    /(?:฿|THB)\s*([0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]{2})?)/i
  );
  if (currencyFirst?.[1]) return currencyFirst[1].replace(/,/g, "");

  // Priority 3: number followed by บาท
  const bahtSuffix = text.match(
    /([0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]{2})?)\s*บาท/
  );
  if (bahtSuffix?.[1]) return bahtSuffix[1].replace(/,/g, "");

  // Fallback: largest number with exactly 2 decimal places.
  // Requiring the decimal point excludes bare account numbers and phone numbers
  // which appear without a fractional part.
  const candidates = [
    ...text.matchAll(/([0-9]{1,3}(?:,[0-9]{3})*\.[0-9]{2})/g),
  ].map((m) => m[1]);

  const best = candidates
    .map((raw) => ({ raw, value: Number(raw.replace(/,/g, "")) }))
    .filter((c) => Number.isFinite(c.value) && c.value > 0)
    .sort((a, b) => b.value - a.value)[0];

  return best?.raw.replace(/,/g, "");
}

function detectDateTime(text: string): string | undefined {
  // Thai named month: "3 มิ.ย. 2568 เวลา 14:23"
  const thai = text.match(THAI_DATE_RE);
  if (thai) {
    const [, day, monthName, year, hour = "0", minute = "0"] = thai;
    const month = thaiMonthMap[monthName];
    if (month !== undefined) {
      const fullYear = normalizeYear(Number(year));
      return toDateTimeLocalValue(
        new Date(fullYear, month - 1, Number(day), Number(hour), Number(minute))
      );
    }
  }

  // ISO-ish YYYY-MM-DD or YYYY/MM/DD — must run before DD/MM to prevent
  // "2025-06-03" being partially matched as "25-06-03" by the numeric pattern.
  const iso = text.match(
    /(\d{4})[/-](\d{1,2})[/-](\d{1,2})(?:[^\d\n]{0,10}(\d{1,2}):(\d{2}))?/
  );
  if (iso) {
    const [, year, month, day, hour = "0", minute = "0"] = iso;
    return toDateTimeLocalValue(
      new Date(
        Number(year),
        Number(month) - 1,
        Number(day),
        Number(hour),
        Number(minute)
      )
    );
  }

  // Numeric DD/MM/YYYY or DD-MM-YYYY (handles Buddhist Era 4-digit years)
  const numeric = text.match(
    /(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})(?:[^\d\n]{0,10}(\d{1,2}):(\d{2}))?/
  );
  if (numeric) {
    const [, day, month, year, hour = "0", minute = "0"] = numeric;
    const fullYear = normalizeYear(Number(year));
    return toDateTimeLocalValue(
      new Date(
        fullYear,
        Number(month) - 1,
        Number(day),
        Number(hour),
        Number(minute)
      )
    );
  }

  return undefined;
}

function normalizeYear(year: number): number {
  if (year > 2400) return year - 543; // Buddhist Era → Gregorian
  if (year < 100) return 2000 + year; // 2-digit Gregorian shorthand
  return year;
}

function detectReference(text: string): string | undefined {
  // [^A-Z0-9] stops the separator from greedily consuming the uppercase/digit
  // prefix of the reference ID itself (e.g. "SCB", "KTB", "BBL").
  const match = text.match(
    /(?:reference|ref\.?|transaction\s+(?:id|no\.?)|trans\.?\s*(?:id|no\.?)|เลขที่รายการ|หมายเลขอ้างอิง|รหัสอ้างอิง|เลขอ้างอิง)[^A-Z0-9]{0,24}([A-Z0-9_-]{6,40})/i
  );
  return match?.[1];
}

function detectReceiver(text: string): string | undefined {
  // \bto\b prevents matching "to" inside words like "touch" or "total".
  const match = text.match(
    /(?:\bto\b|receiver|recipient|ผู้รับ(?:เงิน)?|ชื่อผู้รับ|ถึง)\s*:?\s*([^\n]{3,80})/i
  );
  return match?.[1]?.trim();
}

function detectMerchant(text: string): string | undefined {
  const match = text.match(
    /(?:merchant|ร้านค้า)\s*:?\s*([^\n]{3,80})/i
  );
  return match?.[1]?.trim();
}
