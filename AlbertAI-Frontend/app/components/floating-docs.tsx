export function FloatingDocs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="floating absolute top-1/4 right-1/4">
        <div className="w-16 h-16 bg-white/5 backdrop-blur rounded-lg border border-white/10 shadow-xl">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8 m-4 text-purple-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <path d="M14 2v6h6" />
          </svg>
        </div>
      </div>

      <div className="floating-delayed absolute top-1/3 left-1/4">
        <div className="w-16 h-16 bg-white/5 backdrop-blur rounded-lg border border-white/10 shadow-xl">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8 m-4 text-purple-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <path d="M14 2v6h6" />
          </svg>
        </div>
      </div>

      <div className="floating-more-delayed absolute bottom-1/4 right-1/3">
        <div className="w-16 h-16 bg-white/5 backdrop-blur rounded-lg border border-white/10 shadow-xl">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8 m-4 text-purple-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <path d="M14 2v6h6" />
          </svg>
        </div>
      </div>
    </div>
  )
}

