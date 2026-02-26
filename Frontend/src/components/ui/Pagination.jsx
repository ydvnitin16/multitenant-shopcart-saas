import React from "react";
import Button from "@/components/ui/Button";

const Pagination = ({ currentPage, totalPages, setPage }) => {
    return (
        <div className='flex justify-center gap-3 mt-10'>
            <Button
                variant={currentPage === 1 ? "ghost" : "primary"}
                disabled={currentPage === 1}
                onClick={() => setPage((prev) => prev - 1)}
                className=''
            >
                Prev
            </Button>

            <span className='px-4 py-2'>
                Page {currentPage} of {totalPages}
            </span>

            <Button
                variant={currentPage === totalPages ? "ghost" : "primary"}
                disabled={currentPage === totalPages}
                onClick={() => setPage((prev) => prev + 1)}
                className=''
            >
                Next
            </Button>
        </div>
    );
};

export default Pagination;
