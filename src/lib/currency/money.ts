const minorUnitDigits: Record<string, number> = {
  THB: 2,
  USD: 2,
  EUR: 2,
  GBP: 2,
  JPY: 0
};

export function getMinorUnitDigits(currencyCode: string) {
  return minorUnitDigits[currencyCode.toUpperCase()] ?? 2;
}

export function parseMoneyToMinor(value: string | number, currencyCode = "THB") {
  const digits = getMinorUnitDigits(currencyCode);
  const normalized = String(value).replace(/[,\s฿]/g, "").trim();

  if (!/^-?\d+(\.\d+)?$/.test(normalized)) {
    throw new Error("Invalid money amount.");
  }

  const [wholePart, decimalPart = ""] = normalized.split(".");
  const sign = wholePart.startsWith("-") ? -1 : 1;
  const whole = BigInt(wholePart.replace("-", "") || "0");
  const paddedDecimal = (decimalPart + "0".repeat(digits)).slice(0, digits);
  const minor = whole * BigInt(10 ** digits) + BigInt(paddedDecimal || "0");

  return Number(minor) * sign;
}

export function minorToMajor(minor: number, currencyCode = "THB") {
  return minor / 10 ** getMinorUnitDigits(currencyCode);
}

export function formatMoney(minor: number, currencyCode = "THB", locale = "th-TH") {
  const digits = getMinorUnitDigits(currencyCode);
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  }).format(minorToMajor(minor, currencyCode));
}

export function minorToInputValue(minor: number, currencyCode = "THB") {
  const digits = getMinorUnitDigits(currencyCode);
  return minorToMajor(minor, currencyCode).toFixed(digits);
}
