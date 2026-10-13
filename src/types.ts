export type Place = { name: string; coords: [number, number]; source?: string };
export type JourneyRoute = {
  id: string;
  name: string;
  mode: string;
  line: string;
  minutes: number;
  bus: number | null;
  walk: number;
  transfers: number;
  delay: number;
  note: string;
  geometry: [number, number][];
};
export type User = { name: string; email: string; bio: string; guest: boolean };
export type Message = {
  id: string;
  author: string;
  text: string;
  time: string;
  photo?: string;
  demo?: boolean;
};
export type Post = {
  id: string;
  author: string;
  route: string;
  category: string;
  location: string;
  text: string;
  time: string;
  photo?: string;
  demo?: boolean;
  helpful: string[];
  comments: Message[];
};
