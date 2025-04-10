// Telegram WebApp utility functions
const tg = window.Telegram?.WebApp;

export const initTelegramApp = () => {
  console.log('Checking for Telegram WebApp...');
  console.log('window.Telegram:', window.Telegram);
  console.log('tg object:', tg);

  if (tg) {
    try {
      console.log('Initializing Telegram WebApp...');
      
      // Initialize the WebApp
      tg.ready();
      console.log('WebApp ready called');
      
      // Set the header color
      tg.setHeaderColor('#00f2ff');
      console.log('Header color set');
      
      // Set the background color
      tg.setBackgroundColor('#0a0a0a');
      console.log('Background color set');
      
      // Expand the WebApp to full height
      tg.expand();
      console.log('WebApp expanded');

      // Enable closing confirmation
      tg.enableClosingConfirmation();
      console.log('Closing confirmation enabled');

      // Get user data
      const user = tg.initDataUnsafe?.user;
      console.log('User data:', user);
      
      return {
        isInitialized: true,
        user,
        platform: tg.platform,
        version: tg.version,
        colorScheme: tg.colorScheme,
        showAlert: (message) => tg.showAlert(message),
        showConfirm: (message) => tg.showConfirm(message),
        showPopup: (params) => tg.showPopup(params),
        close: () => tg.close(),
        expand: () => tg.expand(),
        MainButton: tg.MainButton,
        BackButton: tg.BackButton,
      };
    } catch (error) {
      console.error('Error during Telegram WebApp initialization:', error);
      return {
        isInitialized: false,
        error: error.message,
        showAlert: (message) => alert(message),
        showConfirm: (message) => window.confirm(message),
        showPopup: (params) => alert(params.message),
        close: () => window.close(),
        expand: () => {},
        MainButton: null,
        BackButton: null,
      };
    }
  }
  
  console.log('Telegram WebApp not available');
  // Fallback functions for when Telegram WebApp is not available
  return {
    isInitialized: false,
    error: 'Telegram WebApp is not available',
    showAlert: (message) => alert(message),
    showConfirm: (message) => window.confirm(message),
    showPopup: (params) => alert(params.message),
    close: () => window.close(),
    expand: () => {},
    MainButton: null,
    BackButton: null,
  };
};

export const showAlert = (message) => {
  if (tg) {
    tg.showAlert(message);
  } else {
    alert(message);
  }
};

export const showConfirm = (message) => {
  if (tg) {
    return tg.showConfirm(message);
  } else {
    return window.confirm(message);
  }
};

export const showPopup = (params) => {
  if (tg) {
    tg.showPopup(params);
  } else {
    alert(params.message);
  }
};

export const close = () => {
  if (tg) {
    tg.close();
  }
};

export const expand = () => {
  if (tg) {
    tg.expand();
  }
};

export const getMainButton = () => {
  if (tg) {
    return tg.MainButton;
  }
  return null;
};

export const getBackButton = () => {
  if (tg) {
    return tg.BackButton;
  }
  return null;
};

export const getUserData = () => {
  if (tg) {
    return tg.initDataUnsafe?.user;
  }
  return null;
};

export const isTelegramWebApp = () => {
  return !!tg;
}; 