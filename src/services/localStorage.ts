export const setItem = <T>(key: string, item: T): void => {
  localStorage.setItem(key, JSON.stringify(item));
};

export const getItem = <T>(key: string): T | null => {
  const item = window.localStorage.getItem(key);
  if (item) return JSON.parse(item);
  return null;
};

export const deleteItem = (key: string): void => {
  localStorage.removeItem(key);
};

export const setTheme = (theme: 'dark' | 'light'): void => {
  setItem('theme', theme);
};

export const getTheme = (): 'dark' | 'light' | null => {
  return getItem('theme');
};
