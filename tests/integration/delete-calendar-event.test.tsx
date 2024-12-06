import { vi, describe, it, expect, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { googleMock } from '../mocks/googlecalendar_mock';

// Mock the googleapis module
vi.mock('googleapis', () => ({
  google: googleMock
}));

// Import the function to be tested after mocking
import { DELETE as deleteEventFromCalendar } from '@/app/api/calendar/delete-event/route';

describe('Delete Event from Google Calendar API', () => {
  const mockAccessToken = 'mock-access-token';
  const mockEventId = 'mock-event-id';
  const mockCalendarId = 'mock-calendar-id';

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock the calendar list response
    googleMock.calendar().calendarList.list.mockResolvedValue({
      data: {
        items: [{ id: mockCalendarId, summary: 'RNA' }]
      }
    });
  });

  it('should successfully delete an event from the calendar', async () => {
    const req = new NextRequest('http://localhost:3000/api/calendar/delete-event', {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${mockAccessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ eventId: mockEventId })
    });

    googleMock.calendar().events.delete.mockResolvedValue({});

    const response = await deleteEventFromCalendar(req);
    const responseData = await response.json();

    expect(response.status).toBe(200);
    expect(responseData).toEqual({
      success: true,
      message: 'Event deleted successfully'
    });

    expect(googleMock.calendar().events.delete).toHaveBeenCalledWith({
      calendarId: mockCalendarId,
      eventId: mockEventId
    });
  });

  it('should handle API errors when deleting an event', async () => {
    const req = new NextRequest('http://localhost:3000/api/calendar/delete-event', {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${mockAccessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ eventId: mockEventId })
    });

    googleMock.calendar().events.delete.mockRejectedValue(new Error('API Error'));

    const response = await deleteEventFromCalendar(req);
    const responseData = await response.json();

    expect(response.status).toBe(500);
    expect(responseData).toEqual({
      success: false,
      error: 'API Error'
    });
  });

  it('should return 401 if access token is missing', async () => {
    const req = new NextRequest('http://localhost:3000/api/calendar/delete-event', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ eventId: mockEventId })
    });

    const response = await deleteEventFromCalendar(req);
    const responseData = await response.json();

    expect(response.status).toBe(401);
    expect(responseData).toEqual({
      success: false,
      error: 'Access token not found'
    });
  });

  it('should handle the case when RNA calendar is not found', async () => {
    const req = new NextRequest('http://localhost:3000/api/calendar/delete-event', {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${mockAccessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ eventId: mockEventId })
    });

    // Mock the calendar list response with no RNA calendar
    googleMock.calendar().calendarList.list.mockResolvedValue({
      data: {
        items: []
      }
    });

    const response = await deleteEventFromCalendar(req);
    const responseData = await response.json();

    expect(response.status).toBe(200);
    expect(responseData).toEqual({
      success: false,
      error: 'RNA calendar not found'
    });
  });

  it('should handle the case when event is not found', async () => {
    const req = new NextRequest('http://localhost:3000/api/calendar/delete-event', {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${mockAccessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ eventId: 'non-existent-event-id' })
    });

    googleMock.calendar().events.delete.mockRejectedValue(new Error('An error occurred'));

    const response = await deleteEventFromCalendar(req);
    const responseData = await response.json();

    expect(response.status).toBe(500);
    expect(responseData).toEqual({
      success: false,
      error: 'An error occurred'
    });
  });
});

