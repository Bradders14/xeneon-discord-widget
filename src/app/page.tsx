'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import {
  AudioLines,
  Monitor,
  Maximize2,
  Minimize2,
  ExternalLink,
  Palette,
  SlidersHorizontal,
  Radio,
  Music,
  Volume2,
  Eye,
  Cpu,
  Play,
} from 'lucide-react'

const WIDGET_W = 1280
const WIDGET_H = 800

export default function Home() {
  const screenRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [rawMode, setRawMode] = useState(false)

  const computeScale = useCallback(() => {
    const el = screenRef.current
    if (!el) return
    const w = el.clientWidth
    const h = el.clientHeight
    if (w > 0 && h > 0) {
      // fit by width; visualizer canvas is fluid so aspect is flexible
      setScale(w / WIDGET_W)
    }
  }, [])

  useEffect(() => {
    computeScale()
    const ro = new ResizeObserver(computeScale)
    if (screenRef.current) ro.observe(screenRef.current)
    window.addEventListener('resize', computeScale)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', computeScale)
    }
  }, [computeScale, rawMode])

  const features = [
    {
      icon: Music,
      title: 'Any PC Audio',
      desc: 'Captures system sound via the browser — Spotify, YouTube, games, Tidal, anything playing. No app install.',
      tint: 'from-cyan-500/20 to-cyan-500/5 text-cyan-300',
    },
    {
      icon: Eye,
      title: '6 Visualisation Modes',
      desc: 'Bars, Mirror, Waveform, Radial, Ring and Particles — switch instantly from the top bar.',
      tint: 'from-fuchsia-500/20 to-fuchsia-500/5 text-fuchsia-300',
    },
    {
      icon: Palette,
      title: 'Full Colour Control',
      desc: '8 presets (Neon, Aurora, Sunset, Lava, UV, Gold, Matrix, Mono) plus custom start/end colour pickers.',
      tint: 'from-amber-500/20 to-amber-500/5 text-amber-300',
    },
    {
      icon: SlidersHorizontal,
      title: 'Tune Everything',
      desc: 'Sensitivity, smoothing, glow strength, background trail and beat-pulse — all on live sliders.',
      tint: 'from-emerald-500/20 to-emerald-500/5 text-emerald-300',
    },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-[#06070a] text-zinc-200 selection:bg-cyan-500/30">
      {/* ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 opacity-80"
        style={{
          background:
            'radial-gradient(900px 480px at 10% -8%, rgba(0,240,255,.14), transparent 60%), radial-gradient(820px 460px at 100% 0%, rgba(255,0,229,.12), transparent 55%), radial-gradient(700px 500px at 50% 120%, rgba(0,255,157,.08), transparent 60%)',
        }}
      />

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="px-5 sm:px-8 pt-7 pb-4">
          <div className="max-w-[1400px] mx-auto flex flex-wrap items-center gap-4 justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-400 to-fuchsia-500 grid place-items-center shadow-lg shadow-cyan-500/20">
                <AudioLines className="w-6 h-6 text-black" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-tight">
                  Xeneon Music Visualizer
                </h1>
                <p className="text-xs sm:text-sm text-zinc-400">
                  A reactive music visualizer for the Corsair Xeneon Edge — live in an iframe below.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge icon={Monitor} label="Medium → XL" sub="scalable" />
              <Badge icon={Cpu} label="Pure browser" sub="no app" pulse />
              <a
                href="/visualizer.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 h-9 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-zinc-200 transition"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Open visualizer
              </a>
            </div>
          </div>
        </header>

        {/* Toolbar */}
        <div className="px-5 sm:px-8">
          <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                Live preview · demo mode
              </span>
              <span className="text-zinc-600">·</span>
              <span className="tabular-nums">
                {(scale * 100).toFixed(0)}% scale · {WIDGET_W}×{WIDGET_H}
              </span>
            </div>
            <div className="flex items-center gap-1 p-1 rounded-lg bg-white/5 border border-white/10">
              <button
                onClick={() => setRawMode(false)}
                className={`inline-flex items-center gap-1.5 px-3 h-7 rounded-md text-xs font-semibold transition ${
                  !rawMode ? 'bg-white/10 text-white' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                Device
              </button>
              <button
                onClick={() => setRawMode(true)}
                className={`inline-flex items-center gap-1.5 px-3 h-7 rounded-md text-xs font-semibold transition ${
                  rawMode ? 'bg-white/10 text-white' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {rawMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                Raw
              </button>
            </div>
          </div>
        </div>

        {/* Main: device mockup */}
        <main className="flex-1 px-5 sm:px-8 pb-8">
          <div className="max-w-[1400px] mx-auto">
            <div
              className={
                rawMode
                  ? 'rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50 bg-black'
                  : 'mx-auto'
              }
              style={rawMode ? undefined : { maxWidth: 1180 }}
            >
              {rawMode ? (
                <div
                  ref={screenRef}
                  className="relative w-full"
                  style={{ aspectRatio: `${WIDGET_W} / ${WIDGET_H}` }}
                >
                  <ScaledIframe scale={scale} />
                </div>
              ) : (
                <div className="relative">
                  {/* monitor body */}
                  <div
                    className="relative rounded-[20px] p-2.5 sm:p-3"
                    style={{
                      background:
                        'linear-gradient(160deg,#2a2c30 0%,#161719 40%,#0e0f11 100%)',
                      boxShadow:
                        '0 30px 80px -20px rgba(0,0,0,.8), inset 0 1px 0 rgba(255,255,255,.08), inset 0 -1px 0 rgba(0,0,0,.6)',
                    }}
                  >
                    <div
                      ref={screenRef}
                      className="relative w-full overflow-hidden rounded-[10px] bg-black"
                      style={{ aspectRatio: `${WIDGET_W} / ${WIDGET_H}` }}
                    >
                      <ScaledIframe scale={scale} />
                      <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 rounded-[10px]"
                        style={{
                          background:
                            'linear-gradient(115deg, rgba(255,255,255,.06) 0%, transparent 18%, transparent 82%, rgba(255,255,255,.03) 100%)',
                        }}
                      />
                    </div>

                    {/* bottom chin with branding */}
                    <div className="flex items-center justify-between px-3 pt-2.5 pb-1">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(0,240,255,.8)]" />
                        <span className="text-[10px] font-semibold tracking-[0.25em] text-zinc-500">
                          CORSAIR
                        </span>
                      </div>
                      <span className="text-[10px] font-medium tracking-wide text-zinc-600">
                        XENEON EDGE · 14.5&quot; TOUCH
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-medium text-zinc-600">USB-C</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                      </div>
                    </div>
                  </div>

                  {/* stand */}
                  <div className="flex flex-col items-center -mt-1">
                    <div
                      className="w-24 h-5 rounded-b-lg"
                      style={{
                        background: 'linear-gradient(180deg,#1a1b1e,#0c0d10)',
                        boxShadow: 'inset 0 1px 0 rgba(255,255,255,.06)',
                      }}
                    />
                    <div
                      className="w-56 h-2 rounded-full"
                      style={{
                        background: 'linear-gradient(180deg,#22242a,#0a0b0d)',
                        boxShadow: '0 10px 24px rgba(0,0,0,.6)',
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* How it works strip */}
            <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-cyan-500/15 grid place-items-center flex-shrink-0">
                  <Play className="w-4 h-4 text-cyan-300" />
                </div>
                <div className="text-xs text-zinc-300 leading-relaxed">
                  <b className="text-white">How it works on your Xeneon:</b> Add an iframe widget
                  pointing to <code className="px-1.5 py-0.5 rounded bg-white/10 text-cyan-300 font-mono text-[11px]">/visualizer.html</code>,
                  set to Medium or larger. On first load, tap <b>“Connect PC Audio”</b> and in the
                  share dialog pick <b>Entire screen</b> + tick <b>“Share system audio”</b>. The
                  visualiser then reacts to anything your PC plays — no companion app, no install.
                </div>
              </div>
            </div>

            {/* Feature cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="group rounded-xl border border-white/10 bg-white/[0.03] p-4 hover:bg-white/[0.06] transition backdrop-blur-sm"
                >
                  <div
                    className={`w-10 h-10 rounded-lg grid place-items-center mb-3 bg-gradient-to-br ${f.tint}`}
                  >
                    <f.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1">{f.title}</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>

            {/* spec strip */}
            <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.02] p-4 flex flex-wrap items-center gap-x-6 gap-y-3 justify-center text-center">
              <Spec icon={Music} label="System audio capture" />
              <Spec icon={Eye} label="6 visual modes" />
              <Spec icon={Palette} label="8 presets + custom" />
              <Spec icon={SlidersHorizontal} label="Live tuning" />
              <Spec icon={Volume2} label="Sensitivity & glow" />
              <Spec icon={Radio} label="Beat-reactive" />
            </div>
          </div>
        </main>

        {/* Footer (sticky to bottom) */}
        <footer className="mt-auto border-t border-white/10 bg-black/40 backdrop-blur-md">
          <div className="max-w-[1400px] mx-auto px-5 sm:px-8 py-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-zinc-500">
              Pure-browser visualiser · uses getDisplayMedia with system-audio sharing. Deploy to
              Vercel and embed via iframe on the Xeneon.
            </p>
            <p className="text-xs text-zinc-600">
              Built for Corsair Xeneon Edge · scales Medium → XL
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}

/* ---------- helpers ---------- */

function ScaledIframe({ scale }: { scale: number }) {
  return (
    <iframe
      src="/visualizer.html"
      title="Xeneon Music Visualizer"
      loading="eager"
      className="absolute top-0 left-0 origin-top-left border-0"
      style={{
        width: WIDGET_W,
        height: WIDGET_H,
        transform: `scale(${scale})`,
        pointerEvents: 'auto',
      }}
      allow="autoplay; microphone; display-capture"
    />
  )
}

function Badge({
  icon: Icon,
  label,
  sub,
  pulse,
}: {
  icon: React.ElementType
  label: string
  sub?: string
  pulse?: boolean
}) {
  return (
    <div className="inline-flex items-center gap-2 h-9 px-3 rounded-lg bg-white/5 border border-white/10">
      <Icon className="w-3.5 h-3.5 text-zinc-400" />
      <span className="text-xs font-semibold text-zinc-200">{label}</span>
      {sub && (
        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-zinc-400">
          {pulse && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />}
          {sub}
        </span>
      )}
    </div>
  )
}

function Spec({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div className="inline-flex items-center gap-2">
      <Icon className="w-4 h-4 text-cyan-300/80" />
      <span className="text-xs font-medium text-zinc-300">{label}</span>
    </div>
  )
}
