import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Home from './routes/Home';

const AppLayout = lazy(() => import('./routes/app/AppLayout'));
const PoolsPage = lazy(() => import('./routes/app/PoolsPage'));
const PoolDetailPage = lazy(() => import('./routes/app/PoolDetailPage'));
const TicketsPage = lazy(() => import('./routes/app/TicketsPage'));
const ResultsPage = lazy(() => import('./routes/app/ResultsPage'));
const RefundsPage = lazy(() => import('./routes/app/RefundsPage'));
const DocsLayout = lazy(() => import('./routes/docs/DocsLayout'));
const SecurityPage = lazy(() => import('./routes/site/SecurityPage'));
const ProtocolPage = lazy(() => import('./routes/site/ProtocolPage'));
const TestnetReportPage = lazy(() => import('./routes/site/TestnetReportPage'));
const TransparencyPage = lazy(() => import('./routes/site/TransparencyPage'));
const TermsPage = lazy(() => import('./routes/site/LegalPages').then((m) => ({ default: m.default })));
const PrivacyPage = lazy(() => import('./routes/site/LegalPages').then((m) => ({ default: m.PrivacyPage })));

/**
 * ONEDRAW
 *
 *   /                  marketing homepage (unchanged)
 *   /protocol          protocol deep-dive
 *   /security          protocol security guarantees
 *   /docs              documentation (one shell serves every chapter)
 *   /docs/:slug        documentation chapters
 *   /terms  /privacy   legal surfaces
 *   /app               pool browser
 *   /app/pool/:id      pool detail + purchase / draw / refund
 *   /app/tickets       the connected wallet's entries
 *   /app/results       completed draws
 *   /app/refunds       claimable refunds + refund history
 *
 */
export default function App() {
  return (
      <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/protocol" element={<ProtocolPage />} />
        <Route path="/security" element={<SecurityPage />} />
        <Route path="/testnet" element={<TestnetReportPage />} />
        <Route path="/transparency" element={<TransparencyPage />} />
        <Route path="/docs" element={<DocsLayout />} />
        <Route path="/docs/:slug" element={<DocsLayout />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />

        <Route path="/app" element={<AppLayout />}>
          <Route index element={<PoolsPage />} />
          <Route path="pool/:id" element={<PoolDetailPage />} />
          <Route path="tickets" element={<TicketsPage />} />
          <Route path="results" element={<ResultsPage />} />
          <Route path="refunds" element={<RefundsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </Suspense>
  );
}
