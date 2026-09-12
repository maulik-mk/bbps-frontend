import { Link } from 'react-router-dom';
import AppMenu from './AppMenu';

const AppSidebar = () => {
    return (
        <div className="flex flex-column h-full">
            <div className="flex align-items-center justify-content-center">
                <Link to="/" className="flex align-items-center cursor-pointer mb-2">
                    <img src="/logo/Nexasoft.png" alt="Nexasoft Logo" style={{ height: '3.5rem', objectFit: 'contain' }} />
                </Link>
            </div>
            <AppMenu />
        </div>
    );
};

export default AppSidebar;
