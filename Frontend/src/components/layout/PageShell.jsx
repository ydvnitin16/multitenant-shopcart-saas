import React from "react";

const PageShell = ({ title, description, actions, children }) => {
    return (
        <main className='flex-1 p-2'>
            <div className='flex flex-col items-center sm:flex-row justify-between mb-6 gap-5'>
                <div>
                    <h1 className='text-3xl font-bold'>{title}</h1>
                    <p className='text-zinc-500 mt-1'>{description}</p>
                </div>
                {actions && <div>{actions}</div>}
            </div>

            <div className='bg-zinc-50 rounded-xl'>{children}</div>
        </main>
    );
};

export default PageShell;
