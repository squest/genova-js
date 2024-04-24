import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import axios from 'axios';
import { authState } from '../states/credential';
import { BaseUrl } from '../Constants';

// Auth initializer
export function useInitializeAuth() {
  const [auth, setAuth] = useRecoilState(authState);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.post(`${BaseUrl}/user/token`, { token : token})
        .then(response => {
          if (response.data.status === 'ok') {
            setAuth({ isAuthenticated: true, user: response.data.user });
          } else {
            localStorage.removeItem('token');
            setAuth({ isAuthenticated: false });
          }
        })
        .catch(() => setAuth({ isAuthenticated: false }));
    }
  }, [setAuth]);
}