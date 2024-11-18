import {
  Command,
  CommandInput,
} from "@/components/ui/command";

export function SearchBar() {
  return (
    <Command className="rounded-lg border shadow-md md:min-w-[450px]">
      <CommandInput placeholder="Type a command or search..." />
    </Command>
  );
}
