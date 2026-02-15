import React, { useEffect, useState } from 'react';
import { useLazyLoading } from '../../hooks/useLazyLoading';

const LazyImage = ({ 
    src, 
    alt, 
    className = '', 
    ...props 
}) => {
    const { imgRef, isLoaded, isInView, handleLoad, handleError } = useLazyLoading();

    return (
        <div className={`relative overflow-hidden ${className}`}>
            {/* Loading Placeholder */}
            {!isLoaded && (
                <div className="absolute inset-0 bg-white animate-pulse flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-zinc-100 border-t-black rounded-full animate-spin"></div>
                </div>
            )}
            
            {/* Actual Image */}
            
                <img
                    ref={imgRef}
                    src={isInView && src}
                    alt={isInView && alt}
                    onLoad={handleLoad}
                    onError={handleError}
                    className={`transition-opacity duration-300 ${
                        isLoaded ? 'opacity-100' : 'opacity-0'
                    } ${className}`}
                    loading="lazy"
                    {...props}
                />
        </div>
    );
};

export default LazyImage;
