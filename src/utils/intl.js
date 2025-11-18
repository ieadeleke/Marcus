export const formatCurrencyIntl = (value, currency = 'USD', locale) => {
  try {
    const nf = new Intl.NumberFormat(locale || undefined, { style: 'currency', currency });
    return nf.format(Number(value || 0));
  } catch (_) {
    return `$${Number(value || 0).toFixed(2)}`;
  }
};

export const formatDateIntl = (date, locale, options = {}) => {
  try {
    const d = date instanceof Date ? date : new Date(date);
    return new Intl.DateTimeFormat(locale || undefined, {
      year: 'numeric', month: 'short', day: '2-digit',
      ...options,
    }).format(d);
  } catch (_) {
    return String(date);
  }
};

