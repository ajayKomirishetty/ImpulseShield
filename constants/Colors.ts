const Colors = {
  // --- CORE PALETTE ---
  primary: '#FF6B6B', // Red-Pink
  primaryDark: '#EE5A52',
  primaryLight: '#FF8E8E',
  secondary: '#4ECDC4', // Teal
  secondaryDark: '#45B7AF',
  secondaryLight: '#6FD9D1',
  accent: '#FFE66D', // Yellow/Gold
  accentDark: '#F5DC5C',
  success: '#51CF66', // Green
  warning: '#FF922B', // Orange
  danger: '#FF6B6B', // Red (Often same as primary, but good to separate)
  error: '#DC3545', // Red for errors (Slightly darker than danger)

  // --- EXTENDED BRAND COLORS (Used for Goals/Charts) ---
  purple: '#845EC2',
  pink: '#FF6F91',
  blue: '#00C9FF',
  teal: '#00D2FC',
  orange: '#FFC75F',
  green: '#00F2C3',
  
  // --- NEUTRAL SHADES (Crucial for modern UIs) ---
  gray50: '#F9FAFB',
  gray100: '#F3F4F6', // Lighter background/border
  gray200: '#E5E7EB',
  gray300: '#D1D5DB', // Standard border
  gray400: '#9CA3AF',
  gray500: '#6B7280', // Text secondary
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827', // Darkest background
  
  // --- BACKGROUNDS & SURFACES ---
  background: '#FAFBFF', // Very light background
  backgroundSecondary: '#F3F4F8', // Slightly darker sections
  backgroundDark: '#1A1D2E', // Deep dark theme background
  surface: '#FFFFFF', // Card/component background
  surfaceElevated: '#FFFFFF', // Surface with shadow (Can be slightly different shade)
  surfaceDark: '#2D3748', // Card background in dark mode

  // --- TEXT ---
  text: '#1A1D2E', // Primary text color (Very dark gray)
  textSecondary: '#6B7280', // Less important text, descriptions
  textTertiary: '#9CA3AF', // Hints, disabled state, metadata
  textDark: '#FFFFFF', // Text on dark/primary surfaces
  icon: '#4B5563', // Default icon color (A shade of gray)
  
  // --- BORDERS & SEPARATORS ---
  border: '#E5E7EB', // Standard border (Gray 200)
  borderLight: '#F3F4F6', // Very subtle separator
  borderDark: '#4B5563', // Border in dark mode
  
  // --- SHADOWS & OVERLAYS ---
  shadow: 'rgba(26, 29, 46, 0.1)', // Light shadow color
  shadowStrong: 'rgba(26, 29, 46, 0.25)', // Stronger shadow for elevated elements
  overlay: 'rgba(26, 29, 46, 0.5)', // Modal/screen overlay
  
  // --- GRADIENTS (Can remain the same, they are well-defined) ---
  gradient1: ['#FF6B6B', '#FF8E53'],
  gradient2: ['#4ECDC4', '#44A08D'],
  gradient3: ['#845EC2', '#D65DB1'],
  gradient4: ['#FFE66D', '#FFA36C'],
  gradient5: ['#00C9FF', '#92FE9D'],
};

export default Colors;