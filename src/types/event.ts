export interface DadEvent {
  id: string;
  title: string;
  description?: string;
  date: string;
  time: string;
  dateTime?: string;
  location: string;
  attendees: number;
  attendeeIds?: string[];
  emoji: string;
  isAttending?: boolean;
  createdBy?: string;
  createdAt?: string;
}
