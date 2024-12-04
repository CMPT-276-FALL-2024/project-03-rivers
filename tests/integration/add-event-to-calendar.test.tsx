import { vi, describe, it, expect, beforeEach } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';
import { googleMock } from '../mocks/googlecalendar_mock';

// Mock the googleapis module
vi.mock('googleapis', () => ({
  google: googleMock
}));

// Import the function to be tested after mocking
import { POST as addEventToCalendar } from '@/app/api/calendar/add-event/route';

describe('Add Event to Google Calendar API', () => {
  const mockAccessToken = 'mock-access-token';
  const mockCalendarId = 'mock-calendar-id';
  const mockEvent = {
    summary: 'Test Event',
    description: 'This is a test event',
    start: {
      dateTime: '2023-06-01T10:00:00Z',
      timeZone: 'Asia/Tokyo'
    },
    end: {
      dateTime: '2023-06-01T11:00:00Z',
      timeZone: 'Asia/Tokyo'
    }
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should successfully add an event to the calendar', async () => {
    const req = new NextRequest('http://localhost:3000/api/calendar/add-event', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${mockAccessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ event: mockEvent, calendarId: mockCalendarId })
    });

    const mockInsertResponse = {
      data: { id: 'mock-event-id' }
    };

    googleMock.calendar().events.insert.mockResolvedValue(mockInsertResponse);

    const response = await addEventToCalendar(req);
    const responseData = await response.json();

    expect(response.status).toBe(200);
    expect(responseData).toEqual({
      success: true,
      eventId: 'mock-event-id'
    });

    expect(googleMock.calendar().events.insert).toHaveBeenCalledWith({
      calendarId: mockCalendarId,
      requestBody: {
        summary: mockEvent.summary,
        description: mockEvent.description,
        start: mockEvent.start,
        end: mockEvent.end
      }
    });
  });

  it('should handle API errors when adding an event', async () => {
    const req = new NextRequest('http://localhost:3000/api/calendar/add-event', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${mockAccessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ event: mockEvent, calendarId: mockCalendarId })
    });

    googleMock.calendar().events.insert.mockRejectedValue(new Error('API Error'));

    const response = await addEventToCalendar(req);
    const responseData = await response.json();

    expect(response.status).toBe(500);
    expect(responseData).toEqual({
      success: false,
      error: 'API Error'
    });
  });

  it('should return 401 if access token is missing', async () => {
    const req = new NextRequest('http://localhost:3000/api/calendar/add-event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ event: mockEvent, calendarId: mockCalendarId })
    });

    const response = await addEventToCalendar(req);
    const responseData = await response.json();

    expect(response.status).toBe(401);
    expect(responseData).toEqual({
      success: false,
      error: 'Access token not found'
    });
  });

  it('should handle missing or invalid fields', async () => {
    const req = new NextRequest('http://localhost:3000/api/calendar/add-event', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${mockAccessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ event: {}, calendarId: '' }) // Invalid event and empty calendarId
    });

    const response = await addEventToCalendar(req);
    const responseData = await response.json();

    expect(response.status).toBe(500);
    expect(responseData).toEqual({
      success: false,
      error: expect.any(String)
    });
  });
});

