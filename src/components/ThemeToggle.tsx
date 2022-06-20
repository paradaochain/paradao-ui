import React, { useEffect, useMemo, useState } from 'react';
import { getTheme, setTheme as setLocalTheme } from 'services/localStorage';

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
    <div tw="flex flex-col gap-4" id="toggle">
      <div>Toggle switch was here</div>
      {/* <ToggleSwitch checked={isDarkMode} label={isDarkMode ? '🌚' : '🌞'} onChange={() => changeTheme()} /> */}
    </div>
  );
};

export default ThemeToggle;

// started copying design from flowbite, needs more work... do we need to implement themes tho??
// const ToggleSwitch: React.FC<{ checked: boolean; label: string; onChange: () => void }> = ({ checked, label, onChange }) => {
//   return (
//     <div tw="space-x-4 flex flex-row items-center cursor-pointer">
//       <input type="checkbox" checked={checked} onChange={onChange} />
//       <div tw="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
//       <span tw="text-sm font-medium text-gray-900 dark:text-gray-300">{label}</span>
//     </div>
//   );
// };
