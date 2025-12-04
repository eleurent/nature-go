import React, { useRef, useState, useCallback } from 'react';
import { Container, Box, Button, Typography, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import UploadIcon from '@mui/icons-material/Upload';

// Helper to convert blob to base64
const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export default function CameraCapture() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsCameraActive(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL('image/jpeg');
        setImage(imageData);
        stopCamera();
      }
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
          try {
             const base64 = await blobToBase64(file);
             setImage(base64);
          } catch(e) {
              console.error(e);
          }
      }
  }

  const handleRetake = () => {
      setImage(null);
      startCamera();
  }

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <Container maxWidth="md" sx={{ height: '100vh', display: 'flex', flexDirection: 'column', p: 0 }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" sx={{ ml: 2 }}>Capture Observation</Typography>
      </Box>

      <Box sx={{ flexGrow: 1, position: 'relative', bgcolor: '#000', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
        {!image ? (
            <>
                {isCameraActive ? (
                 <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                 />
                ) : (
                    <Typography color="white">Camera inactive</Typography>
                )}
            </>
        ) : (
            <img src={image} alt="Captured" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        )}
         <canvas ref={canvasRef} style={{ display: 'none' }} />
      </Box>

      <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-around', alignItems: 'center', bgcolor: 'background.paper' }}>
         {!image ? (
             <>
                 <Button variant="outlined" component="label" startIcon={<UploadIcon />}>
                    Upload
                    <input type="file" hidden accept="image/*" onChange={handleFileUpload}/>
                 </Button>

                 {!isCameraActive ? (
                     <Button variant="contained" onClick={startCamera} startIcon={<PhotoCameraIcon />}>
                         Start Camera
                     </Button>
                 ) : (
                      <IconButton color="primary" sx={{ width: 64, height: 64, border: '4px solid', p:0 }} onClick={captureImage}>
                         <Box sx={{ width: 48, height: 48, bgcolor: 'primary.main', borderRadius: '50%' }} />
                      </IconButton>
                 )}
             </>
         ) : (
             <>
                <Button variant="outlined" onClick={handleRetake}>Retake</Button>
                <Button variant="contained" onClick={() => alert('Observation flow to be implemented')}>Use Photo</Button>
             </>
         )}
      </Box>
    </Container>
  );
}
