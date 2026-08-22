import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { LayoutProvider } from './layout/context/layoutcontext';
import { PrimeReactProvider } from 'primereact/api';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import '../styles/layout/layout.scss';
import '../styles/demo/Demos.scss';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <PrimeReactProvider>
      <LayoutProvider>
        <App />
      </LayoutProvider>
    </PrimeReactProvider>
  </React.StrictMode>
);
