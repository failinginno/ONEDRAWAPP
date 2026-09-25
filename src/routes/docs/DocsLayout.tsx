import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ChevronRight, Menu, PanelLeft } from 'lucide-react';
import PageBackdrop from '../../components/PageBackdrop';
import Filters from '../../components/Filters';
import { Wordmark } from '../../components/brand';
import { SidebarLink, TopLinks, useToc } from '../../components/docs/DocsChrome';
import { DOCS_GROUPS, DOC_PAGES, DOC_ROOT, docsHref, getDocPage, getNeighbours } from '../../content/docs';

/**
 * Documentation shell.
 *
 * Serves both /docs (Introduction) and /docs/:slug from one route so every
 * chapter shares the sidebar, the "on this page" rail and the prev/next pager
 * without duplicating layout code. The visual language — black surface, hairline
 * dividers, small uppercase labels, restrained cyan — matches the homepage.
 */
export default function DocsLayout() {
  const { pathname } = useLocation();
  const [navOpen, setNavOpen] = useState(false);

  const slug = useMemo(() => {
    const rest = pathname.startsWith(DOC_ROOT) ? pathname.slice(DOC_ROOT.length) : '';
    const clean = rest.replace(/^\//, '');
    return clean.length > 0 ? clean : 'introduction';
  }, [pathname]);

  const page = getDocPage(slug);
  const neighbours = useMemo(() => getNeighbours(page?.slug ?? ''), [page]);
  const { items: toc, active } = useToc(slug);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    setNavOpen(false);
  }, [slug]);

  if (!page) return <Navigate to={DOC_ROOT} replace />;

  return (
    <div className="relative min-h-screen bg-[#000000] text-white">
      <PageBackdrop dense />
      <Filters />

      {/* header */}
      <header className="sticky top-0 z-40 border-b border-white/[0.07] bg-black/55 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-shell items-center justify-between gap-6 px-6 lg:px-10">
          <div className="flex items-center gap-6">
            <Link to="/" aria-label="ONEDRAW home">
              <Wordmark />
            </Link>
            <span className="hidden h-4 w-px bg-white/10 sm:block" />
            <span className="hidden items-center gap-2 sm:flex">
              <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/40">
                Docs
              </span>
              <span className="rounded-full border border-white/12 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-white/45">
                Spec
              </span>
            </span>
          </div>

          <TopLinks className="hidden md:flex" />
          <Link
            to="/app"
            className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-[12.5px] font-medium text-black transition-colors hover:bg-white/90"
          >
            Enter App
          </Link>
        </div>
      </header>

      <div className="relative z-10 mx-auto max-w-shell px-6 lg:px-10">
        {/* mobile chapter nav */}
        <div className="lg:hidden">
          <button
            type="button"
            onClick={() => setNavOpen((v) => !v)}
            className="mt-6 inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-[13px] text-white/70"
          >
            <PanelLeft className="h-3.5 w-3.5" />
            Documentation contents
          </button>
          {navOpen && (
            <nav className="mt-3 rounded-xl border border-white/[0.08] bg-[#070809] p-3">
              {DOCS_GROUPS.map((group) => (
                <div key={group.group} className="mb-4 last:mb-0">
                  <div className="px-3 pb-2 text-[9.5px] font-semibold uppercase tracking-[0.2em] text-white/30">
                    {group.group}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    {group.slugs.map((s) => {
                      const p = DOC_PAGES.find((x) => x.slug === s);
                      if (!p) return null;
                      return (
                        <SidebarLink key={s} to={docsHref(s)}>
                          {p.nav}
                        </SidebarLink>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>
          )}
        </div>

        <div className="flex gap-12 pb-24 pt-10 lg:gap-16 lg:pt-12">
          {/* sidebar */}
          <aside className="hidden w-[236px] shrink-0 lg:block">
            <div className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2">
              {DOCS_GROUPS.map((group) => (
                <div key={group.group} className="mb-7">
                  <div className="px-3 pb-2.5 text-[9.5px] font-semibold uppercase tracking-[0.2em] text-white/30">
                    {group.group}
                  </div>
                  <div className="flex flex-col gap-0.5 border-l border-white/[0.07] pl-3">
                    {group.slugs.map((s) => {
                      const p = DOC_PAGES.find((x) => x.slug === s);
                      if (!p) return null;
                      return (
                        <SidebarLink key={s} to={docsHref(s)}>
                          {p.nav}
                        </SidebarLink>
                      );
                    })}
                  </div>
                </div>
              ))}

              <div className="mt-8 border-t border-white/[0.07] pt-5">
                <div className="flex flex-col gap-2.5 text-[12px]">
                  <Link
                    to="/protocol"
                    className="flex items-center gap-1.5 text-white/45 transition-colors hover:text-white"
                  >
                    Protocol overview
                    <ChevronRight className="h-3 w-3" />
                  </Link>
                  <Link
                    to="/security"
                    className="flex items-center gap-1.5 text-white/45 transition-colors hover:text-white"
                  >
                    Security
                    <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          </aside>

          {/* article */}
          <article className="min-w-0 flex-1">
            <div className="flex items-center gap-3">
              <span className="h-1 w-1 rounded-full bg-azure-cyan" />
              <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-white/40">
                {page.group}
              </span>
              <span className="text-[10px] uppercase tracking-[0.18em] text-white/20">
                {page.reading} read
              </span>
            </div>

            <h1 className="mt-6 text-[2.1rem] font-semibold leading-[1.05] tracking-[-0.035em] text-white md:text-[2.9rem]">
              {page.title}
            </h1>

            <p className="mt-6 max-w-2xl text-[15px] leading-[1.75] text-white/50 md:text-[16px]">
              {page.lede}
            </p>

            <div className="mt-10 h-px w-full bg-white/[0.07]" />

            <div className="max-w-[760px] pt-10">{page.body()}</div>

            {/* pager */}
            <div className="mt-20 grid gap-3 border-t border-white/[0.07] pt-8 sm:grid-cols-2">
              {neighbours.prev ? (
                <Link
                  to={docsHref(neighbours.prev.slug)}
                  className="group rounded-xl border border-white/[0.08] px-5 py-4 transition-colors hover:border-white/[0.16] hover:bg-white/[0.02]"
                >
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-white/35">
                    <ArrowLeft className="h-3 w-3" />
                    Previous
                  </div>
                  <div className="mt-2 text-[14px] font-medium text-white/85 transition-colors group-hover:text-white">
                    {neighbours.prev.nav}
                  </div>
                </Link>
              ) : (
                <div />
              )}

              {neighbours.next && (
                <Link
                  to={docsHref(neighbours.next.slug)}
                  className="group rounded-xl border border-white/[0.08] px-5 py-4 text-right transition-colors hover:border-white/[0.16] hover:bg-white/[0.02] sm:col-start-2"
                >
                  <div className="flex items-center justify-end gap-2 text-[10px] uppercase tracking-[0.18em] text-white/35">
                    Next
                    <ArrowRight className="h-3 w-3" />
                  </div>
                  <div className="mt-2 text-[14px] font-medium text-white/85 transition-colors group-hover:text-white">
                    {neighbours.next.nav}
                  </div>
                </Link>
              )}
            </div>
          </article>

          {/* on this page */}
          <aside className="hidden w-[200px] shrink-0 xl:block">
            <div className="sticky top-28">
              <div className="text-[9.5px] font-semibold uppercase tracking-[0.2em] text-white/30">
                On this page
              </div>
              {toc.length > 0 ? (
                <nav className="mt-4 flex flex-col gap-1 border-l border-white/[0.07] pl-4">
                  {toc.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className={`py-1 text-[12.5px] leading-snug transition-colors ${
                        active === item.id
                          ? 'text-azure-ice'
                          : 'text-white/40 hover:text-white/80'
                      }`}
                    >
                      {item.text}
                    </a>
                  ))}
                </nav>
              ) : (
                <div className="mt-4 text-[12.5px] text-white/25">No sub-sections.</div>
              )}

              <div className="mt-8 border-t border-white/[0.07] pt-5">
                <div className="text-[9.5px] font-semibold uppercase tracking-[0.2em] text-white/30">
                  Status
                </div>
                <p className="mt-3 text-[11.5px] leading-[1.7] text-white/35">
                  Specification. The demo app uses simulated data only.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* compact footer */}
      <footer className="relative z-10 border-t border-white/[0.07]">
        <div className="mx-auto flex max-w-shell flex-wrap items-center justify-between gap-4 px-6 py-8 lg:px-10">
          <p className="text-[11.5px] text-white/30">
            © 2026 ONEDRAW · Documentation describes intended protocol behaviour.
          </p>
          <div className="flex flex-wrap items-center gap-5 text-[12px] text-white/40">
            <Link to="/terms" className="transition-colors hover:text-white">
              Terms
            </Link>
            <Link to="/privacy" className="transition-colors hover:text-white">
              Privacy
            </Link>
            <Link to="/security" className="transition-colors hover:text-white">
              Security
            </Link>
            <Link to="/app" className="transition-colors hover:text-white">
              App
            </Link>
          </div>
        </div>
      </footer>

      {/* mobile menu hint — mirrors the desktopamburger affordance */}
      <button
        type="button"
        aria-label="Documentation navigation"
        onClick={() => setNavOpen((v) => !v)}
        className="fixed bottom-5 right-5 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-black/80 text-white/70 backdrop-blur-xl md:hidden"
      >
        <Menu className="h-4 w-4" />
      </button>
    </div>
  );
}
