import React from "react";

function Loading() {
  return (
    <div className="loading">
      <div className="lds-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <span className="text-[#817f7f]  font-normal text-lg mt-20 ml-2 absolute">
          Loading...
        </span>
      </div>
    </div>
  );
}

export default Loading;
