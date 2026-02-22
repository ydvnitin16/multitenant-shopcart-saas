import React from "react";

const InlineLoader = ({ content = "Loading...", size = "sm" }) => {
    const sizes = {
        sm: "h-3  w-3",
        md: "h-5  w-5",
        lg: "h-7  w-7",
        xl: "h-10  w-10",
    };
    return (
        <div className='flex items-center gap-2 text-sm text-zinc-600'>
            <span
                className={`${sizes[size]} border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin`}
            />
            {content}
        </div>
    );
};

export default InlineLoader;
