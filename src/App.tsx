import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './layout/layout';

// Pages
import Dashboard from './pages/(main)/page';
import Blocks from './pages/(main)/blocks/page';
import Documentation from './pages/(main)/documentation/page';
import FloatLabel from './pages/(main)/uikit/floatlabel/page';
import Misc from './pages/(main)/uikit/misc/page';
import Tree from './pages/(main)/uikit/tree/page';
import Panel from './pages/(main)/uikit/panel/page';
import File from './pages/(main)/uikit/file/page';
import Input from './pages/(main)/uikit/input/page';
import Charts from './pages/(main)/uikit/charts/page';
import Message from './pages/(main)/uikit/message/page';
import FormLayout from './pages/(main)/uikit/formlayout/page';
import Button from './pages/(main)/uikit/button/page';
import Table from './pages/(main)/uikit/table/page';
import List from './pages/(main)/uikit/list/page';
import Menu from './pages/(main)/uikit/menu/page';
import MenuPayment from './pages/(main)/uikit/menu/payment/page';
import MenuConfirmation from './pages/(main)/uikit/menu/confirmation/page';
import MenuSeat from './pages/(main)/uikit/menu/seat/page';
import Overlay from './pages/(main)/uikit/overlay/page';
import InvalidState from './pages/(main)/uikit/invalidstate/page';
import Media from './pages/(main)/uikit/media/page';
import Icons from './pages/(main)/utilities/icons/page';
import EmptyPage from './pages/(main)/pages/empty/page';
import Crud from './pages/(main)/pages/crud/page';
import Timeline from './pages/(main)/pages/timeline/page';

import Landing from './pages/(full-page)/landing/page';
import AccessDenied from './pages/(full-page)/auth/access/page';
import AuthError from './pages/(full-page)/auth/error/page';
import Login from './pages/(full-page)/auth/login/page';
import NotFound from './pages/(full-page)/pages/notfound/page';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Full Page Routes */}
        <Route path="/landing" element={<Landing />} />
        <Route path="/auth/access" element={<AccessDenied />} />
        <Route path="/auth/error" element={<AuthError />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/pages/notfound" element={<NotFound />} />
        
        {/* Main Routes with Layout */}
        <Route path="/" element={<Layout><Dashboard /></Layout>} />
        <Route path="/blocks" element={<Layout><Blocks /></Layout>} />
        <Route path="/documentation" element={<Layout><Documentation /></Layout>} />
        <Route path="/uikit/floatlabel" element={<Layout><FloatLabel /></Layout>} />
        <Route path="/uikit/misc" element={<Layout><Misc /></Layout>} />
        <Route path="/uikit/tree" element={<Layout><Tree /></Layout>} />
        <Route path="/uikit/panel" element={<Layout><Panel /></Layout>} />
        <Route path="/uikit/file" element={<Layout><File /></Layout>} />
        <Route path="/uikit/input" element={<Layout><Input /></Layout>} />
        <Route path="/uikit/charts" element={<Layout><Charts /></Layout>} />
        <Route path="/uikit/message" element={<Layout><Message /></Layout>} />
        <Route path="/uikit/formlayout" element={<Layout><FormLayout /></Layout>} />
        <Route path="/uikit/button" element={<Layout><Button /></Layout>} />
        <Route path="/uikit/table" element={<Layout><Table /></Layout>} />
        <Route path="/uikit/list" element={<Layout><List /></Layout>} />
        <Route path="/uikit/menu" element={<Layout><Menu /></Layout>} />
        <Route path="/uikit/menu/payment" element={<Layout><MenuPayment /></Layout>} />
        <Route path="/uikit/menu/confirmation" element={<Layout><MenuConfirmation /></Layout>} />
        <Route path="/uikit/menu/seat" element={<Layout><MenuSeat /></Layout>} />
        <Route path="/uikit/overlay" element={<Layout><Overlay /></Layout>} />
        <Route path="/uikit/invalidstate" element={<Layout><InvalidState /></Layout>} />
        <Route path="/uikit/media" element={<Layout><Media /></Layout>} />
        <Route path="/utilities/icons" element={<Layout><Icons /></Layout>} />
        <Route path="/pages/empty" element={<Layout><EmptyPage /></Layout>} />
        <Route path="/pages/crud" element={<Layout><Crud /></Layout>} />
        <Route path="/pages/timeline" element={<Layout><Timeline /></Layout>} />
        
        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
