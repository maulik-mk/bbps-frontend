import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
    return (
        <div className="flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden bg-blue-50">
            <div className="flex flex-column align-items-center justify-content-center w-full max-w-30rem px-4">
                <div className="surface-card p-5 sm:p-6 shadow-4 border-round-2xl w-full text-center">
                    <span className="text-blue-500 font-bold text-7xl mb-2 block">404</span>
                    <h1 className="text-900 font-bold text-3xl mb-3">Page Not Found</h1>
                    <div className="text-600 mb-5 font-medium">The page you are looking for doesn't exist or has been moved.</div>

                    <div className="flex flex-column gap-3 text-left">
                        <Link to="/" className="w-full flex align-items-center p-3 border-round-xl hover:surface-100 transition-colors no-underline text-900 border-1 border-200 hover:border-300">
                            <span className="flex justify-content-center align-items-center bg-blue-100 text-blue-600 border-round-lg" style={{ height: '3rem', width: '3rem', minWidth: '3rem' }}>
                                <i className="pi pi-home text-xl"></i>
                            </span>
                            <span className="ml-3 flex flex-column">
                                <span className="font-bold mb-1">Return to Dashboard</span>
                                <span className="text-500 text-sm">Go back to the main overview page</span>
                            </span>
                        </Link>

                        <Link to="/transactions" className="w-full flex align-items-center p-3 border-round-xl hover:surface-100 transition-colors no-underline text-900 border-1 border-200 hover:border-300">
                            <span className="flex justify-content-center align-items-center bg-green-100 text-green-600 border-round-lg" style={{ height: '3rem', width: '3rem', minWidth: '3rem' }}>
                                <i className="pi pi-list text-xl"></i>
                            </span>
                            <span className="ml-3 flex flex-column">
                                <span className="font-bold mb-1">View Transactions</span>
                                <span className="text-500 text-sm">Check your recent Bharat Connect history</span>
                            </span>
                        </Link>

                        <Link to="/bbps/complaint/track" className="w-full flex align-items-center p-3 border-round-xl hover:surface-100 transition-colors no-underline text-900 border-1 border-200 hover:border-300">
                            <span className="flex justify-content-center align-items-center bg-orange-100 text-orange-600 border-round-lg" style={{ height: '3rem', width: '3rem', minWidth: '3rem' }}>
                                <i className="pi pi-ticket text-xl"></i>
                            </span>
                            <span className="ml-3 flex flex-column">
                                <span className="font-bold mb-1">Track a Complaint</span>
                                <span className="text-500 text-sm">Check the status of a pending issue</span>
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;
