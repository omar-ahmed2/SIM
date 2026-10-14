import type {
  WardDataState,
  WardInfant,
  WardAlert,
  AiVideoSession,
  WardActivityLog,
  ExecutiveStats,
  InfantParentsInfo,
} from '../types/dashboard'

const STORAGE_PREFIX = 'simai_real_ward_'

export const wardDataService = {
  getWardData(userId: string, userName?: string): WardDataState {
    try {
      const raw = localStorage.getItem(`${STORAGE_PREFIX}${userId}`)
      if (raw) {
        const parsed: WardDataState = JSON.parse(raw)
        // Check if stored data contains previous seed/mock data (e.g. inf_davies_01, alt_cam_01)
        const isOldMockData =
          parsed.infants?.some(
            (i) => i.id?.startsWith('inf_davies') || i.id?.startsWith('inf_miller')
          ) ||
          parsed.alerts?.some(
            (a) => a.id === 'alt_cam_01' || a.id === 'alt_cam_02'
          )

        if (!isOldMockData && parsed && Array.isArray(parsed.infants)) {
          return parsed
        }
      }
    } catch {
      // ignore
    }

    const initial: WardDataState = {
      infants: [],
      alerts: [],
      videoSessions: [],
      activities: [],
    }

    try {
      localStorage.setItem(`${STORAGE_PREFIX}${userId}`, JSON.stringify(initial))
    } catch {
      // ignore
    }

    return initial
  },

  clearWardData(userId: string): WardDataState {
    const emptyState: WardDataState = {
      infants: [],
      alerts: [],
      videoSessions: [],
      activities: [],
    }
    this.saveWardData(userId, emptyState)
    return emptyState
  },

  saveWardData(userId: string, state: WardDataState): void {
    try {
      localStorage.setItem(`${STORAGE_PREFIX}${userId}`, JSON.stringify(state))
    } catch {
      // ignore
    }
  },

  admitInfant(userId: string, infant: WardInfant, actorName: string): WardDataState {
    const current = this.getWardData(userId, actorName)
    const newLog: WardActivityLog = {
      id: `act_${Date.now()}`,
      actor: actorName,
      action: `Admitted newborn ${infant.name} to ${infant.incubatorNumber}. Camera stream initialized.`,
      targetPatient: infant.name,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' EST',
      type: 'admission',
    }

    const updated: WardDataState = {
      ...current,
      infants: [infant, ...current.infants],
      activities: [newLog, ...current.activities.slice(0, 19)],
    }

    this.saveWardData(userId, updated)
    return updated
  },

  updateInfantVitals(userId: string, infantId: string, updates: Partial<WardInfant>, actorName: string): WardDataState {
    const current = this.getWardData(userId, actorName)
    const updatedInfants = current.infants.map((inf) => {
      if (inf.id !== infantId) return inf
      const merged = { ...inf, ...updates }
      let status: 'normal' | 'warning' | 'critical' = 'normal'
      if (merged.spo2 < 90 || merged.heartRate > 180 || merged.heartRate < 100 || merged.temperature > 38.0) {
        status = 'critical'
      } else if (merged.spo2 < 94 || merged.heartRate > 165 || merged.heartRate < 115 || merged.temperature > 37.5) {
        status = 'warning'
      }
      merged.status = status
      return merged
    })

    const updated: WardDataState = {
      ...current,
      infants: updatedInfants,
    }

    this.saveWardData(userId, updated)
    return updated
  },

  dischargeInfant(userId: string, infantId: string, actorName: string): WardDataState {
    const current = this.getWardData(userId, actorName)
    const target = current.infants.find((i) => i.id === infantId)
    const updated: WardDataState = {
      ...current,
      infants: current.infants.filter((i) => i.id !== infantId),
      activities: target
        ? [
            {
              id: `act_${Date.now()}`,
              actor: actorName,
              action: `Discharged infant ${target.name} from ${target.incubatorNumber}.`,
              targetPatient: target.name,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' EST',
              type: 'system',
            },
            ...current.activities.slice(0, 19),
          ]
        : current.activities,
    }

    this.saveWardData(userId, updated)
    return updated
  },

  triggerAlert(userId: string, alert: WardAlert, actorName: string): WardDataState {
    const current = this.getWardData(userId, actorName)
    const updated: WardDataState = {
      ...current,
      alerts: [alert, ...current.alerts],
      activities: [
        {
          id: `act_${Date.now()}`,
          actor: actorName || 'SIM.AI Vision Engine',
          action: `Camera AI alert: "${alert.title}" on ${alert.cameraName} (${alert.infantName}).`,
          targetPatient: alert.infantName,
          timestamp: alert.timestamp,
          type: 'alert_cleared',
        },
        ...current.activities.slice(0, 19),
      ],
    }

    this.saveWardData(userId, updated)
    return updated
  },

  acknowledgeAlert(userId: string, alertId: string, actorName: string): WardDataState {
    const current = this.getWardData(userId, actorName)
    const target = current.alerts.find((a) => a.id === alertId)
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' EST'

    const updated: WardDataState = {
      ...current,
      alerts: current.alerts.map((a) =>
        a.id === alertId
          ? {
              ...a,
              acknowledged: true,
              acknowledgedBy: actorName,
              acknowledgedAt: nowStr,
              triageStatus: 'in_progress' as const,
            }
          : a
      ),
      activities: target
        ? [
            {
              id: `act_${Date.now()}`,
              actor: actorName,
              action: `Attending to ${target.infantName} for alert: "${target.title}".`,
              targetPatient: target.infantName,
              timestamp: nowStr,
              type: 'alert_cleared',
            },
            ...current.activities.slice(0, 19),
          ]
        : current.activities,
    }

    this.saveWardData(userId, updated)
    return updated
  },

  markFalsePositive(userId: string, alertId: string, actorName: string, reason?: string): WardDataState {
    const current = this.getWardData(userId, actorName)
    const target = current.alerts.find((a) => a.id === alertId)
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' EST'

    const updated: WardDataState = {
      ...current,
      alerts: current.alerts.map((a) =>
        a.id === alertId
          ? {
              ...a,
              acknowledged: true,
              isFalsePositive: true,
              triageStatus: 'false_alarm' as const,
              acknowledgedBy: actorName,
              acknowledgedAt: nowStr,
            }
          : a
      ),
      activities: target
        ? [
            {
              id: `act_${Date.now()}`,
              actor: actorName,
              action: `Marked alert as False Alarm: "${target.title}" on ${target.cameraName} (${reason || 'Caregiver interaction/artifact'}).`,
              targetPatient: target.infantName,
              timestamp: nowStr,
              type: 'alert_cleared',
            },
            ...current.activities.slice(0, 19),
          ]
        : current.activities,
    }

    this.saveWardData(userId, updated)
    return updated
  },

  resolveAlert(userId: string, alertId: string, actorName: string, notes?: string): WardDataState {
    const current = this.getWardData(userId, actorName)
    const target = current.alerts.find((a) => a.id === alertId)
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' EST'

    const updated: WardDataState = {
      ...current,
      alerts: current.alerts.map((a) =>
        a.id === alertId
          ? {
              ...a,
              acknowledged: true,
              triageStatus: 'resolved' as const,
              acknowledgedBy: actorName,
              acknowledgedAt: nowStr,
            }
          : a
      ),
      activities: target
        ? [
            {
              id: `act_${Date.now()}`,
              actor: actorName,
              action: `Resolved alert "${target.title}" (${target.infantName}): ${notes || 'Patient stabilized.'}`,
              targetPatient: target.infantName,
              timestamp: nowStr,
              type: 'alert_cleared',
            },
            ...current.activities.slice(0, 19),
          ]
        : current.activities,
    }

    this.saveWardData(userId, updated)
    return updated
  },

  logVideoSession(userId: string, session: AiVideoSession, actorName: string): WardDataState {
    const current = this.getWardData(userId, actorName)
    const updated: WardDataState = {
      ...current,
      videoSessions: [session, ...current.videoSessions],
      activities: [
        {
          id: `act_${Date.now()}`,
          actor: actorName,
          action: `Processed AI video analysis (${session.videoName}) for ${session.infantName}.`,
          targetPatient: session.infantName,
          timestamp: session.timestamp,
          type: 'video_analyzed',
        },
        ...current.activities.slice(0, 19),
      ],
    }

    this.saveWardData(userId, updated)
    return updated
  },

  addInfantNote(userId: string, infantId: string, noteText: string, actorName: string, actorRole?: string): WardDataState {
    const current = this.getWardData(userId, actorName)
    const target = current.infants.find((i) => i.id === infantId)
    if (!target) return current

    const newNote = {
      id: `note_${Date.now()}`,
      author: actorName,
      role: actorRole || 'Attending Clinician',
      content: noteText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' EST',
    }

    const updated: WardDataState = {
      ...current,
      infants: current.infants.map((i) => (i.id === infantId ? { ...i, clinicalNotes: [newNote, ...(i.clinicalNotes || [])] } : i)),
    }

    this.saveWardData(userId, updated)
    return updated
  },

  updateInfantParentsInfo(userId: string, infantId: string, parentsInfo: InfantParentsInfo, actorName: string): WardDataState {
    const current = this.getWardData(userId, actorName)
    const updated: WardDataState = {
      ...current,
      infants: current.infants.map((i) => (i.id === infantId ? { ...i, parentsInfo: { ...i.parentsInfo, ...parentsInfo } } : i)),
    }
    this.saveWardData(userId, updated)
    return updated
  },

  computeExecutiveStats(state: WardDataState): ExecutiveStats {
    const activeAlertsCount = state.alerts.filter((a) => !a.acknowledged && a.triageStatus !== 'resolved' && a.triageStatus !== 'false_alarm').length
    const uniqueIncubators = new Set(state.infants.map((i) => i.incubatorNumber))

    return {
      totalInfants: state.infants.length,
      activeIncubators: uniqueIncubators.size,
      activeAlerts: activeAlertsCount,
      analyzedVideoSessions: state.videoSessions.length,
    }
  },
}
