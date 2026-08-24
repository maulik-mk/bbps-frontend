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
        <div className={containerClassName}>
            <div className="flex flex-column align-items-center justify-content-center">
                <div
                    style={{
                        borderRadius: '56px',
                        padding: '0.3rem',
                        background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)'
                    }}
                >
                    <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                        <div className="text-center mb-5">
                            <i className="pi pi-user text-6xl text-primary mb-3"></i>
                            <div className="text-900 text-3xl font-medium mb-3">Welcome Back!</div>
                            <span className="text-600 font-medium">Sign in to your account</span>
                        </div>

                        <div>
                            {error && <div className="p-3 mb-4 text-red-700 bg-red-100 border-round">{error}</div>}

                            <label htmlFor="mobile" className="block text-900 text-xl font-medium mb-2">
                                Mobile Number
                            </label>
                            <InputText id="mobile" type="text" placeholder="Enter mobile number" className="w-full md:w-30rem mb-5" style={{ padding: '1rem' }} value={mobile} onChange={(e) => setMobile(e.target.value)} />

                            <label htmlFor="password" className="block text-900 font-medium text-xl mb-2">
                                Password
                            </label>
                            <Password
                                inputId="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter password"
                                toggleMask
                                className="w-full mb-5"
                                inputClassName="w-full p-3 md:w-30rem"
                                feedback={false}
                            ></Password>

                            <div className="flex align-items-center justify-content-between mb-5 gap-5">
                                <div className="flex align-items-center">
                                    <Checkbox inputId="rememberme" checked={checked} onChange={(e) => setChecked(e.checked ?? false)} className="mr-2"></Checkbox>
                                    <label htmlFor="rememberme">Remember me</label>
                                </div>
                            </div>
                            <Button label={loading ? 'Signing in...' : 'Sign In'} className="w-full p-3 text-xl" onClick={handleLogin} disabled={loading}></Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
