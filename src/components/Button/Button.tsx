import React, { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

const Button: React.FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({ className, ...props }) => {
  return (
    <button
      className={clsx(
        'inline-flex items-center py-2 px-3 text-sm font-medium justify-center rounded-lg text-white bg-purple-700 hover:bg-purple-900 focus:bg-purple-500 disabled:bg-gray-600 disabled:text-gray-300 disabled:pointer-events-none transition-all delay-100',
        className
      )}
      {...props}
    ></button>
  );
};

export default Button;
