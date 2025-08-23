'use client';

import { useEffect, useRef } from 'react';

export default function CosmicBackground() {
  const containerRef = useRef(null);
  
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    
    const container = containerRef.current;
    if (!container) return;
    
    let mouseX = 0;
    let mouseY = 0;
    let frameId = null;
    
    const handleMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth) - 0.5;
      mouseY = (e.clientY / window.innerHeight) - 0.5;
    };
    
    const animate = () => {
      const moveX = mouseX * 20;
      const moveY = mouseY * 20;
      
      container.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
      frameId = requestAnimationFrame(animate);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    frameId = requestAnimationFrame(animate);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <div ref={containerRef} className="absolute inset-0 transition-transform duration-300 ease-out">
        {/* Nebula Background */}
        <div className="nebula absolute inset-0" />
        
        {/* Stars */}
        <div className="stars stars-1 absolute inset-0" />
        <div className="stars stars-2 absolute inset-0" />
        <div className="stars stars-3 absolute inset-0" />
        
        {/* Shooting Stars */}
        <div className="shooting-star shooting-star-1" />
        <div className="shooting-star shooting-star-2" />
        <div className="shooting-star shooting-star-3" />
        
        {/* Asteroids */}
        <div className="asteroid asteroid-1" />
        <div className="asteroid asteroid-2" />
        <div className="asteroid asteroid-3" />
        
        {/* Constellations */}
        <div className="constellation constellation-1" />
        <div className="constellation constellation-2" />
        <div className="constellation constellation-3" />

        {/* Orbit System */}
        <div className="absolute left-1/2 top-1/2 w-[min(92vw,720px)] aspect-square -translate-x-1/2 -translate-y-1/2">
          <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
            <defs>
              <linearGradient id="gx-line-1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
              <linearGradient id="gx-line-2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#d946ef" />
              </linearGradient>
              <linearGradient id="gx-line-3" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <circle cx="50" cy="50" r="18" className="orbit orbit-1" />
            <circle cx="50" cy="50" r="30" className="orbit orbit-2" />
            <circle cx="50" cy="50" r="42" className="orbit orbit-3" />
          </svg>

          {/* Center "You" Element */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 grid place-items-center">
            <div className="center-glow absolute rounded-full bg-violet-500/20 blur-xl" />
            <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-gradient-to-br from-violet-600/30 to-fuchsia-600/30 border border-white/20 backdrop-blur-xl shadow-[0_0_60px_0_rgba(139,92,246,0.5)] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
              <div className="h-full w-full grid place-items-center text-xs sm:text-sm font-medium tracking-wider text-white">
                You
              </div>
            </div>
          </div>

          {/* Orbiting Badges */}
          <Orbit radius="calc(50% - 42px)" dur="28s">
            <Badge label="Photos" />
          </Orbit>
          <Orbit radius="calc(50% - 30px)" dur="22s" reverse>
            <Badge label="Music" />
          </Orbit>
          <Orbit radius="calc(50% - 18px)" dur="18s">
            <Badge label="Moods" />
          </Orbit>
          <Orbit radius="calc(50% - 48px)" dur="32s" reverse>
            <Badge label="Friends" />
          </Orbit>
          <Orbit radius="calc(50% - 36px)" dur="26s">
            <Badge label="Memories" />
          </Orbit>
        </div>
      </div>

      <style jsx>{`
        .nebula {
          background:
            radial-gradient(60% 45% at 15% 0%, rgba(139, 92, 246, 0.4) 0%, transparent 70%),
            radial-gradient(45% 35% at 85% 10%, rgba(236, 72, 153, 0.35) 0%, transparent 70%),
            radial-gradient(60% 55% at 50% 85%, rgba(59, 130, 246, 0.3) 0%, transparent 70%),
            radial-gradient(40% 40% at 70% 30%, rgba(6, 182, 212, 0.4) 0%, transparent 100%),
            linear-gradient(125deg, #0f0f1f 0%, #1a1a2e 40%, #16213e 100%);
          background-size: 200% 200%;
          animation: pan 90s ease-in-out infinite alternate;
          filter: saturate(130%);
          opacity: 0.9;
        }
        
        @keyframes pan { 
          0% { background-position: 0% 0%; } 
          50% { background-position: 70% 70%; } 
          100% { background-position: 100% 100%; } 
        }

        .stars {
          background-image: radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px);
          mix-blend-mode: screen;
        }
        .stars-1 { 
          opacity: 0.4; 
          background-size: 40px 40px; 
          animation: drift1 100s linear infinite; 
        }
        .stars-2 { 
          opacity: 0.3; 
          background-size: 100px 100px; 
          animation: drift2 120s linear infinite reverse; 
        }
        .stars-3 { 
          opacity: 0.2; 
          background-size: 200px 200px; 
          animation: drift3 140s linear infinite; 
        }
        
        @keyframes drift1 { 
          0% { transform: translate(0, 0); } 
          100% { transform: translate(-100px, 50px); } 
        }
        @keyframes drift2 { 
          0% { transform: translate(0, 0); } 
          100% { transform: translate(50px, -100px); } 
        }
        @keyframes drift3 { 
          0% { transform: translate(0, 0); } 
          100% { transform: translate(-150px, -80px); } 
        }

        .shooting-star {
          position: absolute;
          height: 2px;
          background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.8));
          animation: shooting 12s linear infinite;
          opacity: 0;
        }
        
        .shooting-star-1 {
          top: 15%;
          left: -100px;
          width: 80px;
          animation-delay: 0s;
        }
        
        .shooting-star-2 {
          top: 65%;
          right: -100px;
          width: 100px;
          animation-delay: 7s;
          transform: rotate(-45deg);
        }
        
        .shooting-star-3 {
          top: 40%;
          left: -80px;
          width: 70px;
          animation-delay: 15s;
          transform: rotate(30deg);
        }
        
        @keyframes shooting {
          0% { transform: translateX(0) rotate(45deg); opacity: 0; }
          5% { opacity: 1; }
          15% { transform: translateX(100vw) rotate(45deg); opacity: 0; }
          100% { opacity: 0; }
        }

        .asteroid {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, #aaa, #444 70%);
          box-shadow: 0 0 15px rgba(255, 255, 200, 0.4);
          animation: float 60s linear infinite;
          opacity: 0.6;
        }
        
        .asteroid-1 {
          width: 8px;
          height: 6px;
          top: 20%;
          left: 10%;
          animation-duration: 45s;
          animation-delay: 0s;
        }
        
        .asteroid-2 {
          width: 12px;
          height: 10px;
          top: 70%;
          left: 80%;
          animation-duration: 60s;
          animation-delay: 20s;
        }
        
        .asteroid-3 {
          width: 6px;
          height: 4px;
          top: 40%;
          left: 5%;
          animation-duration: 50s;
          animation-delay: 35s;
        }
        
        @keyframes float {
          0% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(40vw, 20vh) rotate(90deg); }
          50% { transform: translate(80vw, 40vh) rotate(180deg); }
          75% { transform: translate(20vw, 60vh) rotate(270deg); }
          100% { transform: translate(0, 0) rotate(360deg); }
        }

        .constellation {
          position: absolute;
          opacity: 0.3;
          animation: twinkle 8s ease-in-out infinite;
        }
        
        .constellation-1 {
          top: 15%;
          left: 20%;
          width: 100px;
          height: 60px;
          background-image: 
            radial-gradient(circle, rgba(255,255,255,0.9) 2px, transparent 2px),
            radial-gradient(circle, rgba(255,255,255,0.9) 2px, transparent 2px),
            radial-gradient(circle, rgba(255,255,255,0.9) 2px, transparent 2px),
            radial-gradient(circle, rgba(255,255,255,0.9) 2px, transparent 2px);
          background-position: 0 0, 30px 40px, 60px 10px, 90px 30px;
          background-size: 100px 60px;
          animation-delay: 0s;
        }
        
        .constellation-2 {
          top: 70%;
          right: 15%;
          width: 120px;
          height: 80px;
          background-image: 
            radial-gradient(circle, rgba(255,255,255,0.9) 2px, transparent 2px),
            radial-gradient(circle, rgba(255,255,255,0.9) 2px, transparent 2px),
            radial-gradient(circle, rgba(255,255,255,0.9) 2px, transparent 2px),
            radial-gradient(circle, rgba(255,255,255,0.9) 2px, transparent 2px),
            radial-gradient(circle, rgba(255,255,255,0.9) 2px, transparent 2px);
          background-position: 0 0, 40px 60px, 80px 20px, 100px 50px, 60px 70px;
          background-size: 120px 80px;
          animation-delay: 2s;
        }
        
        .constellation-3 {
          top: 40%;
          left: 70%;
          width: 80px;
          height: 80px;
          background-image: 
            radial-gradient(circle, rgba(255,255,255,0.9) 2px, transparent 2px),
            radial-gradient(circle, rgba(255,255,255,0.9) 2px, transparent 2px),
            radial-gradient(circle, rgba(255,255,255,0.9) 2px, transparent 2px);
          background-position: 0 40px, 40px 0, 80px 60px;
          background-size: 80px 80px;
          animation-delay: 4s;
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.7; }
        }

        .orbit {
          fill: none;
          stroke-width: 0.8;
          stroke-dasharray: 2 3;
          opacity: 0.7;
          filter: url(#glow);
        }
        .orbit-1 { stroke: url(#gx-line-1); }
        .orbit-2 { stroke: url(#gx-line-2); }
        .orbit-3 { stroke: url(#gx-line-3); }

        @media (prefers-reduced-motion: reduce) {
          .nebula, 
          .stars-1, 
          .stars-2, 
          .stars-3, 
          .shooting-star,
          .asteroid,
          .constellation,
          .center-glow,
          [style*="animation"] { 
            animation: none !important; 
          }
          
          .nebula {
            background-position: center;
          }
        }
      `}</style>
    </div>
  );
}

function Orbit({
  radius,
  dur,
  reverse,
  children,
}: { radius: string; dur: string; reverse?: boolean; children: React.ReactNode }) {
  return (
    <div
      className="absolute left-1/2 top-1/2"
      style={{
        width: `calc(${radius} * 2)`,
        height: `calc(${radius} * 2)`,
        marginLeft: `calc(${radius} * -1)`,
        marginTop: `calc(${radius} * -1)`,
        animation: `${reverse ? 'spinrev' : 'spin'} ${dur} linear infinite`,
        transformOrigin: 'center',
      }}
    >
      <div className="absolute left-1/2 top-0 -translate-x-1/2">
        {children}
      </div>

      <style jsx>{`
        @keyframes spin { 
          from { transform: rotate(0deg); } 
          to { transform: rotate(360deg); } 
        }
        @keyframes spinrev { 
          from { transform: rotate(0deg); } 
          to { transform: rotate(-360deg); } 
        }
        
        @media (prefers-reduced-motion: reduce) {
          div[style*="animation"] { 
            animation: none !important; 
          }
        }
      `}</style>
    </div>
  );
}

function Badge({ label }: { label: string }) {
  const gradients = {
    Photos: 'from-violet-600/40 to-fuchsia-500/40',
    Music: 'from-cyan-500/40 to-blue-500/40',
    Moods: 'from-indigo-500/40 to-purple-500/40',
    Friends: 'from-emerald-500/40 to-teal-500/40',
    Memories: 'from-rose-500/40 to-pink-500/40'
  };

  return (
    <div className={`px-3.5 py-2 rounded-full text-xs sm:text-sm font-medium border border-white/20 bg-gradient-to-r ${gradients[label]} backdrop-blur-lg shadow-lg`}>
      {label}
    </div>
  );
}