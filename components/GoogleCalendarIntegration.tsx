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
        title: "Error",
        description: "Please select a date and time to add the recipe to your calendar",
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
Ingredients:
${ingredients.map(i => `- ${i.name}: ${i.amount}`).join('\n')}

Note:
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
        throw new Error(data.error || 'Failed to add event to calendar');
      }

      toast({
        title: "Success",
        description: "Recipe added to your calendar!",
      });
    } catch (error) {
      console.error('Error adding event to calendar:', error);
      let errorMessage = "Error adding event to calendar";
      if (error instanceof Error) {
        errorMessage += `: ${error.message}`;
      }
      toast({
        title: "Error",
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
      {isLoading ? "Adding..." : "Add to Calendar"}
    </Button>
  );
}

