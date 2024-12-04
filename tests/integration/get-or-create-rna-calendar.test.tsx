import { vi, describe, it, expect, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { googleMock } from '../mocks/googlecalendar_mock';

// Mock the googleapis module
vi.mock('googleapis', () => ({
  google: googleMock
}));

// Import the function to be tested after mocking
import { GET as getOrCreateRNACalendar } from '@/app/api/calendar/get-or-create-rna/route';


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

    googleMock.calendar().calendarList.list.mockResolvedValue(mockCalendarList);

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

    googleMock.calendar().calendarList.list.mockResolvedValue(mockCalendarList);
    googleMock.calendar().calendars.insert.mockResolvedValue(mockNewCalendar);

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

    googleMock.calendar().calendarList.list.mockRejectedValue(new Error('API Error'));

    const response = await getOrCreateRNACalendar(req);
    const responseData = await response.json();

    expect(response.status).toBe(500);
    expect(responseData).toEqual({
      success: false,
      error: expect.stringContaining('API Error'),
      details: expect.any(Object),
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

    googleMock.calendar().calendarList.list.mockResolvedValue(mockCalendarList);
    googleMock.calendar().calendars.insert.mockRejectedValue(new Error('API Error'));

    const response = await getOrCreateRNACalendar(req);
    const responseData = await response.json();

    expect(response.status).toBe(500);
    expect(responseData).toEqual({
      success: false,
      error: expect.stringContaining('Failed to get or create calendar'),
      details: expect.any(Object),
    });
  });

  it('should return 401 if access token is missing', async () => {
    const req = new NextRequest('http://localhost:3000/api/calendar/get-or-create-rna', {
      method: 'GET',
    });

    const response = await getOrCreateRNACalendar(req);
    const responseData = await response.json();

    expect(response.status).toBe(401);
    expect(responseData).toEqual({
      success: false,
      error: 'Access token not found',
    });
  });
});

