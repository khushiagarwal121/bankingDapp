export function shortenAddress(address) {
  if (!address) return "";
  return `${address.slice(0, 4)}...${address.slice(-3)}`;
}

export function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h}h ${m}m ${s}s`;
}
