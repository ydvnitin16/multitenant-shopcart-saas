import React from "react";
import HeroSection from "../components/HeroSection";
import Features from "../components/Features";
import ProductCard from "../components/ProductCard";
import SectionWrapper from "../components/SectionWrapper";
import CategoriesMarquee from "../components/CategoriesMarquee";
import { PRODUCT_CATEGORIES } from "../data/categoriesData";
import InlineLoader from "@/components/ui/InlineLoader";
import useFetch from "@/hooks/useFetch";

const Home = () => {
    const { data: bestSellingData, loading: bestSellingProductsLoading } =
        useFetch("/products?page=1&limit=10&sortBy=sold&order=desc");
    const { data: newArrivalsData, loading: newArrivalsProductsLoading } =
        useFetch("/products?page=1&limit=10&sortBy=createdAt&order=asc");

    const bestSellingProducts = bestSellingData?.products || [];
    const newArrivalsProducts = newArrivalsData?.products || [];

    return (
        <>
            {/* Hero section */}
            <HeroSection />

            {/* Categories Pill */}
            <CategoriesMarquee categories={PRODUCT_CATEGORIES} />

            <main className='mx-auto max-w-7xl px-6 py-8'>
                {/* New Arrivals */}
                <SectionWrapper
                    title='New Arrivals'
                    subtitle='Launched this month. Grab them before they are gone.'
                    action={{
                        text: "View All Products",
                        link: "/shop",
                    }}
                >
                    {newArrivalsProductsLoading ? (
                        <div className='flex h-40 mx-auto'>
                            <InlineLoader content='' size={"xl"} />
                        </div>
                    ) : (
                        newArrivalsProducts.map((p) => (
                            <ProductCard
                                key={p._id}
                                id={p._id}
                                image={p.images[0]}
                                name={p.name}
                                price={p.price}
                                category={p.category}
                                mrp={p.mrp}
                                sold={p.sold}
                                inStock={p.inStock}
                            />
                        ))
                    )}
                </SectionWrapper>

                {/* Best Selling */}
                <SectionWrapper
                    title='Best Selling'
                    subtitle='The most popular products in our marketplace.'
                    action={{
                        text: "View All Products",
                        link: "/shop",
                    }}
                >
                    {bestSellingProductsLoading ? (
                        <div className='flex h-40 mx-auto'>
                            <InlineLoader content='' size={"xl"} />
                        </div>
                    ) : (
                        bestSellingProducts.map((p) => (
                            <ProductCard
                                key={p._id}
                                id={p._id}
                                image={p.images[0]}
                                name={p.name}
                                price={p.price}
                                category={p.category}
                                mrp={p.mrp}
                                sold={p.sold}
                                inStock={p.inStock}
                            />
                        ))
                    )}
                </SectionWrapper>
            </main>

            {/* Features */}
            <Features />
        </>
    );
};

export default Home;
