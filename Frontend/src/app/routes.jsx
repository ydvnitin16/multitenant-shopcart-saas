import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
} from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout";
import Login from "../features/authentication/pages/Login";
import Signup from "../features/authentication/pages/Signup";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "@/features/admin/pages/Dashboard";
import Stores from "@/features/admin/pages/Stores";
import StoreRequests from "@/features/admin/pages/StoreRequests";
import StoreLayout from "./layouts/StoreLayout";
import StoreDashboard from "@/features/store/pages/StoreDashboard";
import AddProduct from "@/features/store/pages/AddProduct";
import ManageProducts from "@/features/store/pages/ManageProducts";
import StoreRedirect from "@/features/store/pages/StoreRedirect";
import RootLayout from "./layouts/RootLayout";
import Home from "@/features/catalog/pages/Home";
import Shop from "@/features/catalog/pages/Shop";
import Cart from "@/features/catalog/pages/Cart";
import Product from "@/features/catalog/pages/Product";
import VendorShop from "@/features/catalog/pages/VendorShop";
import PublicOnlyRoute from "@/features/authentication/components/PublicOnlyRoute";
import ProtectedRoute from "@/features/authentication/components/ProtectedRoute";
import RequestStore from "@/features/store/pages/RequestStore";
import StoreRequestStatus from "@/features/store/pages/StoreRequestStatus";

const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route path='/' element={<RootLayout />}>
                <Route index element={<Home />} />
                <Route path='shop' element={<Shop />} />
                <Route path='cart' element={<Cart />} />
                <Route
                    element={
                        <ProtectedRoute
                            allowedRoles={["CUSTOMER", "VENDOR", "ADMIN"]}
                        />
                    }
                >
                    <Route path='request-store' element={<RequestStore />} />
                    <Route
                        path='store-request-status'
                        element={<StoreRequestStatus />}
                    />
                </Route>
            </Route>
            <Route path='/vendor/:storeSlug' element={<VendorShop />} />
            <Route path='/product/:productId' element={<Product />} />

            <Route element={<PublicOnlyRoute />}>
                <Route path='/user' element={<AuthLayout />}>
                    <Route path='login' element={<Login />} />
                    <Route path='signup' element={<Signup />} />
                </Route>
            </Route>
            <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
                <Route path='/admin' element={<AdminLayout />}>
                    <Route path='dashboard' element={<Dashboard />} />
                    <Route path='stores' element={<Stores />} />
                    <Route path='store-requests' element={<StoreRequests />} />
                </Route>
            </Route>
            <Route element={<ProtectedRoute allowedRoles={["VENDOR"]} />}>
                <Route path='/store' element={<StoreLayout />}>
                    <Route index element={<StoreRedirect />} />
                    <Route path=':storeSlug'>
                        <Route path='dashboard' element={<StoreDashboard />} />
                        <Route path='add-product' element={<AddProduct />} />
                        <Route
                            path='manage-products'
                            element={<ManageProducts />}
                        />
                    </Route>
                </Route>
            </Route>
        </>,
    ),
);

export default router;
