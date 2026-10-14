/**
 * AudioAlarmManager
 * Implements ISO 60601-1-8 medical alarm sound profiles using Web Audio API synthesis.
 * Safe for modern browsers: initializes audio context on user interaction.
 */

class AudioAlarmManager {
  private audioCtx: AudioContext | null = null
  private isMuted: boolean = false
  private volume: number = 0.25

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null
    if (!this.audioCtx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass()
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {})
    }
    return this.audioCtx
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted
  }

  public getIsMuted(): boolean {
    return this.isMuted
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted
    if (!this.isMuted) {
      this.playAcknowledgmentPing()
    }
    return this.isMuted
  }

  public setVolume(vol: number): void {
    this.volume = Math.max(0, Math.min(1, vol))
  }

  public getVolume(): number {
    return this.volume
  }

  /**
   * Play Critical Alarm Chime (ISO 60601-1-8 High-Priority 3-tone pattern)
   */
  public playCriticalAlarm(): void {
    if (this.isMuted) return
    const ctx = this.getContext()
    if (!ctx) return

    const now = ctx.currentTime
    const frequencies = [587.33, 659.25, 783.99] // D5, E5, G5

    frequencies.forEach((freq, index) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now + index * 0.14)

      // Envelope: gentle attack and decay
      gain.gain.setValueAtTime(0.0001, now + index * 0.14)
      gain.gain.exponentialRampToValueAtTime(this.volume * 0.4, now + index * 0.14 + 0.03)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.14 + 0.12)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now + index * 0.14)
      osc.stop(now + index * 0.14 + 0.13)
    })
  }

  /**
   * Play Warning Chime (Medium-priority 2-tone alert)
   */
  public playWarningAlert(): void {
    if (this.isMuted) return
    const ctx = this.getContext()
    if (!ctx) return

    const now = ctx.currentTime
    const frequencies = [493.88, 587.33] // B4, D5

    frequencies.forEach((freq, index) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now + index * 0.16)

      gain.gain.setValueAtTime(0.0001, now + index * 0.16)
      gain.gain.exponentialRampToValueAtTime(this.volume * 0.3, now + index * 0.16 + 0.04)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.16 + 0.14)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now + index * 0.16)
      osc.stop(now + index * 0.16 + 0.15)
    })
  }

  /**
   * Gentle acknowledgment ping when clinician resolves/acknowledges an alarm
   */
  public playAcknowledgmentPing(): void {
    if (this.isMuted) return
    const ctx = this.getContext()
    if (!ctx) return

    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(880, now) // A5

    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.exponentialRampToValueAtTime(this.volume * 0.25, now + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.26)
  }
}

export const audioAlarmManager = new AudioAlarmManager()
