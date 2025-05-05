import { useCallback, useMemo, useRef, useState } from 'react';

// Define animation types
export type TransitionType = 'slide' | 'fade' | 'zoom' | 'flip' | 'none' | 'elastic' | 'rotate';

// Map of sections to their transition types
export const sectionTransitions: Record<string, TransitionType> = {
    'modern-react': 'slide',
    'typescript-best-practices': 'zoom',
    'copilot-integration': 'fade',
    'performance-optimization': 'flip'
};

// Define the animation states as a TypeScript union type
export type AnimationState = 'idle' | 'running' | 'paused' | 'completed';

// Define config options with TypeScript interface
export interface AnimationConfig {
    duration?: number;
    delay?: number;
    easing?: string;
    loop?: boolean;
    autoPlay?: boolean;
    onComplete?: () => void;
}

// Utility type to make all properties in T optional
type PartialConfig<T> = {
    [P in keyof T]?: T[P];
};

/**
 * A hook that provides controls for animations with TypeScript integration
 * 
 * @param config - Configuration options for the animation
 * @returns Animation control methods and state
 */
export function useAnimationControl(config: AnimationConfig = {}) {
    // Default configuration with TypeScript
    const defaultConfig: Required<AnimationConfig> = {
        duration: 1000,
        delay: 0,
        easing: 'ease-in-out',
        loop: false,
        autoPlay: true,
        onComplete: () => { },
    };

    // Merge default config with user config
    const mergedConfig = useMemo<Required<AnimationConfig>>(
        () => ({ ...defaultConfig, ...config }),
        [JSON.stringify(config)]
    );

    // Animation state
    const [state, setState] = useState<AnimationState>(
        mergedConfig.autoPlay ? 'running' : 'idle'
    );

    // Progress tracking (0 to 1)
    const [progress, setProgress] = useState<number>(0);

    // Animation timer reference
    const timerRef = useRef<number | null>(null);

    // Start time reference
    const startTimeRef = useRef<number | null>(null);

    // Track if animation is in loop mode
    const loopRef = useRef<boolean>(mergedConfig.loop);

    /**
     * Start the animation
     */
    const play = useCallback(() => {
        // Clear any existing animation timer
        if (timerRef.current !== null) {
            cancelAnimationFrame(timerRef.current);
        }

        setState('running');
        startTimeRef.current = Date.now();

        // Animation frame callback
        const animate = () => {
            const currentTime = Date.now();
            const elapsed = currentTime - (startTimeRef.current || 0);

            // Calculate progress (0 to 1)
            let newProgress = Math.min(1, elapsed / mergedConfig.duration);

            if (newProgress >= 1) {
                // Animation complete
                setProgress(1);
                setState('completed');

                // Call onComplete callback
                mergedConfig.onComplete();

                // Handle looping
                if (loopRef.current) {
                    startTimeRef.current = Date.now();
                    setState('running');
                    requestAnimationFrame(animate);
                }
            } else {
                // Animation still running
                setProgress(newProgress);
                timerRef.current = requestAnimationFrame(animate);
            }
        };

        // Start animation loop
        timerRef.current = requestAnimationFrame(animate);

        return () => {
            if (timerRef.current !== null) {
                cancelAnimationFrame(timerRef.current);
            }
        };
    }, [mergedConfig.duration, mergedConfig.onComplete]);

    /**
     * Pause the animation
     */
    const pause = useCallback(() => {
        if (state === 'running') {
            setState('paused');
            if (timerRef.current !== null) {
                cancelAnimationFrame(timerRef.current);
                timerRef.current = null;
            }
        }
    }, [state]);

    /**
     * Resume the animation from where it was paused
     */
    const resume = useCallback(() => {
        if (state === 'paused') {
            setState('running');
            startTimeRef.current = Date.now() - progress * mergedConfig.duration;
            play();
        }
    }, [state, progress, mergedConfig.duration, play]);

    /**
     * Reset the animation to initial state
     */
    const reset = useCallback(() => {
        if (timerRef.current !== null) {
            cancelAnimationFrame(timerRef.current);
            timerRef.current = null;
        }
        setState('idle');
        setProgress(0);
        startTimeRef.current = null;
    }, []);

    /**
     * Update animation configuration
     */
    const updateConfig = useCallback((newConfig: PartialConfig<AnimationConfig>) => {
        // Update loop ref if it's changed
        if (newConfig.loop !== undefined) {
            loopRef.current = newConfig.loop;
        }

        // Other config changes would be applied next time the animation runs
    }, []);

    /**
     * Get CSS variables for the animation based on current config
     */
    const getCSSVariables = useMemo(() => {
        return {
            '--animation-duration': `${mergedConfig.duration}ms`,
            '--animation-delay': `${mergedConfig.delay}ms`,
            '--animation-easing': mergedConfig.easing,
            '--animation-progress': progress,
        };
    }, [mergedConfig.duration, mergedConfig.delay, mergedConfig.easing, progress]);

    return {
        state,
        progress,
        play,
        pause,
        resume,
        reset,
        updateConfig,
        getCSSVariables,
        config: mergedConfig,
    };
}