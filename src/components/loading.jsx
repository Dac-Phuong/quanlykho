import React from "react";
import { RotatingLines, Triangle } from "react-loader-spinner";

function Loading() {
  return (
    <div className="loading">
      <div className="lds-ring">
        <Triangle
          height="80"
          width="80"
          color="#448AFF"
          ariaLabel="triangle-loading"
          wrapperStyle={{}}
          wrapperClassName=""
          visible={true}
        />
      </div>
    </div>
  );
}

export default Loading;
