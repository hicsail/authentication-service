import React, { FC } from 'react';
import { useAuth } from '@context/auth.context';
import { Paths } from '@constants/paths';
import { Outlet, useNavigate } from 'react-router-dom';

export const AdminGuard: FC = () => {
  const { token, decoded_token, initialized } = useAuth();
  const navigate = useNavigate();
  const projectId = import.meta.env.VITE_SAIL_PROJECT_ID;
  const loginUrl = `${import.meta.env.VITE_AUTH_CLIENT}?projectId=${projectId}&redirectUrl=${encodeURIComponent(window.location.origin + Paths.AUTH_CALLBACK)}`;

  if (initialized && !token) {
    window.location.replace(loginUrl);
    return null;
  }

  if (initialized && decoded_token?.role !== 1) {
    navigate(Paths.PERMISSION_REQUIRED);
  }

  return <Outlet />;
};
