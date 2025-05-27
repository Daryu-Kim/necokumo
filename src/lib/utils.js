export async function generateUUIDFromSeed(seed, length = 12) {
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let hash = 0;

  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }

  let uuid = "";
  for (let i = 0; i < length; i++) {
    const index = Math.abs((hash + i * 31) % charset.length);
    uuid += charset.charAt(index);
  }

  return uuid;
}
