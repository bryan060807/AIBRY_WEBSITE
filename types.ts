// types.ts

export interface GeneratedSong {
  title: string;
  description: string;
  audioUrl: string;
}

export interface SongDetailsResponse {
  title: string;
  description: string;
}

export interface SavedProject {
  id: string;
  name:string;
  savedAt: string;
  inputs: {
    lyrics: string;
    title: string;
    genre: string;
    style: string;
    productionNotes: string;
  };
  generated: {
    title: string;
    description: string;
  } | null;
}