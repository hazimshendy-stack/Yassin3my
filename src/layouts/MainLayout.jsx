import { Outlet } from 'react-router-dom';
import { TopBar } from './TopBar.jsx';
import { Sidebar } from './Sidebar.jsx';

export function MainLayout() {
  return (
    <div className="app">
      <TopBar />
      <div className="app__body">
        <Sidebar />
        <main id="main-content" className="app__main" role="main">
          <div className="container">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
export default MainLayout;
