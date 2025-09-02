import { useState } from "react";
import { format } from "date-fns";
import { Calendar, Clock, Edit2, Trash2, Check, X } from "lucide-react";
import { Todo } from "@/types/todo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface TodoItemProps {
  todo: Todo;
  onUpdate: (id: string, updates: Partial<Todo>) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ todo, onUpdate, onDelete }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description || "");

  const handleSave = () => {
    onUpdate(todo.id, {
      title: editTitle,
      description: editDescription,
      updatedAt: new Date(),
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description || "");
    setIsEditing(false);
  };

  const handleToggleComplete = () => {
    onUpdate(todo.id, { 
      completed: !todo.completed,
      updatedAt: new Date()
    });
  };

  const isOverdue = todo.dueDate && new Date() > todo.dueDate && !todo.completed;

  return (
    <Card className={cn(
      "p-4 transition-all duration-300 hover:shadow-soft border-border/50",
      todo.completed && "opacity-75 bg-muted/50",
      isOverdue && "border-destructive/30 bg-destructive/5"
    )}>
      <div className="flex items-start gap-3">
        <Checkbox
          checked={todo.completed}
          onCheckedChange={handleToggleComplete}
          className="mt-1 data-[state=checked]:bg-success data-[state=checked]:border-success"
        />
        
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="space-y-3">
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="border-primary/30 focus:border-primary"
                placeholder="Task title"
              />
              <Textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Description (optional)"
                className="border-primary/30 focus:border-primary min-h-[80px]"
              />
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  onClick={handleSave}
                  className="bg-success hover:bg-success/90"
                >
                  <Check className="w-4 h-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={handleCancel}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ) : (
            <>
              <h3 className={cn(
                "font-medium text-foreground transition-colors",
                todo.completed && "line-through text-muted-foreground"
              )}>
                {todo.title}
              </h3>
              
              {todo.description && (
                <p className={cn(
                  "text-sm text-muted-foreground mt-1",
                  todo.completed && "line-through"
                )}>
                  {todo.description}
                </p>
              )}
              
              {todo.dueDate && (
                <div className={cn(
                  "flex items-center gap-1 mt-2 text-xs",
                  isOverdue ? "text-destructive" : "text-muted-foreground"
                )}>
                  <Calendar className="w-3 h-3" />
                  <span>{format(todo.dueDate, "MMM dd, yyyy")}</span>
                  <Clock className="w-3 h-3 ml-2" />
                  <span>{format(todo.dueDate, "HH:mm")}</span>
                  {isOverdue && <span className="ml-2 text-destructive font-medium">Overdue</span>}
                </div>
              )}
            </>
          )}
        </div>
        
        {!isEditing && (
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsEditing(true)}
              className="h-8 w-8 p-0 hover:bg-accent"
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(todo.id)}
              className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}