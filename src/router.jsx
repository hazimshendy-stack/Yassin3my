import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout.jsx';
import AuthLayout from './layouts/AuthLayout.jsx';
import RequireAuth from './features/auth/RequireAuth.jsx';
import { ErrorBoundary } from './components/ErrorBoundary.jsx';
import { Spinner } from './components/Spinner.jsx';

const LazyDashboard = lazy(() => import('./features/dashboard/pages/DashboardPage.jsx'));
const LazyCourses   = lazy(() => import('./features/courses/pages/CoursesListPage.jsx'));
const LazyCourse    = lazy(() => import('./features/courses/pages/CourseDetailPage.jsx'));
const LazyProfile   = lazy(() => import('./features/profile/pages/ProfilePage.jsx'));
const LazySettings  = lazy(() => import('./features/settings/pages/SettingsPage.jsx'));
const LazyNotFound  = lazy(() => import('./features/dashboard/pages/NotFoundPage.jsx'));

const LazyLogin     = lazy(() => import('./features/auth/pages/LoginPage.jsx'));
const LazyRegister  = lazy(() => import('./features/auth/pages/RegisterPage.jsx'));

function SuspenseWrap({ children }) {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: '40vh',
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <Spinner size={22} label="جارٍ التحميل" />
        </div>
      }
    >
      <ErrorBoundary>{children}</ErrorBoundary>
    </Suspense>
  );
}

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: (
          <SuspenseWrap>
            <LazyLogin />
          </SuspenseWrap>
        ),
      },
      {
        path: 'register',
        element: (
          <SuspenseWrap>
            <LazyRegister />
          </SuspenseWrap>
        ),
      },
    ],
  },
  {
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: (
          <RequireAuth>
            <SuspenseWrap>
              <LazyDashboard />
            </SuspenseWrap>
          </RequireAuth>
        ),
      },
      {
        path: 'courses',
        element: (
          <RequireAuth>
            <SuspenseWrap>
              <LazyCourses />
            </SuspenseWrap>
          </RequireAuth>
        ),
      },
      {
        path: 'courses/:id',
        element: (
          <RequireAuth>
            <SuspenseWrap>
              <LazyCourse />
            </SuspenseWrap>
          </RequireAuth>
        ),
      },
      {
        path: 'modules',
        element: <Navigate to="/courses" replace />,
      },
      {
        path: 'profile',
        element: (
          <RequireAuth>
            <SuspenseWrap>
              <LazyProfile />
            </SuspenseWrap>
          </RequireAuth>
        ),
      },
      {
        path: 'settings',
        element: (
          <RequireAuth>
            <SuspenseWrap>
              <LazySettings />
            </SuspenseWrap>
          </RequireAuth>
        ),
      },
      {
        path: '*',
        element: (
          <SuspenseWrap>
            <LazyNotFound />
          </SuspenseWrap>
        ),
      },
    ],
  },
]);

export default router;
