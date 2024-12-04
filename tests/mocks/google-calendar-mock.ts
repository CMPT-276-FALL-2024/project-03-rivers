import { Page } from "playwright/test";


export async function mockGoogleCalendarAPI(page: Page) {
  await page.route('**/api/calendar/get-or-create-rna', async route => {
    await route.fulfill({
      status: 200,
      body: JSON.stringify({
        success: true,
        calendarId: 'mock-calendar-id',
        isNew: false
      })
    });
  });

  await page.route('**/api/calendar/add-event', async route => {
    await route.fulfill({
      status: 200,
      body: JSON.stringify({
        success: true,
        eventId: 'mock-event-id'
      })
    });
  });

  await page.route('**/api/calendar/delete-event', async route => {
    await route.fulfill({
      status: 200,
      body: JSON.stringify({
        success: true,
        message: 'Event deleted successfully'
      })
    });
  });

  await page.route('**/api/calendar', async route => {
    await route.fulfill({
      status: 200,
      body: JSON.stringify({
        success: true,
        events: [
          {
            id: 'mock-event-id',
            summary: 'Test Recipe Event',
            description: 'This is a test event',
            start: {
              dateTime: '2023-06-15T14:00:00Z',
              timeZone: 'Asia/Tokyo'
            },
            end: {
              dateTime: '2023-06-15T15:00:00Z',
              timeZone: 'Asia/Tokyo'
            }
          }
        ]
      })
    });
  });
}

