import React from "react";

const StatsCard = ({ title, value, change, bg, color, Icon }) => {
    return (
        <div className='bg-white border border-zinc-200 rounded-2xl p-5'>
            <div className='flex justify-between items-start'>
                <div>
                    <p className='text-sm text-zinc-500'>{title}</p>

                    <h3 className='text-2xl font-bold mt-2'>{value}</h3>

                    {change && (
                        <p className='text-sm text-zinc-500 mt-2'>{change}</p>
                    )}
                </div>

                {Icon && (
                    <div className={`p-3 rounded-xl ${bg}`}>
                        <Icon size={22} className={color} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatsCard;
