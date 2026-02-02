"use client";

import React, { useState } from 'react';
import Header from "@/components/shared/Headers/Header";
import { useAuth } from "@/contexts/VisitorAuthContext";
import LoaderHelix from "@/components/shared/Loaders/LoaderHelix";
import Footer from "@/components/shared/Footer";
import { useQuery, useMutation } from '@apollo/client';
import { GET_VISITOR_PAYMENTS } from '@/graphql/queries';
import { SYNC_COMPLETED_PAYMENTS_TO_MY_VENDORS } from '@/graphql/mutations';
import BottomNavigationBar from '@/components/visitor-dashboard/BottomNavigationBar';
import Breadcrumbs from "@/components/Breadcrumbs";
import toast from 'react-hot-toast';

interface Payment {
    id: string;
    amount: number;
    status: 'completed' | 'pending' | 'failed';
    createdAt: string;
    package: {
        name: string;
        offering: {
            id: string;
            name: string;
        };
    };
}

const PaymentsHistoryPage = () => {
    const { visitor } = useAuth();
    const [isSyncing, setIsSyncing] = useState(false);
    
    const { data, loading, error } = useQuery(GET_VISITOR_PAYMENTS, {
        variables: { visitorId: visitor?.id },
        skip: !visitor?.id,
    });

    const [syncPayments] = useMutation(SYNC_COMPLETED_PAYMENTS_TO_MY_VENDORS);

    const handleSyncToMyVendors = async () => {
        setIsSyncing(true);
        try {
            const result = await syncPayments();
            toast.success(result.data.syncCompletedPaymentsToMyVendors || 'Vendors synced successfully!');
        } catch (err: any) {
            const errorMessage = err?.message || err?.graphQLErrors?.[0]?.message || 'Failed to sync vendors';
            toast.error(errorMessage);
            console.error('Sync error:', err);
        } finally {
            setIsSyncing(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'failed':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) return <LoaderHelix />;

    if (error) {
        return (
            <div className="bg-lightYellow min-h-screen">
                <Header />
                <div className="container mx-auto px-4 py-6">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        Error loading payments: {error.message}
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    const payments = data?.visitorPayments || [];

    return (
        <div className="py-4 px-2 md:py-6 md:px-4">
            {/* Hide breadcrumbs on mobile */}
            <div className="hidden md:block shadow-md bg-white p-4 rounded-lg mb-4 md:mb-6">
                <Breadcrumbs
                    items={[
                        { label: "Dashboard", href: "/visitor-dashboard" },
                        { label: "Payments History", href: "/visitor-dashboard/payments-history" },
                    ]}
                />
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-4xl md:text-3xl font-bold text-black font-title my-3">
                            Payments History
                        </h1>
                        <p className="font-body text-xl text-black">Track all your wedding service payments.</p>
                    </div>
                    <button
                        onClick={handleSyncToMyVendors}
                        disabled={isSyncing}
                        className="bg-orange text-white px-4 py-2 rounded-lg hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                        {isSyncing ? 'Syncing...' : 'Sync to My Vendors'}
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="mt-6 md:mt-12">
                {payments.length > 0 ? (
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <table className="min-w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Service
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Package
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Amount
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {payments.map((payment: Payment) => (
                                    <tr key={payment.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {payment.package.offering.name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {payment.package.name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {payment.amount.toFixed(2)} LKR
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {new Date(payment.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                                                {payment.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow p-6 text-center">
                        <p className="text-gray-500 text-lg">No payment history found</p>
                    </div>
                )}
            </div>
            <BottomNavigationBar />
           
        </div>
    );
};

export default PaymentsHistoryPage;