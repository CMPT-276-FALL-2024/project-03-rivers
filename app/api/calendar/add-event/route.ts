import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function POST(request: Request) {
  try {
    const event = await request.json();

    console.log('Received event:', event);  // デバッグ用ログ

    if (!process.env.GOOGLE_CALENDAR_API_KEY) {
      throw new Error('GOOGLE_CALENDAR_API_KEY is not set');
    }

    // Google Calendar APIの設定
    const calendar = google.calendar({
      version: 'v3',
      auth: process.env.GOOGLE_CALENDAR_API_KEY
    });

    console.log('Attempting to add event to calendar');  // デバッグ用ログ

    // イベントの追加
    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
    });

    console.log('Event added successfully:', response.data.id);  // デバッグ用ログ

    return NextResponse.json({ 
      success: true, 
      eventId: response.data.id 
    });
  } catch (error) {
    console.error('Error adding event to calendar:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

