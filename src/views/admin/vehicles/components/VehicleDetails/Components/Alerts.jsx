import React, { useState, useEffect, useRef } from "react";

import { OrderList } from "primereact/orderlist";

import { Badge } from "primereact/badge";

import { Toast } from "primereact/toast";

import { TabView, TabPanel } from "primereact/tabview";

function Alerts() {
  const toast = useRef(null);
  const show = () => {
    toast.current.show({
      severity: "info",
      summary: "Info",
      detail: "No Video Found ! Sound great.",
    });
  };
  const video = true;
  const item = [
    {
      name: "alert 1",
      value: 3,
    },
    {
      name: "alert 1",
      value: 3,
    },
    {
      name: "alert 1",
      value: 3,
    },
    {
      name: "alert 1",
      value: 3,
    },
    {
      name: "alert 1",
      value: 3,
    },
    {
      name: "alert 1",
      value: 3,
    },
    {
      name: "alert 1",
      value: 3,
    },
    {
      name: "alert 1",
      value: 3,
    },
  ];
  const [alerts, setAlert] = useState([]);
  useEffect(() => {
    setAlert(item);
  }, []);

  useEffect(() => {
    if (!video) {
      show();
    }
  }, [video]);

  const itemTemplate = (item) => {
    return (
      <div className="scrollbar-width-0 align-items-center flex flex-wrap gap-3 p-2">
        <div className="flex-column flex flex-1 gap-2">
          <span className="font-bold">{item.name}</span>
          <div className="align-items-center ml-40 flex gap-2">
            <Badge value={item.value} severity="danger"></Badge>
          </div>
        </div>
      </div>
    );
  };
  return (
    <div>
      <h1 className=" mt-0 px-10 ">MH 14 VP 6875</h1>
      <TabView className="mt-24">
        <TabPanel header="CAS">
          <div className="m-3 mx-2 flex flex-wrap items-center  justify-between rounded-lg p-5 md:m-10 md:mx-3 md:mt-3">
            <OrderList
              className="rgba-[0,0,0,0.8] rgba-[0,0,0,0.24] scrollbar-width-0 border-black border-2 border-solid shadow-md shadow-sm"
              value={alerts}
              onChange={(e) => setAlert(e.value)}
              itemTemplate={itemTemplate}
              header="Alerts"
            ></OrderList>
            {video ? (
              <video
                className="w-300px h-300px md:h-[100%] lg:w-[600px]"
                controls
              >
                <source src="https://www.youtube.com/watch?v=ZpUO2mYtbLU" />
              </video>
            ) : (
              <h1>No Record Found</h1>
            )}
          </div>
          <Toast ref={toast} />
        </TabPanel>
        <TabPanel header="DMS">
          <div className="m-3 mx-2 flex flex-wrap items-center  justify-between rounded-lg p-5 md:m-10 md:mx-3 md:mt-3">
            <OrderList
              className="rgba-[0,0,0,0.8] rgba-[0,0,0,0.24] scrollbar-width-0 border-black border-2 border-solid shadow-md shadow-sm"
              value={alerts}
              onChange={(e) => setAlert(e.value)}
              itemTemplate={itemTemplate}
              header="Alerts"
            ></OrderList>
            {video ? (
              <video
                className="w-300px h-300px md:h-[100%] lg:w-[600px]"
                controls
              >
                <source src="https://www.youtube.com/watch?v=ZpUO2mYtbLU" />
              </video>
            ) : (
              <h1>No Record Found</h1>
            )}
          </div>
          <Toast ref={toast} />
        </TabPanel>
        <TabPanel header="IOT">
          <div className="m-3 mx-2 flex flex-wrap items-center  justify-between rounded-lg p-5 md:m-10 md:mx-3 md:mt-3">
            <OrderList
              className="rgba-[0,0,0,0.8] rgba-[0,0,0,0.24] scrollbar-width-0 border-black border-2 border-solid shadow-md shadow-sm"
              value={alerts}
              onChange={(e) => setAlert(e.value)}
              itemTemplate={itemTemplate}
              header="Alerts"
            ></OrderList>
            {video ? (
              <video
                className="w-300px h-300px md:h-[100%] lg:w-[600px]"
                controls
              >
                <source src="https://www.youtube.com/watch?v=ZpUO2mYtbLU" />
              </video>
            ) : (
              <h1>No Record Found</h1>
            )}
          </div>
          <Toast ref={toast} />
        </TabPanel>
      </TabView>

      
    </div>
  );
}

export default Alerts;
