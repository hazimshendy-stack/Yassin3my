import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { ToastProvider } from './contexts/ToastContext.jsx';
import { UIProvider } from './contexts/UIContext.jsx';
import { router } from './router.jsx';

export default function App() {
  return (
    <UIProvider>
      <AuthProvider>
        <ToastProvider>
          <RouterProvider router={router} />
        </ToastProvider>
      </AuthProvider>
    </UIProvider>
  );
}
