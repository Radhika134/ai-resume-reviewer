/** @type {import('next').NextConfig} */
const securityHeaders = [
  // Prevent MIME type sniffing
  { key: "X-Content-Type-Options",    value: "nosniff" },
  // Block clickjacking via iframes
  { key: "X-Frame-Options",           value: "DENY" },
  // Legacy XSS protection (belt-and-suspenders for older browsers)
  { key: "X-XSS-Protection",         value: "1; mode=block" },
  // Control referrer leakage
  { key: "Referrer-Policy",           value: "strict-origin-when-cross-origin" },
  // Enforce HTTPS for 1 year (enable on Vercel / HTTPS-only deployments)
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  // Disable browser features not needed by this app
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  // Content Security Policy
  // - default: self only
  // - scripts: self + inline (needed by Next.js hydration) + Google Fonts
  // - styles:  self + unsafe-inline (Tailwind injects inline styles)
  // - fonts:   Google Fonts CDN
  // - connect: self + Gemini API (server-side only, but belt-and-suspenders)
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",   // Next.js requires unsafe-eval in dev
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob:",
      "media-src 'self' https://d8j0ntlcm91z4.cloudfront.net",
      "connect-src 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
];

const nextConfig = {
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
