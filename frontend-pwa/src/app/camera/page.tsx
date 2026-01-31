'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useObservation } from '@/contexts/ObservationContext';

export default function CameraPage() {
  const router = useRouter();
  const { authState } = useAuth();
  const { observationMethods } = useObservation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');

  useEffect(() => {
    if (!authState.userToken) {
      router.replace('/');
      return;
    }
    observationMethods.clearObservation();
    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [authState.userToken]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
        audio: false,
      });
      setStream(mediaStream);
      setHasPermission(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Camera access denied:', error);
      setHasPermission(false);
    }
  };

  const capturePhoto = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0);
    const base64 = canvas.toDataURL('image/jpeg', 0.7).split(',')[1];

    observationMethods.setObservationImage(base64);
    observationMethods.setObservationDatetime(new Date().toISOString());

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          observationMethods.setObservationLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => console.error('Geolocation error:', error)
      );
    }

    router.push('/observation/confirm');
  }, [observationMethods, router]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      observationMethods.setObservationImage(base64);
      observationMethods.setObservationDatetime(new Date().toISOString());

      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            observationMethods.setObservationLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => console.error('Geolocation error:', error)
        );
      }

      router.push('/observation/confirm');
    };
    reader.readAsDataURL(file);
  };

  if (!authState.userToken) return null;

  return (
    <div className="relative min-h-screen bg-black">
      <button
        onClick={() => router.back()}
        className="absolute top-4 left-4 z-10 text-white text-2xl"
      >
        ←
      </button>

      {hasPermission === false ? (
        <div className="flex flex-col items-center justify-center min-h-screen text-white px-6">
          <p className="text-xl mb-4 text-center">Camera access denied</p>
          <p className="text-sm text-gray-400 mb-6 text-center">
            Please enable camera access in your browser settings, or use the gallery button to upload a photo.
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn-primary"
          >
            Upload from Gallery
          </button>
        </div>
      ) : (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-screen object-cover"
          />
          <canvas ref={canvasRef} className="hidden" />

          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center pb-12 gap-8">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-white p-3"
              title="Gallery"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>

            <button
              onClick={capturePhoto}
              className="w-20 h-20 rounded-full border-4 border-white bg-white/20 hover:bg-white/40 transition-colors"
              title="Take Photo"
            />

            <button
              onClick={() => {
                if (stream) {
                  stream.getTracks().forEach(track => track.stop());
                }
                setFacingMode(f => f === 'user' ? 'environment' : 'user');
                setTimeout(startCamera, 100);
              }}
              className="text-white p-3"
              title="Switch Camera"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
