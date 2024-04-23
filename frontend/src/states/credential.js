// Define your auth state in Recoil
import { atom } from 'recoil';

export const authState = atom({
  key: 'authState',
  default: { isAuthenticated: false, user: null },
});
