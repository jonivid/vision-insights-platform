export class ReceiveTranscriptDto {
  text: string;
  words: { word: string; start: number; end: number }[];
}
