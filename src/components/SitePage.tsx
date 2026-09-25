import type { ReactNode } from 'react';
import Nav from './Nav';
import Footer from './Footer';
import PageBackdrop from './PageBackdrop';
import Filters from './Filters';

/**
 * Shared chrome for protocol surfaces that are not the homepage
 * (/protocol, /security, /terms, /privacy). Same nav, same footer, same
 * restrained backdrop — no hero video field.
 */
export default function SitePage({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#000000] text-white">
      <PageBackdrop />
      <Filters />

      <div className="relative z-10">
        <Nav />
        <main>{children}</main>
        <Footer />
      </div>
    </div>
  );
}
