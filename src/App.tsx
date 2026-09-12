import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './layout/layout';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import Dashboard from './pages/(main)/page';
import MasterDistributorPage from './pages/(main)/users/master-distributor/page';
import DistributorPage from './pages/(main)/users/distributor/page';
import RetailerPage from './pages/(main)/users/retailer/page';

import Login from './pages/(full-page)/auth/login/page';
import NotFound from './pages/(full-page)/pages/notfound/page';
import Categories from './pages/(main)/bbps/page';
import CategorySelection from './pages/(main)/bbps/category/page';
import BillSummary from './pages/(main)/bbps/bills/page';
import Transactions from './pages/(main)/transactions/page';
import Receipt from './pages/(main)/bbps/receipt/page';
import SchemesPage from './pages/(main)/schemes/page';
import SchemeChargesPage from './pages/(main)/schemes/charges/page';

import ComplaintRegistration from './pages/(main)/bbps/complaint/registration';
import TrackComplaint from './pages/(main)/bbps/complaint/track';
import TransactionSearch from './pages/(main)/bbps/Search';
import BBPSTransactions from './pages/(main)/bbps/transactions/page';
import LedgerPage from './pages/(main)/reports/ledger/page';
import CommissionsPage from './pages/(main)/reports/commissions/page';

// Settings Pages
import ProfileSettings from './pages/(main)/settings/profile/page';
import SecuritySettings from './pages/(main)/settings/security/page';
import KycSettings from './pages/(main)/settings/kyc/page';
import BankSettings from './pages/(main)/settings/banking/page';

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    {/* Full Page Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/pages/notfound" element={<NotFound />} />

                    {/* Main Routes with Layout (Protected) */}
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <Layout>
                                    <Dashboard />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/users/master-distributor"
                        element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <Layout>
                                    <MasterDistributorPage />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/users/distributor"
                        element={
                            <ProtectedRoute allowedRoles={['admin', 'master_distributor']}>
                                <Layout>
                                    <DistributorPage />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/users/retailer"
                        element={
                            <ProtectedRoute allowedRoles={['admin', 'master_distributor', 'distributor']}>
                                <Layout>
                                    <RetailerPage />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/master/schemes"
                        element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <Layout>
                                    <SchemesPage />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/master/schemes/:id/charges"
                        element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <Layout>
                                    <SchemeChargesPage />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/bbps/categories"
                        element={
                            <ProtectedRoute allowedRoles={['retailer']}>
                                <Layout>
                                    <Categories />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/bbps/category/:service"
                        element={
                            <ProtectedRoute allowedRoles={['retailer']}>
                                <Layout>
                                    <CategorySelection />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/bbps/bill/:billerId"
                        element={
                            <ProtectedRoute allowedRoles={['retailer']}>
                                <Layout>
                                    <BillSummary />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/transactions"
                        element={
                            <ProtectedRoute allowedRoles={['admin', 'retailer']}>
                                <Layout>
                                    <Transactions />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/bbps/transactions"
                        element={
                            <ProtectedRoute allowedRoles={['admin', 'retailer']}>
                                <Layout>
                                    <BBPSTransactions />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/bbps/complaint/registration"
                        element={
                            <ProtectedRoute allowedRoles={['retailer']}>
                                <Layout>
                                    <ComplaintRegistration />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/bbps/complaint/track"
                        element={
                            <ProtectedRoute allowedRoles={['retailer']}>
                                <Layout>
                                    <TrackComplaint />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/bbps/transactions/search"
                        element={
                            <ProtectedRoute allowedRoles={['retailer']}>
                                <Layout>
                                    <TransactionSearch />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/bbps/transactions/receipt/:id"
                        element={
                            <ProtectedRoute allowedRoles={['admin', 'retailer']}>
                                <Layout>
                                    <Receipt />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />

                    {/* Settings Routes */}
                    <Route
                        path="/settings"
                        element={
                            <ProtectedRoute>
                                <Layout>
                                    <ProfileSettings />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/settings/profile"
                        element={
                            <ProtectedRoute>
                                <Layout>
                                    <ProfileSettings />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/settings/security"
                        element={
                            <ProtectedRoute>
                                <Layout>
                                    <SecuritySettings />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/settings/kyc"
                        element={
                            <ProtectedRoute>
                                <Layout>
                                    <KycSettings />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/settings/banking"
                        element={
                            <ProtectedRoute>
                                <Layout>
                                    <BankSettings />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/reports/ledger"
                        element={
                            <ProtectedRoute>
                                <Layout>
                                    <LedgerPage />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/reports/commissions"
                        element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <Layout>
                                    <CommissionsPage />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />

                    {/* Catch-all */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}
