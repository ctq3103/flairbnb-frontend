import React from "react";

export const PageSkeleton = () => {
  const skeletonParagraph = (
    <div className="space-y-2">
      <div className="bg-gray-200 animate-pulse h-4 w-1/2 mb-2"></div>
      <div className="bg-gray-200 animate-pulse h-4 w-2/3 mb-2"></div>
      <div className="bg-gray-200 animate-pulse h-4 w-2/3 mb-2"></div>
      <p className="leading-relaxed mb-3 w-2/3 h-3 animate-pulse bg-gray-200"></p>
      <p className="leading-relaxed mb-3 w-1/2 h-3 animate-pulse bg-gray-200"></p>
    </div>
  );
  return (
    <div className="space-y-8 mt-8">
      {/* <div className="bg-gray-400 animate-pulse h-4 w-1/4 mb-2"></div>
    <div className="w-1/2 mb-4 h-6 animate-pulse bg-gray-500"></div> */}
      {skeletonParagraph}
      {skeletonParagraph}
      {skeletonParagraph}
      {skeletonParagraph}
      {skeletonParagraph}
      {/* <p className="leading-relaxed mb-3 w-2/3 h-3 animate-pulse bg-gray-400"></p>
      <p className="leading-relaxed mb-3 w-1/2 h-3 animate-pulse bg-gray-400"></p>
      <div className="flex items-center flex-wrap ">
        <span className="bg-indigo-300 h-4 animate-pulse mt-2 w-32 inline-flex items-center md:mb-2 lg:mb-0"></span>
        <span className="bg-indigo-300 w-16 mt-2 h-4 animate-pulse mr-3 px-2 inline-flex items-center ml-auto leading-none text-sm pr-5 py-1"></span>
      </div> */}
    </div>
  );
};
