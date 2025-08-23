"use client";

import Link from 'next/link';
import { useMemo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash, Pencil } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ModeToggle } from "@/components/theme-toggle-button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

type FilterValue = "all" | "active" | "completed";

export default function Page() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterValue>("all");
  const [newTodo, setNewTodo] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editedTodoTitle, setEditedTodoTitle] = useState("");

  useEffect(() => {
    const storedTodos = localStorage.getItem("todos");
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const filteredTodos = useMemo(() => {
    if (filter === "active") {
      return todos.filter(todo => !todo.completed);
    }
    if (filter === "completed") {
      return todos.filter(todo => todo.completed);
    }
    return todos;
  }, [todos, filter]);

  const handleCreateNewTodo = () => {
    if (newTodo.trim() === "") {
      toast.warning("Todo title cannot be empty.");
      return;
    }

    const newTodoObject: Todo = {
      id: Math.floor(Math.random() * 1000000),
      title: newTodo,
      completed: false,
    };

    setTodos([newTodoObject, ...todos]);
    setNewTodo("");
    toast.success("Todo created successfully!");
  };

  const handleDeleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
    toast.success("Todo deleted successfully!");
  };

  const startEditingTodo = (id: number) => {
    setIsEditing(true);
    setEditingTodoId(id);
    setEditedTodoTitle(todos.find((todo) => todo.id === id)?.title || "");
  };

  const handleEditTodo = () => {
    if (editedTodoTitle.trim() === "") {
      toast.warning("Todo title cannot be empty.");
      return;
    }
    setTodos(
      todos.map((todo) => {
        if (todo.id === editingTodoId) {
          return { ...todo, title: editedTodoTitle };
        }
        return todo;
      })
    );
    setIsEditing(false);
    toast.success("Todo updated successfully!");
  };

  const handleToggleComplete = (id: number) => {
    setTodos(
      todos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, completed: !todo.completed };
        }
        return todo;
      })
    );
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Todos</h1>
        <div className="flex items-center gap-4">
          <ModeToggle />
          <Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            About
          </Link>
        </div>
      </div>

      <div className="flex gap-2 mb-8">
        <Input
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleCreateNewTodo();
            }
          }}
          type="text"
          placeholder="Create a new todo"
          className="flex-grow"
        />
        <Button onClick={handleCreateNewTodo}>Create Todo</Button>
      </div>

      <div className="flex items-center justify-center space-x-2 my-6">
        <Button
          variant={filter === 'all' ? 'default' : 'ghost'}
          onClick={() => setFilter('all')}
        >
          All
        </Button>
        <Button
          variant={filter === 'active' ? 'default' : 'ghost'}
          onClick={() => setFilter('active')}
        >
          Active
        </Button>
        <Button
          variant={filter === 'completed' ? 'default' : 'ghost'}
          onClick={() => setFilter('completed')}
        >
          Completed
        </Button>
      </div>

      <div className="mt-4 space-y-4">
        {filteredTodos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No todos yet. Add one above!</p>
          </div>
        ) : (
          filteredTodos.map((todo: Todo) => (
            <div
              key={todo.id}
              className="flex items-center p-4 bg-card border border-border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-150 ease-in-out"
            >
              <Checkbox
                id={todo.id.toString()}
                checked={todo.completed}
                onCheckedChange={() => handleToggleComplete(todo.id)}
                className="border-gray-500 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <label
                htmlFor={todo.id.toString()}
                className={`ml-3 flex-grow cursor-pointer ${
                  todo.completed ? "line-through text-muted-foreground" : ""
                }`}
              >
                {todo.title}
              </label>
              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => startEditingTodo(todo.id)}
                      className="w-8 h-8 ml-2 hover:bg-muted/50 hover:text-primary"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Edit todo</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteTodo(todo.id)}
                      className="w-8 h-8 ml-2 hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Delete todo</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          ))
        )}
      </div>

      {isEditing && (
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Todo</DialogTitle>
              <DialogDescription>
                Make changes to your todo item here. Click "Save Changes" when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Input
                id="editedTodoTitle"
                type="text"
                value={editedTodoTitle}
                placeholder="Edit Todo Title"
                onChange={(e) => setEditedTodoTitle(e.target.value)}
                className="col-span-3 focus:ring-primary focus:border-primary"
              />
            </div>
            <Button onClick={handleEditTodo} type="submit" className="w-full sm:w-auto">
              Save Changes
            </Button>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}