import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile } from '@/lib/store';

const Index = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate(getProfile() ? '/dashboard' : '/');
  }, []);
  return null;
};

export default Index;
