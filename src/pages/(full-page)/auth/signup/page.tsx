'use client';
import { useNavigate, Link } from "react-router-dom";
import React, { useContext, useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { LayoutContext } from '../../../../layout/context/layoutcontext';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { useAuth } from '../../../../context/AuthContext';
import { authService } from '../../../../services/auth.service';

const SignupPage = () => {
    const [mobile, setMobile] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const { layoutConfig } = useContext(LayoutContext);
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

    const handleSignup = async () => {
        if (!mobile || !password) {
            setError('Please enter mobile number and password');
            return;
        }
        
        setError('');
        setLoading(true);
        
        try {
            await authService.signup({ mobile, email, password });
            setSuccess(true);
            setTimeout(() => navigate('/login'), 2000);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Registration failed. Please try again.');
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
                            <i className="pi pi-user-plus text-6xl text-primary mb-3"></i>
                            <div className="text-900 text-3xl font-medium mb-3">Create Admin Account</div>
                            <span className="text-600 font-medium">Register the root user</span>
                        </div>

                        <div>
                            {error && <div className="p-3 mb-4 text-red-700 bg-red-100 border-round">{error}</div>}
                            {success && <div className="p-3 mb-4 text-green-700 bg-green-100 border-round">Registration successful! Redirecting to login...</div>}
                        
                            <label htmlFor="mobile" className="block text-900 text-xl font-medium mb-2">
                                Mobile Number
                            </label>
                            <InputText 
                                id="mobile" 
                                type="text" 
                                placeholder="Enter mobile number" 
                                className="w-full md:w-30rem mb-5" 
                                style={{ padding: '1rem' }} 
                                value={mobile}
                                onChange={(e) => setMobile(e.target.value)}
                            />
                            
                            <label htmlFor="email" className="block text-900 text-xl font-medium mb-2">
                                Email (Optional)
                            </label>
                            <InputText 
                                id="email" 
                                type="email" 
                                placeholder="Enter email address" 
                                className="w-full md:w-30rem mb-5" 
                                style={{ padding: '1rem' }} 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />

                            <label htmlFor="password" className="block text-900 font-medium text-xl mb-2">
                                Password
                            </label>
                            <Password 
                                inputId="password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                placeholder="Create password" 
                                toggleMask 
                                className="w-full mb-5" 
                                inputClassName="w-full p-3 md:w-30rem"
                                feedback={true}
                            ></Password>

                            <Button 
                                label={loading ? "Registering..." : "Register"} 
                                className="w-full p-3 text-xl mt-3" 
                                onClick={handleSignup}
                                disabled={loading || success}
                            ></Button>
                            
                            <div className="text-center mt-5">
                                <span className="text-600 font-medium">Already have an account? </span>
                                <Link to="/login" className="font-medium no-underline ml-1 text-primary cursor-pointer">
                                    Sign In
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
