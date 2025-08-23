'use client';

export default function CosmicPanel() {
  return (
    <div className="relative h-[520px] rounded-2xl border border-white/10 bg-black/30 overflow-hidden backdrop-blur">
      {/* soft glows */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-violet-600/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-cyan-500/25 blur-3xl" />

      {/* concentrated starfield */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: 'radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px)',
        backgroundSize: '4px 4px'
      }}/>

      {/* SVG art layer */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 520" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="g-planet" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(167, 139, 250, 0.85)"/>
            <stop offset="40%" stopColor="rgba(59, 130, 246, 0.45)"/>
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

        {/* planet core */}
        <g className="spin-slow">
          <circle cx="560" cy="170" r="120" fill="url(#g-planet)" />
          {/* ring */}
          <ellipse cx="560" cy="170" rx="180" ry="48"
                   fill="none" stroke="url(#g-line)" strokeOpacity="0.45"
                   strokeWidth="2" filter="url(#glow)"/>
        </g>

        {/* constellation points */}
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
          {/* stars */}
          {[
            [100,360],[170,300],[250,340],[320,260],[390,300],
            [430,360],[480,320],[520,350],[580,300],[650,330],
          ].map(([x,y],i)=>(
            <circle key={i} cx={x} cy={y} r={i%3===0?2.4:1.8}
              fill="#fff" className={`blink ${i%2?'delay-2':''}`} />
          ))}
        </g>
      </svg>

      {/* caption */}
      <div className="absolute bottom-0 left-0 right-0 p-4 text-xs text-neutral-300/80">
        Your thoughts, like stars, connect into constellations ✨
      </div>

      {/* component-scoped animations */}
      <style jsx>{`
        .spin-slow { animation: spin 40s linear infinite; transform-origin: 560px 170px; }
        .dash { animation: dash 7s ease-in-out infinite; }
        .delay-1 { animation-delay: 1.2s; }
        .blink { animation: blink 2.8s ease-in-out infinite; }
        .delay-2 { animation-delay: 1.4s; }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes dash {
          0% { stroke-dashoffset: 60; opacity: .5; }
          50% { stroke-dashoffset: 0; opacity: .9; }
          100% { stroke-dashoffset: 60; opacity: .5; }
        }
        @keyframes blink {
          0%, 100% { opacity: .6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}
