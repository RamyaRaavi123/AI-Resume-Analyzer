import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import InterviewPrep from './pages/InterviewPrep';
import MockInterview from './pages/MockInterview';
import CodingAssessment from './pages/CodingAssessment';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';
import Notifications from './pages/Notifications';
import ChatAssistant from './pages/ChatAssistant';
import CompanyPrep from './pages/CompanyPrep';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/resume" element={<ResumeAnalyzer />} />
                <Route path="/interview-prep" element={<InterviewPrep />} />
                <Route path="/mock-interview" element={<MockInterview />} />
                <Route path="/coding" element={<CodingAssessment />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/chat" element={<ChatAssistant />} />
                <Route path="/companies" element={<CompanyPrep />} />
                <Route path="/admin" element={<ProtectedRoute adminOnly><AdminPanel /></ProtectedRoute>} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </Provider>
  );
}
