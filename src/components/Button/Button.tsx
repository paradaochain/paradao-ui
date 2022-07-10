import React, { ButtonHTMLAttributes } from 'react';
import tw from 'twin.macro';

const ButtonComp = tw.button`inline-flex items-center py-2 px-3 text-sm font-medium justify-center rounded-lg text-white bg-purple-700 hover:bg-purple-900 focus:bg-purple-500 disabled:bg-gray-600 disabled:text-gray-300 disabled:pointer-events-none transition-all delay-100`;
const Button: React.FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({ ...props }) => {
  return <ButtonComp {...props} />;
};

export default Button;
