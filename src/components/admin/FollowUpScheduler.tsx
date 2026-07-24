'use client'

import { useState } from 'react'
import { Calendar, Clock, Video, BookOpen, Send, Bell } from 'lucide-react'

interface FollowUp {
  id: string
  type: 'webinar' | 'training' | 'call' | 'email'
  title: string
  scheduledDate: string
  scheduledTime: string
  materials?: string[]
  reminderSent: boolean
  completed: boolean
}

export default function FollowUpScheduler({ leadId }: { leadId: string }) {
  const [followUps, setFollowUps] = useState<FollowUp[]>([])
  const [showScheduler, setShowScheduler] = useState(false)
  const [newFollowUp, setNewFollowUp] = useState({
    type: 'webinar' as const,
    title: '',
    date: '',
    time: '',
    materials: [] as string[]
  })

  const scheduleFollowUp = async () => {
    try {
      const response = await fetch('/api/admin/leads/schedule-followup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId,
          ...newFollowUp
        })
      })

      if (response.ok) {
        const followUp = await response.json()
        setFollowUps([...followUps, followUp])
        setShowScheduler(false)
        setNewFollowUp({ type: 'webinar', title: '', date: '', time: '', materials: [] })
      }
    } catch (error) {
      console.error('Failed to schedule follow-up:', error)
    }
  }

  const sendReminder = async (followUpId: string) => {
    try {
      await fetch('/api/admin/leads/send-reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ followUpId, leadId })
      })

      setFollowUps(followUps.map(f =>
        f.id === followUpId ? { ...f, reminderSent: true } : f
      ))
    } catch (error) {
      console.error('Failed to send reminder:', error)
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'webinar': return <Video className="w-4 h-4" />
      case 'training': return <BookOpen className="w-4 h-4" />
      case 'call': return <Clock className="w-4 h-4" />
      case 'email': return <Send className="w-4 h-4" />
      default: return <Calendar className="w-4 h-4" />
    }
  }

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Follow-up Schedule</h3>
        <button
          onClick={() => setShowScheduler(!showScheduler)}
          className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
        >
          + Schedule Follow-up
        </button>
      </div>

      {/* Scheduler Form */}
      {showScheduler && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                value={newFollowUp.type}
                onChange={(e) => setNewFollowUp({ ...newFollowUp, type: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              >
                <option value="webinar">2-Hour Webinar</option>
                <option value="training">1-Day Training</option>
                <option value="call">Call</option>
                <option value="email">Email</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={newFollowUp.title}
                onChange={(e) => setNewFollowUp({ ...newFollowUp, title: e.target.value })}
                placeholder="e.g., AI Transformation Webinar"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                value={newFollowUp.date}
                onChange={(e) => setNewFollowUp({ ...newFollowUp, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time
              </label>
              <input
                type="time"
                value={newFollowUp.time}
                onChange={(e) => setNewFollowUp({ ...newFollowUp, time: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={() => setShowScheduler(false)}
              className="px-4 py-2 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={scheduleFollowUp}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
            >
              Schedule
            </button>
          </div>
        </div>
      )}

      {/* Follow-ups List */}
      <div className="space-y-3">
        {followUps.length === 0 ? (
          <p className="text-sm text-gray-500">No follow-ups scheduled</p>
        ) : (
          followUps.map((followUp) => (
            <div
              key={followUp.id}
              className={`p-3 rounded-lg border ${
                followUp.completed ? 'bg-gray-50 border-gray-200' : 'bg-white border-blue-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${
                    followUp.type === 'webinar' ? 'bg-purple-100' :
                    followUp.type === 'training' ? 'bg-blue-100' :
                    followUp.type === 'call' ? 'bg-green-100' :
                    'bg-yellow-100'
                  }`}>
                    {getIcon(followUp.type)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{followUp.title}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(followUp.scheduledDate).toLocaleDateString()} at {followUp.scheduledTime}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {followUp.reminderSent && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                          Reminder Sent
                        </span>
                      )}
                      {followUp.completed && (
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                          Completed
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {!followUp.reminderSent && !followUp.completed && (
                  <button
                    onClick={() => sendReminder(followUp.id)}
                    className="p-1.5 hover:bg-gray-100 rounded-lg"
                    title="Send Reminder"
                  >
                    <Bell className="w-4 h-4 text-blue-600" />
                  </button>
                )}
              </div>
              {followUp.materials && followUp.materials.length > 0 && (
                <div className="mt-2 pl-11">
                  <p className="text-xs text-gray-500">Attached materials: {followUp.materials.length} files</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Quick Templates */}
      <div className="mt-6 pt-4 border-t">
        <p className="text-sm font-medium text-gray-700 mb-3">Quick Schedule Templates</p>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              setNewFollowUp({
                type: 'webinar',
                title: 'AI Transformation Strategy',
                date: '',
                time: '14:00',
                materials: []
              })
              setShowScheduler(true)
            }}
            className="px-3 py-2 text-xs bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100"
          >
            2-Hour Webinar Template
          </button>
          <button
            onClick={() => {
              setNewFollowUp({
                type: 'training',
                title: '1-Day AI Training',
                date: '',
                time: '09:00',
                materials: []
              })
              setShowScheduler(true)
            }}
            className="px-3 py-2 text-xs bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100"
          >
            Training Day Template
          </button>
        </div>
      </div>
    </div>
  )
}