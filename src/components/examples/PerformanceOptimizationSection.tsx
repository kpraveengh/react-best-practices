import { CheckCircle } from "@mui/icons-material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

/**
 * Performance Optimization Showcase Component
 * Demonstrates various performance optimization techniques
 */

// Define types for our data
interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  rating: number;
}

// Sample data generator
const generateProducts = (count: number): Product[] => {
  const categories = ["Electronics", "Clothing", "Home", "Books", "Sports"];

  return Array.from({ length: count }).map((_, index) => ({
    id: index + 1,
    name: `Product ${index + 1}`,
    category: categories[Math.floor(Math.random() * categories.length)],
    price: Math.floor(Math.random() * 10000) / 100,
    stock: Math.floor(Math.random() * 100),
    rating: Math.floor(Math.random() * 50) / 10,
  }));
};

// Non-memoized expensive calculation function
const calculateTotalValue = (products: Product[]): number => {
  console.log("Calculating total value (expensive operation)");
  // Simulate expensive calculation with artificial delay
  const startTime = Date.now();
  while (Date.now() - startTime < 10) {} // Small delay for demonstration

  return products.reduce(
    (sum, product) => sum + product.price * product.stock,
    0
  );
};

// Example 1: React.memo to prevent unnecessary re-renders
interface ProductItemProps {
  product: Product;
  onSelect: (id: number) => void;
}

// Non-memoized version (for comparison)
const ProductItemWithoutMemo: React.FC<ProductItemProps> = ({
  product,
  onSelect,
}) => {
  console.log(`Rendering ProductItem (non-memoized): ${product.name}`);

  return (
    <TableRow>
      <TableCell>{product.id}</TableCell>
      <TableCell>{product.name}</TableCell>
      <TableCell>{product.category}</TableCell>
      <TableCell>${product.price.toFixed(2)}</TableCell>
      <TableCell>{product.stock}</TableCell>
      <TableCell>{product.rating}/5</TableCell>
      <TableCell>
        <Button
          size="small"
          variant="contained"
          onClick={() => onSelect(product.id)}
        >
          View
        </Button>
      </TableCell>
    </TableRow>
  );
};

// Memoized version with React.memo
const ProductItem = memo<ProductItemProps>(
  ({ product, onSelect }) => {
    console.log(`Rendering ProductItem (memoized): ${product.name}`);

    return (
      <TableRow>
        <TableCell>{product.id}</TableCell>
        <TableCell>{product.name}</TableCell>
        <TableCell>{product.category}</TableCell>
        <TableCell>${product.price.toFixed(2)}</TableCell>
        <TableCell>{product.stock}</TableCell>
        <TableCell>{product.rating}/5</TableCell>
        <TableCell>
          <Button
            size="small"
            variant="contained"
            onClick={() => onSelect(product.id)}
          >
            View
          </Button>
        </TableCell>
      </TableRow>
    );
  },
  // Custom comparison function for memoization
  (prevProps, nextProps) => {
    // Only re-render if these properties change
    return (
      prevProps.product.id === nextProps.product.id &&
      prevProps.product.name === nextProps.product.name &&
      prevProps.product.price === nextProps.product.price &&
      prevProps.product.stock === nextProps.product.stock &&
      prevProps.product.rating === nextProps.product.rating
    );
  }
);

// Example of a React.memo component with useCallback for handlers
interface ProductTableProps {
  products: Product[];
  useMemoization: boolean;
}

const ProductTable = memo<ProductTableProps>(({ products, useMemoization }) => {
  console.log("Rendering ProductTable");

  // State for tracking selected product
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Non-memoized handler (will cause re-renders)
  const handleSelectNonMemoized = (id: number) => {
    console.log(`Selecting product (non-memoized): ${id}`);
    setSelectedId(id);
  };

  // Memoized handler with useCallback
  const handleSelectMemoized = useCallback((id: number) => {
    console.log(`Selecting product (memoized): ${id}`);
    setSelectedId(id);
  }, []);

  return (
    <TableContainer component={Paper}>
      <Typography
        variant="subtitle2"
        sx={{ p: 2, bgcolor: "primary.main", color: "white" }}
      >
        {useMemoization
          ? "Using memo and useCallback (check console for render logs)"
          : "Without memoization (check console for render logs)"}
      </Typography>

      <Table sx={{ minWidth: 650 }} size="small">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Stock</TableCell>
            <TableCell>Rating</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products
            .slice(0, 5)
            .map((product) =>
              useMemoization ? (
                <ProductItem
                  key={product.id}
                  product={product}
                  onSelect={handleSelectMemoized}
                />
              ) : (
                <ProductItemWithoutMemo
                  key={product.id}
                  product={product}
                  onSelect={handleSelectNonMemoized}
                />
              )
            )}
        </TableBody>
      </Table>

      {selectedId && (
        <Box sx={{ p: 2 }}>
          <Typography variant="body2">
            Selected Product ID: {selectedId}
          </Typography>
        </Box>
      )}
    </TableContainer>
  );
});

// Example for useMemo optimization
const UseMemoExample: React.FC<{ products: Product[] }> = ({ products }) => {
  const theme = useMuiTheme();
  const [filter, setFilter] = useState("");
  const [count, setCount] = useState(0);

  // Non-memoized filtering (will re-calculate on any state change)
  const filteredProductsWithoutMemo = products.filter((product) =>
    product.name.toLowerCase().includes(filter.toLowerCase())
  );

  // Total value calculation without memoization
  const totalValueWithoutMemo = calculateTotalValue(
    filteredProductsWithoutMemo
  );

  // Memoized filtering (only re-calculates when filter or products change)
  const filteredProductsWithMemo = useMemo(
    () =>
      products.filter((product) =>
        product.name.toLowerCase().includes(filter.toLowerCase())
      ),
    [products, filter]
  );

  // Memoized expensive calculation
  const totalValueWithMemo = useMemo(
    () => calculateTotalValue(filteredProductsWithMemo),
    [filteredProductsWithMemo]
  );

  return (
    <Card
      elevation={3}
      sx={{
        mb: 4,
        borderRadius: 2,
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: theme.shadows[6],
        },
      }}
    >
      <CardHeader
        title="useMemo for Expensive Calculations"
        titleTypographyProps={{ variant: "h6" }}
        sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}
      />
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box sx={{ mb: 3 }}>
              <TextField
                label="Filter Products"
                size="small"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              />

              <Button
                variant="outlined"
                onClick={() => setCount((c) => c + 1)}
                sx={{ mr: 1 }}
              >
                Trigger Re-render (Count: {count})
              </Button>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Filtered products: {filteredProductsWithMemo.length}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                bgcolor: "error.main",
                color: "white",
                borderRadius: 2,
                mb: 2,
              }}
            >
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                Without useMemo
              </Typography>
              <Typography variant="body2">
                This calculation runs on every render, even when unrelated state
                changes.
              </Typography>
              <Typography variant="h6" sx={{ mt: 2 }}>
                Total inventory value: ${totalValueWithoutMemo.toFixed(2)}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                bgcolor: "success.main",
                color: "white",
                borderRadius: 2,
                mb: 2,
              }}
            >
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                With useMemo
              </Typography>
              <Typography variant="body2">
                This calculation only runs when filtered products change.
              </Typography>
              <Typography variant="h6" sx={{ mt: 2 }}>
                Total inventory value: ${totalValueWithMemo.toFixed(2)}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                bgcolor:
                  theme.palette.mode === "dark"
                    ? "rgba(0,0,0,0.2)"
                    : "rgba(0,0,0,0.05)",
                borderRadius: 1,
                overflowX: "auto",
              }}
            >
              <pre style={{ margin: 0, fontSize: "0.875rem" }}>
                {`// Expensive calculation without memoization
const totalValueWithoutMemo = calculateTotalValue(filteredProducts);

// Same calculation with useMemo
const totalValueWithMemo = useMemo(
  () => calculateTotalValue(filteredProducts),
  [filteredProducts] // Only recalculate when filtered products change
);`}
              </pre>
            </Paper>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

// Example demonstrating useEffect cleanup to prevent memory leaks
const UseEffectCleanupExample: React.FC = () => {
  const theme = useMuiTheme();
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let intervalId: number;

    if (isRunning) {
      // Start interval timer
      intervalId = window.setInterval(() => {
        console.log("Timer tick");
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);

      console.log(`Started timer with interval ID: ${intervalId}`);
    }

    // Cleanup function to clear the interval when component unmounts or dependencies change
    return () => {
      if (intervalId) {
        console.log(`Cleaning up timer with interval ID: ${intervalId}`);
        clearInterval(intervalId);
      }
    };
  }, [isRunning]); // Only re-run effect when isRunning changes

  const handleToggleTimer = () => {
    setIsRunning((prev) => !prev);
  };

  const handleResetTimer = () => {
    setTimer(0);
  };

  return (
    <Card
      elevation={3}
      sx={{
        mb: 4,
        borderRadius: 2,
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: theme.shadows[6],
        },
      }}
    >
      <CardHeader
        title="useEffect Cleanup to Prevent Memory Leaks"
        titleTypographyProps={{ variant: "h6" }}
        sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}
      />
      <CardContent>
        <Box sx={{ mb: 3, textAlign: "center" }}>
          <Typography variant="h3" sx={{ mb: 2 }}>
            {timer}s
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Button
              variant="contained"
              color={isRunning ? "error" : "success"}
              onClick={handleToggleTimer}
              sx={{ mr: 2 }}
            >
              {isRunning ? "Stop" : "Start"}
            </Button>

            <Button
              variant="outlined"
              onClick={handleResetTimer}
              disabled={isRunning}
            >
              Reset
            </Button>
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontStyle: "italic" }}
          >
            Open the console to see cleanup in action
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
              Why Cleanup Matters:
            </Typography>

            <Typography variant="body2" paragraph>
              Without proper cleanup, timers, event listeners, and subscriptions
              can continue running even after a component unmounts, causing
              memory leaks and unexpected behavior.
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                mb: 3,
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 1,
                  bgcolor:
                    theme.palette.mode === "dark"
                      ? "rgba(255,0,0,0.1)"
                      : "rgba(255,0,0,0.05)",
                  border: "1px solid rgba(255,0,0,0.3)",
                }}
              >
                <Typography variant="subtitle2" color="error" gutterBottom>
                  Without Cleanup (BAD)
                </Typography>
                <pre
                  style={{
                    margin: 0,
                    fontSize: "0.875rem",
                    overflow: "auto",
                  }}
                >
                  {`useEffect(() => {
  // This interval will keep running even if the component unmounts!
  const intervalId = setInterval(() => {
    setTimer(timer => timer + 1);
  }, 1000);
}, []);`}
                </pre>
              </Paper>

              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 1,
                  bgcolor:
                    theme.palette.mode === "dark"
                      ? "rgba(0,255,0,0.1)"
                      : "rgba(0,255,0,0.05)",
                  border: "1px solid rgba(0,255,0,0.3)",
                }}
              >
                <Typography variant="subtitle2" color="success" gutterBottom>
                  With Cleanup (GOOD)
                </Typography>
                <pre
                  style={{
                    margin: 0,
                    fontSize: "0.875rem",
                    overflow: "auto",
                  }}
                >
                  {`useEffect(() => {
  const intervalId = setInterval(() => {
    setTimer(timer => timer + 1);
  }, 1000);
  
  // Cleanup function runs when component unmounts or dependencies change
  return () => {
    clearInterval(intervalId);
  };
}, []);`}
                </pre>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

// React.lazy and Suspense example
const LazyLoadingExample: React.FC = () => {
  const theme = useMuiTheme();
  const [isLoaded, setIsLoaded] = useState(false);

  // This would normally be a separate file, imported with React.lazy
  const HeavyComponent = () => {
    // Simulate a heavy component
    const [data, setData] = useState<string[]>([]);

    useEffect(() => {
      // Simulate fetching data
      setTimeout(() => {
        setData([
          "Large dataset item 1",
          "Large dataset item 2",
          "Large dataset item 3",
          "Large dataset item 4",
          "Large dataset item 5",
        ]);
      }, 1500);
    }, []);

    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Heavy Component Loaded
        </Typography>
        <Paper elevation={0} sx={{ p: 2, bgcolor: "background.default" }}>
          <Typography variant="body2" paragraph>
            This component simulates a heavy component that would normally be
            loaded with React.lazy for code splitting.
          </Typography>
          <Box component="ul" sx={{ pl: 2, mt: 1, mb: 0 }}>
            {data.length > 0 ? (
              data.map((item, index) => (
                <Typography component="li" key={index} variant="body2">
                  {item}
                </Typography>
              ))
            ) : (
              <CircularProgress size={24} />
            )}
          </Box>
        </Paper>
      </Box>
    );
  };

  return (
    <Card
      elevation={3}
      sx={{
        mb: 4,
        borderRadius: 2,
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: theme.shadows[6],
        },
      }}
    >
      <CardHeader
        title="Code Splitting with React.lazy and Suspense"
        titleTypographyProps={{ variant: "h6" }}
        sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}
      />
      <CardContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" paragraph>
            Code splitting allows you to split your code into smaller chunks
            that can be loaded on-demand, improving initial load time.
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 3,
            }}
          >
            <Button
              variant="contained"
              onClick={() => setIsLoaded(true)}
              disabled={isLoaded}
              sx={{ mr: 2 }}
            >
              Load Component
            </Button>

            <Button
              variant="outlined"
              onClick={() => setIsLoaded(false)}
              disabled={!isLoaded}
            >
              Unload Component
            </Button>
          </Box>

          <Paper
            elevation={2}
            sx={{
              p: 0,
              overflow: "hidden",
              borderRadius: 2,
              bgcolor: "background.paper",
            }}
          >
            {isLoaded ? (
              <React.Suspense
                fallback={
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      p: 4,
                    }}
                  >
                    <CircularProgress size={40} />
                    <Typography sx={{ ml: 2 }}>Loading component...</Typography>
                  </Box>
                }
              >
                <HeavyComponent />
              </React.Suspense>
            ) : (
              <Box
                sx={{
                  p: 4,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderStyle: "dashed",
                  borderWidth: 1,
                  borderColor: "divider",
                  borderRadius: 1,
                  m: 2,
                }}
              >
                <Typography color="text.secondary">
                  Component not loaded yet.
                </Typography>
              </Box>
            )}
          </Paper>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Implementation:
        </Typography>

        <Paper
          elevation={0}
          sx={{
            p: 2,
            bgcolor:
              theme.palette.mode === "dark"
                ? "rgba(0,0,0,0.2)"
                : "rgba(0,0,0,0.05)",
            borderRadius: 1,
            overflowX: "auto",
          }}
        >
          <pre style={{ margin: 0, fontSize: "0.875rem" }}>
            {`// In a real application, you would split your code like this:
import React, { Suspense } from 'react';

// Lazy load components for code splitting
const HeavyComponent = React.lazy(() => 
  import('./HeavyComponent')
);

// Then use with Suspense
function MyComponent() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {showComponent && <HeavyComponent />}
    </Suspense>
  );
}`}
          </pre>
        </Paper>
      </CardContent>
    </Card>
  );
};

// Virtual List example for handling large datasets
const VirtualizedListExample: React.FC<{ items: Product[] }> = ({ items }) => {
  const theme = useMuiTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleItems, setVisibleItems] = useState<Product[]>([]);
  const [startIndex, setStartIndex] = useState(0);

  // Constants for virtualization
  const itemHeight = 50; // height of each item in pixels
  const bufferSize = 5; // number of items to render above/below the visible area
  const visibleItemCount = 10; // maximum number of items visible at once

  // Handle scroll to update visible items
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;

    const scrollTop = containerRef.current.scrollTop;
    const newStartIndex = Math.max(
      0,
      Math.floor(scrollTop / itemHeight) - bufferSize
    );

    setStartIndex(newStartIndex);
  }, [itemHeight, bufferSize]);

  // Update visible items when scroll position or data changes
  useEffect(() => {
    if (!items.length) return;

    const endIndex = Math.min(
      startIndex + visibleItemCount + 2 * bufferSize,
      items.length
    );

    setVisibleItems(items.slice(startIndex, endIndex));
  }, [items, startIndex, visibleItemCount, bufferSize]);

  // Add scroll event listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("scroll", handleScroll);
    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return (
    <Card
      elevation={3}
      sx={{
        mb: 4,
        borderRadius: 2,
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: theme.shadows[6],
        },
      }}
    >
      <CardHeader
        title="Virtualized Lists for Performance"
        titleTypographyProps={{ variant: "h6" }}
        sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}
      />
      <CardContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" paragraph>
            When working with large lists, rendering only the visible items
            significantly improves performance.
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  bgcolor: "error.main",
                  color: "white",
                  borderRadius: 2,
                  mb: 2,
                }}
              >
                <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                  Without Virtualization
                </Typography>
                <Typography variant="body2">
                  Rendering all {items.length} items at once can cause
                  performance issues.
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  bgcolor: "success.main",
                  color: "white",
                  borderRadius: 2,
                  mb: 2,
                }}
              >
                <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                  With Virtualization
                </Typography>
                <Typography variant="body2">
                  Only rendering {visibleItemCount} items (plus buffer) out of{" "}
                  {items.length} total.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        <Paper
          elevation={1}
          sx={{
            height: "300px",
            overflow: "hidden",
            borderRadius: 2,
            mb: 3,
          }}
        >
          <Box
            ref={containerRef}
            sx={{
              height: "100%",
              overflow: "auto",
            }}
          >
            {/* Container with full scrollable height */}
            <Box
              sx={{
                height: `${items.length * itemHeight}px`,
                position: "relative",
              }}
            >
              {/* Only render visible items */}
              {visibleItems.map((item, index) => (
                <Box
                  key={item.id}
                  sx={{
                    position: "absolute",
                    top: `${(startIndex + index) * itemHeight}px`,
                    left: 0,
                    right: 0,
                    height: `${itemHeight}px`,
                    display: "flex",
                    alignItems: "center",
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    px: 2,
                    py: 1,
                    "&:hover": {
                      bgcolor: "action.hover",
                    },
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" fontWeight="bold">
                      {item.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      ${item.price.toFixed(2)} - Stock: {item.stock}
                    </Typography>
                  </Box>
                  <Chip
                    label={item.category}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </Box>
              ))}
            </Box>
          </Box>
        </Paper>

        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Simple Virtualization Implementation:
        </Typography>

        <Paper
          elevation={0}
          sx={{
            p: 2,
            bgcolor:
              theme.palette.mode === "dark"
                ? "rgba(0,0,0,0.2)"
                : "rgba(0,0,0,0.05)",
            borderRadius: 1,
            overflowX: "auto",
          }}
        >
          <pre style={{ margin: 0, fontSize: "0.875rem" }}>
            {`// Simplified virtualization logic
const VirtualList = ({ items, itemHeight }) => {
  const containerRef = useRef(null);
  const [visibleItems, setVisibleItems] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  
  // Handle scroll events to update visible items
  const handleScroll = useCallback(() => {
    const scrollTop = containerRef.current.scrollTop;
    const newStartIndex = Math.floor(scrollTop / itemHeight);
    setStartIndex(newStartIndex);
  }, [itemHeight]);
  
  // Update visible range when scroll position changes
  useEffect(() => {
    const endIndex = startIndex + visibleItemCount;
    setVisibleItems(items.slice(startIndex, endIndex));
  }, [items, startIndex]);
  
  return (
    <div ref={containerRef} onScroll={handleScroll} style={{height: '300px', overflow: 'auto'}}>
      <div style={{height: \`\${items.length * itemHeight}px\`, position: 'relative'}}>
        {visibleItems.map((item, index) => (
          <div 
            key={item.id}
            style={{
              position: 'absolute',
              top: \`\${(startIndex + index) * itemHeight}px\`,
              height: \`\${itemHeight}px\`
            }}
          >
            {/* Item content */}
          </div>
        ))}
      </div>
    </div>
  );
};`}
          </pre>
        </Paper>
      </CardContent>
    </Card>
  );
};

// Performance Best Practices Component
const PerformanceOptimizationSection: React.FC = () => {
  const theme = useMuiTheme();

  // Generate sample data for demos
  const products = useMemo(() => generateProducts(1000), []);

  // Toggle between memoized and non-memoized components
  const [useMemoization, setUseMemoization] = useState(true);

  const toggleMemoization = () => {
    setUseMemoization((prev) => !prev);
  };

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
            background: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1624555130581-1d9cca783bc0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1740&q=80')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: 2,
            p: 4,
            mb: 4,
            color: "white",
          }}
        >
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Performance Optimization
          </Typography>
          <Typography variant="h6">
            Essential techniques for building high-performance React
            applications
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
              boxShadow: theme.shadows[8],
            },
          }}
        >
          <Typography
            variant="h5"
            color="primary"
            fontWeight="bold"
            gutterBottom
          >
            React Performance Optimization Techniques
          </Typography>

          <Box sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              {[
                {
                  title: "Component Memoization",
                  description:
                    "Use React.memo to prevent unnecessary component re-renders when props haven't changed.",
                },
                {
                  title: "Callback Memoization",
                  description:
                    "Use useCallback to memoize event handlers and prevent new function references on every render.",
                },
                {
                  title: "Expensive Calculations",
                  description:
                    "Use useMemo to cache expensive calculations and avoid recalculating on every render.",
                },
                {
                  title: "Virtualization",
                  description:
                    "Render only visible items in long lists to improve rendering performance.",
                },
                {
                  title: "Code Splitting",
                  description:
                    "Use React.lazy and Suspense to split your code and load components on demand.",
                },
                {
                  title: "Proper useEffect Cleanup",
                  description:
                    "Always clean up subscriptions, timers, and event listeners to prevent memory leaks.",
                },
              ].map((item, index) => (
                <Grid item xs={12} md={6} lg={4} key={index}>
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 1,
                      }}
                    >
                      <CheckCircle
                        sx={{
                          color: "success.main",
                          mr: 1,
                          fontSize: 20,
                        }}
                      />
                      <Typography variant="subtitle1" fontWeight="bold">
                        {item.title}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {item.description}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Card>

        <Card
          elevation={3}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            React.memo & useCallback Demo
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Button
              variant="contained"
              onClick={toggleMemoization}
              color={useMemoization ? "success" : "error"}
              sx={{ mb: 2 }}
            >
              {useMemoization
                ? "Using Memoization (Click to Disable)"
                : "Without Memoization (Click to Enable)"}
            </Button>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Open the browser console to see rendering logs. Notice how
              memoized components only re-render when necessary.
            </Typography>
          </Box>

          <ProductTable products={products} useMemoization={useMemoization} />
        </Card>

        <UseMemoExample products={products} />
        <UseEffectCleanupExample />
        <LazyLoadingExample />
        <VirtualizedListExample items={products} />
      </Box>
    </Box>
  );
};

export default PerformanceOptimizationSection;
