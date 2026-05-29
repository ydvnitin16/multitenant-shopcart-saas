// components/ui/Table.jsx

const Table = ({ columns = [], data = [], loading = false }) => {
    if (loading) {
        return (
            <div className='flex items-center justify-center h-40 text-gray-500'>
                Loading...
            </div>
        );
    }

    return (
        <div className='w-full overflow-x-auto rounded-2xl border border-gray-200 bg-white'>
            <table className='w-full text-sm'>
                <thead className='bg-gray-50'>
                    <tr>
                        {columns.map((column) => (
                            <th
                                key={column.key}
                                className='px-6 py-4 text-left font-semibold text-gray-600 whitespace-nowrap'
                            >
                                {column.title}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {data.length ? (
                        data.map((row, index) => (
                            <tr
                                key={row._id || index}
                                className='border-t border-gray-100 hover:bg-gray-50 transition'
                            >
                                {columns.map((column) => {
                                    console.log(column[column.key]);
                                    return (
                                        <td
                                            key={column.key}
                                            className='px-6 py-4 text-gray-700 whitespace-nowrap'
                                        >
                                            {row[column.key]}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan={columns.length}
                                className='py-10 text-center text-gray-500'
                            >
                                No data found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
