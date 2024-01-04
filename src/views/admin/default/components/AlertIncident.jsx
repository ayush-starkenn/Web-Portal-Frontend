import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { Carousel } from "primereact/carousel";
import { Tag } from "primereact/tag";
import { TabView, TabPanel } from "primereact/tabview";

export default function AlertIncident() {
  const [products, setProducts] = useState([]);
  const data = [
    {
      id: 1,
      event: "Accident Saved",
      vehicle_regestration_no: "MH 14 VP 6756",
      timestamp: "06 Jan , 16:00 hrs",
    },
    {
      id: 1,
      event: "Accident Saved",
      vehicle_regestration_no: "MH 14 VP 6756",
      timestamp: "06 Jan , 16:00 hrs",
    },
    {
      id: 1,
      event: "Accident Saved",
      vehicle_regestration_no: "MH 14 VP 6756",
      timestamp: "06 Jan , 16:00 hrs",
    },
    {
      id: 1,
      event: "Accident Saved",
      vehicle_regestration_no: "MH 14 VP 6756",
      timestamp: "06 Jan , 16:00 hrs",
    },
    {
      id: 1,
      event: "Accident Saved",
      vehicle_regestration_no: "MH 14 VP 6756",
      timestamp: "06 Jan , 16:00 hrs",
    },
    {
      id: 1,
      event: "Accident Saved",
      vehicle_regestration_no: "MH 14 VP 6756",
      timestamp: "06 Jan , 16:00 hrs",
    },
    {
      id: 1,
      event: "Accident Saved",
      vehicle_regestration_no: "MH 14 VP 6756",
      timestamp: "06 Jan , 16:00 hrs",
    },
    {
      id: 1,
      event: "Accident Saved",
      vehicle_regestration_no: "MH 14 VP 6756",
      timestamp: "06 Jan , 16:00 hrs",
    },
    {
      id: 1,
      event: "Accident Saved",
      vehicle_regestration_no: "MH 14 VP 6756",
      timestamp: "06 Jan , 16:00 hrs",
    },
    {
      id: 1,
      event: "Accident Saved",
      vehicle_regestration_no: "MH 14 VP 6756",
      timestamp: "06 Jan , 16:00 hrs",
    },
  ];
  const responsiveOptions = [
    {
      breakpoint: "1199px",
      numVisible: 5,
      numScroll: 5,
    },
    {
      breakpoint: "991px",
      numVisible: 3,
      numScroll: 3,
    },
    {
      breakpoint: "767px",
      numVisible: 2,
      numScroll: 2,
    },
  ];

  useEffect(() => {
    setProducts(data);
  }, []);

  //bg-gray-600

  const productTemplate = (product) => {
    return (
      <div className="border-2 text-dark dark:text-white dark:bg-navy-800 border-gray-600 surface-border border-round m-2 text-center py-5 px-3">
        <div>
          <h4 className="mb-1">{product.event}</h4>
          <h6 className="mt-0 mb-3">{product.timestamp}</h6>
          <Tag
            value={product.vehicle_regestration_no}
            severity="low"
            style={{ letterSpacing: "3px" }}
            className="bg-gray-600"
          ></Tag>
        </div>
      </div>
    );
  };

  return (
    <TabView className="mt-20 !bg-white pt-4 rounded-lg">
      <TabPanel className="" header="Alerts">
        <div className="card">
          <Carousel
            className="mx-10"
            value={products}
            numVisible={5}
            numScroll={5}
            responsiveOptions={responsiveOptions}
            itemTemplate={productTemplate}
          />
        </div>
      </TabPanel>
      <TabPanel className="" header="Incidents">
        <div className="card">
          <Carousel
            value={products}
            numVisible={5}
            numScroll={2}
            responsiveOptions={responsiveOptions}
            itemTemplate={productTemplate}
          />
        </div>
      </TabPanel>
    </TabView>
  );
}
