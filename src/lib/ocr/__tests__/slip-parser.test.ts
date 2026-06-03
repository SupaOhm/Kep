import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { parseSlipText } from "../slip-parser";

function fixture(name: string) {
  return readFileSync(join(__dirname, "fixtures", name), "utf8");
}

describe("parseSlipText", () => {
  describe("KBank basic slip", () => {
    const result = parseSlipText(fixture("kbank-basic.txt"));

    it("detects bank name", () => {
      expect(result.bank_name).toBe("KBank");
    });

    it("extracts labeled amount below จำนวนเงิน with ฿ prefix", () => {
      expect(result.amount).toBe("1250.00");
    });

    it("converts Thai Buddhist Era date with named month to Gregorian datetime", () => {
      expect(result.occurred_at).toBe("2025-06-03T14:23");
    });

    it("extracts receiver from ผู้รับเงิน label", () => {
      expect(result.receiver_name).toBe("ร้านสมมติ");
    });

    it("extracts reference from หมายเลขอ้างอิง label on preceding line", () => {
      expect(result.reference_id).toBe("KPLS256806031234567");
    });
  });

  describe("SCB basic slip", () => {
    const result = parseSlipText(fixture("scb-basic.txt"));

    it("detects bank name", () => {
      expect(result.bank_name).toBe("SCB");
    });

    it("extracts labeled amount from ยอดเงิน", () => {
      expect(result.amount).toBe("850.00");
    });

    it("parses DD/MM/YYYY date with time", () => {
      expect(result.occurred_at).toBe("2025-06-03T14:05");
    });

    it("extracts receiver from ถึง label", () => {
      expect(result.receiver_name).toBe("WANTANA K.");
    });

    it("extracts reference from เลขที่รายการ label", () => {
      expect(result.reference_id).toBe("SCB2506031234567");
    });
  });

  describe("Krungthai basic slip", () => {
    const result = parseSlipText(fixture("krungthai-basic.txt"));

    it("detects bank name", () => {
      expect(result.bank_name).toBe("Krungthai");
    });

    it("extracts labeled amount from Amount keyword with THB currency", () => {
      expect(result.amount).toBe("3500.00");
    });

    it("parses ISO-format date with time", () => {
      expect(result.occurred_at).toBe("2025-06-03T09:15");
    });

    it("extracts receiver from To: label", () => {
      expect(result.receiver_name).toBe("RECIPIENT NAME");
    });

    it("extracts reference from Transaction No. label", () => {
      expect(result.reference_id).toBe("KTB2506031234567");
    });
  });

  describe("Bangkok Bank basic slip", () => {
    const result = parseSlipText(fixture("bangkok-bank-basic.txt"));

    it("detects bank name via Bualuang keyword", () => {
      expect(result.bank_name).toBe("Bangkok Bank");
    });

    it("extracts labeled amount from Amount keyword", () => {
      expect(result.amount).toBe("600.00");
    });

    it("parses DD/MM/YYYY date with double-space before time", () => {
      expect(result.occurred_at).toBe("2025-06-03T11:30");
    });

    it("extracts receiver from Recipient label", () => {
      expect(result.receiver_name).toBe("COFFEE SHOP DEMO");
    });

    it("extracts reference from Reference label", () => {
      expect(result.reference_id).toBe("BBL2506031234567");
    });
  });

  describe("Krungsri basic slip", () => {
    const result = parseSlipText(fixture("krungsri-basic.txt"));

    it("detects bank name via Bank of Ayudhya BAY keyword", () => {
      expect(result.bank_name).toBe("Krungsri");
    });

    it("extracts labeled amount from ยอดชำระ", () => {
      expect(result.amount).toBe("420.00");
    });

    it("converts Buddhist Era numeric date to Gregorian with no time defaults to midnight", () => {
      expect(result.occurred_at).toBe("2025-06-03T00:00");
    });

    it("extracts receiver from ผู้รับเงิน label", () => {
      expect(result.receiver_name).toBe("GROCERY DEMO");
    });

    it("extracts reference from เลขอ้างอิง label", () => {
      expect(result.reference_id).toBe("BAY256806031234567");
    });
  });

  describe("ttb basic slip", () => {
    const result = parseSlipText(fixture("ttb-basic.txt"));

    it("detects bank name via ทีเอ็มบีธนชาต", () => {
      expect(result.bank_name).toBe("ttb");
    });

    it("extracts labeled amount from จำนวนเงิน with trailing THB", () => {
      expect(result.amount).toBe("2200.00");
    });

    it("parses DD/MM/YYYY date with Thai เวลา separator before time", () => {
      expect(result.occurred_at).toBe("2025-06-03T16:45");
    });

    it("extracts receiver from ชื่อผู้รับ label", () => {
      expect(result.receiver_name).toBe("DEMO RECIPIENT");
    });

    it("extracts reference from รหัสอ้างอิง label", () => {
      expect(result.reference_id).toBe("TTB2506031234567");
    });
  });

  describe("raw_text is always preserved", () => {
    it("returns the original text unchanged", () => {
      const raw = "KBank\nจำนวนเงิน 100.00";
      expect(parseSlipText(raw).raw_text).toBe(raw);
    });
  });

  describe("graceful degradation on empty/garbage input", () => {
    it("returns empty SlipDraft fields when no recognizable content", () => {
      const result = parseSlipText("Lorem ipsum dolor sit amet.");
      expect(result.bank_name).toBeUndefined();
      expect(result.amount).toBeUndefined();
      expect(result.occurred_at).toBeUndefined();
      expect(result.reference_id).toBeUndefined();
      expect(result.raw_text).toBe("Lorem ipsum dolor sit amet.");
    });
  });
});
