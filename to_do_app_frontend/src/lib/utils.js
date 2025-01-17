import Cookies from 'js-cookie';

// Function to save the JWT token to a cookie
export const saveTokenToCookie = (token) => {
  Cookies.set('jwt_token', token, { expires: 7, secure: true, sameSite: 'Strict' });
};

export const getTokenFromCookie = () => {
    return Cookies.get('jwt_token');
  };
  
  export const removeTokenFromCookie = () => {
    Cookies.remove('jwt_token');
  };
  