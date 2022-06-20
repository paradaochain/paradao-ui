import React, { FC } from 'react';
import tw from 'twin.macro';
// import { Circle, CircleComplete, CircleOutline, Next } from '@icons/mui';

const H1 = tw.h1`text-2xl text-blue-800`;

const Create: React.FC = () => {
  return (
    <div tw="flex flex-col justify-center items-center">
      <H1>Create New DAO</H1>
      <div tw="flex flex-row justify-center items-center">
        <FormTimeline />
      </div>
    </div>
  );
};

// Flowbite example, was thinking to use some of this styling for the form to create a dao, where each point is a section of the form
// similar to https://app.astrodao.com/create-dao-new
const FormTimeline: FC = () => {
  return (
    <ol tw="relative border-l border-gray-200 dark:border-gray-700">
      <li tw="mb-10 ml-4">
        <div tw="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -left-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
        <time tw="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">February 2022</time>
        <h3 tw="text-lg font-semibold text-gray-900 dark:text-white">Application UI code in Tailwind CSS</h3>
        <p tw="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
          Get access to over 20+ pages including a dashboard layout, charts, kanban board, calendar, and pre-order E-commerce and Marketing
          pages.
        </p>
      </li>
      <li tw="mb-10 ml-4">
        <div tw="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -left-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
        <time tw="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">March 2022</time>
        <h3 tw="text-lg font-semibold text-gray-900 dark:text-white">Marketing UI design in Figma</h3>
        <p tw="text-base font-normal text-gray-500 dark:text-gray-400">
          All of the pages and components are first designed in Figma and we keep a parity between the two versions even as we update the
          project.
        </p>
      </li>
      <li tw="ml-4">
        <div tw="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -left-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
        <time tw="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">April 2022</time>
        <h3 tw="text-lg font-semibold text-gray-900 dark:text-white">E-Commerce UI code in Tailwind CSS</h3>
        <p tw="text-base font-normal text-gray-500 dark:text-gray-400">
          Get started with dozens of web components and interactive elements built on top of Tailwind CSS.
        </p>
      </li>
    </ol>
  );
};

export default Create;
