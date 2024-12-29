export interface Video {
  id: string;
  title: string;
  description: string;
  videoSrc: string;
}

export const videos: Video[] = [
  {
    id: "1",
    title: "Токијски Злодух",
    description: "arima.mp4",
    videoSrc: "https://i.imgur.com/EPmYe83.mp4",
  },
  {
    id: "2",
    title: "Судбина/Велики Поредак",
    description: "jalter.mp4",
    videoSrc: "https://i.imgur.com/i9p7Q1h.mp4",
  },
  {
    id: "3",
    title: "Судбина/Велики Поредак",
    description: "oberon.mp4",
    videoSrc: "https://i.imgur.com/DfwYhM6.mp4",
  },
  {
    id: "4",
    title: "Човек Тестера",
    description: "makima.mp4",
    videoSrc: "https://i.imgur.com/h72rp2V.mp4",
  },
  {
    id: "5",
    title: "Моногатари",
    description: "monogatari.mp4",
    videoSrc: "https://i.imgur.com/sRGicMT.mp4",
  },
  {
    id: "6",
    title: "The Saga of Tanya the Evil",
    description: "tanya.mp4",
    videoSrc: "https://i.imgur.com/NH7rHV4.mp4",
  },
];
