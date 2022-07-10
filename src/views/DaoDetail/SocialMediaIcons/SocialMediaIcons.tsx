import React from 'react';

import { BsDiscord } from 'react-icons/bs';
import { BsInstagram } from 'react-icons/bs';
import { BsYoutube } from 'react-icons/bs';
import { BiWorld } from 'react-icons/bi';

interface SocialMediaIconsProps {
  links: Record<string, string>;
}

const SocialMediaIcons: React.FC<SocialMediaIconsProps> = ({ links }) => {
  return (
    <div className="flex  items-center justify-center gap-5">
      {links?.website && (
        <a href={links.website} target="_blank" rel="noopener noreferrer">
          <BiWorld className=" w-5 h-5  text-purple-900 hover:text-purple-500" />
        </a>
      )}
      {links?.instagram && (
        <a href={links.instagram} target="_blank" rel="noopener noreferrer">
          <BsInstagram className=" w-5 h-5  text-purple-900 hover:text-purple-500" />
        </a>
      )}
      {links?.youtube && (
        <a href={links.instagram} target="_blank" rel="noopener noreferrer">
          <BsYoutube className=" w-5 h-5  text-purple-900 hover:text-purple-500" />
        </a>
      )}
      {links?.discord && (
        <a href={links.discord} target="_blank" rel="noopener noreferrer">
          <BsDiscord className=" w-5 h-5  text-purple-900 hover:text-purple-500" />
        </a>
      )}
    </div>
  );
};

export default SocialMediaIcons;
