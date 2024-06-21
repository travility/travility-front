import base64 from 'base-64';

export const isTokenPresent = () => {
  return !!localStorage.getItem('Authorization');
};

export const removeToken = () => {
  localStorage.removeItem('Authorization');
};

export const getToken = () => {
  return localStorage.getItem('Authorization');
};

export const decodeToken = () => {
  const token = getToken().substring(7);
  const payload = token.substring(
    token.indexOf('.') + 1,
    token.lastIndexOf('.')
  );
  const decordingInfo = JSON.parse(base64.decode(payload));
  return decordingInfo;
};
