import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Checkbox from "@mui/material/Checkbox";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";

// Import React Hook Form
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import * as z from "zod";

// Import context
import { useTheme } from "../../context/ThemeContext";
import { useViewMode } from "../../context/ViewModeContext";

// Basic form example with React Hook Form
const BasicFormExample: React.FC = () => {
  const theme = useMuiTheme();
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Define a TypeScript interface for form values
  interface FormValues {
    firstName: string;
    lastName: string;
    email: string;
  }

  // Initialize the form with useForm hook
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>();

  // Form submission handler
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log(data);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      reset();
    }, 3000);
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
        title="Basic React Hook Form Example"
        titleTypographyProps={{ variant: "h6" }}
      />
      <CardContent>
        <Typography variant="body2" gutterBottom>
          A basic form with validation using React Hook Form:
        </Typography>

        {isSubmitted ? (
          <Alert severity="success" sx={{ my: 2 }}>
            Form submitted successfully!
          </Alert>
        ) : (
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ mt: 2 }}
          >
            <TextField
              fullWidth
              margin="normal"
              label="First Name"
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
              {...register("firstName", { required: "First name is required" })}
            />

            <TextField
              fullWidth
              margin="normal"
              label="Last Name"
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
              {...register("lastName", { required: "Last name is required" })}
            />

            <TextField
              fullWidth
              margin="normal"
              label="Email"
              error={!!errors.email}
              helperText={errors.email?.message}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 3 }}
            >
              Submit
            </Button>
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
          <pre style={{ margin: 0 }}>{`// Basic React Hook Form setup
import { useForm, SubmitHandler } from "react-hook-form";

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
}

const { 
  register, 
  handleSubmit, 
  formState: { errors } 
} = useForm<FormValues>();

const onSubmit: SubmitHandler<FormValues> = (data) => console.log(data);

// JSX form elements
<form onSubmit={handleSubmit(onSubmit)}>
  <input 
    {...register("firstName", { required: "First name is required" })}
  />
  {errors.firstName && <p>{errors.firstName.message}</p>}
  
  {/* Other form fields */}
  
  <button type="submit">Submit</button>
</form>`}</pre>
        </Paper>
      </CardContent>
    </Card>
  );
};

// Advanced form with Zod schema validation
const ZodValidationExample: React.FC = () => {
  const theme = useMuiTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Define Zod schema for validation
  const formSchema = z
    .object({
      username: z
        .string()
        .min(3, "Username must be at least 3 characters")
        .max(20, "Username must be at most 20 characters"),
      email: z.string().email("Invalid email address"),
      password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .refine((value) => /[A-Z]/.test(value), {
          message: "Password must contain at least one uppercase letter",
        })
        .refine((value) => /[0-9]/.test(value), {
          message: "Password must contain at least one number",
        }),
      confirmPassword: z.string(),
      terms: z.boolean().refine((value) => value === true, {
        message: "You must accept the terms and conditions",
      }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    });

  // Extract TypeScript type from schema
  type FormDataType = z.infer<typeof formSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<FormDataType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  // Form submission handler
  const onSubmit: SubmitHandler<FormDataType> = async (data) => {
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log(data);
    setIsSubmitting(false);
    reset();
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
        title="Zod Schema Validation"
        titleTypographyProps={{ variant: "h6" }}
      />
      <CardContent>
        <Typography variant="body2" gutterBottom>
          Advanced form validation using React Hook Form with Zod schema
          validation:
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            margin="normal"
            label="Username"
            error={!!errors.username}
            helperText={errors.username?.message}
            {...register("username")}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Email"
            type="email"
            error={!!errors.email}
            helperText={errors.email?.message}
            {...register("email")}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Password"
            type="password"
            error={!!errors.password}
            helperText={errors.password?.message}
            {...register("password")}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Confirm Password"
            type="password"
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />

          <FormControlLabel
            control={
              <Controller
                name="terms"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    {...field}
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                )}
              />
            }
            label="I accept the terms and conditions"
            sx={{ mt: 2 }}
          />
          {errors.terms && (
            <Typography color="error" variant="caption" display="block">
              {errors.terms.message}
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            sx={{ mt: 3 }}
          >
            {isSubmitting ? (
              <>
                <CircularProgress size={24} sx={{ mr: 1 }} />
                Submitting...
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </Box>

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
          <pre style={{ margin: 0 }}>{`// Zod schema validation setup
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Define schema
const formSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  terms: z.boolean().refine(value => value === true, {
    message: "You must accept the terms",
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Extract TypeScript type from schema
type FormDataType = z.infer<typeof formSchema>;

// Initialize form with schema resolver
const { register, handleSubmit, formState: { errors } } = useForm<FormDataType>({
  resolver: zodResolver(formSchema)
});`}</pre>
        </Paper>
      </CardContent>
    </Card>
  );
};

// Dynamic form fields example with React Hook Form
const DynamicFieldsExample: React.FC = () => {
  const theme = useMuiTheme();

  // Define form types
  interface EducationField {
    institution: string;
    degree: string;
    year: string;
  }

  interface FormData {
    name: string;
    education: EducationField[];
  }

  // Initialize the form with useForm
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      education: [{ institution: "", degree: "", year: "" }],
    },
  });

  // Setup field array for dynamic education fields
  const { fields, append, remove } = useFieldArray({
    control,
    name: "education",
  });

  // Form submission handler
  const onSubmit = (data: FormData) => {
    console.log(data);
    alert(JSON.stringify(data, null, 2));
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
        title="Dynamic Fields with useFieldArray"
        titleTypographyProps={{ variant: "h6" }}
      />
      <CardContent>
        <Typography variant="body2" gutterBottom>
          Handle dynamic form fields with React Hook Form's useFieldArray:
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            margin="normal"
            label="Full Name"
            error={!!errors.name}
            helperText={errors.name?.message}
            {...register("name", { required: "Name is required" })}
          />

          <Typography variant="subtitle1" sx={{ mt: 3, mb: 2 }}>
            Education History
          </Typography>

          {fields.map((field, index) => (
            <Box
              key={field.id}
              sx={{
                p: 2,
                mb: 2,
                border: 1,
                borderColor: "divider",
                borderRadius: 1,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <Typography variant="subtitle2">Entry #{index + 1}</Typography>

                {index > 0 && (
                  <Button
                    size="small"
                    color="error"
                    onClick={() => remove(index)}
                  >
                    Remove
                  </Button>
                )}
              </Box>

              <TextField
                fullWidth
                margin="normal"
                label="Institution"
                error={!!errors.education?.[index]?.institution}
                helperText={errors.education?.[index]?.institution?.message}
                {...register(`education.${index}.institution` as const, {
                  required: "Institution is required",
                })}
              />

              <TextField
                fullWidth
                margin="normal"
                label="Degree"
                error={!!errors.education?.[index]?.degree}
                helperText={errors.education?.[index]?.degree?.message}
                {...register(`education.${index}.degree` as const, {
                  required: "Degree is required",
                })}
              />

              <TextField
                fullWidth
                margin="normal"
                label="Year"
                error={!!errors.education?.[index]?.year}
                helperText={errors.education?.[index]?.year?.message}
                {...register(`education.${index}.year` as const, {
                  required: "Year is required",
                })}
              />
            </Box>
          ))}

          <Button
            variant="outlined"
            color="primary"
            onClick={() => append({ institution: "", degree: "", year: "" })}
            sx={{ mt: 1, mb: 3 }}
          >
            Add Education Entry
          </Button>

          <Button type="submit" variant="contained" color="primary" fullWidth>
            Submit
          </Button>
        </Box>

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
          <pre style={{ margin: 0 }}>{`// Dynamic fields with useFieldArray
import { useForm, useFieldArray } from "react-hook-form";

interface EducationField {
  institution: string;
  degree: string;
  year: string;
}

interface FormData {
  name: string;
  education: EducationField[];
}

const { register, control, handleSubmit } = useForm<FormData>({
  defaultValues: {
    name: "",
    education: [{ institution: "", degree: "", year: "" }]
  }
});

// Setup field array for dynamic education fields
const { fields, append, remove } = useFieldArray({
  control,
  name: "education"
});

// JSX Form
<form onSubmit={handleSubmit(onSubmit)}>
  <input {...register("name")} />
  
  {fields.map((field, index) => (
    <div key={field.id}>
      <input {...register(\`education.\${index}.institution\`)} />
      <input {...register(\`education.\${index}.degree\`)} />
      <input {...register(\`education.\${index}.year\`)} />
      <button type="button" onClick={() => remove(index)}>Remove</button>
    </div>
  ))}
  
  <button type="button" onClick={() => append({ 
    institution: "", degree: "", year: "" 
  })}>
    Add Education
  </button>
  
  <button type="submit">Submit</button>
</form>`}</pre>
        </Paper>
      </CardContent>
    </Card>
  );
};

// Main section component
const ReactHookFormSection: React.FC = () => {
  const { theme } = useTheme();
  const { isFullView } = useViewMode();
  const muiTheme = useMuiTheme();

  const reactHookFormFeatures = [
    {
      text: "Performance - Minimizes re-renders for better form performance",
      icon: "⚡",
    },
    {
      text: "TypeScript Support - First-class TypeScript integration",
      icon: "📝",
    },
    {
      text: "Validation - Built-in validation and schema-based validation support",
      icon: "✅",
    },
    {
      text: "Small Size - Tiny bundle size with no dependencies",
      icon: "🔍",
    },
    {
      text: "Developer Experience - Intuitive API that's easy to use",
      icon: "🧠",
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
            background: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1618044733300-9472054094ee?ixlib=rb-1.2.1&auto=format&fit=crop&w=1740&q=80')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: 2,
            p: 4,
            mb: 4,
            color: "white",
          }}
        >
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            React Hook Form
          </Typography>
          <Typography variant="h6">
            Performant, flexible and extensible forms with easy-to-use
            validation
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
            Why React Hook Form?
          </Typography>

          <List>
            {reactHookFormFeatures.map((item, i) => (
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
                {i < reactHookFormFeatures.length - 1 && <Divider />}
              </Box>
            ))}
          </List>
        </Card>

        <BasicFormExample />
        <ZodValidationExample />
        <DynamicFieldsExample />

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
            React Hook Form Best Practices
          </Typography>

          <List>
            <ListItem>
              <ListItemText
                primary={
                  <Typography variant="body1" fontWeight="bold">
                    1. Use TypeScript interfaces
                  </Typography>
                }
                secondary="Define explicit types for your form values using TypeScript interfaces to get full type checking."
              />
            </ListItem>
            <Divider />

            <ListItem>
              <ListItemText
                primary={
                  <Typography variant="body1" fontWeight="bold">
                    2. Use schema validation libraries
                  </Typography>
                }
                secondary="Integrate with Zod, Yup, or Joi for schema-based validation instead of inline validation rules."
              />
            </ListItem>
            <Divider />

            <ListItem>
              <ListItemText
                primary={
                  <Typography variant="body1" fontWeight="bold">
                    3. Leverage Controller for complex inputs
                  </Typography>
                }
                secondary="Use the Controller component for third-party input components or complex custom inputs."
              />
            </ListItem>
            <Divider />

            <ListItem>
              <ListItemText
                primary={
                  <Typography variant="body1" fontWeight="bold">
                    4. Organize forms with FormProvider
                  </Typography>
                }
                secondary="For large forms, use FormProvider to share the form context with nested components."
              />
            </ListItem>
            <Divider />

            <ListItem>
              <ListItemText
                primary={
                  <Typography variant="body1" fontWeight="bold">
                    5. Prefer controlled components
                  </Typography>
                }
                secondary="For most UI libraries like Material-UI, use Controller to create controlled components."
              />
            </ListItem>
          </List>

          <Alert severity="info" sx={{ mt: 3 }}>
            <Typography variant="body2">
              React Hook Form provides significant performance benefits over
              other form libraries because it minimizes re-renders by isolating
              component re-renders using uncontrolled inputs.
            </Typography>
          </Alert>
        </Card>
      </Box>
    </Box>
  );
};

export default ReactHookFormSection;
