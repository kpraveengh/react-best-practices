# GitHub Copilot Instructions for React TypeScript Best Practices

## Project Context
This is a React TypeScript project dedicated to showcasing best practices for modern React development. The project demonstrates:
- Modern React features (18+)
- TypeScript integration with React
- Performance optimization techniques
- Component design patterns

## Code Style Preferences
- Use functional components with React hooks
- Use TypeScript interfaces for prop types
- Prefer explicit return types on functions
- Use proper type annotations for event handlers
- Follow the principles of immutability

## Component Structure
- Components should be small and focused on a single responsibility
- Separate business logic from presentation using custom hooks
- Use proper memoization techniques for performance
- Implement error boundaries around critical components

## React Hooks Guidelines
- Follow the Rules of Hooks (don't use hooks conditionally)
- Provide proper dependency arrays for useEffect, useMemo, and useCallback
- Create custom hooks for reusable logic
- Use typed state with useState and useReducer

## TypeScript Best Practices
- Use interfaces for props and state
- Prefer union types over enum when appropriate
- Use type guards for runtime type checking
- Avoid using 'any' type
- Use TypeScript utility types when appropriate (Partial, Pick, Omit, etc.)

## Performance Considerations
- Use React.memo for pure components
- Use useCallback for event handlers passed as props
- Use useMemo for expensive calculations
- Implement proper cleanup in useEffect to prevent memory leaks