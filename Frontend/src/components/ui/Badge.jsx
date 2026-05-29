import clsx from "clsx";
import React from "react";

const Badge = ({
    content,
    size = "md",
    variant = "gray",
    className,
    ...props
}) => {
    const sizes = {
        sm: "px-2 py-0.5 text-xs",
        md: "px-2.5 py-1 text-sm",
        lg: "px-3 py-1.5 text-base",
    };

    const variants = {
        gray: "bg-gray-100 text-gray-700",
        green: "bg-green-100 text-green-700",
        red: "bg-red-100 text-red-700",
        yellow: "bg-yellow-100 text-yellow-700",
        blue: "bg-blue-100 text-blue-700",
        purple: "bg-purple-100 text-purple-700",
    };

    return (
        <span
            className={clsx(
                "inline-flex items-center rounded-full font-medium",
                sizes[size],
                variants[variant],
                className,
            )}
            {...props}
        >
            {content}
        </span>
    );
};

export default Badge;
