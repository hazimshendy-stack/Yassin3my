import { Outlet } from 'react-router-dom';
import { TopBar } from './TopBar.jsx';
import { Sidebar } from './Sidebar.jsx';
import { ErrorBoundary } from '../components/ErrorBoundary.jsx';
import './MainLayout.module.css';

export function MainLayout() {
  return (
    <div className="layout">
      <TopBar />
      <div className="layout__body">
        <Sidebar />
        <main id="main-content" className="layout__main" role="main">
          <div className="layout__container">
            <ErrorBoundary>
              <Outlet />
            </ErrorBoundary>
          </div>
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
