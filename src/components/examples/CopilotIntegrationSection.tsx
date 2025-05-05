import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";
import { useTheme } from "../../context/ThemeContext";

// Step 1: Create a simple component that demonstrates how Copilot can help with component creation
const CopilotComponentExample: React.FC = () => {
  return (
    <div className="example-container dark:border-gray-700">
      <h3 className="text-lg font-semibold mb-2 dark:text-gray-200">
        Component Creation with Copilot
      </h3>
      <p className="mb-3 dark:text-gray-300">
        Copilot can help generate entire components based on comments or
        function signatures.
      </p>

      <div className="code-block dark:bg-gray-900">
        <pre>{`// Example: Ask Copilot to create a UserProfile component
// Create a UserProfile component that displays a user's name, 
// avatar, bio, and a button to edit the profile

import React from 'react';

interface UserProfileProps {
  name: string;
  avatarUrl: string;
  bio: string;
  onEdit: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ 
  name, 
  avatarUrl, 
  bio, 
  onEdit 
}) => {
  return (
    <div className="user-profile">
      <img 
        src={avatarUrl} 
        alt={name} 
        className="avatar" 
      />
      <h3>{name}</h3>
      <p>{bio}</p>
      <button onClick={onEdit}>
        Edit Profile
      </button>
    </div>
  );
};

export default UserProfile;`}</pre>
      </div>
    </div>
  );
};

// Step 2: Show how Copilot can help with complex hooks
const CopilotHooksExample: React.FC = () => {
  return (
    <div className="example-container dark:border-gray-700">
      <h3 className="text-lg font-semibold mb-2 dark:text-gray-200">
        Custom Hooks with Copilot
      </h3>
      <p className="mb-3 dark:text-gray-300">
        Copilot excels at generating custom hooks based on your requirements.
      </p>

      <div className="code-block dark:bg-gray-900">
        <pre>{`// Example: Ask Copilot to create a useLocalStorage hook
// Create a useLocalStorage hook that persists state to localStorage

import { useState, useEffect } from 'react';

function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage
  const setValue = (value: T) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
}`}</pre>
      </div>
    </div>
  );
};

// Step 3: Demo component that shows Copilot assisting with API integration
const CopilotApiExample: React.FC = () => {
  return (
    <div className="example-container dark:border-gray-700">
      <h3 className="text-lg font-semibold mb-2 dark:text-gray-200">
        API Integration with Copilot
      </h3>
      <p className="mb-3 dark:text-gray-300">
        Copilot can generate fetch functions, API hooks, and handle error
        states.
      </p>

      <div className="code-block dark:bg-gray-900">
        <pre>{`// Example: Ask Copilot to create a hook for fetching products
// Create a useFetchProducts hook that gets products from an API 
// with pagination, loading state, and error handling

import { useState, useEffect } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
}

interface UseFetchProductsResult {
  products: Product[];
  loading: boolean;
  error: Error | null;
  page: number;
  hasMore: boolean;
  loadMore: () => void;
}

function useFetchProducts(initialPage = 1): UseFetchProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState<number>(initialPage);
  const [hasMore, setHasMore] = useState<boolean>(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // In a real app, append page to URL as a query parameter
        const response = await fetch(\`/api/products?page=\${page}&limit=10\`);
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(prev => [...prev, ...data.products]);
        setHasMore(data.hasMore);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page]);

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  };

  return { products, loading, error, page, hasMore, loadMore };
}`}</pre>
      </div>
    </div>
  );
};

// Step 4: Show how Copilot can help with implementing UI features
const CopilotUIPatternExample: React.FC = () => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const { theme } = useTheme();

  return (
    <div className="example-container dark:border-gray-700">
      <h3 className="text-lg font-semibold mb-2 dark:text-gray-200">
        UI Pattern Implementation with Copilot
      </h3>
      <p className="mb-3 dark:text-gray-300">
        Copilot can help implement complex UI patterns like tooltips, modals,
        and more.
      </p>

      <div className="relative inline-block mt-4">
        <button
          onMouseEnter={() => setIsTooltipVisible(true)}
          onMouseLeave={() => setIsTooltipVisible(false)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
        >
          Hover for Tooltip
        </button>

        {isTooltipVisible && (
          <div
            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 
            bg-gray-800 text-white px-3 py-1 rounded text-sm whitespace-nowrap
            dark:bg-gray-900 dark:text-gray-200"
          >
            This tooltip was generated with Copilot!
          </div>
        )}
      </div>

      <div className="code-block mt-5 dark:bg-gray-900">
        <pre>{`// Example: Ask Copilot to create a Tooltip component
// Create a reusable Tooltip component that appears on hover

import React, { useState, ReactNode } from 'react';

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  position?: 'top' | 'right' | 'bottom' | 'left';
}

const Tooltip: React.FC<TooltipProps> = ({ 
  content, 
  children, 
  position = 'top' 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  
  // Calculate position styles based on the 'position' prop
  const getPositionStyles = () => {
    switch(position) {
      case 'right':
        return { left: '100%', top: '50%', transform: 'translateY(-50%)', marginLeft: '5px' };
      case 'bottom':
        return { top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: '5px' };
      case 'left':
        return { right: '100%', top: '50%', transform: 'translateY(-50%)', marginRight: '5px' };
      case 'top':
      default:
        return { bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: '5px' };
    }
  };
  
  return (
    <div 
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      
      {isVisible && (
        <div style={{
          position: 'absolute',
          backgroundColor: '#333',
          color: 'white',
          padding: '5px 10px',
          borderRadius: '4px',
          fontSize: '14px',
          zIndex: 1000,
          ...getPositionStyles()
        }}>
          {content}
        </div>
      )}
    </div>
  );
};

export default Tooltip;`}</pre>
      </div>
    </div>
  );
};

// Main section component
const CopilotIntegrationSection: React.FC = () => {
  const { theme } = useTheme();

  return (
    <section className="workshop-section overflow-y-auto">
      <Box
        className="section-content-wrapper"
        sx={{
          opacity: 1,
          transition: "opacity 0.5s",
        }}
      >
        <Paper
          className="section-header"
          sx={{
            backgroundImage: `url('https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-1.2.1&auto=format&fit=crop&w=1734&q=80')`,
            backgroundSize: "cover",
            backgroundColor: "rgba(0,0,0,0.6)",
            backgroundBlendMode: "overlay",
            borderRadius: "12px",
            padding: "40px 30px",
            marginBottom: "30px",
            color: "white",
          }}
        >
          <CardHeader
            title={
              <Typography
                variant="h2"
                className="text-3xl font-bold text-white text-shadow-lg mb-4"
                sx={{
                  opacity: 1,
                  transform: "translateY(0)",
                  transition: "opacity 0.5s, transform 0.5s",
                }}
              >
                GitHub Copilot Integration with React
              </Typography>
            }
            subheader={
              <Typography
                variant="body1"
                className="text-lg text-white text-shadow-md"
                sx={{
                  opacity: 1,
                  transform: "translateY(0)",
                  transition: "opacity 0.5s, transform 0.5s",
                }}
              >
                Leverage AI assistance to accelerate your React development
                workflow
              </Typography>
            }
          />
        </Paper>

        <Card className="workshop-section dark:bg-gray-800">
          <CardContent>
            <Typography
              variant="h3"
              className="text-xl font-bold mb-3 text-blue-600 dark:text-blue-400"
            >
              How GitHub Copilot Enhances React Development
            </Typography>
            <ul className="list-disc pl-5 space-y-2 dark:text-gray-300">
              <li>Accelerates component creation and styling</li>
              <li>Generates custom hooks and utility functions</li>
              <li>Implements complex UI patterns</li>
              <li>Creates TypeScript interfaces and types</li>
              <li>Writes unit and integration tests</li>
              <li>Reduces boilerplate code</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="workshop-section dark:bg-gray-800">
          <CardContent>
            <Typography
              variant="h3"
              className="text-xl font-bold mb-3 text-blue-600 dark:text-blue-400"
            >
              Best Practices for Using Copilot with React
            </Typography>
            <ol className="list-decimal pl-5 space-y-2 dark:text-gray-300">
              <li>
                <strong className="dark:text-gray-200">
                  Start with clear comments
                </strong>{" "}
                - Tell Copilot what you want to build
              </li>
              <li>
                <strong className="dark:text-gray-200">
                  Be specific about patterns
                </strong>{" "}
                - Mention specific React patterns like custom hooks
              </li>
              <li>
                <strong className="dark:text-gray-200">
                  Include type information
                </strong>{" "}
                - Mention interfaces and types you want used
              </li>
              <li>
                <strong className="dark:text-gray-200">
                  Iterate on suggestions
                </strong>{" "}
                - Refine Copilot's code by adding more context
              </li>
              <li>
                <strong className="dark:text-gray-200">
                  Let Copilot handle repetitive tasks
                </strong>{" "}
                - Like creating form validation functions
              </li>
            </ol>
          </CardContent>
        </Card>

        <CopilotComponentExample />

        <CopilotHooksExample />

        <CopilotApiExample />

        <CopilotUIPatternExample />

        <Card className="workshop-section dark:bg-gray-800">
          <CardContent>
            <Typography
              variant="h3"
              className="text-xl font-bold mb-3 text-blue-600 dark:text-blue-400"
            >
              Enhancing Copilot with Custom Instructions
            </Typography>
            <Typography className="mb-3 dark:text-gray-300">
              You can create a .github/copilot-instructions.md file in your
              project to provide context-specific instructions for Copilot:
            </Typography>

            <div className="code-block dark:bg-gray-900">
              <pre>{`# GitHub Copilot Instructions for This Project

## Project Context
This is a React TypeScript project following functional component patterns.

## Code Style Preferences
- Use functional components with React hooks
- Use TypeScript interfaces for prop types
- Use CSS modules for styling
- Follow the container/presentational component pattern
- Prefer explicit return types on functions

## Common Patterns
- Use custom hooks for shared logic
- Use context for global state
- Use react-query for data fetching
- Follow error boundary pattern for error handling`}</pre>
            </div>
          </CardContent>
        </Card>
      </Box>
    </section>
  );
};

export default CopilotIntegrationSection;
