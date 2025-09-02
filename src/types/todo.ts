export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface TodoFormData {
  title: string;
  description?: string;
  dueDate?: Date;
}