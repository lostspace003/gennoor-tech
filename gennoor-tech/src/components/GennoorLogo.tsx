// GENNOOR TECH — Animated Logo React Component
// Usage: import GennoorLogo from './GennoorLogo'
//        <GennoorLogo variant="horizontal" />

'use client'

import { useEffect, useRef } from 'react';

interface LogoProps {
  variant?: 'horizontal' | 'hero' | 'stacked' | 'icon' | 'compact';
}

const dots = {
  horizontal: {
    viewBox: "0 0 380 140", width: 810, height: 258,
    arc: [
      [98.1,77.7,5.5],[86.5,92.6,5.5],[69.7,100.9,5.5],[50.9,101.0,5.5],
      [34.0,92.9,5.5],[22.2,78.3,5.5],[18.0,60.0,5.5],[22.2,41.7,5.5],
      [34.0,27.1,5.5],[50.9,19.0,5.5],[69.7,19.1,5.5],[86.5,27.4,5.5]
    ],
    bar: [[74,60,5.5],[88,60,5.5],[102,60,5.5]],
    name: { x: 128, y: 56, size: 30, anchor: "start" },
    tag:  { x: 128, y: 82, size: 19, anchor: "start" }
  },
  hero: {
    viewBox: "0 0 380 130", width: 512, height: 151,  // Matches max-w-lg (512px) with proportional height
    arc: [
      [98.1,77.7,5.5],[86.5,92.6,5.5],[69.7,100.9,5.5],[50.9,101.0,5.5],
      [34.0,92.9,5.5],[22.2,78.3,5.5],[18.0,60.0,5.5],[22.2,41.7,5.5],
      [34.0,27.1,5.5],[50.9,19.0,5.5],[69.7,19.1,5.5],[86.5,27.4,5.5]
    ],
    bar: [[74,60,5.5],[88,60,5.5],[102,60,5.5]],
    name: { x: 128, y: 56, size: 30, anchor: "start" },
    tag:  { x: 128, y: 78, size: 11, anchor: "start" }
  },
  stacked: {
    viewBox: "0 0 280 220", width: 480, height: 420,  // 320 * 1.5 = 480, 280 * 1.5 = 420
    arc: [
      [177.1,94.0,6.5],[162.8,112.3,6.5],[142.0,122.6,6.5],[118.7,122.8,6.5],
      [97.7,112.8,6.5],[83.2,94.7,6.5],[78.0,72.0,6.5],[83.2,49.3,6.5],
      [97.7,31.2,6.5],[118.7,21.2,6.5],[142.0,21.4,6.5],[162.8,31.7,6.5]
    ],
    bar: [[148,72,6.5],[165,72,6.5],[182,72,6.5]],
    name: { x: 140, y: 164, size: 28, anchor: "middle" },
    tag:  { x: 140, y: 184, size: 10, anchor: "middle" }
  },
  icon: {
    viewBox: "0 0 130 130", width: 210, height: 210,  // 140 * 1.5 = 210, 140 * 1.5 = 210
    arc: [
      [105.8,84.0,6],[93.4,99.9,6],[75.4,108.8,6],[55.3,108.9,6],
      [37.1,100.3,6],[24.5,84.6,6],[20.0,65.0,6],[24.5,45.4,6],
      [37.1,29.7,6],[55.3,21.1,6],[75.4,21.2,6],[93.4,30.1,6]
    ],
    bar: [[80,65,6],[95,65,6],[110,65,6]],
    name: null, tag: null
  },
  compact: {
    viewBox: "0 0 300 70", width: 450, height: 105,  // 300 * 1.5 = 450, 70 * 1.5 = 105
    arc: [
      [51.8,40.1,3.5],[45.2,48.6,3.5],[35.5,53.4,3.5],[24.8,53.4,3.5],
      [15.1,48.8,3.5],[8.4,40.5,3.5],[6.0,30.0,3.5],[8.4,19.5,3.5],
      [15.1,11.2,3.5],[24.8,6.6,3.5],[35.5,6.6,3.5],[45.2,11.4,3.5]
    ],
    bar: [[38,30,3.5],[46,30,3.5],[54,30,3.5]],
    name: { x: 70, y: 30, size: 22, anchor: "start" },
    tag:  { x: 72, y: 46, size: 8.5, anchor: "start" }
  }
};

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&family=Sora:wght@400&display=swap');
@keyframes gt-pop{0%{transform:scale(0);opacity:0}60%{transform:scale(1.35);opacity:1}100%{transform:scale(1);opacity:1}}
@keyframes gt-pulse{0%,100%{opacity:1}50%{opacity:.65}}
@keyframes gt-slide{0%{opacity:0;transform:translateX(-10px)}100%{opacity:1;transform:translateX(0)}}
@keyframes gt-fade{0%{opacity:0}100%{opacity:1}}
@keyframes gt-glow{0%,100%{filter:drop-shadow(0 0 0 rgba(37,99,235,0))}50%{filter:drop-shadow(0 0 8px rgba(37,99,235,.25))}}
`;

export default function GennoorLogo({ variant = "horizontal" }: LogoProps) {
  const ref = useRef<SVGSVGElement>(null);
  const d = dots[variant];

  const nameColor = "#2d2d2d";
  const tagColor  = "#aaaaaa";

  useEffect(() => {
    // Inject styles once
    if (!document.getElementById('gt-styles')) {
      const style = document.createElement('style');
      style.id = 'gt-styles';
      style.textContent = styles;
      document.head.appendChild(style);
    }
  }, []);

  const arcDelay = (i: number) => `${0.1 + i * 0.1}s`;
  const pulseDelay = (i: number) => `${3.5 + i * 0.1}s`;
  const barDelay = (i: number) => `${1.45 + i * 0.15}s`;

  return (
    <svg
      ref={ref}
      width={d.width}
      height={d.height}
      viewBox={d.viewBox}
      style={{ animation: 'gt-glow 3s ease-in-out 3.2s infinite' }}
      role="img"
      aria-label="Gennoor Tech logo"
    >
      {d.arc.map(([cx, cy, r], i) => (
        <circle
          key={`a${i}`} cx={cx} cy={cy} r={r} fill="#2563EB"
          style={{
            opacity: 0, transformOrigin: 'center', transformBox: 'fill-box',
            animation: `gt-pop .35s cubic-bezier(.34,1.56,.64,1) ${arcDelay(i)} forwards, gt-pulse 2.5s ease-in-out ${pulseDelay(i)} infinite`
          }}
        />
      ))}
      {d.bar.map(([cx, cy, r], i) => (
        <circle
          key={`b${i}`} cx={cx} cy={cy} r={r}
          fill={i < 2 ? "#F59E0B" : "#2563EB"}
          style={{
            opacity: 0, transformOrigin: 'center', transformBox: 'fill-box',
            animation: `gt-pop .4s cubic-bezier(.34,1.56,.64,1) ${barDelay(i)} forwards, gt-pulse ${i<2?'2':'2.5'}s ease-in-out ${3.5+i*0.2}s infinite`
          }}
        />
      ))}
      {d.name && (
        <text
          x={d.name.x} y={d.name.y} textAnchor={d.name.anchor as any}
          fontFamily="'Plus Jakarta Sans',Helvetica,Arial,sans-serif"
          fontSize={d.name.size} fontWeight="700"
          letterSpacing="0.5"
          style={{ opacity: 0, animation: 'gt-slide .7s ease-out 2.1s forwards' }}
        >
          <tspan fill="#2D3748">Ge</tspan>
          <tspan fill="#2563EB">nn</tspan>
          <tspan fill="#F59E0B">oo</tspan>
          <tspan fill="#2563EB">r</tspan>
          <tspan fill="#4A5568"> Tech</tspan>
        </text>
      )}
      {d.tag && (
        <text
          x={d.tag.x} y={d.tag.y} textAnchor={d.tag.anchor as any}
          fontFamily="'Sora',Helvetica,Arial,sans-serif"
          fontSize={d.tag.size} fontWeight="700" fill={tagColor}
          letterSpacing="3" style={{ opacity: 0, fontVariant: 'small-caps', animation: 'gt-fade .7s ease-out 2.6s forwards' }}
        >
          train. innovate. build.
        </text>
      )}
    </svg>
  );
}