import React from "react";

const Loading = ({ height = "100vh" }) => {
   return (
      <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded-xl z-10">
         {/* Rotating & blinking circle */}
         <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
         <p className="text-white text-lg animate-pulse"></p>
      </div>
   );
};

export default Loading;
