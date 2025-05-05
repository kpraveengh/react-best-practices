import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import React, {
  createContext,
  useCallback,
  useContext,
  useReducer,
} from "react";
import { useTheme } from "../../context/ThemeContext";

// Example using Context API with TypeScript
interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
}

interface TodoState {
  todos: TodoItem[];
  filter: "all" | "active" | "completed";
}

type TodoAction =
  | { type: "ADD_TODO"; payload: string }
  | { type: "TOGGLE_TODO"; payload: number }
  | { type: "REMOVE_TODO"; payload: number }
  | { type: "SET_FILTER"; payload: "all" | "active" | "completed" };

interface TodoContextType {
  state: TodoState;
  dispatch: React.Dispatch<TodoAction>;
}

// Create context with proper typing
const TodoContext = createContext<TodoContextType | undefined>(undefined);

// Create a reducer for todos
const todoReducer = (state: TodoState, action: TodoAction): TodoState => {
  switch (action.type) {
    case "ADD_TODO":
      return {
        ...state,
        todos: [
          ...state.todos,
          {
            id: Date.now(),
            text: action.payload,
            completed: false,
          },
        ],
      };
    case "TOGGLE_TODO":
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload
            ? { ...todo, completed: !todo.completed }
            : todo
        ),
      };
    case "REMOVE_TODO":
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== action.payload),
      };
    case "SET_FILTER":
      return {
        ...state,
        filter: action.payload,
      };
    default:
      return state;
  }
};

// Provider component
const TodoProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(todoReducer, {
    todos: [
      { id: 1, text: "Learn React Context API", completed: true },
      { id: 2, text: "Practice TypeScript with React", completed: false },
      { id: 3, text: "Implement design patterns", completed: false },
    ],
    filter: "all",
  });

  return (
    <TodoContext.Provider value={{ state, dispatch }}>
      {children}
    </TodoContext.Provider>
  );
};

// Custom hook to use the Todo context
const useTodo = (): TodoContextType => {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error("useTodo must be used within a TodoProvider");
  }
  return context;
};

// Component demonstrating the Compound Component pattern
interface TabProps {
  children?: React.ReactNode;
  value?: string;
  label: string;
  tabValue?: string;
  onChange?: (value: string) => void;
}

interface TabsProps {
  children: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
}

interface TabPanelProps {
  children: React.ReactNode;
  value: string;
  tabValue: string;
}

const Tabs: React.FC<TabsProps> & {
  Tab: React.FC<TabProps>;
  Panel: React.FC<TabPanelProps>;
} = ({ children, value, onChange }) => {
  const theme = useMuiTheme();

  return (
    <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
      <Box sx={{ display: "flex" }}>
        {React.Children.map(children, (child) => {
          if (
            React.isValidElement<TabProps>(child) &&
            child.type === Tabs.Tab
          ) {
            return React.cloneElement(child, {
              ...child.props,
              value,
              onChange,
              tabValue: child.props.value, // Pass value to tabValue
            });
          }
          return null;
        })}
      </Box>
    </Box>
  );
};

Tabs.Tab = ({ children, tabValue, label, value, onChange }) => {
  const theme = useMuiTheme();
  const isSelected = value === tabValue;

  return (
    <Button
      sx={{
        py: 1.5,
        px: 3,
        borderRadius: 0,
        position: "relative",
        color: isSelected ? "primary.main" : "text.secondary",
        fontWeight: isSelected ? "bold" : "normal",
        "&::after": {
          content: '""',
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 3,
          bgcolor: isSelected ? "primary.main" : "transparent",
          borderTopLeftRadius: 3,
          borderTopRightRadius: 3,
        },
      }}
      onClick={() => onChange && onChange(tabValue!)}
    >
      {label}
    </Button>
  );
};

Tabs.Panel = ({ children, value, tabValue }) => {
  return value === tabValue ? <Box sx={{ py: 2 }}>{children}</Box> : null;
};

// TodoItem component using the Context
const TodoItemComponent: React.FC<{ todo: TodoItem }> = ({ todo }) => {
  const { dispatch } = useTodo();
  const theme = useMuiTheme();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        p: 2,
        my: 1,
        borderRadius: 1,
        bgcolor: theme.palette.background.paper,
        borderLeft: "4px solid",
        borderLeftColor: todo.completed ? "success.main" : "info.main",
        boxShadow: 1,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => dispatch({ type: "TOGGLE_TODO", payload: todo.id })}
        />
        <Typography
          sx={{
            ml: 2,
            textDecoration: todo.completed ? "line-through" : "none",
            color: todo.completed ? "text.secondary" : "text.primary",
          }}
        >
          {todo.text}
        </Typography>
      </Box>
      <Button
        size="small"
        color="error"
        onClick={() => dispatch({ type: "REMOVE_TODO", payload: todo.id })}
      >
        Remove
      </Button>
    </Box>
  );
};

// TodoList component using the Context
const TodoList: React.FC = () => {
  const { state, dispatch } = useTodo();
  const [newTodo, setNewTodo] = React.useState("");
  const [activeTab, setActiveTab] = React.useState("all");

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      dispatch({ type: "ADD_TODO", payload: newTodo });
      setNewTodo("");
    }
  };

  const filteredTodos = state.todos.filter((todo) => {
    if (state.filter === "active") return !todo.completed;
    if (state.filter === "completed") return todo.completed;
    return true;
  });

  return (
    <Card sx={{ mb: 4 }}>
      <CardHeader title="Todo App - Context API Pattern" />
      <Divider />
      <CardContent>
        <form onSubmit={handleAddTodo}>
          <Box sx={{ display: "flex", mb: 3 }}>
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add new todo"
              style={{
                flex: 1,
                padding: "8px 12px",
                borderRadius: "4px 0 0 4px",
                border: `1px solid ${useMuiTheme().palette.divider}`,
                borderRight: "none",
              }}
            />
            <Button
              type="submit"
              variant="contained"
              sx={{ borderRadius: "0 4px 4px 0" }}
            >
              Add
            </Button>
          </Box>
        </form>

        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.Tab label="All" value="all" />
          <Tabs.Tab label="Active" value="active" />
          <Tabs.Tab label="Completed" value="completed" />
        </Tabs>

        <Tabs.Panel value={activeTab} tabValue="all">
          {filteredTodos.length === 0 ? (
            <Typography color="text.secondary" align="center" sx={{ py: 2 }}>
              No todos to display
            </Typography>
          ) : (
            filteredTodos.map((todo) => (
              <TodoItemComponent key={todo.id} todo={todo} />
            ))
          )}
        </Tabs.Panel>

        <Tabs.Panel value={activeTab} tabValue="active">
          {filteredTodos.length === 0 ? (
            <Typography color="text.secondary" align="center" sx={{ py: 2 }}>
              No active todos
            </Typography>
          ) : (
            filteredTodos.map((todo) => (
              <TodoItemComponent key={todo.id} todo={todo} />
            ))
          )}
        </Tabs.Panel>

        <Tabs.Panel value={activeTab} tabValue="completed">
          {filteredTodos.length === 0 ? (
            <Typography color="text.secondary" align="center" sx={{ py: 2 }}>
              No completed todos
            </Typography>
          ) : (
            filteredTodos.map((todo) => (
              <TodoItemComponent key={todo.id} todo={todo} />
            ))
          )}
        </Tabs.Panel>
      </CardContent>
    </Card>
  );
};

// Render Props Pattern Example
interface RenderPropsExampleProps {
  render: (
    count: number,
    increment: () => void,
    decrement: () => void
  ) => React.ReactNode;
}

const CounterRenderProps: React.FC<RenderPropsExampleProps> = ({ render }) => {
  const [count, setCount] = React.useState(0);

  const increment = useCallback(() => setCount((prev) => prev + 1), []);
  const decrement = useCallback(() => setCount((prev) => prev - 1), []);

  return <>{render(count, increment, decrement)}</>;
};

// HOC Pattern Example
interface WithLoaderProps {
  loading?: boolean;
}

function withLoader<P extends object>(
  Component: React.ComponentType<P>
): React.FC<P & WithLoaderProps> {
  const WithLoader: React.FC<P & WithLoaderProps> = ({
    loading = false,
    ...props
  }) => {
    if (loading) {
      return (
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography>Loading...</Typography>
        </Box>
      );
    }

    return <Component {...(props as P)} />;
  };

  return WithLoader;
}

// Sample component to use with HOC
const DataDisplay: React.FC<{ data: string[] }> = ({ data }) => (
  <Box>
    <Typography variant="h6" gutterBottom>
      Data Display
    </Typography>
    <ul>
      {data.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  </Box>
);

// Apply HOC to the component
const LoadableDataDisplay = withLoader(DataDisplay);

// Custom Hook Pattern example
function useCounter(initialValue: number = 0) {
  const [count, setCount] = React.useState(initialValue);

  const increment = useCallback(() => setCount((prev) => prev + 1), []);
  const decrement = useCallback(() => setCount((prev) => prev - 1), []);
  const reset = useCallback(() => setCount(initialValue), [initialValue]);

  return { count, increment, decrement, reset };
}

// Main Component Pattern Section
const ComponentPatternsSection: React.FC = () => {
  const { theme } = useTheme();
  const muiTheme = useMuiTheme();

  // For HOC example
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // For Custom Hook example
  const { count, increment, decrement, reset } = useCounter(5);

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
            React Design Patterns
          </Typography>
          <Typography variant="h6">
            Essential patterns for building maintainable React applications
          </Typography>
        </Paper>

        {/* Context API Pattern Example */}
        <Card sx={{ mb: 4 }}>
          <CardHeader title="Context API Pattern" />
          <CardContent>
            <Typography paragraph>
              The Context API provides a way to share values like themes or user
              data between components without having to explicitly pass props
              through every level of the component tree.
            </Typography>

            <Paper
              elevation={0}
              sx={{ p: 2, bgcolor: "background.default", mb: 3 }}
            >
              <pre style={{ margin: 0, overflow: "auto" }}>
                {`// Create properly typed context
interface TodoContextType {
  state: TodoState;
  dispatch: React.Dispatch<TodoAction>;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

// Custom hook for consuming context
const useTodo = (): TodoContextType => {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error('useTodo must be used within a TodoProvider');
  }
  return context;
};`}
              </pre>
            </Paper>

            <TodoProvider>
              <TodoList />
            </TodoProvider>
          </CardContent>
        </Card>

        {/* Compound Component Pattern Example */}
        <Card sx={{ mb: 4 }}>
          <CardHeader title="Compound Component Pattern" />
          <CardContent>
            <Typography paragraph>
              Compound components let you build components that have implicit
              state sharing and provide a more declarative and flexible API.
            </Typography>

            <Paper
              elevation={0}
              sx={{ p: 2, bgcolor: "background.default", mb: 3 }}
            >
              <pre style={{ margin: 0, overflow: "auto" }}>
                {`// Define compound component with TypeScript
const Tabs: React.FC<TabsProps> & {
  Tab: React.FC<TabProps>;
  Panel: React.FC<TabPanelProps>;
} = ({ children, value, onChange }) => {
  // Implementation
};

// Usage
<Tabs value={activeTab} onChange={setActiveTab}>
  <Tabs.Tab label="Tab 1" value="tab1" />
  <Tabs.Tab label="Tab 2" value="tab2" />
  
  <Tabs.Panel value={activeTab} tabValue="tab1">
    Tab 1 content
  </Tabs.Panel>
  <Tabs.Panel value={activeTab} tabValue="tab2">
    Tab 2 content
  </Tabs.Panel>
</Tabs>`}
              </pre>
            </Paper>

            <Box
              sx={{ border: 1, borderColor: "divider", borderRadius: 1, p: 2 }}
            >
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                Compound Component Demo
              </Typography>
              <Tabs value="tab1" onChange={() => {}}>
                <Tabs.Tab label="First Tab" value="tab1" />
                <Tabs.Tab label="Second Tab" value="tab2" />
                <Tabs.Tab label="Third Tab" value="tab3" />
              </Tabs>

              <Tabs.Panel value="tab1" tabValue="tab1">
                <Typography>
                  This is the content for the first tab. Compound components
                  create an API that's easier to use and understand.
                </Typography>
              </Tabs.Panel>
            </Box>
          </CardContent>
        </Card>

        {/* Render Props Pattern Example */}
        <Card sx={{ mb: 4 }}>
          <CardHeader title="Render Props Pattern" />
          <CardContent>
            <Typography paragraph>
              The render props pattern allows component logic to be shared by
              taking a function as a prop that returns a React element.
            </Typography>

            <Paper
              elevation={0}
              sx={{ p: 2, bgcolor: "background.default", mb: 3 }}
            >
              <pre style={{ margin: 0, overflow: "auto" }}>
                {`// Render Props with TypeScript
interface RenderPropsExampleProps {
  render: (
    count: number, 
    increment: () => void, 
    decrement: () => void
  ) => React.ReactNode;
}

const CounterRenderProps: React.FC<RenderPropsExampleProps> = ({ render }) => {
  const [count, setCount] = React.useState(0);
  
  const increment = () => setCount(prev => prev + 1);
  const decrement = () => setCount(prev => prev - 1);
  
  return <>{render(count, increment, decrement)}</>;
};

// Usage
<CounterRenderProps
  render={(count, increment, decrement) => (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  )}
/>`}
              </pre>
            </Paper>

            <Box
              sx={{ border: 1, borderColor: "divider", borderRadius: 1, p: 2 }}
            >
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                Render Props Demo
              </Typography>
              <CounterRenderProps
                render={(count, increment, decrement) => (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 2,
                    }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={decrement}
                    >
                      -
                    </Button>
                    <Typography variant="h5" sx={{ mx: 3 }}>
                      {count}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={increment}
                    >
                      +
                    </Button>
                  </Box>
                )}
              />
            </Box>
          </CardContent>
        </Card>

        {/* HOC Pattern Example */}
        <Card sx={{ mb: 4 }}>
          <CardHeader title="Higher-Order Component (HOC) Pattern" />
          <CardContent>
            <Typography paragraph>
              HOCs are functions that take a component and return a new
              component with additional props or behavior.
            </Typography>

            <Paper
              elevation={0}
              sx={{ p: 2, bgcolor: "background.default", mb: 3 }}
            >
              <pre style={{ margin: 0, overflow: "auto" }}>
                {`// HOC with TypeScript generics
function withLoader<P extends object>(
  Component: React.ComponentType<P>
): React.FC<P & WithLoaderProps> {
  return ({ loading = false, ...props }) => {
    if (loading) {
      return <div>Loading...</div>;
    }
    
    return <Component {...(props as P)} />;
  };
}

// Usage
const LoadableComponent = withLoader(MyComponent);
<LoadableComponent loading={isLoading} otherProps={...} />`}
              </pre>
            </Paper>

            <Box
              sx={{ border: 1, borderColor: "divider", borderRadius: 1, p: 2 }}
            >
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                HOC Demo
              </Typography>
              <Button
                variant="outlined"
                sx={{ mb: 2 }}
                onClick={() => setLoading(!loading)}
              >
                Toggle Loading State
              </Button>

              <LoadableDataDisplay
                loading={loading}
                data={["Item 1", "Item 2", "Item 3"]}
              />
            </Box>
          </CardContent>
        </Card>

        {/* Custom Hook Pattern Example */}
        <Card sx={{ mb: 4 }}>
          <CardHeader title="Custom Hook Pattern" />
          <CardContent>
            <Typography paragraph>
              Custom Hooks let you extract component logic into reusable
              functions, following the composition pattern.
            </Typography>

            <Paper
              elevation={0}
              sx={{ p: 2, bgcolor: "background.default", mb: 3 }}
            >
              <pre style={{ margin: 0, overflow: "auto" }}>
                {`// Custom hook with TypeScript
function useCounter(initialValue: number = 0) {
  const [count, setCount] = React.useState(initialValue);
  
  const increment = useCallback(() => 
    setCount(prev => prev + 1), []);
  const decrement = useCallback(() => 
    setCount(prev => prev - 1), []);
  const reset = useCallback(() => 
    setCount(initialValue), [initialValue]);
  
  return { count, increment, decrement, reset };
}

// Usage
const { count, increment, decrement, reset } = useCounter(5);`}
              </pre>
            </Paper>

            <Box
              sx={{ border: 1, borderColor: "divider", borderRadius: 1, p: 2 }}
            >
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                Custom Hook Demo
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography variant="h4" sx={{ mb: 2 }}>
                  {count}
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={decrement}
                  >
                    Decrement
                  </Button>
                  <Button variant="outlined" onClick={reset}>
                    Reset
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={increment}
                  >
                    Increment
                  </Button>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default ComponentPatternsSection;
