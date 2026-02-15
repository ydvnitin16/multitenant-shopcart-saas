import Navbar from "@/components/layout/Navbar";
import React from "react";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
    return (
        <>
            <Navbar />
            <Outlet />
        </>
    );
};

export default RootLayout;
