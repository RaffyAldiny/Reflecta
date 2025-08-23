'use client';

import { useEffect, useRef } from 'react';

/**
 * Enhanced full-screen cosmic background with:
 * - Dynamic 3D-like parallax effect on mouse movement
 * - More vibrant nebula with animated gradient shifts
 * - Three star layers with varying sizes and animation speeds
 * - Glowing orbit trails with improved visual design
 * - Animated badges with subtle hover effects (when pointer events enabled)
 * - Pulsing center element with dynamic glow
 * - Shooting stars for added dynamism
 * - Optimized performance with requestAnimationFrame
 */
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
      // Normalize mouse position to -0.5 to 0.5 range
      mouseX = (e.clientX / window.innerWidth) - 0.5;
      mouseY = (e.clientY / window.innerHeight) - 0.5;
    };
    
    const animate = () => {
      const moveX = mouseX * 20; // Max 20px movement
      const moveY = mouseY * 20;
      
      container.style.transform = `
        translate3d(${moveX}px, ${moveY}px, 0)
      `;
      
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
        {/* Enhanced Nebula with multiple gradient layers */}
        <div className="nebula absolute inset-0" />
        
        {/* Shooting stars */}
        <div className="shooting-stars absolute inset-0" />
        
        {/* Three layers of stars for depth */}
        <div className="stars stars-1 absolute inset-0" />
        <div className="stars stars-2 absolute inset-0" />
        <div className="stars stars-3 absolute inset-0" />
        
        {/* Glowing particles */}
        <div className="particles absolute inset-0" />

        {/* Orbit system (centered & responsive) */}
        <div className="absolute left-1/2 top-1/2 w-[min(92vw,720px)] aspect-square -translate-x-1/2 -translate-y-1/2">
          {/* Enhanced orbit circles with glow effect */}
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

          {/* Enhanced center "You" with pulsing animation */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 grid place-items-center">
            <div className="center-glow absolute rounded-full bg-violet-500/20 blur-xl animate-pulse-slow" />
            <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-gradient-to-br from-violet-600/30 to-fuchsia-600/30 border border-white/20 backdrop-blur-xl shadow-[0_0_60px_0_rgba(139,92,246,0.5)] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
              <div className="h-full w-full grid place-items-center text-xs sm:text-sm font-medium tracking-wider text-white">
                You
              </div>
            </div>
          </div>

          {/* orbiting badges with enhanced styling */}
          <Orbit radius="calc(50% - 42px)" dur="28s">
            <Badge label="Photos" />
          </Orbit>
          <Orbit radius="calc(50% - 30px)" dur="22s" reverse>
            <Badge label="Music" />
          </Orbit>
          <Orbit radius="calc(50% - 18px)" dur="18s">
            <Badge label="Moods" />
          </Orbit>
        </div>
      </div>

      {/* component-scoped styling */}
      <style jsx>{`
        /* Enhanced Nebula with more vibrant colors and movement */
        .nebula {
          background:
            radial-gradient(60% 45% at 15% 0%,  rgba(139, 92, 246, 0.4) 0%, transparent 70%),
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

        /* Shooting stars */
        .shooting-stars:before {
          content: '';
          position: absolute;
          top: 0;
          left: -100px;
          width: 100px;
          height: 2px;
          background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.8));
          animation: shooting 12s linear infinite;
        }
        
        .shooting-stars:after {
          content: '';
          position: absolute;
          top: 30%;
          right: -100px;
          width: 80px;
          height: 1px;
          background: linear-gradient(to left, transparent, rgba(255, 255, 255, 0.6));
          animation: shooting 15s linear infinite;
          animation-delay: 5s;
        }
        
        @keyframes shooting {
          0% { transform: translateX(0) rotate(45deg); opacity: 0; }
          10% { opacity: 1; }
          20% { transform: translateX(100vw) rotate(45deg); opacity: 0; }
          100% { opacity: 0; }
        }

        /* Enhanced stars with different sizes and animations */
        .stars {
          background-image: 
            radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px);
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

        /* Particles */
        .particles:before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: 
            radial-gradient(circle at 20% 30%, rgba(236, 72, 153, 0.3) 0px, transparent 2px),
            radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.3) 0px, transparent 2px),
            radial-gradient(circle at 40% 70%, rgba(6, 182, 212, 0.3) 0px, transparent 2px),
            radial-gradient(circle at 60% 80%, rgba(59, 130, 246, 0.3) 0px, transparent 2px);
          background-size: 100% 100%;
          animation: twinkle 8s ease-in-out infinite;
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.7; }
        }

        /* Enhanced orbits */
        .orbit {
          fill: none;
          stroke-width: 0.8;
          stroke-dasharray: 2 3;
          opacity: 0.7;
          filter: url(#glow);
        }
        .orbit-1 {
          stroke: url(#gx-line-1);
        }
        .orbit-2 {
          stroke: url(#gx-line-2);
        }
        .orbit-3 {
          stroke: url(#gx-line-3);
        }

        /* Pulsing animation for center element */
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.5; transform: scale(1.1); }
          50% { opacity: 0.8; transform: scale(1.3); }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 6s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        /* Respect reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .nebula, 
          .stars-1, 
          .stars-2, 
          .stars-3, 
          .shooting-stars:before,
          .shooting-stars:after,
          .particles:before,
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

/* ---------- Enhanced helpers ---------- */

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
      <div className="absolute left-1/2 top-0 -translate-x-1/2 orbit-badge-container">
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
        
        .orbit-badge-container {
          transition: transform 0.3s ease;
        }
        
        .orbit-badge-container:hover {
          transform: translateX(-50%) scale(1.1);
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
  const gradient =
    label === 'Photos'
      ? 'from-violet-600/40 to-fuchsia-500/40'
      : label === 'Music'
      ? 'from-cyan-500/40 to-blue-500/40'
      : 'from-indigo-500/40 to-purple-500/40';

  return (
    <div className={`relative orbit-badge ${label.toLowerCase()}`}>
      <div className={`px-3.5 py-2 rounded-full text-xs sm:text-sm font-medium border border-white/20 bg-gradient-to-r ${gradient} backdrop-blur-lg shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl`}>
        {label}
      </div>
      <style jsx>{`
        .orbit-badge:before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 110%;
          height: 110%;
          border-radius: 50%;
          transform: translate(-50%, -50%) scale(0.9);
          opacity: 0;
          transition: opacity 0.3s ease, transform 0.3s ease;
          z-index: -1;
        }
        
        .photos:before {
          background: radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%);
        }
        
        .music:before {
          background: radial-gradient(circle, rgba(6, 182, 212, 0.3) 0%, transparent 70%);
        }
        
        .moods:before {
          background: radial-gradient(circle, rgba(79, 70, 229, 0.3) 0%, transparent 70%);
        }
        
        .orbit-badge:hover:before {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1.1);
        }
        
        @media (prefers-reduced-motion: reduce) {
          .orbit-badge, .orbit-badge:before {
            transition: none;
          }
        }
      `}</style>
    </div>
  );
}