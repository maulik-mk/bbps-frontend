import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './layout/layout';

// Pages
import Dashboard from './pages/(main)/page';
import Crud from './pages/(main)/pages/crud/page';

import AccessDenied from './pages/(full-page)/auth/access/page';
import AuthError from './pages/(full-page)/auth/error/page';
import Login from './pages/(full-page)/auth/login/page';
import NotFound from './pages/(full-page)/pages/notfound/page';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Full Page Routes */}
        <Route path="/auth/access" element={<AccessDenied />} />
        <Route path="/auth/error" element={<AuthError />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/pages/notfound" element={<NotFound />} />
        
        {/* Main Routes with Layout */}
        <Route path="/" element={<Layout><Dashboard /></Layout>} />
        <Route path="/pages/crud" element={<Layout><Crud /></Layout>} />
        
        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
