import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumbs = () => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);

    return (
        <nav className="flex px-0 py-1 text-gray-400 text-[10px] font-bold uppercase tracking-wider" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1">
                <li className="inline-flex items-center">
                    <Link
                        to="/dashboard"
                        className="inline-flex items-center hover:text-pink-600 transition-colors duration-200"
                    >
                        Home
                    </Link>
                </li>
                {pathnames.map((value, index) => {
                    const last = index === pathnames.length - 1;
                    const to = `/${pathnames.slice(0, index + 1).join('/')}`;

                    // Custom labels based on path chunks
                    let label = value
                        .split('-')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ');

                    if (value === 'roadmap') label = 'Roadmap';
                    if (value === 'overview') label = 'Path';
                    if (value === 'phase') return null; // Skip "phase" chunk for cleaner breadcrumbs

                    return (
                        <li key={to} className="flex items-center">
                            <span className="mx-1 text-gray-300">/</span>
                            {last ? (
                                <span className="text-gray-900 font-black">
                                    {label}
                                </span>
                            ) : (
                                <Link
                                    to={to === '/roadmap' ? '/roadmap/overview' : to}
                                    className="hover:text-pink-600 transition-colors duration-200"
                                >
                                    {label}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};

export default Breadcrumbs;
