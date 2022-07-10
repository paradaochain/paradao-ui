import clsx from 'clsx';
import React, { PropsWithChildren, useRef, useState } from 'react';
import { useClickAway } from 'react-use';
import { RiArrowDownSLine } from 'react-icons/ri';

interface DropdownProps {
  options: {
    name: string;
    value?: string;
    click?: () => void;
  }[];
}

const Dropdown: React.FC<PropsWithChildren<DropdownProps>> = ({ options, children }) => {
  const [open, setOpen] = useState<boolean>(false);
  const dropdownRef = useRef(null);

  useClickAway(dropdownRef, () => setOpen(false));

  const OptionsItems = options.map((el, i) => {
    return (
      <li key={i}>
        <button className="dropdown-item py-2 px-4 w-full whitespace-nowrap bg-transparent text-gray-700 hover:bg-gray-100" onClick={el.click}>
          {el.name}
        </button>
      </li>
    );
  });

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="px-2 py-1 bg-purple-600 text-white rounded shadow-md hover:bg-purple-700 hover:shadow-lg focus:bg-purple-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-purple-800 active:shadow-lg active:text-white transition duration-150 ease-in-out flex items-center"
        onClick={() => setOpen(!open)}
      >
        {children}
        <RiArrowDownSLine className={clsx('transition-all delay-200 ml-2', open && 'rotate-[180deg]')} />
      </button>
      <ul
        className={clsx(
          'min-w-max absolute right-0 bg-white z-50 float py-2 list-none text-left rounded-lg shadow-lg mt-1 m-0 bg-clip-padding border-none',
          !open && 'hidden'
        )}
      >
        {OptionsItems}
      </ul>
    </div>
  );
};

export default Dropdown;
