import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './features/auth/AuthContext.jsx';
import { ToastProvider } from './components/Toast.jsx';
import { UIProvider } from './components/UIProvider.jsx';
import { ErrorBoundary } from './components/ErrorBoundary.jsx';
import { router } from './router.jsx';

export default function App() {
  return (
    <ErrorBoundary>
      <UIProvider>
        <AuthProvider>
          <ToastProvider>
            <RouterProvider router={router} />
          </ToastProvider>
        </AuthProvider>
      </UIProvider>
    </ErrorBoundary>
  );
}
