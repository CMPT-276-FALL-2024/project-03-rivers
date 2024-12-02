import { useState } from "react";
import { format, parseISO } from "date-fns";
import { enUS } from "date-fns/locale";
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: {
    dateTime: string;
  };
  end: {
    dateTime: string;
  };
}

interface EventDetailsProps {
  event: CalendarEvent | null;
  onClose: () => void;
  onDelete: (eventId: string) => Promise<void>;
}

export function EventDetails({ event, onClose, onDelete }: EventDetailsProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  if (!event) return null;

  const formatDateTime = (dateTimeStr: string) => {
    const date = parseISO(dateTimeStr);
    return format(date, "yyyy-MM-dd HH:mm", { locale: enUS });
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(event.id);
      toast({
        title: "Event deleted",
        description: "The event has been successfully deleted from your calendar.",
      });
      onClose();
    } catch (error) {
      console.error("Failed to delete event:", error);
      toast({
        title: "Error",
        description: "Failed to delete the event. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const parseDescription = (description: string) => {
    const parts = description.split('\n\n');
    const recipeId = parts[0].split(': ')[1];
    const ingredients = parts[1].split('\n').slice(1);
    const instructions = parts[2].split('\n').slice(1).join('\n');
    const notes = parts[3].split('\n').slice(1).join('\n');

    return { recipeId, ingredients, instructions, notes };
  };

  const { recipeId, ingredients, instructions, notes } = event.description ? parseDescription(event.description) : { recipeId: '', ingredients: [], instructions: '', notes: '' };

  const handleGoToRecipe = () => {
    router.push(`/recipe/result?id=${recipeId}`);
  };

  return (
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>{event.summary}</DrawerTitle>
        <DrawerDescription>
          {formatDateTime(event.start.dateTime)} -{" "}
          {formatDateTime(event.end.dateTime)}
        </DrawerDescription>
      </DrawerHeader>

      <ScrollArea className="h-[50vh] px-4">
        <div className="space-y-4">
          <h3 className="font-semibold">Ingredients:</h3>
          <ul className="list-disc list-inside">
            {ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>

          <h3 className="font-semibold">Instructions:</h3>
          <p className="whitespace-pre-wrap">{instructions}</p>

          {notes && (
            <>
              <h3 className="font-semibold">Notes:</h3>
              <p className="whitespace-pre-wrap">{notes}</p>
            </>
          )}
        </div>
      </ScrollArea>

      <DrawerFooter className="flex justify-between">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
        <Button onClick={handleGoToRecipe}>
          Go to Recipe Result
        </Button>
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <>
              <Trash2 className="mr-2 h-4 w-4 animate-spin" />
              Deleting...
            </>
          ) : (
            <>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </>
          )}
        </Button>
      </DrawerFooter>
    </DrawerContent>
  );
}

