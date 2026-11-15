'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useSettings } from '@/contexts/SettingsContext';

export default function SettingsPage() {
  const router = useRouter();
  const { authState } = useAuth();
  const { settings, setAutoPlayAudio, setBrowserNotifications } = useSettings();
  const [supportsBrowserNotifs, setSupportsBrowserNotifs] = useState(false);

  useEffect(() => {
    setSupportsBrowserNotifs(typeof window !== 'undefined' && 'Notification' in window);
  }, []);

  useEffect(() => {
    if (!authState.isLoading && !authState.userToken) {
      router.replace('/');
    }
  }, [authState.isLoading, authState.userToken, router]);

  if (authState.isLoading || !authState.userToken) return null;

  const handleToggleBrowserNotifications = async () => {
    if (!settings.browserNotifications && supportsBrowserNotifs) {
      if (window.Notification.permission === 'default') {
        const result = await window.Notification.requestPermission();
        if (result !== 'granted') {
          setBrowserNotifications(false);
          return;
        }
      } else if (window.Notification.permission === 'denied') {
        setBrowserNotifications(false);
        return;
      }
    }
    setBrowserNotifications(!settings.browserNotifications);
  };

  return (
    <div className="page-background min-h-screen pb-8">
      <button
        onClick={() => router.back()}
        className="fixed top-4 left-4 z-10 bg-white/80 px-3 py-1 rounded shadow"
      >
        ← Back
      </button>

      <div className="pt-20 px-6">
        <h1 className="text-2xl font-old-standard text-center mb-8">Settings</h1>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-nature-brown/20">
            <div>
              <p className="font-old-standard text-nature-brown">Auto-play audio descriptions</p>
              <p className="text-sm text-nature-brown/60 font-old-standard">
                Automatically play audio when viewing species
              </p>
            </div>
            <button
              onClick={() => setAutoPlayAudio(!settings.autoPlayAudio)}
              className={`relative w-12 h-7 rounded-full transition-colors duration-200 ${
                settings.autoPlayAudio ? 'bg-nature-dark' : 'bg-gray-300'
              }`}
              role="switch"
              aria-checked={settings.autoPlayAudio}
              aria-label="Auto-play audio descriptions"
            >
              <span
                className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform duration-200 ${
                  settings.autoPlayAudio ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {supportsBrowserNotifs && (
            <div className="flex items-center justify-between py-3 border-b border-nature-brown/20">
              <div>
                <p className="font-old-standard text-nature-brown">Browser notifications</p>
                <p className="text-sm text-nature-brown/60 font-old-standard">
                  Receive desktop or device alerts for new dispatches
                </p>
              </div>
              <button
                onClick={handleToggleBrowserNotifications}
                className={`relative w-12 h-7 rounded-full transition-colors duration-200 ${
                  settings.browserNotifications ? 'bg-nature-dark' : 'bg-gray-300'
                }`}
                role="switch"
                aria-checked={settings.browserNotifications}
                aria-label="Browser notifications"
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform duration-200 ${
                    settings.browserNotifications ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
