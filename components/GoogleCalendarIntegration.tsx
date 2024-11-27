import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import { CalendarDialog } from '@/app/recipe/components/calendar-dialog';
import { Loader2 } from 'lucide-react';

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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const { toast } = useToast();

  const addToCalendar = async () => {
    const accessToken = localStorage.getItem('googleAccessToken');

    if (!accessToken) {
      setDialogMessage("Please login with Google Account at the first");
      setDialogOpen(true);
      return;
    }

    if (!selectedDate || !selectedTime) {
      toast({
        title: "エラー",
        description: "日付と時間を選択してください",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const eventDateTime = new Date(selectedDate);
      const [hours, minutes] = selectedTime.split(':');
      eventDateTime.setHours(parseInt(hours), parseInt(minutes));

      const endDateTime = new Date(eventDateTime.getTime() + 60 * 60 * 1000);

      const description = `
Ingredients:
${ingredients.map(i => `- ${i.name}: ${i.amount}`).join('\n')}

Notes:
${notes}
      `.trim();

      const calendarResponse = await fetch('/api/calendar/get-or-create-rna', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
      });

      const calendarData = await calendarResponse.json();

      if (!calendarResponse.ok) {
        throw new Error(calendarData.error || 'Failed to get or create RNA calendar');
      }

      const event = {
        summary: `🍳 ${recipeTitle}`,
        description,
        start: {
          dateTime: eventDateTime.toISOString(),
          timeZone: 'Asia/Tokyo'
        },
        end: {
          dateTime: endDateTime.toISOString(),
          timeZone: 'Asia/Tokyo'
        }
      };

      const eventResponse = await fetch('/api/calendar/add-event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ event, calendarId: calendarData.calendarId }),
      });

      const eventData = await eventResponse.json();

      if (!eventResponse.ok) {
        throw new Error(eventData.error || 'Failed to add event to calendar');
      }

      setDialogMessage(calendarData.isNew 
        ? "New calendar RNA created and added recipe into RNA calendar" 
        : "RNA calendar exists and recipe added to RNA calendar");
      setDialogOpen(true);
      setShowConfetti(true);
    } catch (error) {
      console.error('Error adding event to calendar:', error);
      let errorMessage = "Failed to add event to calendar";
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

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setShowConfetti(false);
  };

  return (
    <>
      <Button 
        onClick={addToCalendar} 
        disabled={isLoading || !selectedDate || !selectedTime}
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please wait
          </>
        ) : (
          "Add to Calendar"
        )}
      </Button>
      <CalendarDialog
        isOpen={dialogOpen}
        onClose={handleCloseDialog}
        message={dialogMessage}
        showConfetti={showConfetti}
      />
    </>
  );
}

