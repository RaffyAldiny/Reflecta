'use client';

export default function CosmicPanel() {
  return (
    <div className="relative h-[520px] rounded-2xl border border-white/15 bg-gradient-to-br from-purple-900/30 to-cyan-900/30 overflow-hidden backdrop-blur-md">
      {/* Subtle glows */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-violet-600/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-cyan-500/30 blur-3xl" />

      {/* Subtle starfield */}
      <div className="absolute inset-0 opacity-15" style={{
        backgroundImage: 'radial-gradient(rgba(255,255,255,0.8) 0.8px, transparent 0.8px)',
        backgroundSize: '5px 5px'
      }}/>

      {/* SVG art layer */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 520" preserveAspectRatio="xMidYMid slice">
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

        {/* Planet core */}
        <g className="spin-slow">
          <circle cx="560" cy="170" r="110" fill="url(#g-planet)" />
          {/* Ring */}
          <ellipse cx="560" cy="170" rx="170" ry="42"
                   fill="none" stroke="url(#g-line)" strokeOpacity="0.4"
                   strokeWidth="2" filter="url(#glow)"/>
        </g>

        {/* Constellation */}
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
            <circle key={i} cx={x} cy={y} r={i%3===0?2.2:1.6}
              fill="#fff" className={`blink ${i%2?'delay-2':''}`} />
          ))}
        </g>
      </svg>

      {/* Caption */}
      <div className="absolute bottom-0 left-0 right-0 p-5 text-xs text-neutral-300/70 text-center bg-gradient-to-t from-black/40 to-transparent">
        Your thoughts, like stars, connect into constellations ✨
      </div>

      {/* Animations */}
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
      `}</style>
    </div>
  );
}