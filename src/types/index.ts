export interface Photo {
  id: string;
  filepath: string;
  webviewPath?: string;
  annotation: string;
  timestamp: number;
}

export interface PhotoMetadata {
  id: string;
  filename: string;
  annotation: string;
  timestamp: number;
}

