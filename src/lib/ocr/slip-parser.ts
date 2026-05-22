import { toDateTimeLocalValue } from "@/lib/date/periods";
import type { SlipDraft } from "./slip-processor";

const bankPatterns: Array<[string, RegExp]> = [
  ["KBank", /(kbank|kasikorn|กสิกร)/i],
  ["SCB", /(scb|ไทยพาณิชย์)/i],
  ["Krungthai", /(krungthai|กรุงไทย)/i],
  ["Bangkok Bank", /(bangkok bank|กรุงเทพ)/i],
  ["Krungsri", /(krungsri|กรุงศรี)/i],
  ["ttb", /\bttb\b|ทหารไทย|ธนชาต/i]
];

export function parseSlipText(rawText: string): SlipDraft {
  const text = rawText.replace(/\r/g, "\n");
  const bank = bankPatterns.find(([, pattern]) => pattern.test(text))?.[0];
  const amount = detectAmount(text);
  const occurredAt = detectDateTime(text);
  const referenceId = detectReference(text);
  const receiver = detectReceiver(text);

  return {
    amount,
    occurred_at: occurredAt,
    receiver_name: receiver,
    bank_name: bank,
    reference_id: referenceId,
    raw_text: rawText
  };
}

function detectAmount(text: string) {
  const labeledAmount = text.match(
    /(?:amount|total|จำนวนเงิน|ยอดเงิน|โอนเงิน|บาท|thb)\D{0,24}(?:฿|THB)?\s*([0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]{2})|[0-9]+(?:\.[0-9]{2}))/i
  );
  if (labeledAmount?.[1]) return labeledAmount[1].replace(/,/g, "");

  const candidates = Array.from(
    text.matchAll(/(?:฿|THB)?\s*([0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]{2})|[0-9]+(?:\.[0-9]{2}))/gi)
  )
    .map((match) => match[1])
    .filter(Boolean);

  return candidates
    .map((candidate) => ({ raw: candidate, value: Number(candidate.replace(/,/g, "")) }))
    .filter((candidate) => Number.isFinite(candidate.value) && candidate.value > 0)
    .sort((a, b) => b.value - a.value)[0]
    ?.raw.replace(/,/g, "");
}

function detectDateTime(text: string) {
  const numericDate = text.match(/(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})(?:\s+(\d{1,2}):(\d{2}))?/);
  if (numericDate) {
    const [, day, month, year, hour = "00", minute = "00"] = numericDate;
    const fullYear = normalizeYear(Number(year));
    return toDateTimeLocalValue(new Date(fullYear, Number(month) - 1, Number(day), Number(hour), Number(minute)));
  }

  const isoish = text.match(/(\d{4})[/-](\d{1,2})[/-](\d{1,2})(?:\s+(\d{1,2}):(\d{2}))?/);
  if (isoish) {
    const [, year, month, day, hour = "00", minute = "00"] = isoish;
    return toDateTimeLocalValue(new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute)));
  }

  return undefined;
}

function normalizeYear(year: number) {
  if (year > 2400) return year - 543;
  if (year < 100) return 2000 + year;
  return year;
}

function detectReference(text: string) {
  const match = text.match(
    /(?:reference|ref\.?|transaction|เลขที่รายการ|หมายเลขอ้างอิง)\D{0,24}([A-Z0-9-]{6,40})/i
  );
  return match?.[1];
}

function detectReceiver(text: string) {
  const match = text.match(/(?:to|receiver|recipient|ผู้รับ|ไปยัง)\s*:?\s*([^\n]{3,80})/i);
  return match?.[1]?.trim();
}
