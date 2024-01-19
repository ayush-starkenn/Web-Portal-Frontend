import React from "react";

// Admin Imports
import Dashboard from "views/admin/default";
import VehiclesAdmin from "views/admin/vehicles";
import DevicesAdmin from "views/admin/devices";
import AnalyticsThreshold from "views/admin/analytics_threshold";
import FeatureSet from "views/admin/feature_set";
import Customers from "views/admin/customers";
// import Plans from "views/admin/plans";
// Customer Imports
import MainDashboard from "views/customer/default";
import Vehicles from "views/customer/vehicles";
// import RFIDs from "views/customer/rfids";
import Devices from "views/customer/devices";
import Triggers from "views/customer/alert-triggers";
import Contacts from "views/admin/contacts";
import Reports from "views/customer/reports";

// Icon Imports
import {
  MdOutlineDashboard,
  MdOutlineFeaturedPlayList,
  MdContactPhone,
  MdOutlineSimCard,
} from "react-icons/md";
import { CgOrganisation } from "react-icons/cg";
// import { CiWallet } from "react-icons/ci";
import { BsTruck, BsFillCpuFill } from "react-icons/bs";
import { RiAlertLine } from "react-icons/ri";
import { TbReport, TbDeviceAnalytics } from "react-icons/tb";
// import { BiRfid } from "react-icons/bi";
import { HiOutlineUsers } from "react-icons/hi";
import AdminProtected from "authorization/AdminProteted";
import CustomerProtected from "authorization/CustomerProtected";
// import { DiDatabase } from "react-icons/di";
// import Drivers from "views/customer/drivers";
import OngoingTrip from "views/customer/vehicles/components/OngoingTrip";
import CompletedTrip from "views/customer/vehicles/components/CompletedTrip";
import Organization from "views/admin/organization";
import SimCards from "views/admin/sim_cards";

//routes for Admin panel
export const routes_admin = [
  {
    name: "Dashboard",
    title: "Dashboard",
    layout: "/admin",
    path: "dashboard",
    icon: <MdOutlineDashboard className="h-6 w-6" />,
    component: <Dashboard />,
  },
  {
    name: "Organization",
    title: "Organization",
    layout: "/admin",
    path: "organization",
    icon: <CgOrganisation className="h-6 w-6" />,
    component: (
      // <AdminProtected>
      <Organization />
      // </AdminProtected>
    ),
  },
  // {
  //   name: "Plans",
  //   title: "Plans",
  //   layout: "/admin",
  //   path: "plans",
  //   icon: <CiWallet className="h-6 w-6" />,
  //   component: (
  //     <AdminProtected>
  //       <Plans />
  //     </AdminProtected>
  //   ),
  // },
  {
    name: "Customers",
    title: "Customers",
    layout: "/admin",
    path: "customers",
    icon: <HiOutlineUsers className="h-6 w-6" />,
    component: (
      // <AdminProtected>
      <Customers />
      // </AdminProtected>
    ),
  },
  {
    name: "Devices",
    title: "Devices",
    layout: "/admin",
    icon: <BsFillCpuFill className="h-6 w-6" />,
    path: "devices",
    component: (
      // <AdminProtected>
      <DevicesAdmin />
      // </AdminProtected>
    ),
  },
  {
    name: "Sim Cards",
    title: "Sim Cards",
    layout: "/admin",
    path: "sim-cards",
    icon: <MdOutlineSimCard className="h-6 w-6" />,
    component: (
      // <AdminProtected>
      <SimCards />
      // </AdminProtected>
    ),
  },
  {
    name: "Vehicles",
    title: "Vehicles",
    layout: "/admin",
    path: "vehicles",
    icon: <BsTruck className="h-6 w-6" />,
    component: (
      // <AdminProtected>
      <VehiclesAdmin />
      // </AdminProtected>
    ),
    secondary: true,
  },
  {
    name: "Contacts",
    title: "Contacts",
    layout: "/admin",
    path: "contacts",
    icon: <MdContactPhone className="h-6 w-6" />,
    component: (
        <Contacts />
    ),
  },
  {
    name: "Feature Set",
    title: "Feature Set",
    layout: "/admin",
    path: "feature-set",
    icon: <MdOutlineFeaturedPlayList className="h-6 w-6" />,
    component: (
      // <AdminProtected>
      <FeatureSet />
      // </AdminProtected>
    ),
  },
  {
    name: "Analytics",
    title: "Analytics Threshold",
    layout: "/admin",
    path: "analytics-threshold",
    icon: <TbDeviceAnalytics className="h-6 w-6" />,
    component: (
      // <AdminProtected>
      <AnalyticsThreshold />
      // </AdminProtected>
    ),
  },
];

//routes for Customer panel
export const routes_customer = [
  {
    name: "Dashboard",
    title: "Dashboard",
    layout: "/customer",
    path: "dashboard",
    icon: <MdOutlineDashboard className="h-6 w-6" />,
    component: (
      <CustomerProtected>
        <MainDashboard />
      </CustomerProtected>
    ),
  },
  {
    name: "Devices",
    title: "Devices",
    layout: "/customer",
    icon: <BsFillCpuFill className="h-6 w-6" />,
    path: "devices",
    component: (
      <CustomerProtected>
        <Devices />
      </CustomerProtected>
    ),
  },
  {
    name: "Sim Cards",
    title: "Sim Cards",
    layout: "/admin",
    path: "sim-cards",
    icon: <MdOutlineSimCard className="h-6 w-6" />,
    component: (
      <CustomerProtected>
        <SimCards />
      </CustomerProtected>
    ),
  },
  // {
  //   name: "drivers",
  //   title: "Drivers",
  //   layout: "/customer",
  //   path: "drivers",
  //   icon: <RiContactsLine className="h-6 w-6" />,
  //   component: (
  //     <CustomerProtected>
  //       <Drivers />
  //     </CustomerProtected>
  //   ),
  // },
  {
    name: "Vehicles",
    title: "Vehicles",
    layout: "/customer",
    path: "vehicles/", // Use a wildcard path to match any subroute of "vehicles"
    icon: <BsTruck className="h-6 w-6" />,
    component: (
      <CustomerProtected>
        <Vehicles />
      </CustomerProtected>
    ),
  },
  {
    name: "Vehicles",
    title: "Vehicles",
    layout: "/customer",
    path: "vehicles/ongoing-trip/:trip_id",
    icon: <BsTruck className="h-6 w-6" />,
    component: (
      <CustomerProtected>
        <OngoingTrip />
      </CustomerProtected>
    ),
  },
  {
    name: "Vehicles",
    title: "Vehicles",
    layout: "/customer",
    path: "vehicles/completed-trip/:trip_id",
    icon: <BsTruck className="h-6 w-6" />,
    component: (
      <CustomerProtected>
        <CompletedTrip />
      </CustomerProtected>
    ),
  },
  // {
  //   name: "Vehicle",
  //   title: "Vehicle Logs",
  //   layout: "/customer",
  //   path: "vehicle-logs",
  //   icon: <DiDatabase className="h-6 w-6" />,
  //   component: (
  //     <CustomerProtected>
  //       <RFIDs />
  //     </CustomerProtected>
  //   ),
  // },
  {
    name: "Alert",
    title: "Alert Triggers",
    layout: "/customer",
    path: "alert-triggers",
    icon: <RiAlertLine className="h-6 w-6" />,
    component: (
      <CustomerProtected>
        <Triggers />
      </CustomerProtected>
    ),
  },
  // {
  //   name: "RFIDs",
  //   title: "RFIDs",
  //   layout: "/customer",
  //   path: "RFIDs",
  //   icon: <BiRfid className="h-6 w-6" />,
  //   component: (
  //     <CustomerProtected>
  //       <RFIDs />
  //     </CustomerProtected>
  //   ),
  // },
  {
    name: "Reports",
    title: "Reports",
    layout: "/customer",
    path: "reports",
    icon: <TbReport className="h-6 w-6" />,
    component: (
      <CustomerProtected>
        <Reports />
      </CustomerProtected>
    ),
  },
  {
    name: "Contacts",
    title: "Contacts",
    layout: "/admin",
    path: "contacts",
    icon: <MdContactPhone className="h-6 w-6" />,
    component: (
        <Contacts />
    ),
  },
];
