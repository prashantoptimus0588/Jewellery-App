// src/pages/AuthCallback.jsx
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuthStore();

  useEffect(() => {
    const token = searchParams.get('token');
    const id = searchParams.get('id');
    const name = searchParams.get('name');
    const email = searchParams.get('email');
    const avatar = searchParams.get('avatar');

    if (token && id) {
      login({ id, name, email, avatar: avatar || null }, token);
      navigate('/', { replace: true });
    } else {
      navigate('/', { replace: true });
    }
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-400 font-serif text-lg">Signing you in...</p>
    </div>
  );
};

export default AuthCallback;