import { vi } from 'vitest';

export const googleCalendarMock = {
  auth: {
    OAuth2: vi.fn().mockImplementation(() => ({
      setCredentials: vi.fn(),
    })),
  },
  calendar: vi.fn().mockReturnValue({
    calendarList: {
      list: vi.fn(),
      insert: vi.fn(),
    },
    calendars: {
      insert: vi.fn(),
    },
    events: {
      insert: vi.fn(),
      delete: vi.fn(),
    },
  }),
};

export const googleMock = {
  auth: {
    OAuth2: googleCalendarMock.auth.OAuth2,
  },
  calendar: googleCalendarMock.calendar,
};

