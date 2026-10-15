const formatters = new Map();

const getFormatter = (currency, digits) => {
  const key = `${currency}|${digits}`;

  if (!formatters.has(key)) {
    let formatter;
    try {
      formatter = new Intl.NumberFormat(undefined, {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: Math.max(2, digits),
      });
    } catch {
      // Not an ISO 4217 code (e.g. "beads"), show it as a suffix instead.
      formatter = null;
    }
    formatters.set(key, formatter);
  }

  return formatters.get(key);
};

export const formatMoney = (amount, currency, digits = 2) => {
  const formatter = getFormatter(currency, digits);
  if (formatter) return formatter.format(amount);

  const fixed = amount.toFixed(Math.max(2, digits));
  return currency ? `${fixed} ${currency}` : fixed;
};

export const formatNumber = (n) => new Intl.NumberFormat().format(n);
