import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import React, { useCallback, useEffect, useRef, useState } from "react";

// Import context
import { useTheme } from "../../context/ThemeContext";
import { useViewMode } from "../../context/ViewModeContext";

// Custom hook for window size
const useWindowSize = () => {
  // State to store window dimensions
  const [windowSize, setWindowSize] = useState<{
    width: number | undefined;
    height: number | undefined;
  }>({
    width: undefined,
    height: undefined,
  });

  // Handler to call on window resize
  const handleResize = useCallback(() => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  // Set up event listener
  useEffect(() => {
    // Add event listener
    window.addEventListener("resize", handleResize);

    // Call handler right away to update state with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  return windowSize;
};

// Custom hook for previous state
function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

// Custom hook for local storage
function useLocalStorage<T>(key: string, initialValue: T) {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;

      // Save state
      setStoredValue(valueToStore);

      // Save to local storage
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}

// Custom hook for debounce
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set debouncedValue to value (passed in) after the specified delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Return a cleanup function that will be called every time
    // useEffect is re-called. useEffect will be called again if
    // value changes (see the deps array below). This prevents
    // the debounce from happening if the value changes quickly.
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Custom hook for checking if component is mounted
function useIsMounted() {
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Return the current value directly, not a callback function that requires an argument
  return useCallback(() => isMounted.current, []);
}

// Example component to demonstrate useWindowSize
const WindowSizeExample: React.FC = () => {
  const windowSize = useWindowSize();
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
        title="useWindowSize Hook Example"
        titleTypographyProps={{ variant: "h6" }}
      />
      <CardContent>
        <Typography variant="body2" gutterBottom>
          This hook tracks the browser window dimensions:
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
          <Chip
            label={`Width: ${windowSize.width}px`}
            color="primary"
            sx={{ mr: 1 }}
          />
          <Chip label={`Height: ${windowSize.height}px`} color="secondary" />
        </Box>

        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="body2">
            Resize your browser window to see the values change in real-time!
          </Typography>
        </Alert>

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
          <pre style={{ margin: 0 }}>{`const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    
    window.addEventListener("resize", handleResize);
    handleResize();
    
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
};`}</pre>
        </Paper>
      </CardContent>
    </Card>
  );
};

// Example component to demonstrate useLocalStorage
const LocalStorageExample: React.FC = () => {
  const [name, setName] = useLocalStorage<string>("name", "");
  const [darkMode, setDarkMode] = useLocalStorage<boolean>("darkMode", false);
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
        title="useLocalStorage Hook Example"
        titleTypographyProps={{ variant: "h6" }}
      />
      <CardContent>
        <Typography variant="body2" gutterBottom>
          This hook persists state in localStorage, surviving page refreshes:
        </Typography>

        <Box sx={{ my: 2 }}>
          <TextField
            fullWidth
            label="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="normal"
            helperText="This value persists even if you refresh the page"
          />

          <FormControlLabel
            control={
              <Switch
                checked={darkMode}
                onChange={(e) => setDarkMode(e.target.checked)}
                color="primary"
              />
            }
            label="Dark Mode Preference"
            sx={{ mt: 2 }}
          />
        </Box>

        <Alert severity="success" sx={{ mt: 2 }}>
          <Typography variant="body2">
            Your preferences are saved in localStorage. Try refreshing the page!
          </Typography>
        </Alert>

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
          >{`function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue] as const;
}`}</pre>
        </Paper>
      </CardContent>
    </Card>
  );
};

// Example component to demonstrate useDebounce
const DebounceExample: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const debouncedValue = useDebounce<string>(inputValue, 500);
  const theme = useMuiTheme();

  const [searchResults, setSearchResults] = useState<string[]>([]);

  // Simulate API call whenever debounced value changes
  useEffect(() => {
    if (debouncedValue) {
      // Simulate API call
      const mockSearch = () => {
        return [
          `Result for "${debouncedValue}" - Item 1`,
          `Result for "${debouncedValue}" - Item 2`,
          `Result for "${debouncedValue}" - Item 3`,
        ];
      };

      setSearchResults(mockSearch());
    } else {
      setSearchResults([]);
    }
  }, [debouncedValue]);

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
        title="useDebounce Hook Example"
        titleTypographyProps={{ variant: "h6" }}
      />
      <CardContent>
        <Typography variant="body2" gutterBottom>
          This hook delays updates until typing stops for a specified time:
        </Typography>

        <Box sx={{ my: 2 }}>
          <TextField
            fullWidth
            label="Search (debounced)"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            margin="normal"
            helperText="API call only happens 500ms after you stop typing"
          />

          <Box sx={{ my: 2 }}>
            <Typography variant="body2" gutterBottom>
              Current value: {inputValue}
            </Typography>
            <Typography variant="body2" color="primary" gutterBottom>
              Debounced value: {debouncedValue}
            </Typography>
          </Box>

          {searchResults.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Search Results:
              </Typography>
              <List dense>
                {searchResults.map((result, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={result} />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </Box>

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
          >{`function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
}

// Usage in component
const [inputValue, setInputValue] = useState("");
const debouncedValue = useDebounce(inputValue, 500);

// Only call API when debouncedValue changes
useEffect(() => {
  if (debouncedValue) {
    searchApi(debouncedValue);
  }
}, [debouncedValue]);`}</pre>
        </Paper>
      </CardContent>
    </Card>
  );
};

// Example component to demonstrate usePrevious
const PreviousValueExample: React.FC = () => {
  const [count, setCount] = useState<number>(0);
  const previousCount = usePrevious<number>(count);
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
        title="usePrevious Hook Example"
        titleTypographyProps={{ variant: "h6" }}
      />
      <CardContent>
        <Typography variant="body2" gutterBottom>
          This hook keeps track of the previous value of a variable:
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            my: 3,
          }}
        >
          <Box sx={{ textAlign: "center", px: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Previous
            </Typography>
            <Chip
              label={previousCount !== undefined ? previousCount : "None"}
              color="secondary"
              sx={{ fontSize: "1.2rem", py: 2 }}
            />
          </Box>

          <Box sx={{ textAlign: "center", px: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Current
            </Typography>
            <Chip
              label={count}
              color="primary"
              sx={{ fontSize: "1.2rem", py: 2 }}
            />
          </Box>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, my: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setCount((c) => c + 1)}
          >
            Increment
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setCount((c) => Math.max(0, c - 1))}
          >
            Decrement
          </Button>
        </Box>

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
          >{`function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  
  useEffect(() => {
    ref.current = value;
  }, [value]);
  
  return ref.current;
}

// Usage in component
const [count, setCount] = useState(0);
const previousCount = usePrevious(count);

// Now you can compare current and previous values
if (previousCount !== undefined && count > previousCount) {
  console.log('Count increased!');
}`}</pre>
        </Paper>
      </CardContent>
    </Card>
  );
};

// Main section component
const CustomHooksSection: React.FC = () => {
  const { theme } = useTheme();
  const { isFullView } = useViewMode();
  const muiTheme = useMuiTheme();

  const customHooksBenefits = [
    {
      text: "Reusability - Extract logic patterns for use across components",
      icon: "♻️",
    },
    {
      text: "Separation of Concerns - Isolate business logic from presentation",
      icon: "🧩",
    },
    {
      text: "Composition - Build complex behavior from simple, focused hooks",
      icon: "🧪",
    },
    {
      text: "Encapsulation - Hide implementation details to simplify component code",
      icon: "📦",
    },
    {
      text: "Testability - Test business logic independently from component rendering",
      icon: "🧪",
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
            background: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1542831371-29b0f74f9713?ixlib=rb-1.2.1&auto=format&fit=crop&w=1740&q=80')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: 2,
            p: 4,
            mb: 4,
            color: "white",
          }}
        >
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Custom React Hooks
          </Typography>
          <Typography variant="h6">
            Learn how to create reusable, composable custom hooks that
            encapsulate complex logic
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
            Benefits of Custom Hooks
          </Typography>

          <List>
            {customHooksBenefits.map((item, i) => (
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
                {i < customHooksBenefits.length - 1 && <Divider />}
              </Box>
            ))}
          </List>
        </Card>

        <WindowSizeExample />
        <LocalStorageExample />
        <DebounceExample />
        <PreviousValueExample />

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
            Custom Hooks Best Practices
          </Typography>

          <List>
            <ListItem>
              <ListItemText
                primary={
                  <Typography variant="body1" fontWeight="bold">
                    1. Always prefix with "use"
                  </Typography>
                }
                secondary="Following this convention is required for the React linter to enforce rules of hooks."
              />
            </ListItem>
            <Divider />

            <ListItem>
              <ListItemText
                primary={
                  <Typography variant="body1" fontWeight="bold">
                    2. Focus on a single responsibility
                  </Typography>
                }
                secondary="Keep hooks simple and focused on one specific functionality."
              />
            </ListItem>
            <Divider />

            <ListItem>
              <ListItemText
                primary={
                  <Typography variant="body1" fontWeight="bold">
                    3. Compose complex hooks from simpler ones
                  </Typography>
                }
                secondary="Build advanced hooks by combining multiple simpler hooks instead of creating monolithic hooks."
              />
            </ListItem>
            <Divider />

            <ListItem>
              <ListItemText
                primary={
                  <Typography variant="body1" fontWeight="bold">
                    4. Handle cleanup properly
                  </Typography>
                }
                secondary="Always clean up side effects in useEffect return functions to prevent memory leaks."
              />
            </ListItem>
            <Divider />

            <ListItem>
              <ListItemText
                primary={
                  <Typography variant="body1" fontWeight="bold">
                    5. Use TypeScript for type safety
                  </Typography>
                }
                secondary="Add proper TypeScript types to make your hooks more robust and self-documenting."
              />
            </ListItem>
          </List>
        </Card>
      </Box>
    </Box>
  );
};

export default CustomHooksSection;
