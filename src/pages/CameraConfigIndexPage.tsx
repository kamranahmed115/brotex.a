import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/store/AppContext';

export function CameraConfigIndexPage() {
  const { cameras } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (cameras.length > 0) {
      navigate(`/cameras/${cameras[0].id}/configure`, { replace: true });
    }
  }, [cameras, navigate]);

  return (
    <div className="p-8 text-center text-ink-400">
      Loading camera configuration...
    </div>
  );
}
