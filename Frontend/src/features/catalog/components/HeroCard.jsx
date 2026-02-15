import Button from "@/components/ui/Button";
import React from "react";
import { useNavigate } from "react-router-dom";

const HeroCard = ({
    image,
    tag,
    title,
    description,
    actionText,
    navigateTo,
    textAlignment = "right",
}) => {
    const navigate = useNavigate();
    return (
        <div
            className={`relative flex items-center rounded-3xl overflow-hidden min-h-[350px] md:min-h-full ${
                textAlignment === "left" ? "justify-start" : "justify-end"
            }`}
        >
            <div
                className='absolute inset-0 bg-cover bg-center'
                style={{
                    backgroundImage: `url(${image})`,
                }}
            />
            <div
                className={`relative z-10 md:p-12 p-6 md:max-w-[70%] ${textAlignment === "left" ? "text-left" : "text-right"}`}
            >
                <span className='bg-primary text-white text-sm font-bold px-3 py-1 rounded bg-black'>
                    {tag}
                </span>
                <h2 className='text-3xl md:text-5xl font-black text-white mt-4'>
                    {title}
                </h2>
                <p className='text-slate-300 mt-4'>{description}</p>
                <Button
                    onClick={() => navigate(navigateTo)}
                    size='lg'
                    className={"mt-3 "}
                    variant='secondary'
                >
                    {actionText}
                </Button>
            </div>
        </div>
    );
};

export default HeroCard;
