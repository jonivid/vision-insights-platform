import { api } from './axios';

export interface Video {
  id: string;
  url: string;
  status: string;
  createdAt: string;
}

export interface TranscriptLine {
  id: string;
  startSeconds: number;
  endSeconds: number;
  text: string;
}

export interface Results {
  transcripts: TranscriptLine[];
  tags: any[];
}

export const listVideos = () =>
  api.get<Video[]>('/videos').then(res => res.data);

export const createVideo = (url: string) =>
  api.post<Video>('/videos', { url }).then(res => res.data);

export const getVideo = (id: string) =>
  api.get<Video>(`/videos/${id}`).then(res => res.data);

export const getResults = (id: string) =>
  api.get<Results>(`/videos/${id}/results`).then(res => res.data);