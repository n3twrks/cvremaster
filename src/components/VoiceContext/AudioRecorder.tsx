'use client'

import { useRef, useState, useEffect } from 'react'
import { Square } from 'lucide-react'

interface Props {
  onStop: (blob: Blob, durationSec: number) => void
  onCancel: () => void
}

export default function AudioRecorder({ onStop, onCancel }: Props) {
  const [elapsed, setElapsed] = useState(0)
  const [showWarning, setShowWarning] = useState(false)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mediaRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const startTimeRef = useRef(0)
  const animFrameRef = useRef(0)
  const streamRef = useRef<MediaStream | null>(null)
  const stoppedRef = useRef(false)
  const onStopRef = useRef(onStop)
  const onCancelRef = useRef(onCancel)

  useEffect(() => { onStopRef.current = onStop }, [onStop])
  useEffect(() => { onCancelRef.current = onCancel }, [onCancel])

  function stop() {
    if (stoppedRef.current) return
    stoppedRef.current = true
    const durationSec = startTimeRef.current
      ? Math.floor((Date.now() - startTimeRef.current) / 1000)
      : 0
    cancelAnimationFrame(animFrameRef.current)
    streamRef.current?.getTracks().forEach(t => t.stop())
    const recorder = mediaRef.current
    if (recorder && recorder.state !== 'inactive') {
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType })
        onStopRef.current(blob, durationSec)
      }
      recorder.stop()
    }
  }

  // Timer
  useEffect(() => {
    const id = setInterval(() => {
      if (!startTimeRef.current) return
      const sec = Math.floor((Date.now() - startTimeRef.current) / 1000)
      setElapsed(sec)
      if (sec >= 600) setShowWarning(true)
      if (sec >= 900) stop()
    }, 1000)
    return () => clearInterval(id)
  }, [])

  // Start recording
  useEffect(() => {
    let mounted = true

    async function start() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        if (!mounted) { stream.getTracks().forEach(t => t.stop()); return }

        streamRef.current = stream
        startTimeRef.current = Date.now()

        const audioCtx = new AudioContext()
        const source = audioCtx.createMediaStreamSource(stream)
        const analyser = audioCtx.createAnalyser()
        analyser.fftSize = 256
        source.connect(analyser)

        const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
          ? 'audio/webm;codecs=opus'
          : 'audio/webm'
        const recorder = new MediaRecorder(stream, { mimeType })
        mediaRef.current = recorder
        recorder.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data) }
        recorder.start(1000)

        // Waveform
        const buf = new Uint8Array(analyser.frequencyBinCount)
        function frame() {
          const canvas = canvasRef.current
          if (!canvas) return
          const ctx = canvas.getContext('2d')!
          analyser.getByteTimeDomainData(buf)
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          ctx.strokeStyle = '#1B4332'
          ctx.lineWidth = 1.5
          ctx.beginPath()
          const sw = canvas.width / buf.length
          let x = 0
          for (let i = 0; i < buf.length; i++) {
            const y = (buf[i] / 128.0) * (canvas.height / 2)
            if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y)
            x += sw
          }
          ctx.stroke()
          animFrameRef.current = requestAnimationFrame(frame)
        }
        frame()
      } catch {
        if (mounted) onCancelRef.current()
      }
    }

    start()
    return () => {
      mounted = false
      cancelAnimationFrame(animFrameRef.current)
      streamRef.current?.getTracks().forEach(t => t.stop())
    }
  }, [])

  function fmt(sec: number) {
    const m = Math.floor(sec / 60).toString().padStart(2, '0')
    const s = (sec % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  return (
    <div className="flex flex-col gap-2 py-1.5">
      {showWarning && (
        <p className="text-[11px] text-[#B45309] font-body">⚠ Enregistrement long — arrêt automatique à 15 min.</p>
      )}
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1.5 text-sm font-mono text-[#1A1A18] font-medium tabular-nums shrink-0">
          <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          {fmt(elapsed)}
        </span>
        <canvas
          ref={canvasRef}
          width={140}
          height={28}
          className="flex-1 rounded bg-[#F4F3F0] min-w-0"
        />
        <button
          onClick={stop}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-[#1B4332] text-white text-xs font-body font-medium hover:bg-[#163A2B] transition-colors shrink-0"
        >
          <Square size={10} fill="white" />
          Arrêter
        </button>
      </div>
    </div>
  )
}
