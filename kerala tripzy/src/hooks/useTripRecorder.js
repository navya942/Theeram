import { useCallback, useEffect, useRef, useState } from 'react';
import Geolocation from 'react-native-geolocation-service';

// Requests permission via react-native-permissions could be added; for a prototype we rely on OS prompts

export function useTripRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [path, setPath] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const intervalRef = useRef(null);

  const recordPoint = useCallback(() => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const timestamp = new Date().toISOString();
        setPath(prev => [...prev, { latitude, longitude, timestamp }]);
      },
      (error) => {
        console.warn('Geolocation error:', error);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }, []);

  const start = useCallback(() => {
    if (isRecording) return;
    setPath([]);
    const now = new Date();
    setStartTime(now.toISOString());
    setEndTime(null);
    setIsRecording(true);
    recordPoint();
    intervalRef.current = setInterval(recordPoint, 15000);
  }, [isRecording, recordPoint]);

  const stop = useCallback(() => {
    if (!isRecording) return;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    const now = new Date();
    setEndTime(now.toISOString());
    setIsRecording(false);
  }, [isRecording]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return { isRecording, path, startTime, endTime, start, stop };
}





