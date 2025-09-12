
export enum Tab {
  GENERATE = 'generate',
  EDIT = 'edit',
}

export interface UploadedImage {
  file: File | null;
  dataUrl: string;
}
