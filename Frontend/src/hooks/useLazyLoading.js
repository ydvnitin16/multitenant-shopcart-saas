import { useEffect, useRef, useState, useCallback } from 'react';

export const useLazyLoading = (options = {}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const imgRef = useRef(null);

    const handleLoad = useCallback(() => {
        setIsLoaded(true);
    }, []);

    const handleError = useCallback(() => {
        setIsLoaded(false);
    }, []);

    useEffect(() => {
        const img = imgRef.current;
        if (!img) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            {
                threshold: options.threshold || 0.1,
                rootMargin: options.rootMargin || '50px',
            }
        );

        observer.observe(img);

        return () => observer.disconnect();
    }, [options.threshold, options.rootMargin, isInView]); // Add isInView to dependencies

    // Reset states when component unmounts or src changes
    useEffect(() => {
        setIsLoaded(false);
        setIsInView(false);
    }, []);

    return {
        imgRef,
        isLoaded,
        isInView,
        handleLoad,
        handleError,
    };
};
