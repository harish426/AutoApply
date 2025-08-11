'use client';

import { useRouter } from 'next/navigation';
import { handleLogout } from '../lib/auth';
import { useUserStore } from '../store/userStore';
import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Header() {
    const router = useRouter();
    const pathname = usePathname();

    const { user, clearUser } = useUserStore();
    const [menuOpen, setMenuOpen] = useState(false);

    const logout = async () => {
        await handleLogout();
        clearUser();
        router.push('/login');
    };

    return (
        <header className="sticky top-0 z-50 w-full bg-gray-100 shadow-md">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                {/* Left: App Name */}
                <div className="text-xl font-bold text-blue-600">
                    <Link href="/">Autoapply</Link>
                </div>

                {/* Mobile menu icon */}
                <div className="lg:hidden">
                    <button onClick={() => setMenuOpen(!menuOpen)}>
                        {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Right: Nav + Profile */}
                <div className="hidden lg:flex items-center space-x-6">
                    <Link
                        href="/"
                        className={`relative font-medium px-2 py-1 transition-all duration-300 ease-in-out
    ${pathname === '/' ? 'text-blue-600 underline' : 'text-gray-800 hover:text-blue-600'}`}
                    >
                        Dashboard
                    </Link>

                    <Link
                        href="/profile"
                        className={`relative font-medium px-2 py-1 transition-all duration-300 ease-in-out
    ${pathname === '/profile' ? 'text-blue-600 underline' : 'text-gray-800 hover:text-blue-600'}`}
                    >
                        Profile
                    </Link>


                    {user && (
                        <div className="flex items-center space-x-4">
                            <img
                                src={user.photoURL}
                                alt="user"
                                className="w-10 h-10 rounded-full border"
                            />
                            <button
                                onClick={logout}
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile dropdown */}
            {menuOpen && (
                <div className="lg:hidden px-6 pb-4 space-y-2">
                    <Link
                        href="/"
                        onClick={() => setMenuOpen(false)}
                        className={`block font-medium ${pathname === '/' ? 'text-blue-600 underline' : 'text-gray-800 hover:text-blue-600'}`}
                    >
                        Dashboard
                    </Link>

                    <Link
                        href="/profile"
                        onClick={() => setMenuOpen(false)}
                        className={`block font-medium ${pathname === '/profile' ? 'text-blue-600 underline' : 'text-gray-800 hover:text-blue-600'}`}
                    >
                        Profile
                    </Link>

                    {user && (
                        <div className="mt-2 flex items-center space-x-4">
                            <img
                                src={user.photoURL}
                                alt="user"
                                className="w-10 h-10 rounded-full border"
                            />
                            <button
                                onClick={() => {
                                    logout();
                                    setMenuOpen(false);
                                }}
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            )}
        </header>
    );
}
