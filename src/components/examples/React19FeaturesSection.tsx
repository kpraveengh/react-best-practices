import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Switch from "@mui/material/Switch";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import React, {
  ReactNode,
  Suspense,
  useEffect,
  useOptimistic,
  useRef,
  useState,
} from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useTheme } from "../../context/ThemeContext";
import { useViewMode } from "../../context/ViewModeContext";

/**
 * Error Fallback Component for Error Boundaries
 */
const ErrorFallback: React.FC<{
  error: Error;
  resetErrorBoundary?: () => void;
}> = ({ error, resetErrorBoundary }) => {
  return (
    <Alert severity="error" variant="filled" sx={{ mb: 3, borderRadius: 2 }}>
      <AlertTitle>Error</AlertTitle>
      <Typography variant="body2" sx={{ mb: 1 }}>
        Something went wrong:
      </Typography>
      <Paper
        elevation={0}
        sx={{
          p: 1,
          backgroundColor: "rgba(255, 255, 255, 0.15)",
          overflowX: "auto",
        }}
      >
        <pre style={{ margin: 0, color: "white" }}>{error.message}</pre>
      </Paper>
      {resetErrorBoundary && (
        <Button
          variant="outlined"
          color="inherit"
          onClick={resetErrorBoundary}
          sx={{ mt: 2 }}
        >
          Try Again
        </Button>
      )}
    </Alert>
  );
};

/**
 * Section 1: useOptimistic - Enhanced Examples
 * Shows more complex use cases of optimistic updates
 */
const UseOptimisticAdvancedExample: React.FC = () => {
  const theme = useMuiTheme();

  interface TodoItem {
    id: number;
    text: string;
    completed: boolean;
    loading?: boolean;
  }

  // State for todos list
  const [todos, setTodos] = useState<TodoItem[]>([
    { id: 1, text: "Learn useOptimistic hook", completed: false },
    { id: 2, text: "Build a React 19 demo", completed: false },
    { id: 3, text: "Share knowledge with team", completed: true },
  ]);

  // Setup optimistic state for todos
  const [optimisticTodos, addOptimisticTodo] = useOptimistic<
    TodoItem[],
    { action: string; todo: TodoItem }
  >(todos, (state, { action, todo }) => {
    if (action === "toggle") {
      return state.map((item) =>
        item.id === todo.id
          ? { ...item, completed: todo.completed, loading: true }
          : item
      );
    } else if (action === "delete") {
      return state.filter((item) => item.id !== todo.id);
    } else if (action === "add") {
      return [...state, todo];
    } else if (action === "edit") {
      return state.map((item) =>
        item.id === todo.id ? { ...item, text: todo.text, loading: true } : item
      );
    }
    return state;
  });

  // Mock API calls
  const toggleTodo = async (id: number): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = async (id: number): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const addTodo = async (text: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const newTodo = {
      id: Date.now(),
      text: text,
      completed: false,
    };
    setTodos([...todos, newTodo]);
  };

  const editTodo = async (id: number, newText: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setTodos(
      todos.map((todo) => (todo.id === id ? { ...todo, text: newText } : todo))
    );
  };

  // UI State
  const [newTodoText, setNewTodoText] = useState("");
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  // Handle form submissions
  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoText.trim()) return;

    const optimisticTodo = {
      id: Date.now(),
      text: newTodoText,
      completed: false,
      loading: true,
    };

    addOptimisticTodo({ action: "add", todo: optimisticTodo });
    setNewTodoText("");

    try {
      await addTodo(newTodoText);
    } catch (error) {
      console.error("Failed to add todo:", error);
      // In a real app, you would provide error handling and rollback
    }
  };

  const handleToggleTodo = async (todo: TodoItem) => {
    const optimisticTodoUpdate = {
      ...todo,
      completed: !todo.completed,
    };

    addOptimisticTodo({ action: "toggle", todo: optimisticTodoUpdate });

    try {
      await toggleTodo(todo.id);
    } catch (error) {
      console.error("Failed to toggle todo:", error);
    }
  };

  const handleDeleteTodo = async (todo: TodoItem) => {
    addOptimisticTodo({ action: "delete", todo });

    try {
      await deleteTodo(todo.id);
    } catch (error) {
      console.error("Failed to delete todo:", error);
    }
  };

  const handleStartEditing = (todo: TodoItem) => {
    setEditingTodoId(todo.id);
    setEditText(todo.text);
  };

  const handleSaveEdit = async (todo: TodoItem) => {
    if (!editText.trim() || editText === todo.text) {
      setEditingTodoId(null);
      return;
    }

    const optimisticTodoUpdate = {
      ...todo,
      text: editText,
    };

    addOptimisticTodo({ action: "edit", todo: optimisticTodoUpdate });
    setEditingTodoId(null);

    try {
      await editTodo(todo.id, editText);
    } catch (error) {
      console.error("Failed to edit todo:", error);
    }
  };

  return (
    <Card
      elevation={3}
      sx={{
        mb: 3,
        borderRadius: 2,
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: theme.shadows[6],
        },
      }}
    >
      <CardHeader
        title="Advanced useOptimistic Example"
        titleTypographyProps={{ variant: "h6" }}
      />
      <CardContent>
        <Alert severity="info" sx={{ mb: 3 }}>
          This example demonstrates multiple optimistic updates in a todo
          application, including adding, toggling, editing and deleting todos.
        </Alert>

        <Box
          component="form"
          onSubmit={handleAddTodo}
          sx={{ mb: 3, display: "flex", gap: 1 }}
        >
          <TextField
            fullWidth
            size="small"
            label="New Todo"
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            placeholder="What needs to be done?"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!newTodoText.trim()}
          >
            Add
          </Button>
        </Box>

        <List sx={{ width: "100%" }}>
          {optimisticTodos.map((todo) => (
            <ListItem
              key={todo.id}
              disablePadding
              sx={{
                mb: 1,
                p: 1,
                borderRadius: 1,
                bgcolor: theme.palette.action.hover,
                position: "relative",
                opacity: todo.loading ? 0.7 : 1,
              }}
              secondaryAction={
                editingTodoId === todo.id ? (
                  <IconButton edge="end" onClick={() => handleSaveEdit(todo)}>
                    <SaveIcon />
                  </IconButton>
                ) : (
                  <IconButton edge="end" onClick={() => handleDeleteTodo(todo)}>
                    <DeleteIcon />
                  </IconButton>
                )
              }
            >
              <ListItemIcon
                onClick={() => handleToggleTodo(todo)}
                sx={{ cursor: "pointer", minWidth: 40 }}
              >
                {todo.completed ? (
                  <CheckIcon color="success" />
                ) : (
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      border: `1px solid ${theme.palette.text.disabled}`,
                      borderRadius: "50%",
                    }}
                  />
                )}
              </ListItemIcon>

              {editingTodoId === todo.id ? (
                <TextField
                  fullWidth
                  size="small"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSaveEdit(todo);
                    } else if (e.key === "Escape") {
                      setEditingTodoId(null);
                    }
                  }}
                />
              ) : (
                <>
                  <ListItemText
                    primary={
                      <Typography
                        variant="body1"
                        sx={{
                          textDecoration: todo.completed
                            ? "line-through"
                            : "none",
                          color: todo.completed
                            ? theme.palette.text.secondary
                            : "inherit",
                        }}
                      >
                        {todo.text}
                      </Typography>
                    }
                  />
                  {!todo.loading && (
                    <IconButton
                      edge="end"
                      onClick={() => handleStartEditing(todo)}
                      sx={{ mr: 6 }}
                    >
                      <EditIcon />
                    </IconButton>
                  )}
                </>
              )}

              {todo.loading && (
                <CircularProgress
                  size={16}
                  sx={{
                    position: "absolute",
                    right: 48,
                    top: "50%",
                    marginTop: "-8px",
                  }}
                />
              )}
            </ListItem>
          ))}
        </List>

        <Paper
          elevation={0}
          sx={{
            p: 2,
            mt: 3,
            bgcolor:
              theme.palette.mode === "dark"
                ? "rgba(0, 0, 0, 0.2)"
                : "rgba(0, 0, 0, 0.05)",
            overflowX: "auto",
          }}
        >
          <pre style={{ margin: 0 }}>{`// Advanced useOptimistic implementation
const [optimisticTodos, addOptimisticTodo] = useOptimistic(
  todos,
  (state, { action, todo }) => {
    if (action === "toggle") {
      return state.map(item => 
        item.id === todo.id 
          ? { ...item, completed: todo.completed, loading: true } 
          : item
      );
    } else if (action === "delete") {
      return state.filter(item => item.id !== todo.id);
    } else if (action === "add") {
      return [...state, todo];
    } else if (action === "edit") {
      return state.map(item => 
        item.id === todo.id 
          ? { ...item, text: todo.text, loading: true } 
          : item
      );
    }
    return state;
  }
);

// Using the optimistic updates for editing
const handleSaveEdit = async (todo) => {
  const optimisticTodoUpdate = {
    ...todo,
    text: editText,
  };
  
  addOptimisticTodo({ action: "edit", todo: optimisticTodoUpdate });
  
  try {
    await editTodo(todo.id, editText); // Real API call
  } catch (error) {
    // Error handling would go here
  }
};`}</pre>
        </Paper>
      </CardContent>
    </Card>
  );
};

/**
 * Section 2: Advanced use Hook Examples
 * Demonstrates different use cases for the use hook
 */
const UseHookAdvancedExample: React.FC = () => {
  const theme = useMuiTheme();
  const [activeTab, setActiveTab] = useState(0);

  // Interface for weather data
  interface WeatherData {
    location: string;
    temperature: number;
    conditions: string;
    forecast: {
      day: string;
      high: number;
      low: number;
      conditions: string;
    }[];
  }

  // Interface for user data
  interface UserData {
    name: string;
    email: string;
    preferences: {
      darkMode: boolean;
      units: "imperial" | "metric";
    };
  }

  // Create a resource type that works with the use hook
  interface Resource<T> {
    read(): T;
  }

  // For React 19's use hook compatibility
  interface Usable<T> {
    [Symbol.iterator](): Generator<T, T, unknown>;
  }

  // Create a resource for the use hook
  const createResource = <T,>(promise: Promise<T>): Resource<T> & Usable<T> => {
    let status: "pending" | "fulfilled" | "rejected" = "pending";
    let result: T;
    let error: Error;

    const suspender = promise.then(
      (data) => {
        status = "fulfilled";
        result = data;
      },
      (e) => {
        status = "rejected";
        error = e;
      }
    );

    // Create an object that is both a Resource and Usable
    return {
      read(): T {
        if (status === "pending") {
          throw suspender;
        } else if (status === "rejected") {
          throw error;
        } else {
          return result;
        }
      },
      // Add Symbol.iterator method to make it compatible with use hook
      *[Symbol.iterator](): Generator<T, T, unknown> {
        if (status === "pending") {
          throw suspender;
        } else if (status === "rejected") {
          throw error;
        } else {
          yield result;
          return result;
        }
      },
    };
  };

  // Simulate an API for fetching weather data
  const fetchWeatherData = (): Promise<WeatherData> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          location: "New York, NY",
          temperature: 72,
          conditions: "Partly Cloudy",
          forecast: [
            { day: "Monday", high: 75, low: 61, conditions: "Sunny" },
            { day: "Tuesday", high: 81, low: 66, conditions: "Partly Cloudy" },
            {
              day: "Wednesday",
              high: 82,
              low: 68,
              conditions: "Mostly Cloudy",
            },
            { day: "Thursday", high: 77, low: 65, conditions: "Rainy" },
            { day: "Friday", high: 73, low: 60, conditions: "Partly Cloudy" },
          ],
        });
      }, 1500);
    });
  };

  // Another mock API for user data
  const fetchUserData = (): Promise<UserData> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          name: "Jane Smith",
          email: "jane@example.com",
          preferences: {
            darkMode: true,
            units: "imperial",
          },
        });
      }, 800);
    });
  };

  // Create resources
  const weatherResource = createResource(fetchWeatherData());
  const userResource = createResource(fetchUserData());

  // Components that use the resources
  const WeatherWidget = () => {
    // Call resource.read() outside of the use hook
    const weatherData = weatherResource.read();

    const handleRefresh = () => {
      window.location.reload(); // Simple reload for demo
    };

    return (
      <Box
        sx={{ p: 2, bgcolor: theme.palette.background.paper, borderRadius: 2 }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            {weatherData.location}
          </Typography>
          <Button size="small" onClick={handleRefresh}>
            Refresh
          </Button>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Typography variant="h3" fontWeight="bold" sx={{ mr: 2 }}>
            {weatherData.temperature}°F
          </Typography>
          <Typography variant="body1">{weatherData.conditions}</Typography>
        </Box>

        <Typography variant="subtitle2" gutterBottom>
          5-Day Forecast
        </Typography>
        <Box sx={{ display: "flex", gap: 1, overflowX: "auto", pb: 1 }}>
          {weatherData.forecast.map((day) => (
            <Paper
              key={day.day}
              elevation={1}
              sx={{ p: 1, minWidth: 100, textAlign: "center" }}
            >
              <Typography variant="body2" fontWeight="bold">
                {day.day}
              </Typography>
              <Typography variant="body2">
                {day.high}° / {day.low}°
              </Typography>
              <Typography variant="caption">{day.conditions}</Typography>
            </Paper>
          ))}
        </Box>
      </Box>
    );
  };

  const UserProfile = () => {
    // Call resource.read() outside of the use hook
    const userData = userResource.read();

    return (
      <Box
        sx={{ p: 2, bgcolor: theme.palette.background.paper, borderRadius: 2 }}
      >
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          User Profile
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="subtitle2">Name:</Typography>
            <Typography variant="body2">{userData.name}</Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="subtitle2">Email:</Typography>
            <Typography variant="body2">{userData.email}</Typography>
          </Box>

          <Divider sx={{ my: 1 }} />

          <Typography variant="subtitle2" gutterBottom>
            Preferences
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2">Dark Mode</Typography>
            <Switch checked={userData.preferences.darkMode} disabled />
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2">Units</Typography>
            <Chip
              label={
                userData.preferences.units === "imperial"
                  ? "Fahrenheit"
                  : "Celsius"
              }
              size="small"
            />
          </Box>
        </Box>
      </Box>
    );
  };

  // Example component that combines multiple async data sources
  const CombinedView = () => {
    // Properly accessing data through the read method first instead of directly with use
    const weather = weatherResource.read();
    const userData = userResource.read();

    return (
      <Box
        sx={{ p: 2, bgcolor: theme.palette.background.paper, borderRadius: 2 }}
      >
        <Typography variant="h6" gutterBottom>
          Hello, {userData.name}!
        </Typography>

        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2">
            This component demonstrates using multiple resources with the{" "}
            <code>use</code> hook. It seamlessly combines weather data and user
            preferences.
          </Typography>
        </Alert>

        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Typography variant="body1" sx={{ mr: 1 }}>
            Current weather in {weather.location}:
          </Typography>
          <Typography variant="body1" fontWeight="bold">
            {weather.temperature}°
            {userData.preferences.units === "imperial" ? "F" : "C"}
          </Typography>
        </Box>

        <Typography variant="body2">
          Based on your preferences, we're showing temperatures in{" "}
          {userData.preferences.units === "imperial" ? "Fahrenheit" : "Celsius"}
          .
        </Typography>
      </Box>
    );
  };

  return (
    <Card
      elevation={3}
      sx={{
        mb: 3,
        borderRadius: 2,
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: theme.shadows[6],
        },
      }}
    >
      <CardHeader
        title="Advanced 'use' Hook Examples"
        titleTypographyProps={{ variant: "h6" }}
      />
      <CardContent>
        <Typography variant="body2" sx={{ mb: 2 }}>
          The <code>use</code> hook provides a unified way to handle async
          values and resources. Unlike <code>useState</code> or{" "}
          <code>useEffect</code>, it integrates with Suspense for smoother
          handling of loading states.
        </Typography>

        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          sx={{ mb: 2 }}
        >
          <Tab label="Weather Widget" />
          <Tab label="User Profile" />
          <Tab label="Combined View" />
        </Tabs>

        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          resetKeys={[activeTab]}
        >
          <Box sx={{ minHeight: 300 }}>
            <Suspense
              fallback={
                <Box sx={{ p: 4, textAlign: "center" }}>
                  <CircularProgress size={30} sx={{ mb: 2 }} />
                  <Typography variant="body2">Loading data...</Typography>
                </Box>
              }
            >
              {activeTab === 0 && <WeatherWidget />}
              {activeTab === 1 && <UserProfile />}
              {activeTab === 2 && <CombinedView />}
            </Suspense>
          </Box>
        </ErrorBoundary>

        <Paper
          elevation={0}
          sx={{
            p: 2,
            mt: 3,
            bgcolor:
              theme.palette.mode === "dark"
                ? "rgba(0, 0, 0, 0.2)"
                : "rgba(0, 0, 0, 0.05)",
            overflowX: "auto",
          }}
        >
          <pre style={{ margin: 0 }}>{`// Advanced use hook pattern
// Create a resource that can be consumed by the use hook
const createResource = <T,>(promise: Promise<T>) => {
  let status: "pending" | "fulfilled" | "rejected" = "pending";
  let result: T;
  let error: Error;

  const suspender = promise.then(
    (data) => {
      status = "fulfilled";
      result = data;
    },
    (e) => {
      status = "rejected";
      error = e;
    }
  );

  return {
    read() {
      if (status === "pending") {
        throw suspender;
      } else if (status === "rejected") {
        throw error;
      } else {
        return result;
      }
    },
  };
};

// Create and use resources
const weatherResource = createResource(fetchWeatherData());
const userResource = createResource(fetchUserData());

// Component that uses multiple resources
function CombinedView() {
  const weather = use(weatherResource);
  const userData = use(userResource);
  
  return (
    <div>
      <h2>Hello, {userData.name}!</h2>
      <p>Weather in {weather.location}: {weather.temperature}°</p>
    </div>
  );
}`}</pre>
        </Paper>
      </CardContent>
    </Card>
  );
};

/**
 * Section 3: Document Metadata Example
 * Demonstrates the React 19 Document Metadata API
 */
const DocumentMetadataExample: React.FC = () => {
  const theme = useMuiTheme();
  const [activeSection, setActiveSection] = useState("home");

  // Mock metadata component (simulating React 19's API as it's not yet fully implemented)
  interface MetadataProps {
    title?: string;
    description?: string;
    colorScheme?: string;
    themeColor?: string;
    children?: ReactNode;
    keywords?: string[];
  }

  const DocumentMetadata: React.FC<MetadataProps> = ({
    title,
    description,
    colorScheme,
    themeColor,
    keywords,
    children,
  }) => {
    // In a real application with React 19, this would actually set document metadata
    // For now, we'll just display what would be set
    useEffect(() => {
      console.log("Document metadata would be set:", {
        title,
        description,
        colorScheme,
        themeColor,
        keywords,
      });

      // Simulate setting the page title as a demo
      if (title) {
        const originalTitle = document.title;
        document.title = title;
        return () => {
          document.title = originalTitle;
        };
      }
    }, [title, description, colorScheme, themeColor, keywords]);

    return <>{children}</>;
  };

  // Mock page components
  const HomePage = () => (
    <DocumentMetadata
      title="Home | React 19 Demo"
      description="Welcome to our React 19 features demonstration"
      colorScheme="light dark"
      themeColor="#3498db"
      keywords={["React", "React19", "Home"]}
    >
      <Box
        sx={{ p: 2, bgcolor: theme.palette.background.paper, borderRadius: 2 }}
      >
        <Typography variant="h6" gutterBottom>
          Home Page
        </Typography>
        <Typography variant="body2">
          This is the home page of our React 19 Document Metadata demo. In a
          real application, the metadata would be applied to the document.
        </Typography>
      </Box>
    </DocumentMetadata>
  );

  const ProductsPage = () => (
    <DocumentMetadata
      title="Products | React 19 Demo"
      description="Browse our products catalog"
      colorScheme="light dark"
      themeColor="#e74c3c"
      keywords={["React", "React19", "Products", "Catalog"]}
    >
      <Box
        sx={{ p: 2, bgcolor: theme.palette.background.paper, borderRadius: 2 }}
      >
        <Typography variant="h6" gutterBottom>
          Products Page
        </Typography>
        <Typography variant="body2">
          This is the products page. Notice how the document title changes as
          you navigate.
        </Typography>
        <List>
          {["Product A", "Product B", "Product C"].map((product) => (
            <ListItem key={product}>
              <ListItemText primary={product} />
            </ListItem>
          ))}
        </List>
      </Box>
    </DocumentMetadata>
  );

  const AboutPage = () => (
    <DocumentMetadata
      title="About Us | React 19 Demo"
      description="Learn more about our company"
      colorScheme="light dark"
      themeColor="#2ecc71"
      keywords={["React", "React19", "About", "Company"]}
    >
      <Box
        sx={{ p: 2, bgcolor: theme.palette.background.paper, borderRadius: 2 }}
      >
        <Typography variant="h6" gutterBottom>
          About Page
        </Typography>
        <Typography variant="body2" paragraph>
          This is the about page of our React 19 Document Metadata demo.
        </Typography>
        <Typography variant="body2">
          React 19 introduces a declarative way to manage document metadata,
          making it easier to handle SEO and accessibility concerns.
        </Typography>
      </Box>
    </DocumentMetadata>
  );

  return (
    <Card
      elevation={3}
      sx={{
        mb: 3,
        borderRadius: 2,
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: theme.shadows[6],
        },
      }}
    >
      <CardHeader
        title="Document Metadata API Example"
        titleTypographyProps={{ variant: "h6" }}
      />
      <CardContent>
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            React 19 introduces a new Document Metadata API that allows you to
            declaratively manage document metadata like title, description, and
            themes. This example simulates how it works.
          </Typography>
        </Alert>

        <Paper elevation={1} sx={{ mb: 3 }}>
          <Tabs
            value={activeSection}
            onChange={(_, newValue) => setActiveSection(newValue)}
            variant="fullWidth"
          >
            <Tab label="Home" value="home" />
            <Tab label="Products" value="products" />
            <Tab label="About" value="about" />
          </Tabs>
        </Paper>

        {activeSection === "home" && <HomePage />}
        {activeSection === "products" && <ProductsPage />}
        {activeSection === "about" && <AboutPage />}

        <Paper
          elevation={0}
          sx={{
            p: 2,
            mt: 3,
            bgcolor:
              theme.palette.mode === "dark"
                ? "rgba(0, 0, 0, 0.2)"
                : "rgba(0, 0, 0, 0.05)",
            overflowX: "auto",
          }}
        >
          <pre style={{ margin: 0 }}>{`// React 19 Document Metadata API Example
import { DocumentMetadata } from 'react';

function ProductPage({ product }) {
  return (
    <DocumentMetadata
      title={\`\${product.name} | My Store\`}
      description={product.description}
      themeColor="#3498db"
      colorScheme="light dark"
      keywords={[product.category, product.name, "shop"]}
    >
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <button>Add to Cart</button>
    </DocumentMetadata>
  );
}

// Nested metadata components also work
function App() {
  return (
    <DocumentMetadata title="My Store" themeColor="#3498db">
      {/* App content */}
      <Routes>
        <Route path="/products/:id" element={<ProductPage />} />
        {/* Other routes */}
      </Routes>
    </DocumentMetadata>
  );
}`}</pre>
        </Paper>
      </CardContent>
    </Card>
  );
};

/**
 * Section 4: Actions (Server-side Form Handling)
 * Demonstrates how React 19 Actions work with a simulation
 */
const ActionsExample: React.FC = () => {
  const theme = useMuiTheme();

  // In a real React 19 app, these would be server actions
  // Here we're simulating them
  interface User {
    id: number;
    name: string;
    email: string;
  }

  interface FormState {
    message: string;
    status: "idle" | "success" | "error";
    errors?: Record<string, string>;
  }

  // Simulate the createUser server action
  const createUser = async (formData: FormData): Promise<FormState> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;

    // Validation
    const errors: Record<string, string> = {};

    if (!name || name.length < 3) {
      errors.name = "Name must be at least 3 characters";
    }

    if (!email || !email.includes("@")) {
      errors.email = "Please enter a valid email address";
    }

    if (Object.keys(errors).length > 0) {
      return {
        status: "error",
        message: "Validation failed",
        errors,
      };
    }

    // Success case - in a real app this would create a user in the database
    console.log("User would be created:", { name, email });

    return {
      status: "success",
      message: "User created successfully!",
    };
  };

  // Local state for form submission
  const [submitting, setSubmitting] = useState(false);
  const [formState, setFormState] = useState<FormState>({
    status: "idle",
    message: "",
  });
  const formRef = useRef<HTMLFormElement>(null);

  // Simulating the form submission with actions
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const result = await createUser(formData);

    setFormState(result);
    setSubmitting(false);

    // Reset form on success
    if (result.status === "success" && formRef.current) {
      formRef.current.reset();
    }
  };

  return (
    <Card
      elevation={3}
      sx={{
        mb: 3,
        borderRadius: 2,
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: theme.shadows[6],
        },
      }}
    >
      <CardHeader
        title="React 19 Actions Example"
        titleTypographyProps={{ variant: "h6" }}
      />
      <CardContent>
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            React 19 introduces server Actions, which let you handle form
            submissions directly on the server. This example simulates how
            Actions work, including progressive enhancement and validation.
          </Typography>
        </Alert>

        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: theme.palette.background.paper,
            mb: 3,
          }}
        >
          <Typography variant="subtitle1" gutterBottom fontWeight="bold">
            User Registration Form
          </Typography>

          {formState.status === "success" && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {formState.message}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit}
            ref={formRef}
            noValidate
          >
            <TextField
              fullWidth
              margin="normal"
              id="name"
              name="name"
              label="Name"
              variant="outlined"
              error={!!formState.errors?.name}
              helperText={formState.errors?.name}
              disabled={submitting}
            />

            <TextField
              fullWidth
              margin="normal"
              id="email"
              name="email"
              label="Email"
              type="email"
              variant="outlined"
              error={!!formState.errors?.email}
              helperText={formState.errors?.email}
              disabled={submitting}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              disabled={submitting}
              startIcon={
                submitting ? <CircularProgress size={20} /> : undefined
              }
            >
              {submitting ? "Submitting..." : "Register"}
            </Button>
          </Box>
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: 2,
            bgcolor:
              theme.palette.mode === "dark"
                ? "rgba(0, 0, 0, 0.2)"
                : "rgba(0, 0, 0, 0.05)",
            overflowX: "auto",
          }}
        >
          <pre style={{ margin: 0 }}>{`// React 19 Server Actions Example
"use server";

// This function runs on the server, never on the client
export async function createUser(formData) {
  // Access the form data from the client
  const name = formData.get("name");
  const email = formData.get("email");
  
  // Validate the data
  const errors = {};
  if (!name || name.length < 3) {
    errors.name = "Name must be at least 3 characters";
  }
  if (!email || !email.includes("@")) {
    errors.email = "Please enter a valid email";
  }
  
  // Return early if there are validation errors
  if (Object.keys(errors).length > 0) {
    return { status: "error", errors };
  }
  
  try {
    // Server-side database operations
    await db.users.create({ name, email });
    
    // Successful response
    return { status: "success" };
  } catch (error) {
    return { 
      status: "error", 
      message: "Failed to create user" 
    };
  }
}

// Client component using the server action
function RegistrationForm() {
  return (
    <form action={createUser}>
      <input name="name" placeholder="Name" />
      <input name="email" type="email" placeholder="Email" />
      <button type="submit">Register</button>
    </form>
  );
}`}</pre>
        </Paper>
      </CardContent>
    </Card>
  );
};

/**
 * Section 5: Enhanced Server Components
 * Demonstrates the concepts behind React 19's improved server components
 */
const EnhancedServerComponentsExample: React.FC = () => {
  const theme = useMuiTheme();

  return (
    <Card
      elevation={3}
      sx={{
        mb: 3,
        borderRadius: 2,
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: theme.shadows[6],
        },
      }}
    >
      <CardHeader
        title="Enhanced Server Components"
        titleTypographyProps={{ variant: "h6" }}
      />
      <CardContent>
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            React 19 enhances Server Components with improved data fetching,
            form handling, and better integration with client components. This
            example demonstrates the concepts.
          </Typography>
        </Alert>

        <Paper
          elevation={1}
          sx={{
            p: 3,
            borderRadius: 2,
            bgcolor: theme.palette.background.paper,
            mb: 3,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Server Components Architecture
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 1,
                bgcolor:
                  theme.palette.mode === "dark"
                    ? "rgba(25, 118, 210, 0.15)"
                    : "rgba(25, 118, 210, 0.05)",
                border: "1px solid",
                borderColor: theme.palette.primary.main,
              }}
            >
              <Typography
                variant="subtitle1"
                gutterBottom
                fontWeight="bold"
                color="primary"
              >
                Server Components Benefits
              </Typography>

              <Box component="ul" sx={{ pl: 2, mb: 0 }}>
                <Typography component="li" variant="body2">
                  Zero bundle size - They don't add to your JavaScript bundle
                </Typography>
                <Typography component="li" variant="body2">
                  Direct access to backend resources (databases, files, etc.)
                </Typography>
                <Typography component="li" variant="body2">
                  Automatic code splitting without extra configuration
                </Typography>
                <Typography component="li" variant="body2">
                  Improved loading performance and SEO
                </Typography>
                <Typography component="li" variant="body2">
                  Enhanced security - sensitive data and logic stay on the
                  server
                </Typography>
              </Box>
            </Paper>

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 2,
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 1,
                  bgcolor:
                    theme.palette.mode === "dark"
                      ? "rgba(76, 175, 80, 0.15)"
                      : "rgba(76, 175, 80, 0.05)",
                  border: "1px solid",
                  borderColor: "success.main",
                  flex: 1,
                }}
              >
                <Typography
                  variant="subtitle2"
                  fontWeight="bold"
                  color="success.main"
                  gutterBottom
                >
                  React 19 Server Components
                </Typography>
                <Typography variant="body2">
                  React 19 enhances Server Components with improved streaming,
                  better error handling, and more ergonomic APIs for data
                  fetching.
                </Typography>
              </Paper>

              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 1,
                  bgcolor:
                    theme.palette.mode === "dark"
                      ? "rgba(211, 47, 47, 0.15)"
                      : "rgba(211, 47, 47, 0.05)",
                  border: "1px solid",
                  borderColor: "error.main",
                  flex: 1,
                }}
              >
                <Typography
                  variant="subtitle2"
                  fontWeight="bold"
                  color="error.main"
                  gutterBottom
                >
                  Client Components
                </Typography>
                <Typography variant="body2">
                  Interactive components that run in the browser and use hooks
                  like useState or useEffect are marked as "use client" and run
                  on the client.
                </Typography>
              </Paper>
            </Box>
          </Box>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            p: 2,
            bgcolor:
              theme.palette.mode === "dark"
                ? "rgba(0, 0, 0, 0.2)"
                : "rgba(0, 0, 0, 0.05)",
            overflowX: "auto",
          }}
        >
          <pre style={{ margin: 0 }}>{`// React 19 Enhanced Server Components

// Server Component with data fetching
async function ProductPage({ id }) {
  // Direct database access with no client-side code
  const product = await db.products.findUnique({ where: { id } });
  const relatedProducts = await db.products.findMany({ 
    where: { categoryId: product.categoryId },
    take: 3
  });
  
  // Streaming support for improved UX
  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <ProductPrice product={product} />
      
      {/* Client component for interactive elements */}
      <Suspense fallback={<AddToCartSkeleton />}>
        <AddToCartButton productId={product.id} />
      </Suspense>
      
      {/* Streaming related products */}
      <Suspense fallback={<RelatedProductsSkeleton />}>
        <RelatedProducts products={relatedProducts} />
      </Suspense>
    </div>
  );
}

// Client Component for interactive elements
"use client";

function AddToCartButton({ productId }) {
  const [adding, setAdding] = useState(false);
  
  return (
    <button 
      onClick={async () => {
        setAdding(true);
        await addToCart(productId);
        setAdding(false);
      }}
      disabled={adding}
    >
      {adding ? "Adding..." : "Add to Cart"}
    </button>
  );
}

// The form can be processed directly on the server
async function addToCart(formData) {
  "use server";
  const productId = formData.get("productId");
  const quantity = Number(formData.get("quantity"));
  
  // Server-side validation and cart update
  await db.cart.upsert({
    where: { userId_productId: { userId: session.userId, productId } },
    update: { quantity: { increment: quantity } },
    create: { userId: session.userId, productId, quantity }
  });
  
  // Return a response that can update the UI
  return { success: true };
}`}</pre>
        </Paper>
      </CardContent>
    </Card>
  );
};

/**
 * Section 6: Asset Loading
 * Demonstrates the concepts of React 19's asset loading improvements
 */
const AssetLoadingExample: React.FC = () => {
  const theme = useMuiTheme();
  const [activeAsset, setActiveAsset] = useState<number | null>(null);

  // Mock assets data
  const assets = [
    {
      id: 1,
      type: "image",
      url: "https://images.unsplash.com/photo-1575936123452-b67c3203c357?w=500",
      preload: true,
    },
    {
      id: 2,
      type: "image",
      url: "https://images.unsplash.com/photo-1618077360395-f3068be8e001?w=500",
      preload: true,
    },
    {
      id: 3,
      type: "image",
      url: "https://images.unsplash.com/photo-1560651066-7c20b61f6b7e?w=500",
      preload: false,
    },
    {
      id: 4,
      type: "script",
      url: "https://example.com/widget.js",
      preload: true,
    },
    {
      id: 5,
      type: "style",
      url: "https://example.com/styles.css",
      preload: true,
    },
    {
      id: 6,
      type: "font",
      url: "https://fonts.example.com/opensans.woff2",
      preload: true,
    },
  ];

  // In a real React 19 app, this would be a built-in component
  // Here we're just demonstrating the concept
  interface PreloadProps {
    href: string;
    as: "image" | "script" | "style" | "font";
    type?: string;
    crossOrigin?: string;
    media?: string;
    disabled?: boolean;
  }

  const Preload: React.FC<PreloadProps> = ({
    href,
    as,
    type,
    crossOrigin,
    media,
    disabled = false,
  }) => {
    // In real React 19, this would actually preload the asset
    // Here we're just demonstrating the API
    useEffect(() => {
      if (disabled) return;

      console.log(`Preloading ${as}: ${href}`);

      // Actually create a preload link as a simulation
      const link = document.createElement("link");
      link.rel = "preload";
      link.href = href;
      link.as = as;
      if (type) link.type = type;
      if (crossOrigin) link.crossOrigin = crossOrigin;
      if (media) link.media = media;

      document.head.appendChild(link);

      return () => {
        document.head.removeChild(link);
      };
    }, [href, as, type, crossOrigin, media, disabled]);

    return null;
  };

  // Asset Card component
  const AssetCard: React.FC<{
    asset: (typeof assets)[0];
    active: boolean;
    onClick: () => void;
  }> = ({ asset, active, onClick }) => {
    return (
      <Paper
        elevation={active ? 3 : 1}
        sx={{
          p: 2,
          borderRadius: 2,
          cursor: "pointer",
          transition: "all 0.2s ease",
          border: active
            ? `2px solid ${theme.palette.primary.main}`
            : "2px solid transparent",
          bgcolor: active
            ? theme.palette.mode === "dark"
              ? "rgba(25, 118, 210, 0.1)"
              : "rgba(25, 118, 210, 0.05)"
            : "background.paper",
        }}
        onClick={onClick}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1,
          }}
        >
          <Typography variant="subtitle2" fontWeight="bold">
            {asset.type.charAt(0).toUpperCase() + asset.type.slice(1)} Asset
          </Typography>
          <Chip
            label={asset.preload ? "Preload" : "No Preload"}
            color={asset.preload ? "primary" : "default"}
            size="small"
          />
        </Box>

        <Typography variant="body2" noWrap sx={{ opacity: 0.7 }}>
          {asset.url}
        </Typography>

        {asset.preload && (
          <Typography
            variant="caption"
            sx={{ display: "block", mt: 1, color: "primary.main" }}
          >
            This asset is preloaded for optimal performance
          </Typography>
        )}
      </Paper>
    );
  };

  return (
    <Card
      elevation={3}
      sx={{
        mb: 3,
        borderRadius: 2,
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: theme.shadows[6],
        },
      }}
    >
      <CardHeader
        title="Asset Loading Improvements"
        titleTypographyProps={{ variant: "h6" }}
      />
      <CardContent>
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            React 19 introduces improved asset loading mechanisms to optimize
            web performance. This includes better preloading, resource priority
            control, and declarative asset loading.
          </Typography>
        </Alert>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom fontWeight="bold">
            Asset Loading Demonstration
          </Typography>

          <Typography variant="body2" paragraph>
            The following demonstration shows how React 19 would handle asset
            preloading and prioritization. (Note: This is a simulation as React
            19 is still in development)
          </Typography>

          <Grid container spacing={2}>
            {assets.map((asset) => (
              <React.Fragment key={asset.id}>
                {/* Simulating React 19's asset preloading */}
                {asset.preload && (
                  <Preload
                    href={asset.url}
                    as={asset.type as "image" | "script" | "style" | "font"}
                    crossOrigin="anonymous"
                  />
                )}

                <Grid item xs={12} sm={6} md={4}>
                  <AssetCard
                    asset={asset}
                    active={activeAsset === asset.id}
                    onClick={() => setActiveAsset(asset.id)}
                  />
                </Grid>
              </React.Fragment>
            ))}
          </Grid>
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: 2,
            bgcolor:
              theme.palette.mode === "dark"
                ? "rgba(0, 0, 0, 0.2)"
                : "rgba(0, 0, 0, 0.05)",
            overflowX: "auto",
          }}
        >
          <pre style={{ margin: 0 }}>{`// React 19 Asset Loading Example

// Declarative asset preloading in your components
function ProductPage({ product }) {
  return (
    <>
      {/* Preload critical assets */}
      <Preload href={product.imageUrl} as="image" />
      <Preload 
        href="/fonts/brand-font.woff2" 
        as="font" 
        type="font/woff2" 
        crossOrigin="anonymous" 
      />
      
      {/* Preload critical scripts with priority */}
      <Preload 
        href="/scripts/product-zoom.js" 
        as="script"
        priority="high" 
      />
      
      <div className="product-page">
        <h1>{product.name}</h1>
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          loading="eager" // Built-in priority for images
          priority="high"  // React 19 priority attribute
        />
        <p>{product.description}</p>
        
        {/* Lazy-loaded component that loads assets only when needed */}
        <Suspense fallback={<p>Loading reviews...</p>}>
          <ProductReviews productId={product.id} />
        </Suspense>
      </div>
    </>
  );
}

// Asset management with the use hook
function ProductGallery({ productId }) {
  // Use automatically handles loading states with Suspense
  const images = use(fetchProductImages(productId));
  
  // Prefetch high-resolution versions when gallery is shown
  useEffect(() => {
    images.forEach(image => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = image.highResUrl;
      link.as = 'image';
      document.head.appendChild(link);
      
      return () => document.head.removeChild(link);
    });
  }, [images]);
  
  return (
    <div className="gallery">
      {images.map(image => (
        <img 
          key={image.id}
          src={image.thumbnailUrl} 
          alt={image.alt}
          data-high-res={image.highResUrl} 
        />
      ))}
    </div>
  );
}`}</pre>
        </Paper>
      </CardContent>
    </Card>
  );
};

// Main section component
const React19FeaturesSection: React.FC = () => {
  const { theme } = useTheme();
  const { isFullView } = useViewMode();
  const muiTheme = useMuiTheme();

  const react19Features = [
    {
      text: "useOptimistic - Create optimistic UI updates before server confirmation",
      icon: "🚀",
      description:
        "This hook enables better user experiences by immediately updating the UI based on the expected result of an action, rather than waiting for a server response.",
    },
    {
      text: "use Hook - Handle promises and other resources with suspense integration",
      icon: "🔄",
      description:
        "A unified way to consume any asynchronous value, integrating with Suspense for handling loading states and simplifying data fetching.",
    },
    {
      text: "Actions - Server-side form handling with progressive enhancement",
      icon: "📝",
      description:
        "A new way to handle form submissions directly on the server, with built-in progressive enhancement and support for client-side validation.",
    },
    {
      text: "Document Metadata - Declarative way to manage document title and metadata",
      icon: "📑",
      description:
        "Define page metadata declaratively in your components, making it easier to manage SEO, theming, and other document-level attributes.",
    },
    {
      text: "Enhanced Server Components - More powerful server rendering capabilities",
      icon: "💪",
      description:
        "Improved integration between server and client components, with better data fetching, streaming, and state management.",
    },
    {
      text: "Asset Loading - Improved preloading and asset management",
      icon: "📦",
      description:
        "Declarative control over resource loading, prioritization, and optimization for better performance and user experience.",
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
            background: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-1.2.1&auto=format&fit=crop&w=1740&q=80')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: 2,
            p: 4,
            mb: 4,
            color: "white",
          }}
        >
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            React 19 Features
          </Typography>
          <Typography variant="h6">
            In-depth exploration of the latest React 19 features with practical
            examples
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
            React 19 Key Features Overview
          </Typography>

          <List>
            {react19Features.map((item, i) => (
              <Box key={i}>
                <ListItem alignItems="flex-start">
                  <Box
                    sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}
                  >
                    <Typography variant="h6" sx={{ mt: 0.5 }}>
                      {item.icon}
                    </Typography>
                    <Box>
                      <Typography component="div" fontWeight="bold">
                        {item.text.split(" - ")[0]}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.description}
                      </Typography>
                    </Box>
                  </Box>
                </ListItem>
                {i < react19Features.length - 1 && <Divider />}
              </Box>
            ))}
          </List>
        </Card>

        <UseOptimisticAdvancedExample />
        <UseHookAdvancedExample />
        <ActionsExample />
        <DocumentMetadataExample />
        <EnhancedServerComponentsExample />
        <AssetLoadingExample />
      </Box>
    </Box>
  );
};

export default React19FeaturesSection;
