// utils/auth.js
export const refreshToken = async () => {
    await fetch('https://maoulaty.shop/auth/refresh', {
      method: 'POST',
      credentials: 'include',
    });
  };
  