import React from 'react';
import clsx from 'clsx';

type TextAreaProps = React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>;

interface TextArea {
  label?: string;
  error?: string;
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps & TextArea>(({ className, label, error, ...props }, ref) => {
  return (
    <div className="flex flex-col w-full mb-8  relative ">
      <label className="text-gray-600 font-semibold text-xs mb-1">{label && label}</label>
      <textarea
        ref={ref}
        className={clsx(
          `border text-sm bg-white disabled:text-gray-500 border-gray-200 py-2 px-3 rounded-md outline-none focus:shadow-md transition duration-150 ease-in-out`,
          className
        )}
        {...props}
      />
      <p className="text-red-500 text-xs absolute bottom-[-18px] w-full text-center">{error && error}</p>
    </div>
  );
});

TextArea.displayName = 'TextArea';

export default TextArea;
