"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash, Pencil } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

export default function page() {
  const LIMIT = 5;
  const [page, setPage] = useState(1);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editedTodoTitle, setEditedTodoTitle] = useState("");

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get(
          `https://jsonplaceholder.typicode.com/todos?_page=${page}&_limit=${LIMIT}`
        );
        setTodos(response.data);
      } catch (error) {
        console.log("Error fetching todos", error);
      }
    };
    fetchTodos();
  }, []);

  const handleCreateNewTodo = () => {
    if (newTodo.trim() === "") return;

    const newTodoObject = {
      userId: 1,
      id: Math.floor(Math.random() * 1000000),
      title: newTodo,
      completed: false,
    };

    setTodos([...todos, newTodoObject]);
  };

  const handleDeleteTodo = (id: number) => {
    const filteredTodos = todos.filter((todo: Todo) => todo.id !== id);
    setTodos(filteredTodos);
  };

  const startEditingTodo = (id: number) => {
    setIsEditing(true);
    setEditingTodoId(id);
    setEditedTodoTitle(todos.find((todo) => todo.id === id)?.title || "");
  };

  const handleEditTodo = () => {
    const updatedTodos = todos.map((todo: Todo) => {
      if(todo.id === editingTodoId) {
        return {
          ...todo,
          title: editedTodoTitle,
        }
      } else {
        return todo;
      }
    })
    setTodos(updatedTodos);
    setIsEditing(false);
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-10">Todos</h1>

      <Input
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        type="text"
        placeholder="Create a new todo"
        className="w-[50vw]"
      />
      <Button onClick={handleCreateNewTodo}>Create Todo</Button>
      <div className="mt-10">
        {todos.length > 0 &&
          todos.map((todo: Todo) => {
            return (
              <div key={todo.id} className="flex items-center p-2">
                <Checkbox id={todo.id.toString()} className="border-gray-500" />
                <label htmlFor={todo.id.toString()} className="ml-2">
                  {todo.title}
                </label>
                <Button
                  onClick={() => handleDeleteTodo(todo.id)}
                  className="w-6 h-6 ml-2 cursor-pointer"
                >
                  <Trash />
                </Button>
                <Button
                  onClick={() => startEditingTodo(todo.id)}
                  className="w-6 h-6 ml-2 cursor-pointer"
                >
                  <Pencil />
                </Button>
              </div>
            );
          })}
      </div>
      {isEditing && (
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogContent>
            <Input
              type="text"
              value={editedTodoTitle}
              placeholder="Edit Todo"
              onChange={(e) => setEditedTodoTitle(e.target.value)}
            />
            <Button onClick={handleEditTodo}>Done</Button>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
