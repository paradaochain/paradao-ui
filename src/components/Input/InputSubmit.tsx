import React, { useRef, useState } from 'react';
import { BsCardImage } from 'react-icons/bs';
import clsx from 'clsx';
import tw, { css } from 'twin.macro';
import { fileToBase64 } from '@utils/encodings';
import { IoClose } from 'react-icons/io5';
import Button from '@components/Button/Button';

const LabelStyle = css`
  &:hover {
    > svg {
      ${tw`animate-bounce`};
    }
  }
`;

const InputSubmit = React.forwardRef<
  HTMLInputElement,
  React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & { setLogo: (s: string) => void }
>(({ className, setLogo, ...props }, ref) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState<string>();

  const handleFileInput = async () => {
    if (!fileRef.current?.files) return;
    const [file] = fileRef.current.files;
    const base64File = await fileToBase64(file);
    setUrl(base64File);
    setLogo(base64File);
  };

  return (
    <div className={clsx('text-center relative', className)}>
      <input type="file" accept="image/*" id="imageInput" className="hidden outline-none" ref={fileRef} onChange={handleFileInput} {...props} />
      <label
        htmlFor="imageInput"
        className={clsx('flex items-center justify-center  p-2 cursor-pointer text-white rounded-lg gap-3 w-fit', !url && 'bg-purple-600')}
        css={LabelStyle}
      >
        {url ? (
          <div className="max-w-[5rem] relative">
            <img src={url} className="w-full rounded-full" />
          </div>
        ) : (
          <>
            <BsCardImage className="h-5 w-5 " /> <span>Choose image</span>
          </>
        )}
      </label>

      <span
        className={clsx('absolute top-0 right-0', url ? 'block cursor-pointer bg-[rgba(239,246,255,0.5)] rounded-md' : 'hidden')}
        onClick={() => setUrl('')}
      >
        <IoClose className="w-5 h-5 " />
      </span>
    </div>
  );
});

InputSubmit.displayName = 'InputSubmit';

export default InputSubmit;
