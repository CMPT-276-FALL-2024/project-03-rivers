import { test, expect } from '@playwright/test';
import { mockGoogleCalendarAPI } from '../mocks/google-calendar-mock';

test.describe('Calendar Integration E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Mock Google Calendar API responses
    await mockGoogleCalendarAPI(page);

    // Navigate to the calendar page
    await page.goto('/calendar');
  });

  test('should add an event to the calendar', async ({ page }) => {
    // Select a date
    await page.click('text=15'); // Assuming we're clicking on the 15th day of the current month

    // Fill in event details
    await page.fill('input[placeholder="Event title"]', 'Test Recipe Event');
    await page.fill('input[placeholder="Start time"]', '14:00');
    await page.fill('input[placeholder="End time"]', '15:00');
    await page.fill('textarea[placeholder="Notes"]', 'This is a test event');

    // Click "Add to Calendar" button
    await page.click('button:has-text("Add to Calendar")');

    // Wait for the success message
    await expect(page.locator('text=Event added successfully')).toBeVisible();

    // Verify the event appears in the weekly view
    await expect(page.locator('text=Test Recipe Event')).toBeVisible();
  });

  test('should delete an event from the calendar', async ({ page }) => {
    // Assume an event already exists
    await expect(page.locator('text=Test Recipe Event')).toBeVisible();

    // Click on the event to open details
    await page.click('text=Test Recipe Event');

    // Click the delete button
    await page.click('button:has-text("Delete")');

    // Confirm deletion
    await page.click('button:has-text("Confirm")');

    // Wait for the success message
    await expect(page.locator('text=Event deleted successfully')).toBeVisible();

    // Verify the event no longer appears in the weekly view
    await expect(page.locator('text=Test Recipe Event')).not.toBeVisible();
  });

  test('should handle errors when adding an event', async ({ page }) => {
    // Simulate an error response from the API
    await page.route('**/api/calendar/add-event', async route => {
      await route.fulfill({
        status: 500,
        body: JSON.stringify({ success: false, error: 'Failed to add event' })
      });
    });

    // Attempt to add an event
    await page.click('text=15');
    await page.fill('input[placeholder="Event title"]', 'Error Test Event');
    await page.click('button:has-text("Add to Calendar")');

    // Verify error message is displayed
    await expect(page.locator('text=Failed to add event')).toBeVisible();
  });

  test('should handle errors when deleting an event', async ({ page }) => {
    // Simulate an error response from the API
    await page.route('**/api/calendar/delete-event', async route => {
      await route.fulfill({
        status: 500,
        body: JSON.stringify({ success: false, error: 'Failed to delete event' })
      });
    });

    // Attempt to delete an event
    await page.click('text=Test Recipe Event');
    await page.click('button:has-text("Delete")');
    await page.click('button:has-text("Confirm")');

    // Verify error message is displayed
    await expect(page.locator('text=Failed to delete event')).toBeVisible();
  });
});

