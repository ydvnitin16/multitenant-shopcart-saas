import { Facebook, Instagram, Twitter, Github } from "lucide-react";
import { Link } from "react-router-dom";

const footerProducts = [
    { label: "Earphones", path: "/category/earphones" },
    { label: "Headphones", path: "/category/headphones" },
    { label: "Smartphones", path: "/category/smartphones" },
    { label: "Laptops", path: "/category/laptops" },
];

const footerWebsite = [
    { label: "Home", path: "/" },
    { label: "Privacy Policy", path: "/privacy-policy" },
    { label: "Become Plus Member", path: "/membership" },
    { label: "Create Your Store", path: "/request-store" },
];

const footerContacts = [
    {
        label: "+1-212-456-7890",
    },
    {
        label: "contact@example.com",
    },
    {
        label: "794 Francisco, 94102",
    },
];

const footerSocials = [
    {
        name: "Facebook",
        url: "https://facebook.com",
        icon: <Facebook size={20} />,
    },
    {
        name: "Instagram",
        url: "https://instagram.com",
        icon: <Instagram size={20} />,
    },
    {
        name: "Twitter",
        url: "https://twitter.com",
        icon: <Twitter size={20} />,
    },
    {
        name: "LinkedIn",
        url: "https://linkedin.com",
        icon: <Github size={20} />,
    },
];

const Footer = () => {
    return (
        <footer className='bg-white border-t border-zinc-200 mt-20'>
            <div className='max-w-6xl mx-auto px-6 py-16'>
                <div className='grid grid-cols-2 md:grid-cols-4 gap-10'>
                    <div>
                        <h2 className='text-xl font-semibold text-zinc-900'>
                            ShopCart
                        </h2>
                        <p className='text-sm text-zinc-500 mt-4 leading-relaxed'>
                            A modern multi-vendor marketplace connecting
                            customers with trusted brands worldwide.
                        </p>
                    </div>

                    <div>
                        <h3 className='text-sm font-semibold text-zinc-900 mb-4'>
                            SHOP
                        </h3>
                        <ul className='space-y-3 text-sm text-zinc-600'>
                            {footerProducts.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        to={link.path}
                                        className='hover:text-zinc-900 transition'
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className='text-sm font-semibold text-zinc-900 mb-4'>
                            WEBSITE
                        </h3>
                        <ul className='space-y-3 text-sm text-zinc-600'>
                            {footerWebsite.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        to={link.path}
                                        className='hover:text-zinc-900 transition'
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className='text-sm font-semibold text-zinc-900 mb-4'>
                            CONTACT
                        </h3>
                        <ul className='space-y-3 text-sm text-zinc-600'>
                            {footerContacts.map((link) => (
                                <li key={link.label}>{link.label}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className='border-t border-zinc-200 my-10' />

                <div className='flex flex-col md:flex-row items-center justify-between gap-6'>
                    <p className='text-sm text-zinc-500'>
                        © {new Date().getFullYear()} ShopCart. All rights
                        reserved.
                    </p>

                    <div className='flex items-center gap-4 text-zinc-500'>
                        {footerSocials.map((social) => (
                            <a
                                key={social.name}
                                href={social.url}
                                className='hover:text-zinc-900 transition'
                            >
                                {social.icon}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
