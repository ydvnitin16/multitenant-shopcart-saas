import Button from "@/components/ui/Button";
import HeroCard from "./HeroCard";
import { heroData } from "../data/heroData";

const HeroSection = () => {
    return (
        <section className="pt-24 pb-12 px-6">
    <div className="grid md:grid-cols-2 gap-6 min-h-[calc(90vh-64px)]">

                {heroData.map((hero, index) => (
                    <HeroCard key={index} {...hero} />
                ))}
            </div>
        </section>
    );
};

export default HeroSection;
