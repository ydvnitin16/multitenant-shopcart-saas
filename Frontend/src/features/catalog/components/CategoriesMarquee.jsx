import React from "react";

const CategoriesMarquee = ({ categories }) => {
    return (
        <div className='relative overflow-hidden py-8'>
            <div className='flex w-max animate-scroll gap-6'>
                {[...categories, ...categories].map((cat, index) => (
                    <div
                        key={index}
                        className='flex shrink-0 items-center gap-3 rounded-full bg-white px-4 py-2 border border-zinc-200 shadow-sm'
                    >
                        <span className='font-medium text-sm'>{cat.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategoriesMarquee;
