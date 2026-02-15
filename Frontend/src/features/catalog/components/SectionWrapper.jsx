import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const SectionWrapper = ({ title, subtitle, action, children }) => {
    return (
        <section>
            <div className='mb-8 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between'>
                <div>
                    <h3 className='text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900'>
                        {title}
                    </h3>

                    {subtitle && (
                        <p className='mt-2 text-sm sm:text-base font-medium text-gray-600'>
                            {subtitle}
                        </p>
                    )}
                </div>

                {action && (
                    <Link
                        to={action.link}
                        className='inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 transition hover:text-emerald-700'
                    >
                        {action.text}
                        <ArrowRight size={16} />
                    </Link>
                )}
            </div>

            <div className='flex gap-5 overflow-x-auto pb-3 mb-8'>
                {children}
            </div>
        </section>
    );
};

export default SectionWrapper;
