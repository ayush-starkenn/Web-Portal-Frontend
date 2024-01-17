import React, { useState, useEffect, useRef } from "react";
import DevicesList from "./components/DevicesList";
import DevicesGrid from "./components/DevicesGrid";
import { BsGrid, BsListUl } from "react-icons/bs";
import axios from "axios";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import Cookies from "js-cookie";
import { FiPlus } from "react-icons/fi";

const DevicesAdmin = () => {
  const token = Cookies.get("token");
  const user_id = Cookies.get("user_id");
  const [devices, setDevices] = useState(true);
  const [data, setData] = useState([]);
  const [isListView, setIsListView] = useState(
    localStorage.getItem("viewPreference") === "grid" ? false : true
  );
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    device_id: false,
    device_type_id: false,
  });

  const [addData, setAddData] = useState({
    device_id: "",
    device_type_id: "",
  });
  const [devicetypes, setDeviceTypes] = useState([]);
  const toastRef = useRef(null);

  //Fetching all data

  useEffect(() => {
    axios
      .post(
        `${process.env.REACT_APP_AWS_URL}/getUserDevices`,
        { user_id },
        {
          headers: {
            Authorization: token,
          },
        }
      )

      .then((res) => {
        const formattedData = res.data.data.deviceData.devices.map(
          (item, index) => ({
            ...item,
            serialNo: index + 1,
            key: index + 1,
          })
        );
        setData(formattedData);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [token, user_id, devices]);

  // Edit Devices
  const handleEditDevice = (deviceId, editedDevice) => {
    axios
      .put(
        `${process.env.REACT_APP_AWS_URL}/editDevice/${deviceId}`,
        { ...editedDevice },
        { headers: { Authorization: token } }
      )
      .then((res) => {
        setDevices(editedDevice);

        toastRef.current.show({
          severity: "success",
          summary: "Success",
          detail: `Device ${deviceId} updated successfully`,
          life: 3000,
        });
      })
      .catch((err) => {
        if (err.response.data === 404) {
          toastRef.current.show({
            severity: "warn",
            summary: "Warning",
            detail: "Device not found",
            life: 3000,
          });
        }
        if (err.response.data === 500) {
          toastRef.current.show({
            severity: "danger",
            summary: "Error",
            detail: "Failed to update device",
            life: 3000,
          });
        }
      });
  };

  // Delete api call
  const handleDeleteDevice = (deviceId) => {
    axios
      .put(
        `${process.env.REACT_APP_API_URL}/devices/delete-device/${deviceId}`,
        { user_uuid: user_id },
        { headers: { authorization: `bearer ${token}` } }
      )
      .then((res) => {
        setDevices(data);
        toastRef.current.show({
          severity: "success",
          summary: "Success",
          detail: `Device ${deviceId} deleted successfully`,
          life: 3000,
        });
      })
      .catch((err) => {
        console.error(err);
        toastRef.current.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to delete device. Please try again later.",
          life: 3000,
        });
      });
  };

  const resetFormData = () => {
    setAddData({
      device_id: "",
      device_type_id: "",
    });
  };

  const handleToggleView = () => {
    const newView = !isListView;
    setIsListView(newView);
    // Store the view preference in localStorage
    localStorage.setItem("viewPreference", newView ? "list" : "grid");
  };

  //Add device dialog open
  const openDialog = () => {
    resetFormData();
    setIsDialogVisible(true);
  };

  //Add device dialog close
  const closeDialog = () => {
    resetFormData();
    setValidationErrors(false);
    setIsDialogVisible(false);
  };

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_AWS_URL}/deviceTypeData`, {
        headers: { Authorization: token },
      })
      .then((res) => {
        setDeviceTypes(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [token]);

  const devicesOptions = () => {
    return devicetypes?.map((el) => ({
      label: el.device_name,
      value: el.device_type_id,
    }));
  };

  // Add customer api call
  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post(
        `${process.env.REACT_APP_AWS_URL}/createDevice`,
        { ...addData },
        {
          headers: { Authorization: token },
        }
      )
      .then(() => {
        setDevices(addData);
        toastRef.current.show({
          severity: "success",
          summary: "Success",
          detail: `Device ${addData.device_id} added successfully`,
          life: 3000,
        });
        closeDialog();
      })
      .catch((err) => {
        toastRef.current.show({
          severity: "error",
          summary: "Error",
          detail: err.response.data.message,
          life: 3000,
        });
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddData({ ...addData, [name]: value });
  };

  //add device dialog
  return (
    <>
      <Toast ref={toastRef} className="toast-custom" position="top-right" />
      <div className="flex justify-between">
        <h4 className="text-dark pt-3 text-2xl font-bold dark:text-white">
          Devices
        </h4>
        <Dialog
          visible={isDialogVisible}
          onHide={closeDialog}
          style={{ width: "45rem" }}
          breakpoints={{ "960px": "75vw", "641px": "90vw" }}
          header="Fill the details"
          modal
          className="p-fluid dark:bg-gray-900"
        >
          <form onSubmit={handleSubmit} className="mx-auto">
            <div
              className={`mx-auto mt-8 w-full ${
                validationErrors.device_id ? "p-error" : ""
              }`}
            >
              <span className="p-float-label">
                <InputText
                  id="device_id"
                  name="device_id"
                  onChange={handleChange}
                  className={`border py-2 pl-2 ${
                    validationErrors.device_id ? "border-red-600" : ""
                  }`}
                />
                <label htmlFor="device_id" className="dark:text-gray-300">
                  Device ID
                </label>
              </span>
              {validationErrors.device_id && (
                <small className="text-red-600">Device ID is required</small>
              )}
            </div>
            <div
              className={`mx-auto mt-8 w-full ${
                validationErrors.device_type_id ? "p-error" : ""
              }`}
            >
              <span className="p-float-label">
                <Dropdown
                  id="device_type"
                  name="device_type_id"
                  options={devicesOptions()}
                  optionLabel="label"
                  optionValue="value"
                  className={`p-dropdown border ${
                    validationErrors.device_type_id ? "border-red-600" : ""
                  }`}
                  onChange={handleChange}
                  value={addData.device_type_id}
                />
                <label htmlFor="device_type" className="dark:text-gray-300">
                  Device Type
                </label>
              </span>
              {validationErrors.device_type_id && (
                <small className="text-red-600">Device Type is required</small>
              )}
            </div>

            <div className="mt-6 flex justify-center">
              <button
                type="submit"
                className="rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-600"
              >
                Add Device
              </button>
            </div>
          </form>
        </Dialog>
        <div className="pt-3">
          <button
            className={`${
              isListView === true
                ? "list-btn bg-gray-150 px-3 py-2  dark:bg-gray-700  "
                : "list-btn bg-white px-3 py-2  dark:bg-gray-150 "
            }`}
            onClick={handleToggleView}
          >
            <BsListUl />
          </button>
          <button
            className={`${
              isListView === false
                ? "grid-btn bg-gray-150 px-3 py-2  dark:bg-gray-700  "
                : "grid-btn bg-white px-3 py-2  dark:bg-gray-150 "
            }`}
            onClick={handleToggleView}
          >
            <BsGrid />
          </button>
        </div>
      </div>
      <button
        className="mt-2 flex h-10 items-center rounded-lg bg-blue-500 px-3 py-2 text-left font-semibold text-white hover:bg-blue-600"
        onClick={openDialog}
      >
        <FiPlus className="mr-2" />
        New Device
      </button>
      {!isListView && (
        <DevicesGrid
          data={data}
          onEditDevice={handleEditDevice}
          onDeleteDevice={handleDeleteDevice}
        />
      )}
      {isListView && (
        <div className="opacity-100 transition-opacity duration-500">
          <DevicesList
            data={data}
            deviceType={devicesOptions()}
            onEditDevice={handleEditDevice}
            onDeleteDevice={handleDeleteDevice}
          />
        </div>
      )}
    </>
  );
};

export default DevicesAdmin;
