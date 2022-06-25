import React, { ComponentProps, FC } from 'react';
import tw from 'twin.macro';

const BaseButton = tw.button`inline-flex items-center py-2 px-3 text-sm font-medium text-center rounded-lg`;
const CtaButton = tw(BaseButton)`text-white bg-purple-700 hover:bg-purple-800 focus:bg-purple-500`;

const Button: FC<ComponentProps<'button'>> = (props) => {
  if (props.disabled) {
    return <CtaButton tw="border-2 border-color[#EEEEEE] color[#B2B2B2] background[#F3F3F3] cursor-default" {...props} />;
  }
  return <CtaButton {...props} />;
};

export default Button;

const SectionBtn = tw(BaseButton)`absolute right-0 bottom-0 text-white bg-gray-700 hover:bg-gray-800 focus:bg-gray-500`;

export const CreateFormButton: FC<ComponentProps<'button'>> = (props) => {
  if (props.disabled) {
    return (
      <SectionBtn tw="border-2 border-color[#EEEEEE] color[#B2B2B2] background[#F3F3F3] cursor-default hover:background[#F3F3F3]" {...props} />
    );
  }
  return <SectionBtn {...props} />;
};
