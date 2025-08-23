'use client';

export default function CosmicStrip() {
  return (
    <div className="relative h-[200px] w-full rounded-xl border-2 border-violet-500/30 bg-gradient-to-r from-purple-900/40 to-cyan-900/40 overflow-hidden backdrop-blur-lg">
      {/* Subtle glows */}
      <div className="pointer-events-none absolute -top-16 -left-16 h-40 w-40 rounded-full bg-violet-600/40 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-16 -right-16 h-40 w-40 rounded-full bg-cyan-500/30 blur-2xl" />

      {/* Starfield */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: 'radial-gradient(rgba(255,255,255,0.9) 0.8px, transparent 0.8px)',
        backgroundSize: '4px 4px'
      }}/>

      {/* SVG art layer - simplified for mobile strip */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 200" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="g-line-mobile" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#a78bfa"/>
            <stop offset="100%" stopColor="#22d3ee"/>
          </linearGradient>
          <filter id="glow-mobile">
            <feGaussianBlur stdDeviation="2" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Horizontal constellation for mobile */}
        <g filter="url(#glow-mobile)">
          <polyline
            points="50,100 150,80 250,120 350,60 450,100 550,80 650,120 750,100"
            fill="none" stroke="url(#g-line-mobile)" strokeWidth="2"
            strokeDasharray="4 8" className="dash" />
          {/* Stars */}
          {[
            [50,100],[150,80],[250,120],[350,60],[450,100],[550,80],[650,120],[750,100]
          ].map(([x,y],i)=>(
            <circle key={i} cx={x} cy={y} r={i%3===0?2:1.5}
              fill="#fff" className={`blink ${i%2?'delay-2':''}`} />
          ))}
        </g>
      </svg>

      {/* Caption */}
      <div className="absolute bottom-0 left-0 right-0 p-4 text-xs text-cyan-100/80 font-light text-center bg-gradient-to-t from-black/40 to-transparent">
        Your thoughts, like stars, connect into constellations ✨
      </div>

      {/* Animations */}
      <style jsx>{`
        .dash { animation: dash 8s ease-in-out infinite; }
        .blink { animation: blink 3s ease-in-out infinite; }
        .delay-2 { animation-delay: 1.8s; }

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