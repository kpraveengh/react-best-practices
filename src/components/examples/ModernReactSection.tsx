import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import OutlinedInput from "@mui/material/OutlinedInput";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import React, {
  Suspense,
  use,
  useDeferredValue,
  useId,
  useOptimistic,
  useState,
  useTransition,
} from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useTheme } from "../../context/ThemeContext";
import { useViewMode } from "../../context/ViewModeContext";

// Example component to demonstrate useId hook
const FormExample: React.FC = () => {
  const emailId = useId();
  const passwordId = useId();
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
        title="useId Example"
        titleTypographyProps={{ variant: "h6" }}
      />
      <CardContent>
        <Typography variant="body2" gutterBottom>
          Using useId to generate stable, unique IDs:
        </Typography>
        <Box component="form" sx={{ mt: 2 }}>
          <FormControl fullWidth margin="normal">
            <InputLabel htmlFor={emailId}>Email</InputLabel>
            <OutlinedInput id={emailId} label="Email" type="email" />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel htmlFor={passwordId}>Password</InputLabel>
            <OutlinedInput id={passwordId} label="Password" type="password" />
          </FormControl>
        </Box>
        <Alert severity="info" sx={{ mt: 2 }}>
          <code>useId</code> generates unique IDs that are stable across server
          and client rendering.
        </Alert>
      </CardContent>
    </Card>
  );
};

// Example component to demonstrate useDeferredValue and useTransition
const SearchExample: React.FC = () => {
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();
  const deferredQuery = useDeferredValue(query);
  const theme = useMuiTheme();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Immediate update for the input
    setQuery(value);

    // Defer expensive state updates
    startTransition(() => {
      // In a real app, this might trigger expensive filtering or API calls
      console.log(`Processing search for: ${value}`);
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
        title="useTransition & useDeferredValue Example"
        titleTypographyProps={{ variant: "h6" }}
      />
      <CardContent>
        <TextField
          fullWidth
          label="Search"
          value={query}
          onChange={handleChange}
          placeholder="Search..."
          variant="outlined"
          margin="normal"
        />

        {isPending && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Updating results...
          </Typography>
        )}

        <Box sx={{ mt: 2 }}>
          <Typography variant="body2">Results for: {deferredQuery}</Typography>

          <Paper
            elevation={0}
            sx={{
              p: 2,
              mt: 2,
              backgroundColor:
                theme.palette.mode === "dark"
                  ? "rgba(0, 0, 0, 0.1)"
                  : "rgba(0, 0, 0, 0.05)",
              overflowX: "auto",
            }}
          >
            <pre
              style={{ margin: 0 }}
            >{`const [isPending, startTransition] = useTransition();
const deferredQuery = useDeferredValue(query);

// Immediate update
setQuery(value);

// Deferred update
startTransition(() => {
  // Expensive operation
});`}</pre>
          </Paper>
        </Box>
      </CardContent>
    </Card>
  );
};

// Error Fallback Component
const ErrorFallback: React.FC<{ error: Error }> = ({ error }) => {
  return (
    <Alert severity="error" variant="filled" sx={{ mb: 3, borderRadius: 2 }}>
      <AlertTitle>Error Boundary Example</AlertTitle>
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
      <Typography variant="body2" sx={{ mt: 1 }}>
        In real applications, you would log this error and provide recovery
        options.
      </Typography>
    </Alert>
  );
};

// Component that will intentionally throw an error
const BuggyComponent: React.FC = () => {
  const [shouldError, setShouldError] = useState(false);

  if (shouldError) {
    throw new Error("This is a demonstration error");
  }

  return (
    <Box sx={{ p: 2 }}>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setShouldError(true)}
      >
        Trigger Error
      </Button>
      <Typography variant="body2" sx={{ mt: 2 }}>
        Click the button to see the Error Boundary in action
      </Typography>
    </Box>
  );
};

// Example component demonstrating React 19's useOptimistic hook
const OptimisticUpdateExample: React.FC = () => {
  const theme = useMuiTheme();

  // Define comment type
  type Comment = { id: number; text: string; author: string };

  // State for comments list
  const [comments, setComments] = useState<Comment[]>([
    { id: 1, text: "Great article!", author: "Alice" },
    { id: 2, text: "Thanks for sharing!", author: "Bob" },
  ]);

  // State for new comment input
  const [newComment, setNewComment] = useState("");

  // useOptimistic hook for optimistic UI updates
  const [optimisticComments, addOptimisticComment] = useOptimistic<
    Comment[],
    Comment
  >(comments, (state, newComment) => [...state, newComment]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Create optimistic comment with temporary ID
    const optimisticComment = {
      id: Date.now(),
      text: newComment,
      author: "You (sending...)",
    };

    // Apply optimistic update
    addOptimisticComment(optimisticComment);

    // Clear input
    setNewComment("");

    try {
      // Simulate API call with delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Update with real data after successful "API call"
      const serverComment = {
        id: Date.now(),
        text: newComment,
        author: "You",
      };

      setComments((prev) => [...prev, serverComment]);
    } catch (error) {
      // In real app, handle the error appropriately
      console.error("Failed to post comment:", error);
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
        title="useOptimistic Example (React 19)"
        titleTypographyProps={{ variant: "h6" }}
      />
      <CardContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" gutterBottom>
            Comments:
          </Typography>
          <List>
            {optimisticComments.map((comment) => (
              <ListItem
                key={comment.id}
                sx={{
                  pl: 2,
                  my: 1,
                  borderLeft: `4px solid ${theme.palette.primary.main}`,
                  bgcolor: comment.author.includes("sending")
                    ? theme.palette.mode === "dark"
                      ? "rgba(255, 255, 255, 0.05)"
                      : "rgba(0, 0, 0, 0.03)"
                    : "transparent",
                }}
              >
                <ListItemText
                  primary={
                    <Box component="span">
                      <Typography component="span" fontWeight="bold">
                        {comment.author}:
                      </Typography>
                      <Typography component="span" sx={{ ml: 1 }}>
                        {comment.text}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>

        <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
          <TextField
            fullWidth
            label="Add a comment"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            variant="outlined"
            margin="normal"
            sx={{ mb: 2 }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!newComment}
          >
            Post Comment
          </Button>
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
          <pre style={{ margin: 0 }}>{`// React 19 useOptimistic hook
const [optimisticComments, addOptimisticComment] = useOptimistic(
  comments,
  (state, newComment) => [...state, newComment]
);

// Use in handler
const handleSubmit = async (e) => {
  // Create optimistic version
  const optimisticComment = { /*...*/ };
  
  // Apply optimistic update
  addOptimisticComment(optimisticComment);
  
  // Real API call happens after
  await postComment(newComment);
};`}</pre>
        </Paper>
      </CardContent>
    </Card>
  );
};

// Example of React 19's use hook with Resource pattern
const AsyncDataExample: React.FC = () => {
  const theme = useMuiTheme();

  // Define user data type
  type UserData = { name: string; email: string };

  // Resource pattern implementation that's compatible with the use hook
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

    // Return a special Promise-like object that React's use hook can work with
    return {
      then(onfulfilled: (value: T) => any, onrejected: (error: any) => any) {
        if (status === "pending") {
          throw suspender;
        } else if (status === "fulfilled") {
          return Promise.resolve(onfulfilled(result));
        } else {
          return Promise.reject(onrejected(error));
        }
      },
      // Additional method to make the resource readable directly
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

  // Simulate fetching user data
  const userResource = createResource(
    new Promise<UserData>((resolve) => {
      setTimeout(() => {
        resolve({ name: "Jane Smith", email: "jane@example.com" });
      }, 2000);
    })
  );

  // Component that uses the resource
  const UserProfile = () => {
    // The 'use' hook manages the Promise and Suspense integration
    const userData = use(userResource);

    return (
      <Box sx={{ p: 2, bgcolor: theme.palette.background.default }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          User Profile
        </Typography>
        <Typography variant="body2">Name: {userData.name}</Typography>
        <Typography variant="body2">Email: {userData.email}</Typography>
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
        title="use Hook Example (React 19)"
        titleTypographyProps={{ variant: "h6" }}
      />
      <CardContent>
        <Typography variant="body2" sx={{ mb: 2 }}>
          The 'use' hook works with Suspense to handle asynchronous values:
        </Typography>

        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Suspense
            fallback={
              <Box sx={{ p: 2, textAlign: "center" }}>
                <CircularProgress size={24} sx={{ mb: 1 }} />
                <Typography variant="body2">Loading user profile...</Typography>
              </Box>
            }
          >
            <UserProfile />
          </Suspense>
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
          <pre style={{ margin: 0 }}>{`// React 19's 'use' hook
function UserProfile() {
  // Works with Promises and integrates with Suspense
  const userData = use(userResource);
  
  return (
    <div>
      <h4>User Profile</h4>
      <p>Name: {userData.name}</p>
      <p>Email: {userData.email}</p>
    </div>
  );
}`}</pre>
        </Paper>
      </CardContent>
    </Card>
  );
};

// Main section component
const ModernReactSection: React.FC = () => {
  const { theme } = useTheme();
  const { isFullView } = useViewMode();
  const muiTheme = useMuiTheme();

  // Animation variants for list items
  const listItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.4,
      },
    }),
  };

  const react18Features = [
    {
      text: "Concurrent Rendering - enables React to prepare multiple versions of the UI at the same time",
      icon: "⚡",
    },
    {
      text: "Automatic Batching - groups state updates for better performance",
      icon: "🔄",
    },
    {
      text: "Transitions API - marks updates as non-urgent for better responsiveness",
      icon: "🔀",
    },
    {
      text: "Suspense for Data Fetching - lets components wait for data before rendering",
      icon: "⏳",
    },
    {
      text: "Server Components - moves rendering work to the server (React 18+)",
      icon: "🖥️",
    },
  ];

  const react19Features = [
    {
      text: "useOptimistic - Create optimistic UI updates before server confirmation",
      icon: "🚀",
    },
    {
      text: "use Hook - Handle promises and other resources with suspense integration",
      icon: "🔄",
    },
    {
      text: "Actions - Server-side form handling with progressive enhancement",
      icon: "📝",
    },
    {
      text: "Document Metadata - Declarative way to manage document title and metadata",
      icon: "📑",
    },
    {
      text: "Enhanced Server Components - More powerful server rendering capabilities",
      icon: "💪",
    },
    {
      text: "Asset Loading - Improved preloading and asset management",
      icon: "📦",
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
            background: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1740&q=80')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: 2,
            p: 4,
            mb: 4,
            color: "white",
          }}
        >
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Modern React Features (18+)
          </Typography>
          <Typography variant="h6">
            Explore the latest features in React that will transform how you
            build applications
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
            React 18 Key Features
          </Typography>

          <List>
            {react18Features.map((item, i) => (
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
                {i < react18Features.length - 1 && <Divider />}
              </Box>
            ))}
          </List>
        </Card>

        <FormExample />
        <SearchExample />

        <Card
          elevation={3}
          sx={{
            mb: 3,
            borderRadius: 2,
            transition: "all 0.3s ease",
            "&:hover": {
              boxShadow: muiTheme.shadows[6],
            },
          }}
        >
          <CardHeader
            title="Suspense and Error Boundaries"
            titleTypographyProps={{ variant: "h6" }}
          />
          <CardContent>
            <Typography variant="body2" paragraph>
              Modern React applications use Suspense for loading states and
              Error Boundaries for error handling:
            </Typography>

            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <Suspense
                fallback={
                  <Box sx={{ p: 2, textAlign: "center" }}>
                    <CircularProgress size={24} sx={{ mb: 1 }} />
                    <Typography variant="body2">
                      Loading component...
                    </Typography>
                  </Box>
                }
              >
                <BuggyComponent />
              </Suspense>
            </ErrorBoundary>

            <Paper
              elevation={0}
              sx={{
                p: 2,
                mt: 3,
                bgcolor:
                  muiTheme.palette.mode === "dark"
                    ? "rgba(0, 0, 0, 0.2)"
                    : "rgba(0, 0, 0, 0.05)",
                overflowX: "auto",
              }}
            >
              <pre style={{ margin: 0 }}>{`// Error Boundary usage
<ErrorBoundary FallbackComponent={ErrorFallback}>
  <Suspense fallback={<p>Loading...</p>}>
    <YourComponent />
  </Suspense>
</ErrorBoundary>`}</pre>
            </Paper>
          </CardContent>
        </Card>

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
            React 19 Features
          </Typography>

          <List>
            {react19Features.map((item, i) => (
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
                {i < react19Features.length - 1 && <Divider />}
              </Box>
            ))}
          </List>
        </Card>

        {/* React 19 Examples */}
        <OptimisticUpdateExample />
        <AsyncDataExample />
      </Box>
    </Box>
  );
};

export default ModernReactSection;
