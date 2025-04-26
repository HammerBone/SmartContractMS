import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';
import Loader from './components/common/Loader';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import ContractsPage from './pages/ContractsPage';
import ContractDetailsPage from './pages/ContractDetailsPage';
import CreateContractPage from './pages/CreateContractPage';
import TemplatesPage from './pages/TemplatesPage';
import CreateTemplatePage from './pages/CreateTemplatePage';
import TemplateDetailsPage from './pages/TemplateDetailsPage';
import VerifyPage from './pages/VerifyPage';
import NotFoundPage from './pages/NotFoundPage';

// Context
import { AuthProvider } from './context/AuthContext';
import { ContractProvider } from './context/ContractContext';
import { TemplateProvider } from './context/TemplateContext';
import { NotificationProvider } from './context/NotificationContext';

// Base path for the application
const BASE_PATH = '/3000';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <AuthProvider>
      <ContractProvider>
        <TemplateProvider>
          <NotificationProvider>
            <div className="app">
              <Header basePath={BASE_PATH} />
              <main className="container">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/verify/:code" element={<VerifyPage />} />
                  
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/contracts" element={
                    <ProtectedRoute>
                      <ContractsPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/contracts/create" element={
                    <ProtectedRoute>
                      <CreateContractPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/contracts/:id" element={
                    <ProtectedRoute>
                      <ContractDetailsPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/templates" element={
                    <ProtectedRoute>
                      <TemplatesPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/templates/create" element={
                    <ProtectedRoute>
                      <CreateTemplatePage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/templates/:id" element={
                    <ProtectedRoute>
                      <TemplateDetailsPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/404" element={<NotFoundPage />} />
                  <Route path="*" element={<Navigate to="/404" replace />} />
                </Routes>
              </main>
              <Footer />
              <ToastContainer position="bottom-right" />
            </div>
          </NotificationProvider>
        </TemplateProvider>
      </ContractProvider>
    </AuthProvider>
  );
}

export default App;
