import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function GET(request: Request) {
  try {
    const accessToken = request.headers.get('Authorization')?.split('Bearer ')[1];

    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: 'アクセストークンが見つかりません' },
        { status: 401 }
      );
    }

    // OAuth2クライアントの設定
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessToken });

    const calendar = google.calendar({ 
      version: 'v3', 
      auth: oauth2Client 
    });

    // カレンダーリストを取得
    console.log('Fetching calendar list...');
    const calendarList = await calendar.calendarList.list();
    console.log('Calendar list fetched');

    // RNAカレンダーを検索
    const rnaCalendar = calendarList.data.items?.find(cal => cal.summary === 'RNA');

    if (!rnaCalendar?.id) {
      console.log('RNA calendar not found');
      return NextResponse.json({ 
        success: false, 
        error: 'RNAカレンダーが見つかりません',
        calendars: calendarList.data.items
      });
    }

    console.log('RNA calendar found:', rnaCalendar.id);

    // 今日から1週間のイベントを取得
    const now = new Date();
    const oneWeekLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    console.log('Fetching events...');
    const response = await calendar.events.list({
      calendarId: rnaCalendar.id,
      timeMin: now.toISOString(),
      timeMax: oneWeekLater.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });

    console.log('Events fetched:', response.data.items?.length || 0);

    return NextResponse.json({ 
      success: true, 
      calendarId: rnaCalendar.id,
      events: response.data.items 
    });
  } catch (error) {
    console.error('Error in debug API route:', error);
    
    let errorMessage = '不明なエラーが発生しました';
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { success: false, error: errorMessage, stack: error instanceof Error ? error.stack : undefined },
      { status: 500 }
    );
  }
}

