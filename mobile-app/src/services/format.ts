// Small shared formatting helpers (kept dependency-free)

export const formatPrice = (n: number): string =>
  '$' + n.toFixed(2).replace(/\.00$/, '');

export const formatPriceExact = (n: number): string => '$' + n.toFixed(2);

export const formatDate = (ms: number): string => {
  const d = new Date(ms);
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatRelative = (ms: number): string => {
  const diff = Date.now() - ms;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(ms);
};
