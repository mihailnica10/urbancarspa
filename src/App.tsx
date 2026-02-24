const currentYear = new Date().getFullYear()

export function App() {
  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-600/5 rounded-full blur-3xl animate-float-medium" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/3 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      {/* Content wrapper */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-md mx-auto py-12 sm:py-16 lg:py-20">
        {/* Logo Section */}
        <div className="text-center mb-10 sm:mb-12 lg:mb-16">
          <div className="mb-6">
            {/* Logo icon/symbol */}
            <div className="mx-auto w-20 h-20 sm:w-24 sm:h-24 mb-6 flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-red-600/20 rounded-2xl blur-xl animate-pulse" />
                <svg
                  className="relative w-full h-full text-red-600"
                  viewBox="0 0 100 100"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    d="M20 65 L20 35 L35 35 L35 30 Q35 20 45 20 L55 20 Q65 20 65 30 L65 65 L50 65 L50 40 L45 40 L45 65 L30 65 L30 40 L20 40 Z"
                    strokeLinejoin="round"
                  />
                  <circle cx="75" cy="45" r="8" />
                </svg>
              </div>
            </div>

            {/* Brand name */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight">
              URBAN<span className="text-red-600">CAR</span>SPA
            </h1>
          </div>

          {/* Tagline */}
          <p className="text-zinc-500 text-sm sm:text-base uppercase tracking-[0.3em] font-medium">
            Premium Auto Detailing
          </p>
        </div>

        {/* Divider */}
        <div className="w-full max-w-[200px] h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent mb-10 sm:mb-12" />

        {/* Social Media Links */}
        <nav className="w-full space-y-3 sm:space-y-4" aria-label="Social media links">
          {/* Instagram */}
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center justify-between gap-4 py-4 px-5 sm:px-6 rounded-2xl bg-zinc-900/50 hover:bg-red-600 transition-all duration-300 border border-zinc-800 hover:border-red-500 hover:shadow-lg hover:shadow-red-600/25"
            aria-label="Follow us on Instagram"
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-zinc-800 group-hover:bg-white/10 flex items-center justify-center transition-colors">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </div>
              <span className="text-white font-semibold text-base">Instagram</span>
            </div>
            <svg className="w-5 h-5 text-zinc-600 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </a>

          {/* Facebook */}
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center justify-between gap-4 py-4 px-5 sm:px-6 rounded-2xl bg-zinc-900/50 hover:bg-red-600 transition-all duration-300 border border-zinc-800 hover:border-red-500 hover:shadow-lg hover:shadow-red-600/25"
            aria-label="Follow us on Facebook"
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-zinc-800 group-hover:bg-white/10 flex items-center justify-center transition-colors">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </div>
              <span className="text-white font-semibold text-base">Facebook</span>
            </div>
            <svg className="w-5 h-5 text-zinc-600 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </a>

          {/* TikTok */}
          <a
            href="https://tiktok.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center justify-between gap-4 py-4 px-5 sm:px-6 rounded-2xl bg-zinc-900/50 hover:bg-red-600 transition-all duration-300 border border-zinc-800 hover:border-red-500 hover:shadow-lg hover:shadow-red-600/25"
            aria-label="Follow us on TikTok"
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-zinc-800 group-hover:bg-white/10 flex items-center justify-center transition-colors">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
              </div>
              <span className="text-white font-semibold text-base">TikTok</span>
            </div>
            <svg className="w-5 h-5 text-zinc-600 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </nav>
      </div>

      {/* Footer */}
      <footer className="relative z-10 mt-auto pt-8 pb-6 sm:pt-10 sm:pb-8">
        <div className="flex items-center gap-2 text-zinc-600 text-xs sm:text-sm">
          <span>©</span>
          <span>{currentYear}</span>
          <span className="text-zinc-700">|</span>
          <span>UrbanCarSpa</span>
        </div>
      </footer>
    </main>
  )
}

export default App
