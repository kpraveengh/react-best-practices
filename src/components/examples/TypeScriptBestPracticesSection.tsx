import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import FormHelperText from "@mui/material/FormHelperText";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import Slider from "@mui/material/Slider";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import React from "react";
import { useForm } from "../../hooks/useForm";

// Define a discriminated union type for notification settings
type NotificationType = "email" | "push" | "sms";

// Using TypeScript utility types - Partial, Record, Pick, etc.
interface UserPreferences {
  theme: "light" | "dark" | "system";
  fontSize: number;
  notifications: Partial<Record<NotificationType, boolean>>;
  emailFrequency: "daily" | "weekly" | "monthly" | "never";
  language: string;
  showAvatar: boolean;
}

// Using TypeScript utility type to create a subset of the type
type UserPreferencesForm = Pick<
  UserPreferences,
  | "theme"
  | "fontSize"
  | "notifications"
  | "emailFrequency"
  | "language"
  | "showAvatar"
>;

// Demonstrate using TypeScript with validation
interface ValidationResult {
  isValid: boolean;
  errors: Partial<Record<keyof UserPreferencesForm, string>>;
}

// Example component demonstrating TypeScript with forms
const TypeScriptFormExample: React.FC = () => {
  const theme = useMuiTheme();

  // Initial form values with proper typing
  const initialValues: UserPreferencesForm = {
    theme: "system",
    fontSize: 16,
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
    emailFrequency: "weekly",
    language: "en",
    showAvatar: true,
  };

  // Validation function with TypeScript
  const validateForm = (values: UserPreferencesForm) => {
    const errors: Partial<Record<keyof UserPreferencesForm, string>> = {};

    if (!values.theme) {
      errors.theme = "Theme is required";
    }

    if (values.fontSize < 8 || values.fontSize > 32) {
      errors.fontSize = "Font size must be between 8 and 32";
    }

    if (!values.emailFrequency) {
      errors.emailFrequency = "Email frequency is required";
    }

    return errors;
  };

  // Using our custom form hook with TypeScript
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    isSubmitting,
  } = useForm<UserPreferencesForm>(initialValues, validateForm);

  // Handle form submission
  const onSubmit = async (formValues: UserPreferencesForm) => {
    // Simulate API call
    console.log("Submitting form:", formValues);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Success message would be shown here in a real app
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
        title="Type-Safe Form Handling"
        titleTypographyProps={{ variant: "h6" }}
        sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}
      />
      <CardContent>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.theme && !!touched.theme}>
                <InputLabel id="theme-select-label">Theme</InputLabel>
                <Select
                  labelId="theme-select-label"
                  id="theme-select"
                  name="theme"
                  value={values.theme}
                  label="Theme"
                  onChange={handleChange}
                  onBlur={() => handleBlur("theme")}
                >
                  <MenuItem value="light">Light</MenuItem>
                  <MenuItem value="dark">Dark</MenuItem>
                  <MenuItem value="system">System Default</MenuItem>
                </Select>
                {errors.theme && touched.theme && (
                  <FormHelperText>{errors.theme}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl
                fullWidth
                error={!!errors.emailFrequency && !!touched.emailFrequency}
              >
                <InputLabel id="email-frequency-label">
                  Email Frequency
                </InputLabel>
                <Select
                  labelId="email-frequency-label"
                  id="email-frequency"
                  name="emailFrequency"
                  value={values.emailFrequency}
                  label="Email Frequency"
                  onChange={handleChange}
                  onBlur={() => handleBlur("emailFrequency")}
                >
                  <MenuItem value="daily">Daily</MenuItem>
                  <MenuItem value="weekly">Weekly</MenuItem>
                  <MenuItem value="monthly">Monthly</MenuItem>
                  <MenuItem value="never">Never</MenuItem>
                </Select>
                {errors.emailFrequency && touched.emailFrequency && (
                  <FormHelperText>{errors.emailFrequency}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Typography gutterBottom>
                Font Size: {values.fontSize}px
              </Typography>
              <Slider
                name="fontSize"
                value={values.fontSize}
                onChange={(_, newValue) =>
                  setFieldValue("fontSize", newValue as number)
                }
                onChangeCommitted={() => handleBlur("fontSize")}
                min={8}
                max={32}
                step={1}
                marks={[
                  { value: 8, label: "8px" },
                  { value: 16, label: "16px" },
                  { value: 24, label: "24px" },
                  { value: 32, label: "32px" },
                ]}
                sx={{ maxWidth: 500 }}
              />
              {errors.fontSize && touched.fontSize && (
                <FormHelperText error>{errors.fontSize}</FormHelperText>
              )}
            </Grid>

            <Grid item xs={12}>
              <Typography gutterBottom sx={{ mb: 2 }}>
                Notification Preferences
              </Typography>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={values.notifications.email}
                      onChange={(e) =>
                        setFieldValue("notifications", {
                          ...values.notifications,
                          email: e.target.checked,
                        })
                      }
                      name="notifications.email"
                    />
                  }
                  label="Email Notifications"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={values.notifications.push}
                      onChange={(e) =>
                        setFieldValue("notifications", {
                          ...values.notifications,
                          push: e.target.checked,
                        })
                      }
                      name="notifications.push"
                    />
                  }
                  label="Push Notifications"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={values.notifications.sms}
                      onChange={(e) =>
                        setFieldValue("notifications", {
                          ...values.notifications,
                          sms: e.target.checked,
                        })
                      }
                      name="notifications.sms"
                    />
                  }
                  label="SMS Notifications"
                />
              </FormGroup>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="language-select-label">Language</InputLabel>
                <Select
                  labelId="language-select-label"
                  id="language-select"
                  name="language"
                  value={values.language}
                  label="Language"
                  onChange={handleChange}
                >
                  <MenuItem value="en">English</MenuItem>
                  <MenuItem value="es">Spanish</MenuItem>
                  <MenuItem value="fr">French</MenuItem>
                  <MenuItem value="de">German</MenuItem>
                  <MenuItem value="ja">Japanese</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                sx={{ mt: 2 }}
              >
                {isSubmitting ? "Saving..." : "Save Preferences"}
              </Button>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          TypeScript Benefits Demonstrated:
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
            {`// Discriminated union types
type NotificationType = "email" | "push" | "sms";

// TypeScript utility types
interface UserPreferences {
  theme: "light" | "dark" | "system";
  fontSize: number;
  notifications: Partial<Record<NotificationType, boolean>>;
  emailFrequency: "daily" | "weekly" | "monthly" | "never";
  // ...other fields
}

// Using utility types for form validation
type UserPreferencesForm = Pick<
  UserPreferences,
  "theme" | "fontSize" | "notifications" | "emailFrequency"
>;

// Type-safe validation
const validateForm = (values: UserPreferencesForm) => {
  const errors: Partial<Record<keyof UserPreferencesForm, string>> = {};
  // ...validation logic
  return errors;
};`}
          </pre>
        </Paper>
      </CardContent>
    </Card>
  );
};

// Type-safe Component Props with TypeScript
interface GenericListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T, index: number) => string;
  emptyMessage?: string;
  isLoading?: boolean;
}

// Component using generic TypeScript props
function GenericList<T>({
  items,
  renderItem,
  keyExtractor,
  emptyMessage = "No items to display",
  isLoading = false,
}: GenericListProps<T>) {
  if (isLoading) {
    return (
      <Box sx={{ p: 2, textAlign: "center" }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (items.length === 0) {
    return (
      <Box sx={{ p: 2, textAlign: "center" }}>
        <Typography color="text.secondary">{emptyMessage}</Typography>
      </Box>
    );
  }

  return (
    <Box component="ul" sx={{ p: 0, m: 0, listStyle: "none" }}>
      {items.map((item, index) => (
        <Box component="li" key={keyExtractor(item, index)} sx={{ mb: 2 }}>
          {renderItem(item, index)}
        </Box>
      ))}
    </Box>
  );
}

// Example implementation using the generic list
const GenericListExample: React.FC = () => {
  const theme = useMuiTheme();

  // Define a specific type for our list items
  interface UserProfile {
    id: string;
    name: string;
    role: "admin" | "user" | "guest";
    isActive: boolean;
    joinDate: string;
  }

  // Sample data with proper typing
  const users: UserProfile[] = [
    {
      id: "1",
      name: "Alex Johnson",
      role: "admin",
      isActive: true,
      joinDate: "2023-01-15",
    },
    {
      id: "2",
      name: "Samantha Williams",
      role: "user",
      isActive: true,
      joinDate: "2023-03-21",
    },
    {
      id: "3",
      name: "Michael Brown",
      role: "guest",
      isActive: false,
      joinDate: "2023-05-07",
    },
  ];

  // Render function with proper typing
  const renderUser = (user: UserProfile, index: number) => (
    <Paper
      elevation={1}
      sx={{
        p: 2,
        borderLeft: `4px solid ${
          user.role === "admin"
            ? theme.palette.error.main
            : user.role === "user"
            ? theme.palette.primary.main
            : theme.palette.grey[500]
        }`,
        bgcolor: !user.isActive
          ? theme.palette.mode === "dark"
            ? "rgba(0,0,0,0.2)"
            : "rgba(0,0,0,0.05)"
          : "transparent",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box>
          <Typography variant="subtitle1" fontWeight="bold">
            {user.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Role: {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          </Typography>
        </Box>
        <Box>
          <Typography
            variant="caption"
            sx={{
              px: 1,
              py: 0.5,
              borderRadius: 1,
              bgcolor: user.isActive ? "success.main" : "error.main",
              color: "white",
            }}
          >
            {user.isActive ? "Active" : "Inactive"}
          </Typography>
        </Box>
      </Box>
      <Typography variant="caption" color="text.secondary">
        Joined: {new Date(user.joinDate).toLocaleDateString()}
      </Typography>
    </Paper>
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
        title="Type-Safe Generic Components"
        titleTypographyProps={{ variant: "h6" }}
        sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}
      />
      <CardContent>
        <Typography paragraph>
          This example demonstrates how to create reusable generic components
          with TypeScript:
        </Typography>

        <Box sx={{ mb: 3 }}>
          <GenericList<UserProfile>
            items={users}
            renderItem={renderUser}
            keyExtractor={(user) => user.id}
            emptyMessage="No users found"
          />
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          TypeScript Generics Example:
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
            {`// Generic component props with TypeScript
interface GenericListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T, index: number) => string;
  emptyMessage?: string;
  isLoading?: boolean;
}

// Generic component implementation
function GenericList<T>({
  items,
  renderItem,
  keyExtractor,
  // Default values for optional props
  emptyMessage = "No items to display",
  isLoading = false,
}: GenericListProps<T>) {
  // Component implementation
}

// Usage with a specific type
interface UserProfile {
  id: string;
  name: string;
  role: "admin" | "user" | "guest";
  // ...other fields
}

<GenericList<UserProfile>
  items={users}
  renderItem={(user) => <UserItem user={user} />}
  keyExtractor={(user) => user.id}
/>`}
          </pre>
        </Paper>
      </CardContent>
    </Card>
  );
};

// Demonstrates TypeScript with React Context
const AdvancedTypeScriptPatterns: React.FC = () => {
  const theme = useMuiTheme();

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
        title="Advanced TypeScript Patterns"
        titleTypographyProps={{ variant: "h6" }}
        sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}
      />
      <CardContent>
        <Typography paragraph>
          TypeScript offers powerful type patterns that can enhance React
          development:
        </Typography>

        <Box sx={{ mb: 4 }}>
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            gutterBottom
            color="primary"
          >
            1. Discriminated Union Types
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
              mb: 2,
              overflowX: "auto",
            }}
          >
            <pre style={{ margin: 0, fontSize: "0.875rem" }}>
              {`// Different state types with a discriminator
type RequestState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: User[] }
  | { status: "error"; error: Error };

// Type-safe rendering based on state
function UserList({ state }: { state: RequestState }) {
  switch (state.status) {
    case "idle":
      return <div>Start searching for users</div>;
    case "loading":
      return <div>Loading users...</div>;
    case "error":
      return <div>Error: {state.error.message}</div>;
    case "success":
      return (
        <ul>
          {state.data.map(user => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      );
  }
}`}
            </pre>
          </Paper>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            gutterBottom
            color="primary"
          >
            2. Mapped Types and Type Transformations
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
              mb: 2,
              overflowX: "auto",
            }}
          >
            <pre style={{ margin: 0, fontSize: "0.875rem" }}>
              {`// Original form data type
interface UserForm {
  name: string;
  email: string;
  age: number;
  bio: string;
}

// Create a validation schema type from the form type
type ValidationSchema = {
  [K in keyof UserForm]: (value: UserForm[K]) => string | null;
};

// Implementation of the validation schema
const validators: ValidationSchema = {
  name: (value) => (value.length < 2 ? "Name is too short" : null),
  email: (value) => (!value.includes('@') ? "Invalid email" : null),
  age: (value) => (value < 18 ? "Must be 18 or older" : null),
  bio: (value) => (value.length > 500 ? "Bio is too long" : null),
};

// Create form error type
type FormErrors = {
  [K in keyof UserForm]?: string;
};`}
            </pre>
          </Paper>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            gutterBottom
            color="primary"
          >
            3. Type Guards for Runtime Checking
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
              mb: 2,
              overflowX: "auto",
            }}
          >
            <pre style={{ margin: 0, fontSize: "0.875rem" }}>
              {`// Define API response types
interface SuccessResponse {
  kind: "success";
  data: unknown;
}

interface ErrorResponse {
  kind: "error";
  message: string;
}

type ApiResponse = SuccessResponse | ErrorResponse;

// Type guard function
function isSuccessResponse(response: ApiResponse): response is SuccessResponse {
  return response.kind === "success";
}

// Using the type guard in a component
function handleResponse(response: ApiResponse) {
  if (isSuccessResponse(response)) {
    // TypeScript knows this is SuccessResponse
    console.log(response.data);
  } else {
    // TypeScript knows this is ErrorResponse
    console.error(response.message);
  }
}`}
            </pre>
          </Paper>
        </Box>

        <Box>
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            gutterBottom
            color="primary"
          >
            4. Template Literal Types
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
              {`// Define base colors and variants
type BaseColor = "primary" | "secondary" | "error" | "warning" | "info" | "success";
type ColorVariant = "light" | "main" | "dark";

// Create template literal type for theme color paths
type ThemeColorPath = \`\${BaseColor}.\${ColorVariant}\`;

// Type-safe theme color accessor
function getThemeColor(theme: Theme, colorPath: ThemeColorPath): string {
  const [base, variant] = colorPath.split('.');
  return theme.palette[base as BaseColor][variant as ColorVariant];
}

// Usage
const buttonColor = getThemeColor(theme, "primary.main");
const errorColor = getThemeColor(theme, "error.light");

// This would cause TypeScript error:
// const invalidColor = getThemeColor(theme, "primary.invalid");`}
            </pre>
          </Paper>
        </Box>
      </CardContent>
    </Card>
  );
};

// Main TypeScript Best Practices Section component
const TypeScriptBestPracticesSection: React.FC = () => {
  const theme = useMuiTheme();

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
            background: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1616763355548-1b606f439f86?ixlib=rb-1.2.1&auto=format&fit=crop&w=1740&q=80')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: 2,
            p: 4,
            mb: 4,
            color: "white",
          }}
        >
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            TypeScript Best Practices
          </Typography>
          <Typography variant="h6">
            Explore advanced TypeScript patterns and techniques for modern React
            applications
          </Typography>
        </Paper>

        <TypeScriptFormExample />
        <GenericListExample />
        <AdvancedTypeScriptPatterns />
      </Box>
    </Box>
  );
};

export default TypeScriptBestPracticesSection;
