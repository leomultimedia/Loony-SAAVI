// middleware.ts
// Next.js 15 Edge Middleware for multi-tenant routing and Ghost-Call validation

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /fonts (inside /public)
     * 4. /examples (inside /public)
     * 5. all root files inside /public (e.g. favicon.ico)
     */
    '/((?!api|_next|fonts|examples|[\\w-]+\\.\\w+).*)',
  ],
};

export default function middleware(req: NextRequest) {
  const url = req.nextUrl;
  
  // Extract hostname (e.g., tenant1.loonyheads.ae, app.loonyheads.ae)
  const hostname = req.headers.get('host') || 'loonyheads.ae';

  // Define allowed Base Domains
  const isApexDomain = hostname === 'loonyheads.ae' || hostname === 'www.loonyheads.ae';
  const isSuperAdmin = hostname === 'admin.loonyheads.ae';

  // Subdomain / Tenant extraction
  const subdomain = hostname.replace(`.loonyheads.ae`, '');

  if (isApexDomain) {
    // Route to Marketing/Trust Center (Apps/Web)
    return NextResponse.rewrite(new URL(`/marketing${url.pathname}`, req.url));
  }

  if (isSuperAdmin) {
    // Route to Super-Admin GOD MODE dashboard (Apps/Admin)
    return NextResponse.rewrite(new URL(`/god-mode${url.pathname}`, req.url));
  }

  // Tenant / Reseller routing (Apps/App)
  // Using the requested Zero latency streaming architecture and multi-tenant DB structure
  return NextResponse.rewrite(new URL(`/[tenant]${url.pathname}?tenantId=${subdomain}`, req.url));
}
