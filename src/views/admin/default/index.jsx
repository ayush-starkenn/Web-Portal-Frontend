import { useEffect, useState } from "react";
import axios from "axios";
import { HiOutlineUsers } from "react-icons/hi";
import { BsTruck, BsFillCpuFill } from "react-icons/bs";
import Widget from "components/widget/Widget";
import Cookies from "js-cookie";
import MapOverview from "components/maps/MapOverview";
import VehicleData from "./components/VehicleData";
import AlertIncident from "./components/AlertIncident";

const Dashboard = () => {
  let token = Cookies.get("token");

  const [vehiclesCount, setVehiclesCount] = useState();
  const [devicesCount, setDevicesCount] = useState();
  const [customersCount, setCustomersCount] = useState();

  // Fetching total vehicle's count
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/vehicles/total-vehicles`, {
        headers: { authorization: `bearer ${token}` },
      })
      .then((res) => {
        // console.log(res);
        setVehiclesCount(res.data.result[0].count);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [token]);

  // Fetching total device's count
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/devices/total-devices`, {
        headers: { authorization: `bearer ${token}` },
      })
      .then((res) => {
        // console.log(res.data.result[0].count);
        setDevicesCount(res.data.result[0].count);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [token]);

  // Fetching total customer's count
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/customers/total-customers`, {
        headers: { authorization: `bearer ${token}` },
      })

      .then((res) => {
        setCustomersCount(res.data.result[0].count);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [token]);

  return (
    <div>
      <h4 className="text-dark pt-1 text-xl font-semibold dark:text-white">
        Dashboard
      </h4>

      {/* Card widget */}

      <div className="mt-3 flex flex-row justify-between sm-max:flex-col">
        <MapOverview className="rounded-lg" />
        <VehicleData />
      </div>

      <AlertIncident className=" !ml-0 mt-20" />

      {/* <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-3 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-3">
        <Widget
          icon={<HiOutlineUsers className="h-7 w-7" />}
          title={"Customers"}
          subtitle={customersCount}
          cardhref={"/admin/customers"}
        />
        <Widget
          icon={<BsFillCpuFill className="h-6 w-6" />}
          title={"Devices"}
          subtitle={devicesCount}
          cardhref={"/admin/devices"}
        />
        <Widget
          icon={<BsTruck className="h-7 w-7" />}
          title={"Vehicles"}
          subtitle={vehiclesCount}
          cardhref={"/admin/vehicles"}
        />
      </div> */}

      {/* Charts */}

      {/* <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-1 md:grid-cols-2">
        <div className="mb-5 md:mb-0">
          <TotalSpent />
          <br />
          <TotalSpent />
        </div>
        <div>
          <WeeklyRevenue />
        </div>
      </div> */}
    </div>
  );
};

export default Dashboard;
