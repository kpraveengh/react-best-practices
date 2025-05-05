import { ChangeEvent, FormEvent, useState } from 'react';

// Import MUI's SelectChangeEvent type
import { SelectChangeEvent } from '@mui/material/Select';

/**
 * A type-safe custom hook for handling form state and validation
 * 
 * @template T - The shape of the form values
 * @template E - The shape of form errors (defaults to Partial<T>)
 */
export function useForm<T extends Record<string, any>, E extends Partial<Record<keyof T, string>> = Partial<Record<keyof T, string>>>(
    initialValues: T,
    validate?: (values: T) => E
) {
    // Form values state
    const [values, setValues] = useState<T>(initialValues);

    // Form errors state
    const [errors, setErrors] = useState<E>({} as E);

    // Form submission state
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // Touched fields tracking
    const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

    /**
     * Handles input change events with proper typing
     * Supports both standard React ChangeEvent and Material UI's SelectChangeEvent
     */
    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> | SelectChangeEvent<any>
    ) => {
        const { name, value } = e.target;

        // Check if this is a checkbox input (only for standard HTML inputs)
        if ('type' in e.target && e.target.type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setValues(prev => ({
                ...prev,
                [name]: checked
            }));
            return;
        }

        // Handle number inputs (only for standard HTML inputs)
        if ('type' in e.target && e.target.type === 'number') {
            setValues(prev => ({
                ...prev,
                [name]: value === '' ? '' : Number(value)
            }));
            return;
        }

        // Default handling for text inputs and MUI Select
        setValues(prev => ({
            ...prev,
            [name]: value
        }));
    };

    /**
     * Updates a specific form field programmatically
     */
    const setFieldValue = <K extends keyof T>(field: K, value: T[K]) => {
        setValues(prev => ({
            ...prev,
            [field]: value
        }));
    };

    /**
     * Marks a field as touched when it loses focus
     */
    const handleBlur = (field: keyof T) => {
        setTouched(prev => ({
            ...prev,
            [field]: true
        }));

        // Run validation if provided
        if (validate) {
            const validationErrors = validate(values);
            setErrors(validationErrors);
        }
    };

    /**
     * Handles form submission with validation
     */
    const handleSubmit = (
        onSubmit: (values: T) => void | Promise<void>
    ) => async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Mark all fields as touched
        const allTouched = Object.keys(values).reduce(
            (acc, key) => ({ ...acc, [key]: true }),
            {} as Record<keyof T, boolean>
        );
        setTouched(allTouched);

        // Validate form if validation function is provided
        let formIsValid = true;
        if (validate) {
            const validationErrors = validate(values);
            setErrors(validationErrors);
            formIsValid = Object.keys(validationErrors).length === 0;
        }

        if (formIsValid) {
            setIsSubmitting(true);
            try {
                await onSubmit(values);
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    /**
     * Resets the form to its initial state
     */
    const resetForm = () => {
        setValues(initialValues);
        setErrors({} as E);
        setTouched({});
        setIsSubmitting(false);
    };

    return {
        values,
        errors,
        touched,
        isSubmitting,
        handleChange,
        handleBlur,
        handleSubmit,
        setFieldValue,
        resetForm,
        setValues
    };
}