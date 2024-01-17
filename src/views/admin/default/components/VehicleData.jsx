import { Checkbox } from "primereact/checkbox";
import { ScrollPanel } from "primereact/scrollpanel";
import React, { useState } from "react";

const VehicleData = () => {
  const [checked, setChecked] = useState(false);
  return (
    <>
      <div className="card rounded-none rounded-t-lg  bg-gray-50 dark:bg-navy-800 dark:text-gray-50">
        <ScrollPanel
          style={{ width: "18vw", height: "494px" }}
          className="custombar2 !sm-max:w-[100vw] mx-2"
        >
          <h1 className="text-dark pt-3 text-base font-semibold dark:text-white">
            All Vehicles
          </h1>
          <div className="my-4 mr-4">
            <div className="card justify-content-start flex items-center border-b-0 border-l-8 border-r-0 border-t-0 border-gray-200 border-l-navy-400 bg-gray-200 py-2 pl-2 dark:bg-gray-900 ">
              <Checkbox
                onChange={(e) => setChecked(e.checked)}
                checked={checked}
              ></Checkbox>
              <p className="pl-2">Vehicle 001</p>
            </div>
            <div className="border-gray-400 pb-2 pt-2">
              <p className="ml-4 text-sm">Vehicle Type</p>
              <p className="ml-4 text-xs text-[#444] dark:text-[#ccc]">
                Transport
              </p>
            </div>
            <div className=" border-gray-400 pb-2">
              <p className="ml-4 text-sm">Last Updated Time</p>
              <p className="ml-4 text-xs text-[#444] dark:text-[#ccc]">
                1:05:34pm
              </p>
            </div>
            <div className="border-b-[1px] border-gray-400 pb-2">
              <p className="ml-4 text-sm">Odometer Reading</p>
              <p className="ml-4 text-xs text-[#444] dark:text-[#ccc]">
                76597 Kms
              </p>
            </div>
          </div>
          <div className="my-4 mr-4">
            <div className="card justify-content-start flex items-center border-b-0 border-l-8 border-r-0 border-t-0 border-gray-200 border-l-navy-400 bg-gray-200 py-2 pl-2 dark:bg-gray-900 ">
              <Checkbox
                onChange={(e) => setChecked(e.checked)}
                checked={checked}
              ></Checkbox>
              <p className="pl-2">Vehicle 001</p>
            </div>
            <div className="border-gray-400 pb-2 pt-2">
              <p className="ml-4 text-sm">Vehicle Type</p>
              <p className="ml-4 text-xs text-[#444] dark:text-[#ccc]">
                Transport
              </p>
            </div>
            <div className=" border-gray-400 pb-2">
              <p className="ml-4 text-sm">Last Updated Time</p>
              <p className="ml-4 text-xs text-[#444] dark:text-[#ccc]">
                1:05:34pm
              </p>
            </div>
            <div className="border-b-[1px] border-gray-400 pb-2">
              <p className="ml-4 text-sm">Odometer Reading</p>
              <p className="ml-4 text-xs text-[#444] dark:text-[#ccc]">
                76597 Kms
              </p>
            </div>
          </div>
          <div className="my-4 mr-4">
            <div className="card justify-content-start flex items-center border-b-0 border-l-8 border-r-0 border-t-0 border-gray-200 border-l-navy-400 bg-gray-200 py-2 pl-2 dark:bg-gray-900 ">
              <Checkbox
                onChange={(e) => setChecked(e.checked)}
                checked={checked}
              ></Checkbox>
              <p className="pl-2">Vehicle 001</p>
            </div>
            <div className="border-gray-400 pb-2 pt-2">
              <p className="ml-4 text-sm">Vehicle Type</p>
              <p className="ml-4 text-xs text-[#444] dark:text-[#ccc]">
                Transport
              </p>
            </div>
            <div className=" border-gray-400 pb-2">
              <p className="ml-4 text-sm">Last Updated Time</p>
              <p className="ml-4 text-xs text-[#444] dark:text-[#ccc]">
                1:05:34pm
              </p>
            </div>
            <div className="border-b-[1px] border-gray-400 pb-2">
              <p className="ml-4 text-sm">Odometer Reading</p>
              <p className="ml-4 text-xs text-[#444] dark:text-[#ccc]">
                76597 Kms
              </p>
            </div>
          </div>
          <div className="my-4 mr-4">
            <div className="card justify-content-start flex items-center border-b-0 border-l-8 border-r-0 border-t-0 border-gray-200 border-l-navy-400 bg-gray-200 py-2 pl-2 dark:bg-gray-900 ">
              <Checkbox
                onChange={(e) => setChecked(e.checked)}
                checked={checked}
              ></Checkbox>
              <p className="pl-2">Vehicle 001</p>
            </div>
            <div className="border-gray-400 pb-2 pt-2">
              <p className="ml-4 text-sm">Vehicle Type</p>
              <p className="ml-4 text-xs text-[#444] dark:text-[#ccc]">
                Transport
              </p>
            </div>
            <div className=" border-gray-400 pb-2">
              <p className="ml-4 text-sm">Last Updated Time</p>
              <p className="ml-4 text-xs text-[#444] dark:text-[#ccc]">
                1:05:34pm
              </p>
            </div>
            <div className="border-b-[1px] border-gray-400 pb-2">
              <p className="ml-4 text-sm">Odometer Reading</p>
              <p className="ml-4 text-xs text-[#444] dark:text-[#ccc]">
                76597 Kms
              </p>
            </div>
          </div>

          <div className="my-4 mr-4">
            <div className="card justify-content-start flex items-center border-b-0 border-l-8 border-r-0 border-t-0 border-gray-200 border-l-navy-400 bg-gray-200 py-2 pl-2 dark:bg-gray-900 ">
              <Checkbox
                onChange={(e) => setChecked(e.checked)}
                checked={checked}
              ></Checkbox>
              <p className="pl-2">Vehicle 001</p>
            </div>
            <div className="border-gray-400 pb-2 pt-2">
              <p className="ml-4 text-sm">Vehicle Type</p>
              <p className="ml-4 text-xs text-[#444] dark:text-[#ccc]">
                Transport
              </p>
            </div>
            <div className=" border-gray-400 pb-2">
              <p className="ml-4 text-sm">Last Updated Time</p>
              <p className="ml-4 text-xs text-[#444] dark:text-[#ccc]">
                1:05:34pm
              </p>
            </div>
            <div className="border-b-[1px] border-gray-400 pb-2">
              <p className="ml-4 text-sm">Odometer Reading</p>
              <p className="ml-4 text-xs text-[#444] dark:text-[#ccc]">
                76597 Kms
              </p>
            </div>
          </div>
        </ScrollPanel>
      </div>
    </>
  );
};

export default VehicleData;
