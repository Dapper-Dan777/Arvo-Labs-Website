import { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { supabase } from './supabaseClient';
import UseCasesPage from './pages/UseCasesPage';
import HomePages from './pages/HomePages';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import FeaturesPage from './pages/FeaturesPage';
import PricingPage from './pages/PricingPage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import BlogPage from './pages/BlogPage';
import PrivacyPage from './pages/PrivacyPage';
import ImprintPage from './pages/ImprintPage';
import TermsPage from './pages/TermsPage';

// ScrollToTop Component - scrollt bei jeder Route-Änderung nach oben
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0a0a0a',
          color: '#fff',
        }}
      >
        <div>Laden...</div>
      </div>
    );
  }

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePages />} />
        <Route path="/" element={<HomePages />} />
        <Route path="/use-cases" element={<UseCasesPage />} />
        <Route path="/funktionen" element={<FeaturesPage />} />
        <Route path="/preise" element={<PricingPage />} />
        <Route path="/kontakt" element={<ContactPage />} />
        <Route path="/ueber-uns" element={<AboutPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/datenschutz" element={<PrivacyPage />} />
        <Route path="/impressum" element={<ImprintPage />} />
        <Route path="/agb" element={<TermsPage />} />
        {/* Öffentliche Auth-Routen */}
        <Route
          path="/login"
          element={!user ? <LoginPage /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/register"
          element={!user ? <RegisterPage /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/dashboard"
          element={user ? <DashboardPage /> : <Navigate to="/" />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
