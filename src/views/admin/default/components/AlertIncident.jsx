import React, { useState, useEffect } from "react";
import { Carousel } from "primereact/carousel";
import { Tag } from "primereact/tag";
import { TabView, TabPanel } from "primereact/tabview";

export default function AlertIncident() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const data = [
      {
        id: 1,
        event: "Accident Saved",
        vehicle_registration_no: "MH 14 VP 6756",
        timestamp: "06 Jan , 16:00 hrs",
      },
      {
        id: 1,
        event: "Accident Saved",
        vehicle_registration_no: "MH 14 VP 6756",
        timestamp: "06 Jan , 16:00 hrs",
      },
      {
        id: 1,
        event: "Accident Saved",
        vehicle_registration_no: "MH 14 VP 6756",
        timestamp: "06 Jan , 16:00 hrs",
      },
      {
        id: 1,
        event: "Accident Saved",
        vehicle_registration_no: "MH 14 VP 6756",
        timestamp: "06 Jan , 16:00 hrs",
      },
      {
        id: 1,
        event: "Accident Saved",
        vehicle_registration_no: "MH 14 VP 6756",
        timestamp: "06 Jan , 16:00 hrs",
      },
      {
        id: 1,
        event: "Accident Saved",
        vehicle_regstration_no: "MH 14 VP 6756",
        timestamp: "06 Jan , 16:00 hrs",
      },
      {
        id: 1,
        event: "Accident Saved",
        vehicle_registration_no: "MH 14 VP 6756",
        timestamp: "06 Jan , 16:00 hrs",
      },
      {
        id: 1,
        event: "Accident Saved",
        vehicle_registration_no: "MH 14 VP 6756",
        timestamp: "06 Jan , 16:00 hrs",
      },
      {
        id: 1,
        event: "Accident Saved",
        vehicle_registration_no: "MH 14 VP 6756",
        timestamp: "06 Jan , 16:00 hrs",
      },
      {
        id: 1,
        event: "Accident Saved",
        vehicle_registration_no: "MH 14 VP 6756",
        timestamp: "06 Jan , 16:00 hrs",
      },
    ];
    setProducts(data);
  }, []);

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

  //bg-gray-600

  const productTemplate = (product) => {
    return (
      <div className="text-dark surface-border m-2 rounded-lg border-2 border-gray-100 px-3 py-5 text-center dark:bg-navy-800 dark:text-white">
        <div>
          <h4 className="mb-1">{product.event}</h4>
          <h6 className="mb-3 mt-0">{product.timestamp}</h6>
          <Tag
            value={product.vehicle_registration_no}
            severity="low"
            style={{ letterSpacing: "3px" }}
            className="bg-gray-600"
          ></Tag>
        </div>
      </div>
    );
  };

  return (
    <>
      <TabView className="mt-8 rounded-lg !bg-white pt-4">
        <TabPanel header="Alerts">
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
        <TabPanel header="Incidents">
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
    </>
  );
}
