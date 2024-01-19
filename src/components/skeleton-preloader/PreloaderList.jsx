import { Skeleton } from "primereact/skeleton";
import React from "react";

const PreloaderList = () => {
  return (
    <div className="card">
      <div className="border-round border-1 surface-border p-4 ">
        <ul className="m-0 list-none p-0">
          <li>
            <div className="flex">
              <div style={{ flex: "1" }}>
                <Skeleton
                  width="100%"
                  height="7vh"
                  className="mb-4 dark:bg-navy-700"
                ></Skeleton>
                <Skeleton
                  width="100%"
                  height="7vh"
                  className="mb-4 dark:bg-navy-700"
                ></Skeleton>
              </div>
            </div>
          </li>
          <li>
            <div className="flex">
              <div style={{ flex: "1" }}>
                <Skeleton
                  width="100%"
                  height="7vh"
                  className="mb-4 dark:bg-navy-700"
                ></Skeleton>
                <Skeleton
                  width="100%"
                  height="7vh"
                  className="mb-4 dark:bg-navy-700"
                ></Skeleton>
              </div>
            </div>
          </li>
          <li>
            <div className="flex">
              <div style={{ flex: "1" }}>
                <Skeleton
                  width="100%"
                  height="100%"
                  className="mb-4 dark:bg-navy-700"
                ></Skeleton>
                <Skeleton
                  width="100%"
                  height="100%"
                  className="mb-4 dark:bg-navy-700"
                ></Skeleton>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PreloaderList;
