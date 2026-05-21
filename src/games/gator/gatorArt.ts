export type GatorArtVariant = 'triangle' | 'friendly' | 'symbol' | 'cartoon' | 'profile';

export const GATOR_ART_VARIANTS: { id: GatorArtVariant; label: string; blurb: string }[] = [
  { id: 'triangle', label: 'Classic jaw', blurb: 'Simple hungry triangle mouth' },
  { id: 'friendly', label: 'Friendly gator', blurb: 'Round snout and big eyes' },
  { id: 'symbol', label: 'Math symbol', blurb: 'Bold > and < with eyes' },
  { id: 'cartoon', label: 'Cartoon chomp', blurb: 'Top and bottom jaws with teeth' },
  { id: 'profile', label: 'Side profile', blurb: 'Gator head from the side' },
];

const STORAGE_KEY = 'hungry-gators-art-variant';

export function loadGatorArtVariant(): GatorArtVariant {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (GATOR_ART_VARIANTS.some((v) => v.id === raw)) {
      return raw as GatorArtVariant;
    }
  } catch {
    /* ignore */
  }
  return 'symbol';
}

export function saveGatorArtVariant(variant: GatorArtVariant): void {
  try {
    localStorage.setItem(STORAGE_KEY, variant);
  } catch {
    /* ignore */
  }
}
