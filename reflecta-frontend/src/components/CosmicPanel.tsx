'use client';

export default function CosmicPanel() {
  return (
    <div className="relative w-full h-[300px] md:h-[520px] rounded-xl md:rounded-2xl border border-violet-400/20 bg-gradient-to-br from-purple-900/30 to-cyan-900/30 overflow-hidden backdrop-blur-sm">
      {/* Subtle glows - positioned for mobile and desktop */}
      <div className="pointer-events-none absolute -top-16 -left-16 h-48 w-48 rounded-full bg-violet-600/40 blur-2xl md:blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-cyan-500/30 blur-2xl md:blur-3xl" />

      {/* Responsive starfield */}
      <div className="absolute inset-0 opacity-20 md:opacity-30" style={{
        backgroundImage: 'radial-gradient(rgba(255,255,255,0.9) 0.8px, transparent 0.8px)',
        backgroundSize: '4px 4px'
      }}/>

      {/* Responsive SVG art layer */}
      <svg 
        className="absolute inset-0 w-full h-full" 
        viewBox="0 0 800 520" 
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="g-planet" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(167, 139, 250, 0.7)"/>
            <stop offset="40%" stopColor="rgba(59, 130, 246, 0.4)"/>
            <stop offset="100%" stopColor="rgba(0,0,0,0)"/>
          </radialGradient>
          <linearGradient id="g-line" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#a78bfa"/>
            <stop offset="100%" stopColor="#22d3ee"/>
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Responsive planet core */}
        <g className="spin-slow">
          <circle cx="560" cy="170" r="100" fill="url(#g-planet)" className="md:r-[120px]" />
          {/* Responsive ring */}
          <ellipse cx="560" cy="170" rx="160" ry="40"
                   fill="none" stroke="url(#g-line)" strokeOpacity="0.4"
                   strokeWidth="2" filter="url(#glow)" className="md:rx-[180px] md:ry-[48px]"/>
        </g>

        {/* Constellation - simplified for mobile */}
        <g filter="url(#glow)">
          {/* lines */}
          <polyline
            points="100,360 170,300 250,340 320,260 390,300"
            fill="none" stroke="url(#g-line)" strokeWidth="2"
            strokeDasharray="4 8" className="dash" />
          <polyline
            points="430,360 480,320 520,350 580,300 650,330"
            fill="none" stroke="url(#g-line)" strokeWidth="2"
            strokeDasharray="4 8" className="dash delay-1" />
          {/* Stars */}
          {[
            [100,360],[170,300],[250,340],[320,260],[390,300],
            [430,360],[480,320],[520,350],[580,300],[650,330],
          ].map(([x,y],i)=>(
            <circle key={i} cx={x} cy={y} r={i%3===0?1.8:1.4}
              fill="#fff" className={`blink ${i%2?'delay-2':''}`} />
          ))}
        </g>
      </svg>

      {/* Responsive caption */}
      <div className="absolute bottom-0 left-0 right-0 p-4 text-xs md:text-sm text-cyan-100/80 font-light text-center bg-gradient-to-t from-black/50 to-transparent">
        Your thoughts, like stars, connect into constellations ✨
      </div>

      {/* Responsive animations */}
      <style jsx>{`
        .spin-slow { animation: spin 35s linear infinite; transform-origin: 560px 170px; }
        .dash { animation: dash 8s ease-in-out infinite; }
        .delay-1 { animation-delay: 1.5s; }
        .blink { animation: blink 3s ease-in-out infinite; }
        .delay-2 { animation-delay: 1.8s; }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes dash {
          0% { stroke-dashoffset: 60; opacity: .4; }
          50% { stroke-dashoffset: 0; opacity: .8; }
          100% { stroke-dashoffset: 60; opacity: .4; }
        }
        @keyframes blink {
          0%, 100% { opacity: .5; transform: scale(1); }
          50% { opacity: .8; transform: scale(1.2); }
        }
        
        /* Mobile optimizations */
        @media (max-width: 768px) {
          .spin-slow { 
            animation: spin 45s linear infinite;
            transform-origin: 70% 30%;
          }
          .dash { animation: dash 10s ease-in-out infinite; }
        }
      `}</style>
    </div>
  );
}