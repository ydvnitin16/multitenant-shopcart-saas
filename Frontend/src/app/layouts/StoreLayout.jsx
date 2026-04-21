import AppShell from "@/components/layout/AppShell";
import StoresList from "@/features/store/components/StoresList";
import useVendorStoreStore from "@/stores/useVendorStoreStore";
import {
    LucideHome,
    LucideSquarePlus,
    PackageOpen,
    ShoppingBag,
    SquarePen,
} from "lucide-react";
import React, { useEffect } from "react";
import { Outlet, useNavigate, useParams, useLocation } from "react-router-dom";

const StoreLayout = () => {
    const { storeSlug } = useParams();

    const NAV_LINKS = [
        {
            label: "Dashboard",
            slug: `/store/${storeSlug}/dashboard`,
            icon: <LucideHome size={18} />,
        },
        {
            label: "Add product",
            slug: `/store/${storeSlug}/add-product`,
            icon: <LucideSquarePlus size={18} />,
        },
        {
            label: "Manage products",
            slug: `/store/${storeSlug}/manage-products`,
            icon: <SquarePen size={18} />,
        },
        {
            label: "Manage orders",
            slug: `/store/${storeSlug}/manage-orders`,
            icon: <PackageOpen size={18} />,
        },
    ];

    const PANEL_DETAILS = {
        label: "STORE PANEL",
        icon: <ShoppingBag size={18} />,
    };

    return (
        <AppShell
            navLinks={NAV_LINKS}
            panelDetails={PANEL_DETAILS}
            Footer={<StoresList />}
        >
            <Outlet />
        </AppShell>
    );
};

export default StoreLayout;
