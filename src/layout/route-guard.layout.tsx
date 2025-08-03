import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/src/context/auth.context';
import Loading from '@/src/layout/loader.layout';

interface RouteGuardProps {
  children: React.ReactNode;
}

export default function RouteGuard({ children }: RouteGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return <Loading.Page message="Checking authentication..." />;
  }

  if (!isAuthenticated) {
    return <Loading.Page message="Redirecting to login..." />;
  }

  return <>{children}</>;
}