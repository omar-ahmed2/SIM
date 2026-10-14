import React, { useState, useRef, useEffect } from 'react'
import { Icon } from '../ui/Icon'
import type { WardInfant } from '../../types/dashboard'
import incubatorHudImage from '../../assets/images/incubator-hud.png'

interface VideoAiPlayerProps {
  activeInfant?: WardInfant | null
  onUploadVideo?: (videoUrl: string, fileName: string) => void
  onTriggerAlert?: (message: string) => void
}

export const VideoAiPlayer: React.FC<VideoAiPlayerProps> = ({
  activeInfant,
  onUploadVideo,
  onTriggerAlert,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [activeAiEvent, setActiveAiEvent] = useState<string | null>(null)

  // Dynamic AI detections based on state
  const [posture, setPosture] = useState('Supine (On Back)')
  const [activity, setActivity] = useState<'Calm' | 'Active' | 'Restless'>('Calm')
  const [breathing, setBreathing] = useState('Regular')
  const [confidence, setConfidence] = useState(98.6)

  const handlePlayPause = () => {
    if (!videoRef.current) return
    if (videoRef.current.paused) {
      videoRef.current.play()
      setIsPlaying(true)
    } else {
      videoRef.current.pause()
      setIsPlaying(false)
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      onUploadVideo(url, file.name)
      setIsPlaying(true)
    }
  }

  // Load a built-in simulation / sample video
  const handleLoadSampleVideo = () => {
    // Public sample video or animated canvas
    const sampleUrl = ''
    onUploadVideo(sampleUrl, 'Sample_Incubator_Observation.mp4')
    setIsPlaying(true)
  }

  // Simulate an AI Event trigger
  const handleSimulateAiTrigger = (type: 'calm' | 'movement' | 'posture') => {
    if (type === 'movement') {
      setActivity('Restless')
      setActiveAiEvent('⚠️ AI Alert: Rapid Limb Movement Detected (Threshold > 85%)')
      setConfidence(99.2)
      onTriggerAlert?.('Rapid limb movement detected on incubator camera feed')
    } else if (type === 'posture') {
      setPosture('Prone Adjustment')
      setActiveAiEvent('ℹ️ AI Detection: Infant head turn & posture adjustment observed')
      setConfidence(97.8)
    } else {
      setActivity('Calm')
      setPosture('Supine (On Back)')
      setActiveAiEvent(null)
      setConfidence(98.6)
    }
  }

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
    const s = Math.floor(secs % 60)
    return `${m}:${s < 10 ? '0' : ''}${s}`
  }

  const videoSrc = (activeInfant as any)?.videoUrl

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-5 sm:p-6 shadow-xs border border-outline-variant/30 flex flex-col justify-between">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="video/mp4,video/webm,video/quicktime"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-2 border-b border-outline-variant/20">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-secondary-container/30 text-secondary flex items-center justify-center">
            <Icon name="videocam" size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-base text-on-surface">
                AI Video Observation &amp; Movement Analysis
              </span>
              <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-secondary font-mono text-[10px] font-bold uppercase">
                AI Vision v2.4
              </span>
            </div>
            <p className="text-xs text-on-surface-variant">
              {activeInfant
                ? `Active Feed: ${activeInfant.name} (${activeInfant.incubatorNumber})`
                : 'Select an incubator or upload a video clip to begin AI analysis.'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-outline-variant/30"
          >
            <Icon name="upload_file" size={16} className="text-primary" />
            <span>{videoSrc ? 'Replace Video' : 'Upload Video'}</span>
          </button>

          {!videoSrc && (
            <button
              type="button"
              onClick={handleLoadSampleVideo}
              className="px-3 py-1.5 rounded-xl bg-primary-container hover:bg-primary text-on-primary text-xs font-bold transition-all cursor-pointer shadow-2xs"
            >
              Load Demo Video
            </button>
          )}
        </div>
      </div>

      {/* Video Viewport / Dropzone */}
      <div className="relative w-full aspect-video bg-inverse-surface rounded-xl overflow-hidden my-4 flex items-center justify-center border border-outline-variant/40 shadow-inner group">
        {videoSrc ? (
          <>
            {/* The Actual Video */}
            <video
              ref={videoRef}
              src={videoSrc}
              className="w-full h-full object-cover"
              loop
              playsInline
              muted={isMuted}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onClick={handlePlayPause}
            />

            {/* AI HUD Scanner & Crosshair Overlay */}
            <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between">
              {/* Top HUD Line */}
              <div className="flex items-center justify-between text-[11px] font-mono text-tertiary-fixed font-bold bg-inverse-surface/60 backdrop-blur-xs px-3 py-1 rounded-lg self-start border border-tertiary-fixed/30">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-tertiary-fixed animate-ping" />
                  <span>AI Computer-Vision Engine • Tracking Infant Movement</span>
                </span>
              </div>

              {/* Central Observation Reticle */}
              <div className="self-center border border-dashed border-secondary/60 rounded-xl w-48 h-32 flex flex-col items-center justify-between p-2 opacity-70">
                <span className="text-[10px] font-mono text-secondary-fixed bg-secondary/40 px-1 rounded">
                  Bounding Box: ISOLETTE-ROI
                </span>
                <span className="text-[10px] font-mono text-secondary-fixed">
                  Conf: {(confidence).toFixed(1)}%
                </span>
              </div>

              {/* Bottom Video Controls Bar */}
              <div className="pointer-events-auto bg-inverse-surface/80 backdrop-blur-md px-3.5 py-2 rounded-xl flex items-center justify-between gap-3 border border-outline/30 text-inverse-on-surface">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePlayPause}
                    className="p-1 rounded-lg hover:bg-surface/20 transition-colors cursor-pointer text-white"
                  >
                    <Icon name={isPlaying ? 'pause' : 'play_arrow'} size={20} />
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-1 rounded-lg hover:bg-surface/20 transition-colors cursor-pointer text-white"
                  >
                    <Icon name={isMuted ? 'volume_off' : 'volume_up'} size={18} />
                  </button>

                  <span className="font-mono text-xs text-inverse-on-surface/80 tabular-nums">
                    {formatTime(currentTime)} / {formatTime(duration || 0)}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-tertiary" />
                  <span className="font-mono text-[11px] text-tertiary-fixed font-semibold">
                    {(activeInfant as any)?.videoFileName || 'Incubator_Stream.mp4'}
                  </span>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Empty / Upload Prompt Dropzone */
          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center p-6 text-center cursor-pointer hover:bg-surface-container/20 transition-all w-full h-full"
          >
            <div className="relative mb-3">
              <img
                src={incubatorHudImage}
                alt="Incubator HUD schematic"
                className="w-36 h-24 object-cover rounded-xl opacity-60 border border-outline/40 shadow-xs"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-inverse-surface/40 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-secondary-container/40 text-secondary-fixed flex items-center justify-center shadow-md">
                  <Icon name="cloud_upload" size={24} />
                </div>
              </div>
            </div>

            <span className="font-display font-bold text-sm text-inverse-on-surface mb-1">
              Upload Video for AI Analysis
            </span>
            <p className="text-xs text-inverse-on-surface/70 max-w-sm mb-3">
              Drag &amp; drop an incubator video clip (MP4, WebM) here, or click to browse. The AI model will observe movement patterns and posture.
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  fileInputRef.current?.click()
                }}
                className="px-3.5 py-1.5 rounded-xl bg-primary-container text-on-primary text-xs font-bold hover:bg-primary transition-all shadow-xs"
              >
                Choose Video File
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleLoadSampleVideo()
                }}
                className="px-3.5 py-1.5 rounded-xl bg-surface/20 text-inverse-on-surface text-xs font-semibold hover:bg-surface/30 transition-colors"
              >
                Try Sample Clip
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Real-time AI Vision Insights Bar */}
      <div className="bg-surface-container-low rounded-xl p-3 sm:p-4 border border-outline-variant/30 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Icon name="auto_awesome" size={18} className="text-secondary" />
            <span className="font-display font-bold text-xs text-on-surface">
              Real-Time AI Detections
            </span>
          </div>

          {/* Test Trigger Simulation Buttons */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-on-surface-variant font-medium hidden sm:inline">
              Test AI Trigger:
            </span>
            <button
              type="button"
              onClick={() => handleSimulateAiTrigger('movement')}
              className="px-2 py-1 rounded-lg bg-warning-container text-on-warning text-[11px] font-bold hover:brightness-95 transition-all cursor-pointer"
            >
              Simulate Movement Alert
            </button>
            <button
              type="button"
              onClick={() => handleSimulateAiTrigger('calm')}
              className="px-2 py-1 rounded-lg bg-surface-container-high text-on-surface-variant text-[11px] font-semibold hover:bg-surface-container-highest transition-all cursor-pointer"
            >
              Reset to Calm
            </button>
          </div>
        </div>

        {/* AI Event Notification Pill if triggered */}
        {activeAiEvent && (
          <div className="p-2.5 rounded-lg bg-warning-container/80 border border-warning/40 text-on-warning text-xs font-bold flex items-center justify-between animate-in fade-in-50">
            <span>{activeAiEvent}</span>
            <button
              type="button"
              onClick={() => setActiveAiEvent(null)}
              className="text-on-warning hover:underline text-[11px]"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* 4 Core Observation Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {/* Posture */}
          <div className="bg-surface-container-lowest p-2.5 rounded-xl border border-outline-variant/20 flex flex-col">
            <span className="text-[10px] font-mono text-on-surface-variant uppercase font-semibold">
              Posture
            </span>
            <span className="text-xs font-bold text-on-surface mt-0.5 truncate">
              {posture}
            </span>
          </div>

          {/* Activity */}
          <div className="bg-surface-container-lowest p-2.5 rounded-xl border border-outline-variant/20 flex flex-col">
            <span className="text-[10px] font-mono text-on-surface-variant uppercase font-semibold">
              Activity Level
            </span>
            <span
              className={`text-xs font-bold mt-0.5 ${
                activity === 'Restless'
                  ? 'text-warning font-extrabold'
                  : 'text-tertiary'
              }`}
            >
              {activity}
            </span>
          </div>

          {/* Breathing */}
          <div className="bg-surface-container-lowest p-2.5 rounded-xl border border-outline-variant/20 flex flex-col">
            <span className="text-[10px] font-mono text-on-surface-variant uppercase font-semibold">
              Chest Movement
            </span>
            <span className="text-xs font-bold text-on-surface mt-0.5 truncate">
              {breathing}
            </span>
          </div>

          {/* AI Confidence */}
          <div className="bg-surface-container-lowest p-2.5 rounded-xl border border-outline-variant/20 flex flex-col">
            <span className="text-[10px] font-mono text-on-surface-variant uppercase font-semibold">
              Confidence
            </span>
            <span className="text-xs font-bold text-secondary font-mono mt-0.5">
              {(confidence).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
export default VideoAiPlayer
