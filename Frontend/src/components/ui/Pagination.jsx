import React from "react";
import Button from "@/components/ui/Button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ onPrev, onNext, currentPage, totalPages }) => {
    return (
        <div className='flex justify-center items-center gap-3 mt-10'>
            <Button
                variant={currentPage === 1 ? "ghost" : "primary"}
                disabled={currentPage === 1}
                onClick={onPrev}
                className=''
            >
                <ChevronLeft /> Previous
            </Button>

            <span className='px-4 py-2'>
                {currentPage} of {totalPages}
            </span>

            <Button
                variant={currentPage === totalPages ? "ghost" : "primary"}
                disabled={currentPage === totalPages}
                onClick={onNext}
            >
                Next <ChevronRight size={18} />
            </Button>
        </div>
    );
};

export default Pagination;
