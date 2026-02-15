import { ShoppingCart, Search, Heart, Menu, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import Button from "../ui/Button";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const navItems = [
        { name: "Home", path: "/" },
        { name: "Shop", path: "/shop" },
        { name: "About", path: "/about" },
        { name: "Contact", path: "/contact" },
    ];

    return (
        <>
            <nav className='fixed top-0 z-50 w-full bg-white backdrop-blur-md border-b border-zinc-100'>
                <div className='mx-auto max-w-7xl px-4 sm:px-6'>
                    <div className='flex h-16 items-center justify-between'>
                        {/* Logo */}
                        <h1 className='text-2xl font-bold tracking-tight'>
                            <span className='text-emerald-600'>Shop</span>
                            <span className='text-gray-900'>cart.</span>
                        </h1>

                        {/* Desktop Nav */}
                        <ul className='hidden md:flex items-center gap-8 text-sm text-gray-600'>
                            {navItems.map((item) => (
                                <li key={item.name}>
                                    <NavLink
                                        to={item.path}
                                        className={({ isActive }) =>
                                            `transition hover:text-black ${
                                                isActive
                                                    ? "text-black font-medium"
                                                    : ""
                                            }`
                                        }
                                    >
                                        {item.name}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>

                        {/* Right Section */}
                        <div className='flex items-center gap-5'>
                            <div className='hidden md:flex items-center gap-2 rounded-full border border-zinc-200 bg-gray-50 px-4 py-2 text-sm focus-within:ring-1 focus-within:ring-zinc-500'>
                                <Search size={16} className='text-gray-400' />
                                <input
                                    type='text'
                                    placeholder='Search products...'
                                    className='w-40 bg-transparent outline-none placeholder:text-gray-400'
                                />
                            </div>

                            <button className='relative text-gray-600 hover:text-black transition'>
                                <Heart size={20} />
                            </button>

                            <button className='relative text-gray-600 hover:text-black transition'>
                                <ShoppingCart size={20} />
                                <span className='absolute -top-2 -right-2 h-4 w-4 rounded-full bg-black text-[10px] text-white flex items-center justify-center'>
                                    2
                                </span>
                            </button>

                            <Button
                                variant='primary'
                                size='sm'
                                className='hidden md:inline'
                            >
                                Login
                            </Button>

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className='md:hidden text-gray-700'
                            >
                                {isOpen ? <X size={22} /> : <Menu size={22} />}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Drawer */}
            {isOpen && (
                <div className='fixed inset-0 z-40 bg-white pt-20 px-6 md:hidden'>
                    <ul className='flex flex-col gap-6 text-lg font-medium text-zinc-800'>
                        {navItems.map((item) => (
                            <li key={item.name}>
                                <NavLink
                                    to={item.path}
                                    onClick={() => setIsOpen(false)}
                                >
                                    {item.name}
                                </NavLink>
                            </li>
                        ))}
                        <li className='pt-6 border-t'>
                            <Button
                                variant='primary'
                                size='lg'
                                className='hidden md:inline'
                            >
                                Login
                            </Button>
                        </li>
                    </ul>
                </div>
            )}
        </>
    );
};

export default Navbar;
