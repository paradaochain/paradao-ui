import React from 'react';
import { FieldError } from 'react-hook-form';
import clsx from 'clsx';
import tw, { css } from 'twin.macro';

type InputProps = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
  error?: FieldError;
};

const InputStyle = css`
  &:focus,
  &:not(:placeholder-shown) {
    outline: 'none';
    & ~ label {
      transform: translate(0px, -1.8rem);
      left: 0;
      ${tw`text-xs`};
    }
  }
  &::placeholder {
    color: transparent;
  }
`;

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ name, error, type, placeholder, className, ...props }, ref) => {
  return (
    <div className={clsx('relative mb-6 h-fit', className)}>
      <input
        placeholder={placeholder}
        name={name}
        type={type}
        ref={ref}
        {...props}
        className="w-full bg-transparent px-2 py-1 outline-none transition-all delay-75 border-b border-purple-600 relative z-[1] focus:shadow-md"
        css={InputStyle}
      />
      <label htmlFor={name} className="absolute left-2 bottom-1 transition-all delay-75 text-gray-600">
        {placeholder}
      </label>
      {error && <span className="text-xs text-red-500 absolute left-0 bottom-[-1rem]">{error.message}</span>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
