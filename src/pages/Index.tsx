import { useState, useEffect } from "react";
import { Todo, TodoFormData } from "@/types/todo";
import { AddTodoForm } from "@/components/AddTodoForm";
import { TodoItem } from "@/components/TodoItem";
import { TodoStats } from "@/components/TodoStats";
import { CheckSquare, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  // Load todos from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('todos');
    if (saved) {
      const parsedTodos = JSON.parse(saved).map((todo: any) => ({
        ...todo,
        createdAt: new Date(todo.createdAt),
        updatedAt: new Date(todo.updatedAt),
        dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined,
      }));
      setTodos(parsedTodos);
    }
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (todoData: TodoFormData) => {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      title: todoData.title,
      description: todoData.description,
      completed: false,
      dueDate: todoData.dueDate,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setTodos(prev => [newTodo, ...prev]);
  };

  const updateTodo = (id: string, updates: Partial<Todo>) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, ...updates } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'pending') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-xl">
              <CheckSquare className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">TaskZen</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stay organized and productive with your minimalist task manager
          </p>
        </div>

        {/* Stats */}
        <div className="mb-8">
          <TodoStats todos={todos} />
        </div>

        {/* Add Todo Form */}
        <div className="mb-8">
          <AddTodoForm onAdd={addTodo} />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-6">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <div className="flex gap-2">
            {(['all', 'pending', 'completed'] as const).map((filterType) => (
              <Button
                key={filterType}
                variant={filter === filterType ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(filterType)}
                className="capitalize"
              >
                {filterType}
              </Button>
            ))}
          </div>
        </div>

        {/* Todo List */}
        <div className="space-y-3">
          {filteredTodos.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckSquare className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                {filter === 'all' ? 'No tasks yet' : 
                 filter === 'pending' ? 'No pending tasks' : 
                 'No completed tasks'}
              </h3>
              <p className="text-muted-foreground">
                {filter === 'all' ? 'Add your first task to get started!' : 
                 filter === 'pending' ? 'Great job! All tasks are completed.' : 
                 'Complete some tasks to see them here.'}
              </p>
            </div>
          ) : (
            <div className="group">
              {filteredTodos.map((todo) => (
                <div key={todo.id} className="mb-3">
                  <TodoItem
                    todo={todo}
                    onUpdate={updateTodo}
                    onDelete={deleteTodo}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
