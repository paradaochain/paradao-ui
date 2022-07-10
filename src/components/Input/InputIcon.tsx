import React from 'react';
import { FieldError } from 'react-hook-form';
import clsx from 'clsx';
import tw, { css } from 'twin.macro';

type InputIconProps = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
  icon: React.ReactNode;
  error?: FieldError;
  position?: 'left' | 'right';
};

const DivStyle = css`
  svg {
    ${tw`w-5`};
    ${tw`h-5`};
  }
`;

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

const InputIcon = React.forwardRef<HTMLInputElement, InputIconProps>(
  ({ name, error, type, placeholder, className, icon, position = 'left', ...props }, ref) => {
    return (
      <div className={clsx('relative mb-6 h-fit', className)} css={DivStyle}>
        <div className={clsx('absolute bottom-1 w-4', position === 'left' && 'left-2', position === 'right' && 'right-2')}>{icon}</div>
        <input
          placeholder={placeholder}
          name={name}
          type={type}
          ref={ref}
          {...props}
          className={clsx(
            'bg-transparent px-2 py-1 outline-none transition-all delay-75 border-b border-purple-600 relative z-[1] focus:shadow-md',
            position === 'left' && 'indent-7'
          )}
          css={InputStyle}
        />
        <label
          htmlFor={name}
          className={clsx('absolute bottom-1 transition-all delay-75', position === 'left' && 'left-10', position === 'right' && 'left-2')}
        >
          {placeholder}
        </label>
        {error && <span className="text-xs text-red-500 absolute left-0 bottom-[-1rem]">{error.message}</span>}
      </div>
    );
  }
);

InputIcon.displayName = 'InputIcon';

export default InputIcon;
