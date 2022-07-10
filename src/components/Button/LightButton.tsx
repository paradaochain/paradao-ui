import React, { ButtonHTMLAttributes } from 'react';
import Button from './Button';
import clsx from 'clsx';

const LightButton: React.FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({ className, ...props }) => {
  return (
    <Button
      className={clsx(
        'bg-gray-100 text-purple-700 border border-purple-700 hover:bg-purple-700 hover:text-white  focus:bg-gray-200 disabled:border-gray-600',
        className
      )}
      {...props}
    ></Button>
  );
};

export default LightButton;
