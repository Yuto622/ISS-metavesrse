export interface ModuleInfo {
  id: string;
  name: string;
  descriptionJa: string;
  descriptionEn: string;
  position: [number, number, number]; // Approx center for proximity check
}

export type CameraMode = 'FIRST_PERSON' | 'THIRD_PERSON';

export interface PlayerState {
  position: [number, number, number];
  rotation: [number, number, number];
}
