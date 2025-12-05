'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function SettingsPage() {
  const router = useRouter()
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsAlerts: false,
    autoReports: true,
    darkMode: true,
    language: 'english'
  })

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-gray-400 mt-2">Manage your account and preferences</p>
          </div>
          <button 
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
          >
            ← Back to Dashboard
          </button>
        </div>

        <div className="space-y-6">
          {/* Notification Settings */}
          <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
            <h2 className="text-2xl font-bold mb-6">Notifications</h2>
            <div className="space-y-4">
              {[
                { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive updates via email' },
                { key: 'smsAlerts', label: 'SMS Alerts', description: 'Critical alerts via SMS' },
                { key: 'autoReports', label: 'Auto Reports', description: 'Weekly performance reports' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{item.label}</div>
                    <div className="text-sm text-gray-400">{item.description}</div>
                  </div>
                  <button
                    onClick={() => handleSettingChange(item.key, !settings[item.key as keyof typeof settings])}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      settings[item.key as keyof typeof settings] ? 'bg-cyan-500' : 'bg-gray-600'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        settings[item.key as keyof typeof settings] ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    ></div>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Appearance Settings */}
          <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
            <h2 className="text-2xl font-bold mb-6">Appearance</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">Dark Mode</div>
                  <div className="text-sm text-gray-400">Use dark theme</div>
                </div>
                <button
                  onClick={() => handleSettingChange('darkMode', !settings.darkMode)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.darkMode ? 'bg-cyan-500' : 'bg-gray-600'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      settings.darkMode ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  ></div>
                </button>
              </div>
              
              <div>
                <label className="font-semibold block mb-2">Language</label>
                <select
                  value={settings.language}
                  onChange={(e) => handleSettingChange('language', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="english">English</option>
                  <option value="spanish">Spanish</option>
                  <option value="chinese">Chinese</option>
                  <option value="arabic">Arabic</option>
                </select>
              </div>
            </div>
          </div>

          {/* Account Settings */}
          <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
            <h2 className="text-2xl font-bold mb-6">Account</h2>
            <div className="space-y-4">
              <button className="w-full text-left p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors">
                <div className="font-semibold">Change Password</div>
                <div className="text-sm text-gray-400">Update your account password</div>
              </button>
              
              <button className="w-full text-left p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors">
                <div className="font-semibold">Two-Factor Authentication</div>
                <div className="text-sm text-gray-400">Enhanced security for your account</div>
              </button>
              
              <button className="w-full text-left p-4 bg-red-500/20 rounded-lg hover:bg-red-500/30 transition-colors text-red-400">
                <div className="font-semibold">Delete Account</div>
                <div className="text-sm">Permanently delete your account and data</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
