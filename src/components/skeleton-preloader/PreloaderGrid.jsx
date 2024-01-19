import { Skeleton } from "primereact/skeleton";
import React from "react";

const PreloaderGrid = () => {
  return (
    <div className="card">
      <div className="border-round border-1 surface-border p-4 ">
        <ul className="m-0 list-none p-0">
          <li className="mb-3">
            <div className="col-3 grid">
              <Skeleton
                width="100%"
                height="12vh"
                className="mb-4 dark:bg-navy-700"
              ></Skeleton>
              <Skeleton
                width="100%"
                height="12vh"
                className="mb-4 dark:bg-navy-700"
              ></Skeleton>
              <Skeleton
                width="100%"
                height="12vh"
                className="mb-4 dark:bg-navy-700"
              ></Skeleton>
            </div>
          </li>
          <li className="mb-3">
            <div className="col-3 grid">
              <Skeleton
                width="100%"
                height="12vh"
                className="mb-4 dark:bg-navy-700"
              ></Skeleton>
              <Skeleton
                width="100%"
                height="12vh"
                className="mb-4 dark:bg-navy-700"
              ></Skeleton>
              <Skeleton
                width="100%"
                height="12vh"
                className="mb-4 dark:bg-navy-700"
              ></Skeleton>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PreloaderGrid;
