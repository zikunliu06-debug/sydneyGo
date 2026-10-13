import type { Place, JourneyRoute, Message, Post } from "../types";
export const places: Place[] = [
  {
    name: "Glebe Point Road · Demo origin",
    coords: [151.1855, -33.8795],
    source: "Sydney demo location",
  },
  {
    name: "University of Technology Sydney",
    coords: [151.2005, -33.8832],
    source: "Curated Sydney place",
  },
  {
    name: "Central Station",
    coords: [151.2066, -33.883],
    source: "Curated Sydney place",
  },
  {
    name: "Town Hall",
    coords: [151.2069, -33.8732],
    source: "Curated Sydney place",
  },
  {
    name: "Broadway Shopping Centre",
    coords: [151.1939, -33.8845],
    source: "Curated Sydney place",
  },
  {
    name: "Circular Quay",
    coords: [151.211, -33.8611],
    source: "Curated Sydney place",
  },
  {
    name: "Sydney Opera House",
    coords: [151.2153, -33.8568],
    source: "Curated Sydney place",
  },
];
export const routes: JourneyRoute[] = [
  {
    id: "a",
    name: "Stay on Bus 370",
    mode: "Bus",
    line: "370",
    minutes: 35,
    bus: 8,
    walk: 4,
    transfers: 0,
    delay: 12,
    note: "Less walking, but Broadway congestion adds 12 minutes.",
    geometry: [
      [151.1855, -33.8795],
      [151.187, -33.884],
      [151.194, -33.8845],
      [151.2005, -33.8832],
    ],
  },
  {
    id: "b",
    name: "Bus + a short walk",
    mode: "Bus + Walk",
    line: "431",
    minutes: 24,
    bus: 5,
    walk: 9,
    transfers: 0,
    delay: 0,
    note: "Avoids the demo disruption. Walk 9 minutes to your destination.",
    geometry: [
      [151.1855, -33.8795],
      [151.188, -33.878],
      [151.197, -33.879],
      [151.2005, -33.8832],
    ],
  },
  {
    id: "c",
    name: "Light rail via Central",
    mode: "Light rail + Walk",
    line: "L1",
    minutes: 29,
    bus: null,
    walk: 7,
    transfers: 1,
    delay: 0,
    note: "More predictable in this simulation, with one transfer.",
    geometry: [
      [151.1855, -33.8795],
      [151.191, -33.875],
      [151.201, -33.879],
      [151.2066, -33.883],
      [151.2005, -33.8832],
    ],
  },
];
// Fixed source timestamps are intentional: the demo never claims fresh live observations.
export const incident = {
  id: "broadway",
  title: "Heavy traffic on Broadway",
  location: "Broadway, near Bay Street",
  coords: [151.194, -33.8845] as [number, number],
  updated: "2026-10-14T08:42:00+11:00",
  source: "SydneyGo university scenario · simulated report",
  description:
    "A simulated traffic accident is slowing eastbound traffic near Bay Street. Bus 370 is affected. Allow approximately 12 extra minutes.",
};
export const messages: Message[] = [
  {
    id: "m1",
    author: "Alex",
    text: "Our 370 is moving slowly near Broadway. Might be worth taking the alternative.",
    time: "2026-10-14T08:39:00+11:00",
    demo: true,
  },
  {
    id: "m2",
    author: "Priya",
    text: "The footpath is clear. I’m walking the last part to UTS.",
    time: "2026-10-14T08:41:00+11:00",
    demo: true,
  },
];
export const posts: Post[] = [
  {
    id: "p1",
    author: "Jess L.",
    route: "L1",
    category: "Accessibility",
    location: "Central Station",
    text: "A little tip for the Central light rail interchange: follow the lift signs near the concourse if you need step-free access. Leave a few extra minutes for the walk.",
    time: "2026-10-13T17:30:00+11:00",
    demo: true,
    helpful: [],
    comments: [
      {
        id: "c1",
        author: "Sam",
        text: "Thanks for sharing — useful for my next trip.",
        time: "2026-10-13T18:00:00+11:00",
        demo: true,
      },
    ],
  },
  {
    id: "p2",
    author: "Daniel",
    route: "370",
    category: "Delays",
    location: "Broadway",
    text: "What’s your go-to alternative when Broadway gets busy? I’ve been trying a bus and walk combination.",
    time: "2026-10-14T08:00:00+11:00",
    demo: true,
    helpful: [],
    comments: [],
  },
  {
    id: "p3",
    author: "Mia",
    route: "T1",
    category: "Crowding",
    location: "Town Hall",
    text: "Planning a trip outside the morning peak? It can make the ride a lot more comfortable. Share your favourite quieter travel windows.",
    time: "2026-10-12T12:00:00+11:00",
    demo: true,
    helpful: [],
    comments: [],
  },
];
export const categories = [
  "Delays",
  "Crowding",
  "Accessibility",
  "Station Information",
  "General Advice",
];
