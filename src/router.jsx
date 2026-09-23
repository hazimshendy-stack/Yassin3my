import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import MainLayout from './layouts/MainLayout.jsx';
import AuthLayout from './layouts/AuthLayout.jsx';
import { useAuth } from './contexts/AuthContext.jsx';

const Dashboard = lazy(() => import('./pages/DashboardPage.jsx'));
const Courses = lazy(() => import('./pages/CoursesPage.jsx'));
const CourseDetail = lazy(() => import('./pages/CourseDetailPage.jsx'));
const Profile = lazy(() => import('./pages/ProfilePage.jsx'));
const Settings = lazy(() => import('./pages/SettingsPage.jsx'));
const Login = lazy(() => import('./pages/LoginPage.jsx'));
const Register = lazy(() => import('./pages/RegisterPage.jsx'));
const NotFound = lazy(() => import('./pages/NotFoundPage.jsx'));

function Loading() {
  return <div className="loading"><span className="spinner" /></div>;
}
function Guard({ children }) {
  const { user, ready } = useAuth();
  if (!ready) return <Loading />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
function Wrap({ children }) {
  return <Suspense fallback={<Loading />}>{children}</Suspense>;
}

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <Wrap><Login /></Wrap> },
      { path: 'register', element: <Wrap><Register /></Wrap> },
    ],
  },
  {
    element: <MainLayout />,
    children: [
      { index: true, element: <Wrap><Guard><Dashboard /></Guard></Wrap> },
      { path: 'courses', element: <Wrap><Guard><Courses /></Guard></Wrap> },
      { path: 'courses/:id', element: <Wrap><Guard><CourseDetail /></Guard></Wrap> },
      { path: 'profile', element: <Wrap><Guard><Profile /></Guard></Wrap> },
      { path: 'settings', element: <Wrap><Guard><Settings /></Guard></Wrap> },
      { path: '*', element: <Wrap><NotFound /></Wrap> },
    ],
  },
]);
export default router;
