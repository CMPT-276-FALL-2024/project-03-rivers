import { vi, describe, it, expect, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET as getOrCreateRNACalendar } from '@/app/api/calendar/get-or-create-rna/route';

// Mock the googleapis
vi.mock('googleapis', () => {
  const mockCalendarList = {
    list: vi.fn(),
    insert: vi.fn(),
  };

  return {
    google: {
      auth: {
        OAuth2: vi.fn().mockImplementation(() => ({
          setCredentials: vi.fn(),
        })),
      },
      calendar: vi.fn().mockReturnValue({
        calendarList: mockCalendarList,
      }),
    },
  };
});

describe('Get or Create RNA Calendar API', () => {
  const mockAccessToken = 'mock-access-token';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return existing RNA calendar if it exists', async () => {
    const req = new NextRequest('http://localhost:3000/api/calendar/get-or-create-rna', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${mockAccessToken}`,
      },
    });

    const mockCalendarList = {
      data: {
        items: [
          { id: 'existing-rna-id', summary: 'RNA' },
        ],
      },
    };

    const { google } = await import('googleapis');
    const calendar = google.calendar();
    calendar.calendarList.list.mockResolvedValue(mockCalendarList);

    const response = await getOrCreateRNACalendar(req);
    const responseData = await response.json();

    expect(response.status).toBe(200);
    expect(responseData).toEqual({
      success: true,
      calendarId: 'existing-rna-id',
      isNew: false,
    });
  });

  it('should create a new RNA calendar if it does not exist', async () => {
    const req = new NextRequest('http://localhost:3000/api/calendar/get-or-create-rna', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${mockAccessToken}`,
      },
    });

    const mockCalendarList = {
      data: {
        items: [],
      },
    };

    const mockNewCalendar = {
      data: { id: 'new-rna-id' },
    };

    const { google } = await import('googleapis');
    const calendar = google.calendar();
    calendar.calendarList.list.mockResolvedValue(mockCalendarList);
    calendar.calendarList.insert.mockResolvedValue(mockNewCalendar);

    const response = await getOrCreateRNACalendar(req);
    const responseData = await response.json();

    expect(response.status).toBe(200);
    expect(responseData).toEqual({
      success: true,
      calendarId: 'new-rna-id',
      isNew: true,
    });
  });

  it('should handle API errors when fetching calendar list', async () => {
    const req = new NextRequest('http://localhost:3000/api/calendar/get-or-create-rna', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${mockAccessToken}`,
      },
    });

    const { google } = await import('googleapis');
    const calendar = google.calendar();
    calendar.calendarList.list.mockRejectedValue(new Error('API Error'));

    const response = await getOrCreateRNACalendar(req);
    const responseData = await response.json();

    expect(response.status).toBe(500);
    expect(responseData).toEqual({
      success: false,
      error: 'Error fetching calendar list: API Error',
    });
  });

  it('should handle API errors when creating a new calendar', async () => {
    const req = new NextRequest('http://localhost:3000/api/calendar/get-or-create-rna', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${mockAccessToken}`,
      },
    });

    const mockCalendarList = {
      data: {
        items: [],
      },
    };

    const { google } = await import('googleapis');
    const calendar = google.calendar();
    calendar.calendarList.list.mockResolvedValue(mockCalendarList);
    calendar.calendarList.insert.mockRejectedValue(new Error('API Error'));

    const response = await getOrCreateRNACalendar(req);
    const responseData = await response.json();

    expect(response.status).toBe(500);
    expect(responseData).toEqual({
      success: false,
      error: 'Error creating RNA calendar: API Error',
    });
  });
});

