import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';

interface GoogleCalendarIntegrationProps {
  recipeTitle: string;
  selectedDate: Date | undefined;
  selectedTime: string | undefined;
  notes: string;
  ingredients: { name: string; amount: string }[];
}

export function GoogleCalendarIntegration({ 
  recipeTitle, 
  selectedDate, 
  selectedTime, 
  notes,
  ingredients 
}: GoogleCalendarIntegrationProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const addToCalendar = async () => {
    const accessToken = localStorage.getItem('googleAccessToken');
    console.log('Using access token:', accessToken);

    if (!selectedDate || !selectedTime || !accessToken) {
      toast({
        title: "エラー",
        description: "日付と時間を選択し、Googleアカウントでログインしてください。",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const eventDateTime = new Date(selectedDate);
      const [hours, minutes] = selectedTime.split(':');
      eventDateTime.setHours(parseInt(hours), parseInt(minutes));

      const description = `
材料:
${ingredients.map(i => `- ${i.name}: ${i.amount}`).join('\n')}

メモ:
${notes}
      `.trim();

      const event = {
        summary: `🍳 ${recipeTitle}`,
        description,
        start: {
          dateTime: eventDateTime.toISOString(),
          timeZone: 'Asia/Tokyo'
        },
        end: {
          dateTime: new Date(eventDateTime.getTime() + 60 * 60 * 1000).toISOString(),
          timeZone: 'Asia/Tokyo'
        }
      };

      console.log('Sending event data:', event);

      const response = await fetch('/api/calendar/add-event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(event),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'カレンダーへの追加に失敗しました');
      }

      toast({
        title: "成功",
        description: "レシピがカレンダーに追加されました！",
      });
    } catch (error) {
      console.error('Error adding event to calendar:', error);
      let errorMessage = "カレンダーへの追加中にエラーが発生しました";
      if (error instanceof Error) {
        errorMessage += `: ${error.message}`;
      }
      toast({
        title: "エラー",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={addToCalendar} 
      disabled={isLoading || !selectedDate || !selectedTime}
      className="w-full"
    >
      {isLoading ? "追加中..." : "カレンダーに追加"}
    </Button>
  );
}

