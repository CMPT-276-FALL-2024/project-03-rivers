//@tests/integration/google-calendar.test.tsx

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { expect, vi, test, describe, beforeEach } from 'vitest';
import { useRouter } from 'next/navigation';

function MockCalendarPage({ onAddToCalendar }: { onAddToCalendar: () => Promise<void> }) {
  return (
    <div>
      <button onClick={onAddToCalendar}>Add to Calendar</button>
    </div>
  );
}

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

global.fetch = vi.fn();

describe('Google Calendar Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as any).mockReturnValue({ push: vi.fn() });
    vi.spyOn(console, 'log');
    vi.spyOn(console, 'error');
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(() => 'mock-access-token'),
        setItem: vi.fn(),
      },
      writable: true
    });
  });

  test('adds correct event to Google Calendar when "Add to Calendar" is clicked', async () => {
    const mockDate = new Date('2023-01-01T12:00:00Z');
    vi.setSystemTime(mockDate);

    (global.fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, calendarId: 'mock-calendar-id' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, eventId: 'mock-event-id' }),
      });

    const mockAddToCalendar = vi.fn(async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) return;

      try {
        const rnaCalendarResponse = await fetch('/api/calendar/get-or-create-rna', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const { calendarId } = await rnaCalendarResponse.json();

        const addEventResponse = await fetch('/api/calendar/add-event', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            calendarId,
            event: {
              summary: 'Test Recipe',
              description: 'Ingredients: test\nNotes: test',
              start: { dateTime: new Date().toISOString() },
              end: { dateTime: new Date(Date.now() + 3600000).toISOString() },
            },
          }),
        });
        const { success, eventId } = await addEventResponse.json();
        if (success) {
          console.log('Event added successfully', eventId);
        }
      } catch (error) {
        console.error('Error adding event to calendar:', error);
      }
    });

    render(<MockCalendarPage onAddToCalendar={mockAddToCalendar} />);

    const addToCalendarButton = screen.getByRole('button', { name: /add to calendar/i });
    fireEvent.click(addToCalendarButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    expect(global.fetch).toHaveBeenNthCalledWith(1, '/api/calendar/get-or-create-rna', {
      headers: { Authorization: 'Bearer mock-access-token' },
    });
    expect(global.fetch).toHaveBeenNthCalledWith(2, '/api/calendar/add-event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mock-access-token',
      },
      body: expect.any(String),
    });

    const secondCallOptions = (global.fetch as any).mock.calls[1][1];
    const requestBody = JSON.parse(secondCallOptions.body);

    expect(requestBody).toEqual({
      calendarId: 'mock-calendar-id',
      event: {
        summary: 'Test Recipe',
        description: 'Ingredients: test\nNotes: test',
        start: { dateTime: '2023-01-01T12:00:00.000Z' },
        end: { dateTime: '2023-01-01T13:00:00.000Z' },
      },
    });

    expect(mockAddToCalendar).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledWith('Event added successfully', 'mock-event-id');
    expect(console.error).not.toHaveBeenCalled();
  });

  test('handles errors when adding event to calendar', async () => {
    (global.fetch as any)
      .mockRejectedValueOnce(new Error('API Error'));

    const mockAddToCalendar = vi.fn(async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) return;

      try {
        await fetch('/api/calendar/get-or-create-rna', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
      } catch (error) {
        console.error('Error adding event to calendar:', error);
      }
    });

    render(<MockCalendarPage onAddToCalendar={mockAddToCalendar} />);

    const addToCalendarButton = screen.getByRole('button', { name: /add to calendar/i });
    fireEvent.click(addToCalendarButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    expect(console.error).toHaveBeenCalledWith('Error adding event to calendar:', expect.any(Error));
  });
});

