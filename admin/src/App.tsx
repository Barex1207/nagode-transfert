import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Toaster } from './components/ui/Toaster';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { RequireRole } from './components/RequireRole';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Vehicles from './pages/Vehicles';
import Agencies from './pages/Agencies';
import News from './pages/News';
import Settings from './pages/Settings';
import Destinations from './pages/Destinations';
import Services from './pages/Services';
import Schedules from './pages/Schedules';
import Fares from './pages/Fares';
import SupportNumbers from './pages/SupportNumbers';
import Suggestions from './pages/Suggestions';
import ContactMessages from './pages/ContactMessages';
import Faq from './pages/Faq';
import Testimonials from './pages/Testimonials';
import TeamMembers from './pages/TeamMembers';
import Account from './pages/Account';
import AdminUsers from './pages/AdminUsers';
import AuditLog from './pages/AuditLog';

export default function App() {
  return (
    <>
      <Toaster />
      <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/vehicles" element={<Vehicles />} />
                <Route path="/services" element={<Services />} />
                <Route path="/destinations" element={<Destinations />} />
                <Route path="/agencies" element={<Agencies />} />
                <Route path="/schedules" element={<Schedules />} />
                <Route path="/fares" element={<Fares />} />
                <Route path="/news" element={<News />} />
                <Route path="/support-numbers" element={<SupportNumbers />} />
                <Route path="/suggestions" element={<Suggestions />} />
                <Route path="/contact-messages" element={<ContactMessages />} />
                <Route path="/faq" element={<Faq />} />
                <Route path="/testimonials" element={<Testimonials />} />
                <Route path="/team-members" element={<TeamMembers />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/account" element={<Account />} />
                <Route
                  path="/admin-users"
                  element={
                    <RequireRole role="SUPER_ADMIN">
                      <AdminUsers />
                    </RequireRole>
                  }
                />
                <Route
                  path="/audit-log"
                  element={
                    <RequireRole role="SUPER_ADMIN">
                      <AuditLog />
                    </RequireRole>
                  }
                />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />
      </Routes>
    </>
  );
}
