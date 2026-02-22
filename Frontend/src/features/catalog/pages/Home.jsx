import React from "react";
import HeroSection from "../components/HeroSection";
import Features from "../components/Features";
import ProductCard from "../components/ProductCard";
import SectionWrapper from "../components/SectionWrapper";
import { newArrivalsProducts } from "../data/productsData.js";
import CategoriesMarquee from "../components/CategoriesMarquee";
import { categoriesData } from "../data/categoriesData";
import { useProducts } from "../hooks/useProducts";
import InlineLoader from "@/components/ui/InlineLoader";

const Home = () => {
    const {
        loading: bestSellingProductsLoading,
        products: bestSellingProducts,
        error: bestSellingProductsError,
    } = useProducts({
        page: 1,
        limit: 10,
        sortBy: "sold",
        order: "desc",
    });
    const {
        loading: newArrivalsProductsLoading,
        products: newArrivalsProducts,
        error: newArrivalsProductsError,
    } = useProducts({
        page: 1,
        limit: 10,
        sortBy: "createdAt",
        order: "asc",
    });

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
                                title={p.title}
                                price={p.price}
                                category={p.category}
                                mrp={p.mrp}
                                sold={p.sold}
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
                        link: "/products",
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
                                title={p.title}
                                price={p.price}
                                category={p.category}
                                mrp={p.mrp}
                                sold={p.sold}
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
