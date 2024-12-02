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

  const formatInstructions = (instructions: string) => {
    return instructions.split(/(?<=\.)/).filter(step => step.trim() !== '');
  };

  const formattedInstructions = formatInstructions(instructions);

  return (
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>{event.summary}</DrawerTitle>
        <DrawerDescription>
          {formatDateTime(event.start.dateTime)} -{" "}
          {formatDateTime(event.end.dateTime)}
        </DrawerDescription>
      </DrawerHeader>

      <div className="flex flex-col md:flex-row h-[300px] md:h-[400px] px-4">
        <ScrollArea className="flex-1 pr-2 md:pr-4 h-full">
          <div>
            <h3 className="font-semibold mb-2">Ingredients:</h3>
            <ul className="list-disc list-inside">
              {ingredients.map((ingredient, index) => (
                <li key={index} className="mb-1">{ingredient}</li>
              ))}
            </ul>
          </div>
        </ScrollArea>

        <ScrollArea className="flex-1 mt-4 md:mt-0 pl-2 md:pl-4 border-t md:border-t-0 md:border-l h-full">
          <div>
            <h3 className="font-semibold mb-2">Instructions:</h3>
            <ol className="list-decimal list-inside">
              {formattedInstructions.map((step, index) => (
                <li key={index} className="mb-2">{step.trim()}</li>
              ))}
            </ol>
          </div>
          {notes && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Notes:</h3>
              <p className="whitespace-pre-wrap">{notes}</p>
            </div>
          )}
        </ScrollArea>
      </div>

      <DrawerFooter className="flex flex-col sm:flex-row justify-between gap-2">
        <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
          Close
        </Button>
        <Button onClick={handleGoToRecipe} className="w-full sm:w-auto">
          Go to Recipe Result
        </Button>
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={isDeleting}
          className="w-full sm:w-[120px]"
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

