import React, { useRef, useState, useCallback } from 'react';
import { Container, Box, Button, Typography, IconButton, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import UploadIcon from '@mui/icons-material/Upload';
import CheckIcon from '@mui/icons-material/Check';

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
    <Container maxWidth="md" sx={{ height: '100vh', display: 'flex', flexDirection: 'column', p: 0, bgcolor: 'black' }}>

        {/* Header Overlay */}
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, bgcolor: 'rgba(0,0,0,0.5)' }}>
        <IconButton onClick={() => navigate(-1)} sx={{ color: 'white' }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" sx={{ ml: 2, color: 'white', fontFamily: '"Special Elite", cursive' }}>Field Scope</Typography>
      </Box>

        {/* Viewfinder Area */}
      <Box sx={{ flexGrow: 1, position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
        {!image ? (
            <>
                {isCameraActive ? (
                 <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
                     <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                     />
                     {/* Viewfinder Crosshair */}
                     <Box sx={{
                         position: 'absolute',
                         top: '50%',
                         left: '50%',
                         width: 40,
                         height: 40,
                         border: '2px solid rgba(255,255,255,0.7)',
                         transform: 'translate(-50%, -50%)',
                         borderRadius: '50%'
                     }} />
                      <Box sx={{
                         position: 'absolute',
                         top: '50%',
                         left: '50%',
                         width: 4,
                         height: 4,
                         bgcolor: 'rgba(255,255,255,0.9)',
                         transform: 'translate(-50%, -50%)',
                         borderRadius: '50%'
                     }} />
                 </Box>
                ) : (
                     <Box sx={{ textAlign: 'center' }}>
                         <Typography color="white" gutterBottom sx={{ fontFamily: '"Special Elite", cursive' }}>Lens Cap On</Typography>
                         <Button variant="contained" onClick={startCamera} startIcon={<PhotoCameraIcon />} sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }}>
                             Open Shutter
                         </Button>
                     </Box>
                )}
            </>
        ) : (
            <img src={image} alt="Captured" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        )}
         <canvas ref={canvasRef} style={{ display: 'none' }} />
      </Box>

        {/* Controls */}
      <Box sx={{ p: 4, display: 'flex', justifyContent: 'space-around', alignItems: 'center', bgcolor: '#2c2c2c' }}>
         {!image ? (
             <>
                 <Button variant="outlined" component="label" sx={{ color: 'white', borderColor: 'white' }}>
                    <UploadIcon />
                    <input type="file" hidden accept="image/*" onChange={handleFileUpload}/>
                 </Button>

                 {isCameraActive && (
                      <IconButton
                        sx={{
                            width: 72,
                            height: 72,
                            border: '4px solid white',
                            p:0
                        }}
                        onClick={captureImage}
                      >
                         <Box sx={{ width: 60, height: 60, bgcolor: 'white', borderRadius: '50%' }} />
                      </IconButton>
                 )}

                 <Box sx={{ width: 64 }} /> {/* Spacer */}
             </>
         ) : (
             <>
                <Button variant="outlined" onClick={handleRetake} sx={{ color: 'white', borderColor: 'white' }}>Discard</Button>
                <Button variant="contained" onClick={() => alert('Observation recorded in logbook!')} color="success" startIcon={<CheckIcon />}>Keep</Button>
             </>
         )}
      </Box>
    </Container>
  );
}
