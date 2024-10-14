import React from 'react';

const SidebarLinkSkeleton = () => {
  return (
    <div
      className={`animate-pulse py-3 px-4 rounded-lg flex items-center justify-center w-[266px] gap-2 md:justify-normal`}
    >
      <div className='w-8 h-8 bg-gray-400 rounded-full md:h-6 md:w-8'></div>
      <span className={`hidden md:block text-sm w-full`}>
        <div className='w-full h-5 bg-gray-400 rounded'></div>
      </span>
    </div>
  );
};

export default SidebarLinkSkeleton;
