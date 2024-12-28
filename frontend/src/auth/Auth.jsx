import React, { useEffect, useState } from 'react';
import { useUser } from '../context/user.context';
import { useNavigate } from 'react-router-dom';

const Auth = ({ children }) => {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || !user) {
      navigate('/login');
    } else {
      setLoading(false); 
    }
  }, [token, user, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default Auth;
