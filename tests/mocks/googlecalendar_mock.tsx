import { vi } from 'vitest';

const googleCalendarMock = {
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
  }),
};

export default googleCalendarMock;

