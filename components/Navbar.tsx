"use client"
import { useState } from "react";
import Link from "next/link";
import { HiMenu, HiX, HiShoppingCart } from "react-icons/hi";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/store/useCartStore";

export default function Navbar() {
    const {products} = useCartStore()
    const {data:session,status} = useSession()
    const [menuOpen, setMenuOpen] = useState(false);
    const pathname = usePathname() || "/";

    const navLinks = [
        { href: "/", label: "Home" },
        { href: "/products", label: "Products" },
        { href: "/service", label: "Service" },
        { href: "/about", label: "About" },
    ];
    const isActiveCart = pathname === "/cart" || pathname.startsWith("/cart");

    return (
        <div>
            <nav className="flex items-center justify-between p-5 gap-5 xl:max-w-7xl mx-auto relative">
                <h1>
                    <Link href="/" className="text-xl lg:text-3xl tracking-wider font-semibold">
                        <span className="text-orange-500">S</span>hathe<span className="text-orange-500">A</span>chi
                    </Link>
                </h1>

                <button
                    type="button"
                    className="lg:hidden text-2xl"
                    aria-label="Toggle menu"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    {menuOpen ? <HiX /> : <HiMenu />}
                </button>

                <ul className={`lg:flex lg:items-center lg:gap-8 gap-4 ${menuOpen ? "flex flex-col absolute top-full left-0 w-full bg-white p-4 shadow-md" : "hidden"} lg:static lg:w-auto lg:bg-transparent lg:p-0 lg:shadow-none`}>
                    {navLinks.map((link) => {
                        const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
                        return (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    className={`block py-2 lg:py-0 ${isActive ? "text-orange-500 font-semibold" : "text-gray-700"}`}
                                    onClick={() => setMenuOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            </li>
                        );
                    })}
                    {/* Cart button */}
                    <li>
                        <Link href="/cart" className={`flex items-center gap-2 py-2 lg:py-0 ${isActiveCart ? "text-orange-500 font-semibold" : "text-gray-700"}`} onClick={() => setMenuOpen(false)}>
                            <HiShoppingCart className="text-xl" />
                            <span className="hidden sm:inline">Cart <sup>{products.length}</sup></span>
                        </Link>
                    </li>
                    {session ? (
                        <li>
                            <Link href="/admin" className="block py-2 lg:py-0 text-orange-500">
                                Admin
                            </Link>
                        </li>
                    ) : null}
                </ul>
            </nav>
        </div>
    );
}
