import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './layout/layout';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import Dashboard from './pages/(main)/page';

import AccessDenied from './pages/(full-page)/auth/access/page';
import AuthError from './pages/(full-page)/auth/error/page';
import Login from './pages/(full-page)/auth/login/page';
import Signup from './pages/(full-page)/auth/signup/page';
import NotFound from './pages/(full-page)/pages/notfound/page';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Full Page Routes */}
          <Route path="/auth/access" element={<AccessDenied />} />
          <Route path="/auth/error" element={<AuthError />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/pages/notfound" element={<NotFound />} />
          
          {/* Main Routes with Layout (Protected) */}
          <Route path="/" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
          
          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
