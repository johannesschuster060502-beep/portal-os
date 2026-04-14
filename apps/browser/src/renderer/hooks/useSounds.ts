import { useSettingsStore } from '@store/settings.store'

let audioCtx: AudioContext | null = null

function getCtx(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext()
  }
  return audioCtx
}

function playTone(freq: number, duration: number, volume = 0.04): void {
  if (!useSettingsStore.getState().soundEnabled) return

  try {
    const ctx = getCtx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.value = freq
    gain.gain.value = volume
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration / 1000)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start()
    osc.stop(ctx.currentTime + duration / 1000)
  } catch {
    // Audio context might not be available
  }
}

export function soundTabOpen(): void {
  playTone(800, 50, 0.03)
}

export function soundTabClose(): void {
  playTone(600, 40, 0.025)
}

export function soundNavigate(): void {
  playTone(500, 30, 0.015)
}

export function soundClick(): void {
  playTone(1000, 20, 0.02)
}
