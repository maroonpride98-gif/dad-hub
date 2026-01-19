export interface DadJoke {
  id: string;
  joke: string;
  punchline: string;
  author?: string;
  likes?: number;
  isUserSubmitted?: boolean;
}

export interface JokeTeller {
  name: string;
  jokes: number;
  emoji: string;
}
