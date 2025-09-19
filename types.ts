
export interface EditingOptions {
  clothingStyle: string;
  collarStyle: string;
  customCollar: string;
  clothingColor: string;
  clothingPattern: string;
  hairstyle: string;
  customHairstyle: string;
  expression: string;
}

export interface GeneratedImage {
  id: number;
  src: string;
  title: string;
  colorName: string;
}

export type AppState = 'idle' | 'loading' | 'success' | 'error';
