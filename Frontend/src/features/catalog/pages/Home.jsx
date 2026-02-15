import React from "react";
import HeroSection from "../components/HeroSection";
import Features from "../components/Features";
import ProductCard from "../components/ProductCard";
import SectionWrapper from "../components/SectionWrapper";
import {
    bestSellingProducts,
    newArrivalsProducts,
} from "../data/productsData.js";
import CategoriesMarquee from "../components/CategoriesMarquee";
import { categoriesData } from "../data/categoriesData";

const Home = () => {
    return (
        <>
            {/* Hero section */}
            <HeroSection />

            {/* Categories Pill */}
            <CategoriesMarquee categories={categoriesData} />

            <main className='mx-auto max-w-7xl px-6 py-8'>
                {/* New Arrivals */}
                <SectionWrapper
                    title='New Arrivals'
                    subtitle='Launched this month. Grab them before they are gone.'
                    action={{
                        text: "View All Products",
                        link: "/products",
                    }}
                >
                    {newArrivalsProducts.map((p) => (
                        <ProductCard
                            key={p.id}
                            image={p.image}
                            title={p.title}
                            price={p.price}
                            category={p.category}
                            mrp={p.mrp}
                        />
                    ))}
                </SectionWrapper>

                {/* Best Selling */}
                <SectionWrapper
                    title='Best Selling'
                    subtitle='The most popular products in our marketplace.'
                    action={{
                        text: "View All Products",
                        link: "/products",
                    }}
                >
                    {bestSellingProducts.map((p) => (
                        <ProductCard
                            key={p.id}
                            image={p.image}
                            title={p.title}
                            price={p.price}
                            category={p.category}
                            mrp={p.mrp}
                        />
                    ))}
                </SectionWrapper>
            </main>

            {/* Features */}
            <Features />
        </>
    );
};

export default Home;
