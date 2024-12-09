import { create } from 'zustand';

interface LoginState {
  loginState: boolean;
  adminLoginState: boolean;
  token: string | null;
  expirationTime: number;
  login: (token: string) => void;
  adminLogin: () => void;
  adminLogout: () => void;
  logout: () => void;
  checkTokenExpiration: () => void;
}

const useLoginStore = create<LoginState>((set) => {
  const isBrowser = typeof window !== 'undefined';
  const initialToken = isBrowser ? sessionStorage.getItem('token') : null;

  return {
    loginState: !!initialToken,
    token: initialToken,
    adminLoginState: false,
    expirationTime: 0,

    adminLogin: () => {
      set({
        adminLoginState: true,
      });
    },

    adminLogout: () => {
      set({
        adminLoginState: false,
      });
    },

    login: (token: string) => {
      // 1시간 후 만료
      const expirationTime = Date.now() + 3600000;
      set({
        loginState: true,
        token,
        expirationTime,
      });

      setTimeout(() => {
        set({ loginState: false, token: null, expirationTime: 0 });
      }, 3600000);
    },

    logout: () => {
      set({
        loginState: false,
        token: null,
        expirationTime: 0,
      });
    },

    checkTokenExpiration: () => {
      const { expirationTime } = useLoginStore.getState();
      const currentTime = Date.now();
      if (currentTime > expirationTime) {
        set({ loginState: false, token: null });
        console.log('토큰이 만료되어 자동 로그아웃되었습니다.');
      }
    },
  };
});

export default useLoginStore;
