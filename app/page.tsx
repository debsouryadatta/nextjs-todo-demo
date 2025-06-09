"use client";

import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash, Pencil, Loader2, FileText, CheckCircle2, ListX } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ModeToggle } from "@/components/theme-toggle-button"; // Import ModeToggle
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

type FilterValue = "all" | "active" | "completed"; // Filter type

export default function page() {
  const LIMIT = 5;
  const [page, setPage] = useState(1);
  const [todos, setTodos] = useState<Todo[]>([]); // This will store all todos for the current page from API
  const [isLoadingTodos, setIsLoadingTodos] = useState(false);
  const [isLastPage, setIsLastPage] = useState(false);
  const [filter, setFilter] = useState<FilterValue>("all"); // Filter state
  const [newTodo, setNewTodo] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editedTodoTitle, setEditedTodoTitle] = useState("");

  const filteredTodos = useMemo(() => {
    if (filter === "active") {
      return todos.filter(todo => !todo.completed);
    }
    if (filter === "completed") {
      return todos.filter(todo => todo.completed);
    }
    return todos; // "all"
  }, [todos, filter]);

  useEffect(() => {
    const loadTodos = async () => {
      // Check if we're in the browser (client-side)
      if (typeof window !== 'undefined') {
        const storedTodos = localStorage.getItem('todos');
        
        if (storedTodos) {
          // Load todos from localStorage if they exist
          setTodos(JSON.parse(storedTodos));
        } else {
          // If no todos in localStorage, fetch from API
          try {
            const response = await axios.get(
              `https://jsonplaceholder.typicode.com/todos?_page=${page}&_limit=${LIMIT}`
            );
            setTodos(response.data);
            setIsLastPage(response.data.length < LIMIT);
          } catch (error) {
            console.log("Error fetching todos", error);
            toast.error("Failed to fetch todos. Please try again later.");
          } finally {
            setIsLoadingTodos(false);
          }
        }
      }
    };
    loadTodos();
  }, [page, LIMIT]);

  // Save todos to localStorage whenever todos state changes
  useEffect(() => {
    if (typeof window !== 'undefined' && todos.length > 0) {
      localStorage.setItem('todos', JSON.stringify(todos));
    }
  }, [todos]);

  const handleCreateNewTodo = () => {
    if (newTodo.trim() === "") {
      toast.warning("Todo title cannot be empty.");
      return;
    }

    const newTodoObject = {
      userId: 1, // Assuming a default userId
      id: Math.floor(Math.random() * 1000000), // Temporary ID generation
      title: newTodo,
      completed: false,
    };

    setTodos([newTodoObject, ...todos]); // Add to the beginning of the list for better UX
    setNewTodo(""); // Clear input
    toast.success("Todo created successfully!");
  };

  const handleDeleteTodo = (id: number) => {
    const filteredTodos = todos.filter((todo: Todo) => todo.id !== id);
    setTodos(filteredTodos);
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
      return; // Don't close dialog or save
    }
    const updatedTodos = todos.map((todo: Todo) => {
      if (todo.id === editingTodoId) {
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
    toast.success("Todo updated successfully!");
  }

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(prevPage => prevPage - 1);
    }
  };

  const handleNextPage = () => {
    if (!isLastPage) {
      setPage(prevPage => prevPage + 1);
    }
  };

  const getEmptyStateMessage = () => {
    // Loading state is handled separately
    if (isLoadingTodos) return null;

    // If there are no todos fetched from the API for the current page at all
    if (todos.length === 0) {
      return {
        icon: <FileText className="h-16 w-16 text-muted-foreground/50 mb-4" />,
        title: "Your list is empty for this page!",
        message: "Add a new todo or try another page.",
      };
    }

    // Filter-specific empty states (when todos exist on the page but not for the filter)
    if (filter === "active" && filteredTodos.length === 0) {
      return {
        icon: <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />,
        title: "All tasks completed!",
        message: "Nice job! No active todos left on this page.",
      };
    }
    if (filter === "completed" && filteredTodos.length === 0) {
      return {
        icon: <ListX className="h-16 w-16 text-muted-foreground/50 mb-4" />,
        title: "No completed tasks yet.",
        message: "Keep working to see your finished todos here for this page.",
      };
    }
    // This case should ideally not be hit if todos.length > 0 and filteredTodos.length === 0
    // unless it's a new filter state not covered above.
    // Or if filter is 'all' and todos.length > 0 but filteredTodos.length is somehow 0 (should not happen with current logic).
    // However, to be safe, we can return a generic message or the "all" filter empty state.
    if (filteredTodos.length === 0) {
       return {
        icon: <FileText className="h-16 w-16 text-muted-foreground/50 mb-4" />,
        title: "No todos match your filter.",
        message: "Try a different filter or add more todos.",
      };
    }

    return null; // Should not be reached if filteredTodos has items
  };

  const emptyStateContent = getEmptyStateMessage();

  const handleToggleComplete = (id: number) => {
    const updatedTodos = todos.map((todo: Todo) => {
      if (todo.id === id) {
        return {
          ...todo,
          completed: !todo.completed,
        };
      }
      return todo;
    });
    setTodos(updatedTodos);
  };

  return (
    // Adjusted padding to match example: py-8 px-4, and removed container (max-w-3xl is already on this div)
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Todos</h1>
        <ModeToggle />
      </div>

      <div className="flex gap-2 mb-8">
        <Input
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          type="text"
          placeholder="Create a new todo"
          className="flex-grow"
        />
        <Button onClick={handleCreateNewTodo}>Create Todo</Button>
      </div>

      {/* Filter Buttons */}
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

      <div className="mt-4 space-y-4"> {/* Adjusted margin from mt-8 to mt-4 */}
        {isLoadingTodos ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Loading todos...</p>
          </div>
        ) : emptyStateContent && filteredTodos.length === 0 ? ( // Check for emptyStateContent and use filteredTodos
          <div className="flex flex-col items-center justify-center py-12 text-center">
            {emptyStateContent.icon}
            <h2 className="text-xl font-semibold mb-2">{emptyStateContent.title}</h2>
            <p className="text-muted-foreground">{emptyStateContent.message}</p>
          </div>
        ) : (
          filteredTodos.map((todo: Todo) => { // Use filteredTodos here
            return (
              <div
                key={todo.id}
                className="flex items-center p-4 bg-card border border-border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-150 ease-in-out" // 1. Todo Item Hover Effect
              >
                <Checkbox
                  id={todo.id.toString()}
                  checked={todo.completed}
                  // onCheckedChange={(checked) => handleToggleTodo(todo.id, !!checked)} // Assuming you'll add this handler
                  className="border-gray-500 data-[state=checked]:bg-primary data-[state=checked]:border-primary" // 5. Checkbox Visuals (enhanced)
                />
                <label
                  htmlFor={todo.id.toString()}
                  className={`ml-3 flex-grow cursor-pointer ${ // Added cursor-pointer for better UX
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
                        className="w-8 h-8 ml-2 hover:bg-muted/50 hover:text-primary" // 2. Action Button Styling
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
                        className="w-8 h-8 ml-2 hover:bg-destructive/10 hover:text-destructive" // 2. Action Button Styling (Destructive variant for delete)
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
            );
          })
        )}
      </div>
      {isEditing && (
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogContent className="sm:max-w-[425px]"> {/* 4. Dialog Styling */}
            <DialogHeader>
              <DialogTitle>Edit Todo</DialogTitle>
              <DialogDescription>
                Make changes to your todo item here. Click "Save Changes" when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Input
                id="editedTodoTitle" // Added id for potential label association if needed
                type="text"
                value={editedTodoTitle}
                placeholder="Edit Todo Title"
                onChange={(e) => setEditedTodoTitle(e.target.value)}
                className="col-span-3 focus:ring-primary focus:border-primary" // 3. Input Field Focus (explicitly added for dialog)
              />
            </div>
            <Button onClick={handleEditTodo} type="submit" className="w-full sm:w-auto"> {/* 4. Dialog Button Styling */}
              Save Changes
            </Button>
          </DialogContent>
        </Dialog>
      )}

      {/* Pagination: Show if not loading AND (there are base todos OR currently on a page > 1 to allow going back) */}
      {!isLoadingTodos && (todos.length > 0 || page > 1) && (
        <div className="mt-8 flex justify-center items-center space-x-4">
          <Button
            onClick={handlePreviousPage}
            disabled={page === 1 || isLoadingTodos}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">Page {page}</span>
          <Button
            onClick={handleNextPage}
            disabled={isLastPage || isLoadingTodos}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
