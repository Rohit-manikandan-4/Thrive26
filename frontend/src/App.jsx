import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Watermark from './components/Watermark.jsx';
import ChatWidget from './components/ChatWidget.jsx';
import AccessibilityPanel from './components/AccessibilityPanel.jsx';
import SkipLink from './components/SkipLink.jsx';

const Home = lazy(() => import('./pages/Home.jsx'));
const Onboarding = lazy(() => import('./pages/Onboarding.jsx'));
const Opportunities = lazy(() => import('./pages/Opportunities.jsx'));
const OpportunityDetails = lazy(() => import('./pages/OpportunityDetails.jsx'));
const About = lazy(() => import('./pages/About.jsx'));

function PageLoading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-uplift-200 border-t-uplift-600" />
    </div>
  );
}

export default function App() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <SkipLink />
      <Navbar />
      <main id="main-content" className="flex-1">
        <Suspense fallback={<PageLoading />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/opportunities" element={<Opportunities />} />
            <Route path="/opportunities/:id" element={<OpportunityDetails />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <ChatWidget />
      <AccessibilityPanel />
      <Watermark />
    </div>
  );
}
