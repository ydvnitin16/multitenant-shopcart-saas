import FeatureItem from "./FeatureItem";
import { featuresData } from "../data/featuresData.js";

const Features = () => {
    return (
        <section className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 py-8 px-10 mx-auto border-b border-slate-200'>
            {featuresData.map((feature) => {
                const Icon = feature.icon;

                return (
                    <FeatureItem
                        key={feature.id}
                        icon={<Icon />}
                        title={feature.title}
                        subtitle={feature.subtitle}
                    />
                );
            })}
        </section>
    );
};

export default Features;
