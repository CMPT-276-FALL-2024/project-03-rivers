//@app/calendar/types/index.ts

export interface CalendarEvent {
    id: string;
    summary: string;
    description: string;
    start: {
      dateTime: string;
      timeZone: string;
    };
    end: {
      dateTime: string;
      timeZone: string;
    };
  }
  
  