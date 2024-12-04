import { createMocks } from 'node-mocks-http';
import { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';
import { POST as getOrCreateRNACalendar } from '@/app/api/calendar/get-or-create-rna/route';

// Mock the googleapis module
jest.mock('googleapis', () => ({
  google: {
    auth: {
      OAuth2: jest.fn(() => ({
        setCredentials: jest.fn(),
      })),
    },
    calendar: jest.fn(() => ({
      calendarList: {
        list: jest.fn(),
        insert: jest.fn(),
      },
    })),
  },
}));

describe('Get or Create RNA Calendar API', () => {
  const mockAccessToken = 'mock-access-token';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return existing RNA calendar if it exists', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
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

    (google.calendar().calendarList.list as jest.Mock).mockResolvedValue(mockCalendarList);

    await getOrCreateRNACalendar(req as any, res as any);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({
      success: true,
      calendarId: 'existing-rna-id',
      isNew: false,
    });
  });

  it('should create a new RNA calendar if it does not exist', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
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

    (google.calendar().calendarList.list as jest.Mock).mockResolvedValue(mockCalendarList);
    (google.calendar().calendarList.insert as jest.Mock).mockResolvedValue(mockNewCalendar);

    await getOrCreateRNACalendar(req as any, res as any);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({
      success: true,
      calendarId: 'new-rna-id',
      isNew: true,
    });
  });

  it('should handle API errors when fetching calendar list', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${mockAccessToken}`,
      },
    });

    (google.calendar().calendarList.list as jest.Mock).mockRejectedValue(new Error('API Error'));

    await getOrCreateRNACalendar(req as any, res as any);

    expect(res._getStatusCode()).toBe(500);
    expect(JSON.parse(res._getData())).toEqual({
      success: false,
      error: 'Error fetching calendar list: API Error',
    });
  });

  it('should handle API errors when creating a new calendar', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${mockAccessToken}`,
      },
    });

    const mockCalendarList = {
      data: {
        items: [],
      },
    };

    (google.calendar().calendarList.list as jest.Mock).mockResolvedValue(mockCalendarList);
    (google.calendar().calendarList.insert as jest.Mock).mockRejectedValue(new Error('API Error'));

    await getOrCreateRNACalendar(req as any, res as any);

    expect(res._getStatusCode()).toBe(500);
    expect(JSON.parse(res._getData())).toEqual({
      success: false,
      error: 'Error creating RNA calendar: API Error',
    });
  });
});

