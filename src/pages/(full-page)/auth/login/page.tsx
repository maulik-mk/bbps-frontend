'use client';
import { useNavigate } from 'react-router-dom';
import React, { useContext, useState, useEffect } from 'react';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { LayoutContext } from '../../../../layout/context/layoutcontext';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { useAuth } from '../../../../context/AuthContext';
import { authService } from '../../../../services/auth.service';

const LoginPage = () => {
    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const [checked, setChecked] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { layoutConfig } = useContext(LayoutContext);
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

    const handleLogin = async () => {
        if (!mobile || !password) {
            setError('Please enter mobile number and password');
            return;
        }

        setError('');
        setLoading(true);

        try {
            const response = await authService.login({ mobile, password });
            login(response.data.token, response.data.user);
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-nogutter min-h-screen surface-0 overflow-hidden">
            <div className="col-12 lg:col-5 flex flex-column">
                <div className="p-5 md:px-7"></div>
                <div className="flex-1 flex align-items-center justify-content-center px-5 md:px-7 pb-8">
                    <div className="w-full" style={{ maxWidth: '420px' }}>
                        <div className="text-center mb-5">
                            <img src="/logo/Nexasoft.png" alt="Nexasoft Logo" style={{ height: '5rem', objectFit: 'contain' }} />
                        </div>
                        <div className="mb-5">
                            <h1 className="text-900 text-3xl font-bold font-italic mb-2 uppercase">Welcome Back</h1>
                            <p className="text-500 font-medium m-0 line-height-3">Sign in to your account to manage your transactions, onboarding, and disputes securely.</p>
                        </div>

                        {error && <div className="p-3 mb-4 text-red-700 bg-red-100 border-round font-medium text-sm">{error}</div>}

                        <div className="field mb-4">
                            <label htmlFor="mobile" className="block text-900 font-bold mb-2 text-sm">
                                Mobile Number
                            </label>
                            <InputText
                                id="mobile"
                                type="text"
                                placeholder="+91 9876543210"
                                className="w-full p-3 border-round-lg border-300 shadow-none hover:border-blue-400 focus:border-blue-500 transition-colors"
                                value={mobile}
                                onChange={(e) => setMobile(e.target.value)}
                            />
                        </div>

                        <div className="field mb-4">
                            <div className="flex justify-content-between align-items-center mb-2">
                                <label htmlFor="password" className="block text-900 font-bold m-0 text-sm">
                                    Password
                                </label>
                            </div>
                            <Password
                                inputId="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                toggleMask
                                className="w-full"
                                inputClassName="w-full p-3 border-round-lg border-300 shadow-none hover:border-blue-400 focus:border-blue-500 transition-colors"
                                feedback={false}
                            ></Password>
                        </div>

                        <div className="flex align-items-center justify-content-between mb-5 mt-2">
                            <div className="flex align-items-center">
                                <Checkbox inputId="rememberme" checked={checked} onChange={(e) => setChecked(e.checked ?? false)} className="mr-2"></Checkbox>
                                <label htmlFor="rememberme" className="text-600 text-sm ml-2">
                                    Remember me
                                </label>
                            </div>
                            <a className="font-medium no-underline text-blue-500 cursor-pointer text-sm transition-colors hover:text-blue-700">Forgot password?</a>
                        </div>

                        <div className="flex flex-column sm:flex-row align-items-center justify-content-between gap-4 mt-2">
                            <Button
                                label={loading ? 'Signing in...' : 'Sign in'}
                                className="w-full sm:w-auto px-5 py-3 text-md font-bold border-round-lg bg-blue-600 border-blue-600 hover:bg-blue-700 transition-colors shadow-none"
                                onClick={handleLogin}
                                disabled={loading || !mobile || !password}
                            ></Button>
                        </div>

                        <div className="mt-6 text-500 text-sm line-height-3">
                            By proceeding, you confirm that you've read, understood, and agree to our <a className="text-blue-500 cursor-pointer">Terms & Conditions</a>.
                        </div>

                        <div className="mt-8 pt-6">
                            <Button label="Go to homepage" icon="pi pi-home" onClick={() => navigate('/')} className="p-button-secondary p-button-text text-600 p-2 bg-gray-100 border-round-md text-sm font-bold" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="hidden lg:flex lg:col-7 bg-blue-50 relative align-items-center justify-content-center p-8 border-left-1 border-300">
                <div className="absolute top-0 left-0 w-full h-full bg-cover bg-center" style={{ backgroundImage: 'url(/layout/images/auth-bg.jpg)', opacity: 0.9 }}></div>

                <div className="absolute bottom-0 left-0 m-6 p-4 bg-white border-round-xl shadow-4 flex flex-column z-1" style={{ width: '300px' }}>
                    <div className="flex align-items-center mb-2">
                        <i className="pi pi-star-fill text-green-500 text-xl mr-2"></i>
                        <span className="font-bold text-900 text-lg">Verified Platform</span>
                    </div>
                    <div className="flex gap-1 mb-2">
                        <div className="bg-green-500 text-white p-1 border-round-sm">
                            <i className="pi pi-star-fill text-xs"></i>
                        </div>
                        <div className="bg-green-500 text-white p-1 border-round-sm">
                            <i className="pi pi-star-fill text-xs"></i>
                        </div>
                        <div className="bg-green-500 text-white p-1 border-round-sm">
                            <i className="pi pi-star-fill text-xs"></i>
                        </div>
                        <div className="bg-green-500 text-white p-1 border-round-sm">
                            <i className="pi pi-star-fill text-xs"></i>
                        </div>
                        <div className="bg-green-500 text-white p-1 border-round-sm">
                            <i className="pi pi-star-fill text-xs"></i>
                        </div>
                    </div>
                    <div className="text-sm font-bold text-900 mb-1">Platform Rating 4.9</div>
                    <div className="text-xs text-600 font-medium">Reviews 1M+ • Excellent</div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
