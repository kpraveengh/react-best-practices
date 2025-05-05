import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import LinearProgress from "@mui/material/LinearProgress";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";

// Import context
import { useTheme } from "../../context/ThemeContext";
import { useViewMode } from "../../context/ViewModeContext";

// Define TypeScript interfaces for the simulated React Query
interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

interface QueryResult<T> {
  data: T | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  isFetching: boolean;
  refetch: () => Promise<T>;
}

interface QueryOptions<T> {
  data?: T;
  isLoading?: boolean;
  isError?: boolean;
  error?: Error | null;
  isFetching?: boolean;
  refetch?: () => Promise<T>;
  initialData?: T;
}

interface MutationResult<T> {
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  isSuccess: boolean;
  data: T | undefined;
  mutate: (variables: any) => Promise<T>;
  mutateAsync: (variables: any) => Promise<T>;
}

interface MutationOptions<T, V> {
  onSuccess?: (data: T, variables: V) => void;
  onError?: (error: Error, variables: V, context?: any) => void;
  onMutate?: (variables: V) => Promise<any> | any;
  onSettled?: (data?: T, error?: Error, variables?: V, context?: any) => void;
}

// React Query imports (these are just for example purposes)
// In a real app, you would install and import from @tanstack/react-query
// Simulating React Query hooks for the examples
const simulateReactQuery = () => {
  // Helper to simulate different query states
  function createQueryResult<T>(options: QueryOptions<T>): QueryResult<T> {
    const {
      data,
      isLoading = false,
      isError = false,
      error = null,
      isFetching = false,
      refetch = () => Promise.resolve(data as T),
    } = options;

    return {
      data,
      isLoading,
      isError,
      error,
      isFetching,
      refetch:
        refetch ||
        (() => {
          console.log("Refetching data...");
          return Promise.resolve(data as T);
        }),
    };
  }

  // Simulate useQuery hook
  function useQuery<T>(
    queryKey: any[],
    queryFn: () => Promise<T>,
    options: QueryOptions<T> = {}
  ): QueryResult<T> {
    const [state, setState] = useState<QueryResult<T>>({
      data: options.initialData,
      isLoading: !options.initialData,
      isError: false,
      error: null,
      isFetching: !options.initialData,
      refetch: async () => {
        setState((prev) => ({ ...prev, isFetching: true }));
        try {
          const result = await queryFn();
          setState({
            data: result,
            isLoading: false,
            isError: false,
            error: null,
            isFetching: false,
            refetch: state.refetch,
          });
          return result;
        } catch (err) {
          setState({
            data: undefined,
            isLoading: false,
            isError: true,
            error: err as Error,
            isFetching: false,
            refetch: state.refetch,
          });
          throw err;
        }
      },
    });

    React.useEffect(() => {
      let isMounted = true;

      if (state.isLoading) {
        const fetchData = async () => {
          try {
            await new Promise((resolve) => setTimeout(resolve, 1500));
            const result = await queryFn();
            if (isMounted) {
              setState({
                data: result,
                isLoading: false,
                isError: false,
                error: null,
                isFetching: false,
                refetch: state.refetch,
              });
            }
          } catch (err) {
            if (isMounted) {
              setState({
                data: undefined,
                isLoading: false,
                isError: true,
                error: err as Error,
                isFetching: false,
                refetch: state.refetch,
              });
            }
          }
        };

        fetchData();
      }

      return () => {
        isMounted = false;
      };
    }, [queryKey.join("")]);

    return state;
  }

  // Simulate useMutation hook
  function useMutation<T, V>(
    mutationFn: (variables: V) => Promise<T>,
    options: MutationOptions<T, V> = {}
  ): MutationResult<T> {
    const initialState: MutationResult<T> = {
      isLoading: false,
      isError: false,
      error: null,
      isSuccess: false,
      data: undefined,
      mutate: async (variables: V): Promise<T> => {
        throw new Error("Not implemented");
      },
      mutateAsync: async (variables: V): Promise<T> => {
        throw new Error("Not implemented");
      },
    };

    const [state, setState] = useState<MutationResult<T>>(initialState);

    // Create the mutate function once
    const mutateRef = React.useRef<(variables: V) => Promise<T>>(
      async (variables: V): Promise<T> => {
        setState((prev) => ({
          ...prev,
          isLoading: true,
          isError: false,
          error: null,
          isSuccess: false,
          data: undefined,
        }));

        try {
          const result = await mutationFn(variables);
          setState((prev) => ({
            ...prev,
            isLoading: false,
            isError: false,
            error: null,
            isSuccess: true,
            data: result,
          }));

          if (options.onSuccess) {
            options.onSuccess(result, variables);
          }

          return result;
        } catch (err) {
          setState((prev) => ({
            ...prev,
            isLoading: false,
            isError: true,
            error: err as Error,
            isSuccess: false,
            data: undefined,
          }));

          if (options.onError) {
            options.onError(err as Error, variables);
          }

          throw err;
        }
      }
    );

    // Initialize state with the actual mutate functions
    React.useEffect(() => {
      setState((prev) => ({
        ...prev,
        mutate: mutateRef.current,
        mutateAsync: mutateRef.current,
      }));
    }, []);

    return state;
  }

  // Simulate useQueryClient
  const queryClient = {
    invalidateQueries: (queryKey: any[]) => {
      console.log(`Invalidating queries matching ${queryKey}`);
      return Promise.resolve();
    },
    setQueryData: (queryKey: any[], updater: (data: any) => any) => {
      console.log(`Setting query data for ${queryKey}`);
      return undefined;
    },
    getQueryData: (queryKey: any[]) => {
      console.log(`Getting query data for ${queryKey}`);
      return undefined;
    },
  };

  function useQueryClient() {
    return queryClient;
  }

  return {
    useQuery,
    useMutation,
    useQueryClient,
  };
};

// Simulated React Query implementation
const { useQuery, useMutation, useQueryClient } = simulateReactQuery();

// Mock API service
const api = {
  getTodos: async () => {
    // Simulate network request
    return [
      { id: 1, title: "Learn React Query", completed: false },
      { id: 2, title: "Build a project with TypeScript", completed: true },
      { id: 3, title: "Master custom hooks", completed: false },
    ];
  },

  getTodoById: async (id: number) => {
    // Simulate network request
    const todos = await api.getTodos();
    const todo = todos.find((t) => t.id === id);

    if (!todo) {
      throw new Error("Todo not found");
    }

    return todo;
  },

  addTodo: async (newTodo: { title: string }) => {
    // Simulate network request
    return {
      id: Date.now(),
      title: newTodo.title,
      completed: false,
    };
  },

  updateTodo: async (updatedTodo: Todo) => {
    // Simulate network request
    return updatedTodo;
  },

  deleteTodo: async (id: number) => {
    // Simulate network request
    return { success: true, id };
  },
};

// Basic Query Example component
const BasicQueryExample: React.FC = () => {
  const theme = useMuiTheme();

  // Use the simulated useQuery hook
  const {
    data: todos = [], // Provide default empty array value
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery<Todo[]>(["todos"], () => api.getTodos());

  return (
    <Card
      elevation={3}
      sx={{
        p: 2,
        mb: 3,
        borderRadius: 2,
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: theme.shadows[6],
        },
      }}
    >
      <CardHeader
        title="Basic Query Example"
        titleTypographyProps={{ variant: "h6" }}
        action={
          <Button
            variant="outlined"
            size="small"
            onClick={() => refetch()}
            disabled={isLoading || isFetching}
            startIcon={isFetching ? <CircularProgress size={16} /> : null}
          >
            Refetch
          </Button>
        }
      />
      <CardContent>
        <Typography variant="body2" gutterBottom>
          Using React Query to fetch a list of todos:
        </Typography>

        {isLoading ? (
          <Box sx={{ mt: 2 }}>
            {[1, 2, 3].map((_, index) => (
              <Skeleton
                key={index}
                animation="wave"
                height={50}
                sx={{ my: 1, borderRadius: 1 }}
              />
            ))}
          </Box>
        ) : isError && error ? (
          <Alert severity="error" sx={{ mt: 2 }}>
            Error: {error.message}
          </Alert>
        ) : (
          <Box sx={{ mt: 2 }}>
            {isFetching && <LinearProgress sx={{ mb: 2 }} />}

            <List>
              {todos.map((todo) => (
                <ListItem
                  key={todo.id}
                  sx={{
                    py: 1,
                    px: 2,
                    mb: 1,
                    bgcolor: theme.palette.action.hover,
                    borderRadius: 1,
                  }}
                  secondaryAction={
                    <Chip
                      label={todo.completed ? "Completed" : "Pending"}
                      color={todo.completed ? "success" : "warning"}
                      size="small"
                    />
                  }
                >
                  <ListItemText primary={todo.title} />
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        <Paper
          elevation={0}
          sx={{
            p: 2,
            mt: 3,
            backgroundColor:
              theme.palette.mode === "dark"
                ? "rgba(0, 0, 0, 0.1)"
                : "rgba(0, 0, 0, 0.05)",
            overflowX: "auto",
          }}
        >
          <pre style={{ margin: 0 }}>{`// Basic React Query example
import { useQuery } from '@tanstack/react-query';

function TodoList() {
  const { 
    data, 
    isLoading, 
    isError, 
    error,
    refetch,
    isFetching 
  } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div>
      <button onClick={() => refetch()}>Refresh</button>
      {isFetching && <div>Refreshing...</div>}
      <ul>
        {data.map(todo => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
    </div>
  );
}`}</pre>
        </Paper>
      </CardContent>
    </Card>
  );
};

// Mutation Example component
const MutationExample: React.FC = () => {
  const theme = useMuiTheme();
  const [newTodoTitle, setNewTodoTitle] = useState("");

  // Simulated query client
  const queryClient = useQueryClient();

  // Simulated query for todos
  const { data: todos = [], isLoading: isTodosLoading } = useQuery<Todo[]>(
    ["todos"],
    () => api.getTodos()
  );

  // Simulated mutation for adding a todo
  const {
    mutate,
    isLoading: isAdding,
    isSuccess,
    isError,
    error,
  } = useMutation<Todo, { title: string }>(
    (newTodo: { title: string }) => api.addTodo(newTodo),
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["todos"]);
        setNewTodoTitle("");
      },
    }
  );

  const handleAddTodo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;

    mutate({ title: newTodoTitle });
  };

  return (
    <Card
      elevation={3}
      sx={{
        p: 2,
        mb: 3,
        borderRadius: 2,
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: theme.shadows[6],
        },
      }}
    >
      <CardHeader
        title="Mutation Example"
        titleTypographyProps={{ variant: "h6" }}
      />
      <CardContent>
        <Typography variant="body2" gutterBottom>
          Using React Query mutations to add a new todo:
        </Typography>

        <Box component="form" onSubmit={handleAddTodo} sx={{ mt: 2, mb: 3 }}>
          <TextField
            fullWidth
            label="New Todo"
            value={newTodoTitle}
            onChange={(e) => setNewTodoTitle(e.target.value)}
            disabled={isAdding}
            sx={{ mb: 2 }}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isAdding || !newTodoTitle.trim()}
            startIcon={isAdding ? <CircularProgress size={16} /> : null}
          >
            {isAdding ? "Adding..." : "Add Todo"}
          </Button>
        </Box>

        {isSuccess && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Todo added successfully!
          </Alert>
        )}

        {isError && error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Error: {error.message}
          </Alert>
        )}

        <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
          Current Todos
        </Typography>

        {isTodosLoading ? (
          <Box sx={{ mt: 2 }}>
            {[1, 2, 3].map((_, index) => (
              <Skeleton
                key={index}
                animation="wave"
                height={40}
                sx={{ my: 0.5, borderRadius: 1 }}
              />
            ))}
          </Box>
        ) : (
          <List>
            {todos.map((todo) => (
              <ListItem
                key={todo.id}
                sx={{
                  py: 1,
                  px: 2,
                  mb: 1,
                  bgcolor: theme.palette.action.hover,
                  borderRadius: 1,
                }}
              >
                <ListItemText
                  primary={todo.title}
                  primaryTypographyProps={{
                    style: {
                      textDecoration: todo.completed ? "line-through" : "none",
                    },
                  }}
                />
              </ListItem>
            ))}
          </List>
        )}

        <Paper
          elevation={0}
          sx={{
            p: 2,
            mt: 3,
            backgroundColor:
              theme.palette.mode === "dark"
                ? "rgba(0, 0, 0, 0.1)"
                : "rgba(0, 0, 0, 0.05)",
            overflowX: "auto",
          }}
        >
          <pre style={{ margin: 0 }}>{`// React Query mutation example
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

function AddTodo() {
  const [title, setTitle] = useState('');
  const queryClient = useQueryClient();
  
  const { data: todos } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
  });
  
  const mutation = useMutation({
    mutationFn: (newTodo) => {
      return axios.post('/api/todos', newTodo);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      setTitle('');
    },
  });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ title });
  };
  
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={mutation.isLoading}
        />
        <button disabled={mutation.isLoading}>
          {mutation.isLoading ? 'Adding...' : 'Add Todo'}
        </button>
      </form>
      
      {/* Show todos */}
      <ul>
        {todos?.map(todo => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
    </div>
  );
}`}</pre>
        </Paper>
      </CardContent>
    </Card>
  );
};

// QueryClient Configuration component
const QueryClientConfigExample: React.FC = () => {
  const theme = useMuiTheme();

  return (
    <Card
      elevation={3}
      sx={{
        p: 2,
        mb: 3,
        borderRadius: 2,
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: theme.shadows[6],
        },
      }}
    >
      <CardHeader
        title="QueryClient Configuration"
        titleTypographyProps={{ variant: "h6" }}
      />
      <CardContent>
        <Typography variant="body2" gutterBottom>
          Setting up React Query with TypeScript and configuring the
          QueryClient:
        </Typography>

        <Alert severity="info" sx={{ mt: 2, mb: 3 }}>
          <Typography variant="body2">
            The QueryClient is the central hub for managing the cache, default
            options, and global behaviors.
          </Typography>
        </Alert>

        <Paper
          elevation={0}
          sx={{
            p: 2,
            backgroundColor:
              theme.palette.mode === "dark"
                ? "rgba(0, 0, 0, 0.1)"
                : "rgba(0, 0, 0, 0.05)",
            overflowX: "auto",
            mb: 3,
          }}
        >
          <pre style={{ margin: 0 }}>{`// Setting up QueryClient in TypeScript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,                 // Only retry failed queries once
      refetchOnWindowFocus: true, // Refetch when window gains focus
      staleTime: 1000 * 60 * 5,   // Data considered fresh for 5 minutes
      cacheTime: 1000 * 60 * 30,  // Unused data garbage-collected after 30 minutes
    },
  },
});

// Wrap your application with the provider
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YourApp />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}`}</pre>
        </Paper>

        <Typography variant="subtitle1" gutterBottom>
          Type-Safe Query Keys with TypeScript
        </Typography>

        <Paper
          elevation={0}
          sx={{
            p: 2,
            backgroundColor:
              theme.palette.mode === "dark"
                ? "rgba(0, 0, 0, 0.1)"
                : "rgba(0, 0, 0, 0.05)",
            overflowX: "auto",
          }}
        >
          <pre style={{ margin: 0 }}>{`// Type-safe query keys in TypeScript
import { createQueryKeyStore } from '@lukemorales/query-key-factory';

export const queryKeys = createQueryKeyStore({
  todos: {
    all: null,
    detail: (id: number) => [id],
    lists: {
      filtered: (filters: TodoFilters) => [filters],
    },
  },
  users: {
    all: null,
    detail: (id: number) => [id],
  },
});

// Usage
useQuery({
  queryKey: queryKeys.todos.detail(1),
  queryFn: () => fetchTodoById(1),
});`}</pre>
        </Paper>
      </CardContent>
    </Card>
  );
};

// Optimistic Updates Example
const OptimisticUpdatesExample: React.FC = () => {
  const theme = useMuiTheme();
  const [selectedTodoId, setSelectedTodoId] = useState(1);

  // Simulated query client
  const queryClient = useQueryClient();

  // Simulated query for todos
  const { data: todos = [], isLoading: isTodosLoading } = useQuery<Todo[]>(
    ["todos"],
    () => api.getTodos()
  );

  // Simulated mutation to toggle a todo with optimistic updates
  const { mutate: toggleTodo, isLoading: isToggling } = useMutation<Todo, Todo>(
    (updatedTodo: Todo) => api.updateTodo(updatedTodo),
    {
      // Optimistically update the cache
      onMutate: async (updatedTodo: Todo) => {
        // Cancel any outgoing refetches
        await queryClient.invalidateQueries(["todos"]);

        // Get the current todo to rollback if needed
        const previousTodos = queryClient.getQueryData(["todos"]) as
          | Todo[]
          | undefined;

        // Optimistically update the todos list
        queryClient.setQueryData(["todos"], (old: Todo[] = []) =>
          old.map((todo: Todo) =>
            todo.id === updatedTodo.id ? { ...todo, ...updatedTodo } : todo
          )
        );

        return { previousTodos };
      },

      // If the mutation fails, roll back
      onError: (err: Error, variables: Todo, context: any) => {
        if (context?.previousTodos) {
          queryClient.setQueryData(["todos"], context.previousTodos);
        }
      },

      // Always refetch after mutation
      onSettled: () => {
        queryClient.invalidateQueries(["todos"]);
      },
    }
  );

  // Handler to toggle a todo
  const handleToggleTodo = (todo: Todo) => {
    toggleTodo({
      ...todo,
      completed: !todo.completed,
    });
  };

  return (
    <Card
      elevation={3}
      sx={{
        p: 2,
        mb: 3,
        borderRadius: 2,
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: theme.shadows[6],
        },
      }}
    >
      <CardHeader
        title="Optimistic Updates"
        titleTypographyProps={{ variant: "h6" }}
      />
      <CardContent>
        <Typography variant="body2" gutterBottom>
          Implementing optimistic updates to create a responsive UI:
        </Typography>

        <Alert severity="info" sx={{ my: 2 }}>
          <Typography variant="body2">
            Optimistic updates improve UX by updating the UI immediately,
            without waiting for the server response.
          </Typography>
        </Alert>

        {isTodosLoading ? (
          <Box sx={{ mt: 2 }}>
            {[1, 2, 3].map((_, index) => (
              <Skeleton
                key={index}
                animation="wave"
                height={60}
                sx={{ my: 1, borderRadius: 1 }}
              />
            ))}
          </Box>
        ) : (
          <List sx={{ mt: 2 }}>
            {todos.map((todo) => (
              <ListItem
                key={todo.id}
                sx={{
                  py: 1,
                  px: 2,
                  mb: 1,
                  bgcolor: theme.palette.action.hover,
                  borderRadius: 1,
                }}
              >
                <ListItemText
                  primary={todo.title}
                  primaryTypographyProps={{
                    style: {
                      textDecoration: todo.completed ? "line-through" : "none",
                    },
                  }}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={todo.completed}
                      onChange={() => handleToggleTodo(todo)}
                      disabled={isToggling}
                    />
                  }
                  label={todo.completed ? "Completed" : "Pending"}
                />
              </ListItem>
            ))}
          </List>
        )}

        <Paper
          elevation={0}
          sx={{
            p: 2,
            mt: 3,
            backgroundColor:
              theme.palette.mode === "dark"
                ? "rgba(0, 0, 0, 0.1)"
                : "rgba(0, 0, 0, 0.05)",
            overflowX: "auto",
          }}
        >
          <pre style={{ margin: 0 }}>{`// Optimistic Updates Example
const { mutate: toggleTodo } = useMutation({
  mutationFn: updateTodo,
  // When mutate is called:
  onMutate: async (updatedTodo) => {
    // Cancel any outgoing refetches
    await queryClient.cancelQueries({ queryKey: ['todos'] });
    
    // Save the previous value
    const previousTodos = queryClient.getQueryData(['todos']);
    
    // Optimistically update the data
    queryClient.setQueryData(['todos'], old => 
      old.map(todo => 
        todo.id === updatedTodo.id ? updatedTodo : todo
      )
    );
    
    // Return context with the previous data for rollback
    return { previousTodos };
  },
  
  // If mutation fails, use the context returned
  // from onMutate to roll back
  onError: (err, updatedTodo, context) => {
    queryClient.setQueryData(['todos'], context.previousTodos);
  },
  
  // After success or failure, refetch
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['todos'] });
  },
});`}</pre>
        </Paper>
      </CardContent>
    </Card>
  );
};

// Main section component
const ReactQuerySection: React.FC = () => {
  const { theme } = useTheme();
  const { isFullView } = useViewMode();
  const muiTheme = useMuiTheme();

  const reactQueryFeatures = [
    {
      text: "Caching - Automatic request deduplication and caching",
      icon: "💾",
    },
    {
      text: "Auto Refetching - Automatic background updates on focus, network reconnection",
      icon: "🔄",
    },
    {
      text: "Stale While Revalidate - Show stale data while fetching new data",
      icon: "⏳",
    },
    {
      text: "Pagination & Infinite Scroll - Built-in support for advanced data fetching patterns",
      icon: "📜",
    },
    {
      text: "DevTools - Visual debugging with React Query DevTools",
      icon: "🔍",
    },
    {
      text: "TypeScript Support - Complete type safety with generics",
      icon: "📝",
    },
  ];

  return (
    <Box
      component="section"
      sx={{
        height: "100%",
        overflowY: "auto",
        pb: 4,
      }}
    >
      <Box>
        <Paper
          elevation={3}
          sx={{
            background: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1740&q=80')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: 2,
            p: 4,
            mb: 4,
            color: "white",
          }}
        >
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            TanStack Query (React Query)
          </Typography>
          <Typography variant="h6">
            Modern and performant data fetching, caching, and state management
          </Typography>
        </Paper>

        <Card
          elevation={3}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 2,
            transition: "all 0.3s ease",
            "&:hover": {
              boxShadow: muiTheme.shadows[8],
            },
          }}
        >
          <Typography
            variant="h5"
            color="primary"
            fontWeight="bold"
            gutterBottom
          >
            Why Use React Query?
          </Typography>

          <List>
            {reactQueryFeatures.map((item, i) => (
              <Box key={i}>
                <ListItem>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography variant="h6">{item.icon}</Typography>
                    <ListItemText
                      primary={
                        <Typography component="span">
                          <Box component="span" fontWeight="bold">
                            {item.text.split(" - ")[0]}
                          </Box>
                          <Box component="span">
                            {" "}
                            - {item.text.split(" - ")[1]}
                          </Box>
                        </Typography>
                      }
                    />
                  </Box>
                </ListItem>
                {i < reactQueryFeatures.length - 1 && <Divider />}
              </Box>
            ))}
          </List>
        </Card>

        <BasicQueryExample />
        <MutationExample />
        <QueryClientConfigExample />
        <OptimisticUpdatesExample />

        <Card
          elevation={3}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 2,
          }}
        >
          <Typography
            variant="h5"
            color="primary"
            fontWeight="bold"
            gutterBottom
          >
            React Query Best Practices
          </Typography>

          <List>
            <ListItem>
              <ListItemText
                primary={
                  <Typography variant="body1" fontWeight="bold">
                    1. Structured Query Keys
                  </Typography>
                }
                secondary="Use array-based query keys for better organization and invalidation patterns (e.g., ['todos', { status: 'active' }])."
              />
            </ListItem>
            <Divider />

            <ListItem>
              <ListItemText
                primary={
                  <Typography variant="body1" fontWeight="bold">
                    2. Prefetch critical data
                  </Typography>
                }
                secondary="Use queryClient.prefetchQuery() to start loading important data before it's needed for better user experience."
              />
            </ListItem>
            <Divider />

            <ListItem>
              <ListItemText
                primary={
                  <Typography variant="body1" fontWeight="bold">
                    3. Avoid unnecessary fetching
                  </Typography>
                }
                secondary="Configure staleTime properly to prevent unnecessary network requests when the data is still fresh."
              />
            </ListItem>
            <Divider />

            <ListItem>
              <ListItemText
                primary={
                  <Typography variant="body1" fontWeight="bold">
                    4. Use optimistic updates
                  </Typography>
                }
                secondary="Implement optimistic updates for mutations to create a more responsive UI experience."
              />
            </ListItem>
            <Divider />

            <ListItem>
              <ListItemText
                primary={
                  <Typography variant="body1" fontWeight="bold">
                    5. Handle errors properly
                  </Typography>
                }
                secondary="Configure retry logic and error handling to provide a graceful user experience when problems occur."
              />
            </ListItem>
          </List>

          <Alert severity="info" sx={{ mt: 3 }}>
            <Typography variant="body2">
              React Query works exceptionally well with TypeScript, allowing you
              to define strongly-typed query hooks that are reusable throughout
              your application.
            </Typography>
          </Alert>
        </Card>
      </Box>
    </Box>
  );
};

export default ReactQuerySection;
