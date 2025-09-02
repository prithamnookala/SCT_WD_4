import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Clock, Plus } from "lucide-react";
import { TodoFormData } from "@/types/todo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface AddTodoFormProps {
  onAdd: (todo: TodoFormData) => void;
}

export function AddTodoForm({ onAdd }: AddTodoFormProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<Date>();
  const [dueTime, setDueTime] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;

    let finalDueDate: Date | undefined;
    if (dueDate) {
      finalDueDate = new Date(dueDate);
      if (dueTime) {
        const [hours, minutes] = dueTime.split(':').map(Number);
        finalDueDate.setHours(hours, minutes);
      }
    }

    onAdd({
      title: title.trim(),
      description: description.trim() || undefined,
      dueDate: finalDueDate,
    });

    // Reset form
    setTitle("");
    setDescription("");
    setDueDate(undefined);
    setDueTime("");
    setIsExpanded(false);
  };

  const handleCancel = () => {
    setTitle("");
    setDescription("");
    setDueDate(undefined);
    setDueTime("");
    setIsExpanded(false);
  };

  return (
    <Card className="p-4 border-border/50 hover:border-primary/30 transition-colors">
      <form onSubmit={handleSubmit}>
        {!isExpanded ? (
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setIsExpanded(true)}
          >
            <Plus className="w-5 h-5 text-muted-foreground" />
            <span className="text-muted-foreground">Add a new task...</span>
          </div>
        ) : (
          <div className="space-y-4">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="border-primary/30 focus:border-primary"
              autoFocus
            />
            
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description (optional)"
              className="border-primary/30 focus:border-primary min-h-[80px]"
            />
            
            <div className="flex gap-3 items-center">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !dueDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "MMM dd, yyyy") : "Due date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={setDueDate}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              
              {dueDate && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <Input
                    type="time"
                    value={dueTime}
                    onChange={(e) => setDueTime(e.target.value)}
                    className="w-auto border-primary/30 focus:border-primary"
                  />
                </div>
              )}
            </div>
            
            <div className="flex gap-2 pt-2">
              <Button 
                type="submit" 
                disabled={!title.trim()}
                className="bg-primary hover:bg-primary-hover"
              >
                Add Task
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </form>
    </Card>
  );
}