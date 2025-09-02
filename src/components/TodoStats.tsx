import { Todo } from "@/types/todo";
import { Card } from "@/components/ui/card";
import { CheckCircle, Circle, Clock } from "lucide-react";

interface TodoStatsProps {
  todos: Todo[];
}

export function TodoStats({ todos }: TodoStatsProps) {
  const total = todos.length;
  const completed = todos.filter(todo => todo.completed).length;
  const pending = total - completed;
  const overdue = todos.filter(
    todo => !todo.completed && todo.dueDate && new Date() > todo.dueDate
  ).length;

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card className="p-4 text-center border-border/50">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Circle className="w-5 h-5 text-primary" />
          <span className="text-2xl font-bold text-foreground">{total}</span>
        </div>
        <p className="text-sm text-muted-foreground">Total Tasks</p>
      </Card>
      
      <Card className="p-4 text-center border-border/50">
        <div className="flex items-center justify-center gap-2 mb-2">
          <CheckCircle className="w-5 h-5 text-success" />
          <span className="text-2xl font-bold text-foreground">{completed}</span>
        </div>
        <p className="text-sm text-muted-foreground">Completed</p>
      </Card>
      
      <Card className="p-4 text-center border-border/50">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Circle className="w-5 h-5 text-muted-foreground" />
          <span className="text-2xl font-bold text-foreground">{pending}</span>
        </div>
        <p className="text-sm text-muted-foreground">Pending</p>
      </Card>
      
      <Card className="p-4 text-center border-border/50">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Clock className="w-5 h-5 text-destructive" />
          <span className="text-2xl font-bold text-foreground">{overdue}</span>
        </div>
        <p className="text-sm text-muted-foreground">Overdue</p>
      </Card>
    </div>
  );
}