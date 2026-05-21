import React from "react";

const Chart = ({ title, data, xKey, yKey }) => {
    return (
        <div className='mt-8 grid h-64 grid-cols-7 items-end gap-3'>
            {data.map((item) => (
                <div
                    key={item.date}
                    className='flex h-full flex-col justify-end gap-3'
                >
                    <div
                        className='rounded-t-xl bg-black'
                        style={{
                            height: `${Math.max(
                                (item.revenue / maxRevenue) * 100,
                                item.revenue > 0 ? 12 : 4,
                            )}%`,
                        }}
                        title={`${item.label}: ${formatPrice(item.revenue)} from ${item.orders} orders`}
                    />
                    <div className='text-center'>
                        <p className='text-xs font-medium text-zinc-700'>
                            {item.label}
                        </p>
                        <p className='text-[11px] text-zinc-500'>
                            {item.orders} orders
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Chart;
