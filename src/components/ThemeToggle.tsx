import React, { useEffect, useMemo, useState } from 'react';
import { getTheme, setTheme as setLocalTheme } from 'services/localStorage';
import { ToggleSwitch } from 'flowbite-react';

const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  const isDarkMode = useMemo(() => theme === 'dark', [theme]);

  useEffect(() => {
    const defaultTheme = getTheme();
    if (defaultTheme) setTheme(defaultTheme);
    document.documentElement.classList.add(defaultTheme || theme);
  }, []);

  const changeTheme = () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    setTheme(newTheme);
    setLocalTheme(newTheme);
    document.documentElement.classList.add(newTheme);
    document.documentElement.classList.remove(theme);
  };

  return (
    <div className="flex flex-col gap-4" id="toggle">
      <ToggleSwitch checked={isDarkMode} label={isDarkMode ? '🌚' : '🌞'} onChange={() => changeTheme()} />
    </div>
  );
};

export default ThemeToggle;
