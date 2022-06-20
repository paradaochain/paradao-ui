import React, { FC } from 'react';
import tw from 'twin.macro';
// import { Alert } from 'flowbite-react';
import ThemeToggle from '@components/ThemeToggle';

const PrimaryButton = tw.button`bg-blue-800 text-white px-6 py-2 m-6 rounded-md hover:bg-blue-600`;
const OtherButton = tw(PrimaryButton)`bg-purple-600 hover:bg-purple-200`;

const Home: React.FC = () => {
  return (
    <div>
      <Breadcrumbs />
      <DemoTestimonial />
      <PrimaryButton> Hello </PrimaryButton>
      <OtherButton> Other Button</OtherButton>
      <ThemeToggle />
    </div>
  );
};

export default Home;

// can still use some of the examples from flowbite design :)
const Breadcrumbs: FC = () => {
    return (
      <nav tw="flex" aria-label="Breadcrumb">
        <ol tw="inline-flex items-center space-x-1 md:space-x-3">
          <li tw="inline-flex items-center">
            <a
              href="#"
              tw="inline-flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              <svg tw="mr-2 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
              </svg>
              Home
            </a>
          </li>
          <li>
            <div tw="flex items-center">
              <svg tw="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <a href="#" tw="ml-1 text-sm font-medium text-gray-700 hover:text-gray-900 md:ml-2 dark:text-gray-400 dark:hover:text-white">
                Projects
              </a>
            </div>
          </li>
          <li aria-current="page">
            <div tw="flex items-center">
              <svg tw="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span tw="ml-1 text-sm font-medium text-gray-500 md:ml-2 dark:text-gray-400">ParaDAO</span>
            </div>
          </li>
        </ol>
      </nav>
    );
};

// placeholder for init testing
const DemoTestimonial: FC = () => {
  return (
    <div tw="md:flex m-12 bg-gray-100 rounded-xl p-8 md:p-0">
      <img
        tw="w-32 h-32 md:w-48 md:h-auto md:rounded-none rounded-full mx-auto"
        src="https://tailwindcss.com/_next/static/media/sarah-dayan.a8ff3f1095a58085a82e3bb6aab12eb2.jpg"
        alt=""
        width="384"
        height="512"
      />
      <div tw="pt-6 md:p-8 text-center md:text-left space-y-4">
        <blockquote>
          <p tw="text-lg font-semibold">
            “Tailwind CSS is the only framework that Ive seen scale on large teams. Its easy to customize, adapts to any design, and the build
            size is tiny.”
          </p>
        </blockquote>
        <div tw="font-medium">
          <div tw="text-blue-600">Sarah Dayan</div>
          <div tw="text-gray-500">Staff Engineer, Algolia</div>
        </div>
      </div>
    </div>
  );
};
