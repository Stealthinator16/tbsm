// High contrast palette for dark mode (Zinc-950/Black background)
// Principles: High Luminance (>50%), High Saturation.
const FEATURE_PALETTE = [
  '#d8b4fe', // Fuchsia-300 (Soft Purple)
  '#bef264', // Lime-300 (Electric Lime)
  '#fca5a5', // Rose-300 (Soft Red)
  '#fde047', // Yellow-300 (Bright Yellow)
  '#67e8f9', // Cyan-300 (Bright Cyan - distinct from Calm's blue)
  '#93c5fd', // Sky-300 (Soft Blue)
];

export const getArtistColor = (name: string, calmColor: string, encoreColor: string) => {
  const n = name.toLowerCase();
  
  // Core Duo - Specific brand colors
  if (n.includes('calm')) return calmColor;
  if (n.includes('encore') || n.includes('abj')) return encoreColor;
  
  // Generic
  if (n.includes('chorus') || n.includes('seedhe maut') || n === 'unknown') return '#a1a1aa'; // Zinc-400 (visible gray)
  
  // Featured Artists
  let sum = 0;
  for (let i = 0; i < n.length; i++) {
    sum += n.charCodeAt(i);
  }
  
  return FEATURE_PALETTE[sum % FEATURE_PALETTE.length];
};
