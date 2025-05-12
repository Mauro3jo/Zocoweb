// Función para detectar el sistema operativo
export const getOperatingSystem = () => {
  const userAgent =
    window.navigator.userAgent || window.navigator.vendor || window.opera;

  if (/android/i.test(userAgent)) {
    return "android";
  }

  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    return "ios";
  }

  return "other";
};
