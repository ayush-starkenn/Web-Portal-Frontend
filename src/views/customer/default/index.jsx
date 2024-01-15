import { BsTruck, BsFillCpuFill } from "react-icons/bs";
import Widget from "components/widget/Widget";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import axios from "axios";
import MapOverview from "../../../components/maps/MapOverview";
import OngoingTable from "./components/OngoingTable";
import LogsTable from "./components/LogsTable";
import { RiContactsLine } from "react-icons/ri";
import VehicleData from "views/admin/default/components/VehicleData";
import AlertIncident from "views/admin/default/components/AlertIncident";

const MainDashboard = () => {
  const user_uuid = Cookies.get("user_uuid");
  const token = Cookies.get("token");
  const [devicesCount, setDevicesCount] = useState();
  const [vehiclesCount, setVehiclesCount] = useState();
  const [driversCount, setDriversCount] = useState();

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/vehicles/get-user-vehiclelist/${user_uuid}`,
        { headers: { authorization: `bearer ${token}` } }
      )
      .then((res) => {
        setVehiclesCount(res.data.results.length);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [token, user_uuid]);

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/devices/get-user-devices-list/${user_uuid}`,
        { headers: { authorization: `bearer ${token}` } }
      )
      .then((res) => {
        setDevicesCount(res.data.results.length);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [token, user_uuid, devicesCount]);
  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/contacts/getContacts-all/${user_uuid}`,
        { headers: { authorization: `bearer ${token}` } }
      )
      .then((res) => {
        setDriversCount(res.data.contacts.length);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [token, user_uuid, driversCount]);
  return (
    <div>
      {/* Card widget */}
      <h4 className="text-dark py-3 text-2xl font-bold dark:text-white">
        Dashboard
      </h4>
      {/* <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-3 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-3">
        <Widget
          icon={<BsFillCpuFill className="h-6 w-6" />}
          title={"Devices"}
          subtitle={devicesCount}
          cardhref="/customer/devices"
        />

        <Widget
          icon={<BsTruck className="h-7 w-7" />}
          title={"Vehicles"}
          subtitle={vehiclesCount}
          cardhref="/customer/vehicles/*"
        />
        <Widget
          icon={<RiContactsLine className="h-6 w-6" />}
          title={"Contacts"}
          subtitle={driversCount}
          cardhref="/customer/contacts"
        />
      </div> */}

      {/* <div className="mt-6">
        <MapOverview />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-2">
        <div>
          <OngoingTable />
        </div>
        <div>
          <LogsTable />
        </div>
      </div> */}
      <div className="mt-3 flex flex-row justify-between sm-max:flex-col">
        <MapOverview className="rounded-lg" />
        <VehicleData />
      </div>
      <div>
        <AlertIncident className="!ml-0 mt-20" />
      </div>
    </div>
  );
};

export default MainDashboard;
