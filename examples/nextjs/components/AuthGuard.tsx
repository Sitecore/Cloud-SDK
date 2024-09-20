import { useRouter } from 'next/navigation';
import { ComponentType, useEffect } from 'react';
import { useAuth } from '../context/Auth';

export function withAuthGuard<T extends object>(WrappedComponent: ComponentType<T>) {
  return function Auth(props: T) {
    const { isLoggedIn } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isLoggedIn) {
        router.replace('/login');
      }
    }, [router, isLoggedIn]);

    return <WrappedComponent {...props} />;
  };
}
