import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { store, useStore } from './store';
import Login from './pages/Login';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Inbox from './pages/Inbox';
import Outbox from './pages/Outbox';
import Letters from './pages/Letters';
import LetterDetail from './pages/LetterDetail';
import CreateLetter from './pages/CreateLetter';
import Approvals from './pages/Approvals';
import Archive from './pages/Archive';
import Workflows from './pages/Workflows';
import Users from './pages/Users';
import Departments from './pages/Departments';
import AuditLogs from './pages/AuditLogs';
import Notifications from './pages/Notifications';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { currentUser } = useStore();
  if (!currentUser) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  const { currentUser } = useStore();

  return (
    <HashRouter>
      <Routes>
        {!currentUser ? (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        ) : (
          <>
            <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route index element={<Dashboard />} />
              <Route path="inbox" element={<Inbox />} />
              <Route path="outbox" element={<Outbox />} />
              <Route path="letters" element={<Letters />} />
              <Route path="letters/create" element={<CreateLetter />} />
              <Route path="letters/:id" element={<LetterDetail />} />
              <Route path="approvals" element={<Approvals />} />
              <Route path="archive" element={<Archive />} />
              <Route path="workflows" element={<Workflows />} />
              <Route path="users" element={<Users />} />
              <Route path="departments" element={<Departments />} />
              <Route path="audit-logs" element={<AuditLogs />} />
              <Route path="notifications" element={<Notifications />} />
            </Route>
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </HashRouter>
  );
}
