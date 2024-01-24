import React, { useState, useEffect, useRef } from "react";
import { BsGrid, BsListUl } from "react-icons/bs";
import axios from "axios";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import Cookies from "js-cookie";
import { FiPlus } from "react-icons/fi";
import PreloaderGrid from "components/skeleton-preloader/PreloaderGrid";
import PreloaderList from "components/skeleton-preloader/PreloaderList";
import SimList from "./components/SimList";
import SimGrid from "./components/SimGrid";
import { Calendar } from "primereact/calendar";

const SimCards = () => {
  const token = Cookies.get("token");
  const userUUID = Cookies.get("user_uuid");
  const [simcards, setSimCards] = useState(true);
  const [data, setData] = useState([]);
  const [isListView, setIsListView] = useState(
    localStorage.getItem("viewPreference") === "grid" ? false : true
  );
  const [activationDate, setActivationDate] = useState(null);
  const [validity, setValidity] = useState(null);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    sim_number: false,
    device_type: false,
    user_uuid: false,
    status: false,
  });
  // const requiredFields = ["sim_number", "device_type", "user_uuid", "status"];
  const [addData, setAddData] = useState({
    sim_number: "",
    sim_data_pack: "",
    sim_tag: "",
    sim_owner: "",
  });
  const [loaded, setLoaded] = useState(false);
  const toastRef = useRef(null);

  //Fetching all data

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_AWS_URL}/getAllSimCards`, {
        headers: { Authorization: token },
      })
      .then((res) => {
        const formattedData = res.data.data.map((item, index) => ({
          ...item,
          serialNo: index + 1,
          key: index + 1,
        }));
        setData(formattedData);
        setLoaded(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [token, simcards]);

  // Edit Devices
  const handleEditDevice = (deviceId, editedDevice) => {
    axios
      .put(
        `${process.env.REACT_APP_API_URL}/devices/edit-device/${deviceId}`,
        { ...editedDevice, userUUID },
        { headers: { authorization: `bearer ${token}` } }
      )
      .then((res) => {
        setSimCards(editedDevice);
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
        { user_uuid: userUUID },
        { headers: { authorization: `bearer ${token}` } }
      )
      .then((res) => {
        setSimCards(data);
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
      device_type: "",
      user_uuid: "",
      status: "",
      sim_number: "",
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

  // Add customer api call
  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post(
        `${process.env.REACT_APP_AWS_URL}/createSimCards`,
        {
          ...addData,
          sim_activation_date: activationDate,
          sim_validity: validity,
        },
        {
          headers: { Authorization: token },
        }
      )
      .then((res) => {
        setSimCards(addData);
        toastRef.current.show({
          severity: "success",
          summary: "Success",
          detail: `Device ${addData.sim_number} Added successfully`,
          life: 3000,
        });
        closeDialog();
      })
      .catch((err) => {
        toastRef.current.show({
          severity: "error",
          summary: "Error",
          detail: "DeviceId or Sim number Already exists.",
          life: 3000,
        });
        console.log(err);
      });

    // Set validation errors for the required fields
    // const errors = {};
    // requiredFields.forEach((field) => {
    //   errors[field] = !addData[field].trim();
    // });
    // setValidationErrors(errors);
  };

  function formatDateToYYYYMMDD(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-based, so add 1 and pad with '0' if needed
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const handleValidation = (name, value) => {
    const errors = { ...validationErrors };
    errors[name] = !value.trim();
    setValidationErrors(errors);
  };

  // Check if all fields are valid
  // const isFormValid = () => {
  //   // Check if all required fields are filled
  //   const requiredFieldsFilled = requiredFields.every(
  //     (field) => !!addData[field].trim()
  //   );

  //   // If device type is "DMS" or "IoT," also check if "sim_number" is filled
  //   const isSimNumberRequired =
  //     addData.device_type === "DMS" || addData.device_type === "IoT";
  //   const simNumberFilled = !isSimNumberRequired || !!addData.sim_number.trim();

  //   return requiredFieldsFilled && simNumberFilled;
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddData({ ...addData, [name]: value });
    handleValidation(name, value);
  };

  //add device dialog
  return (
    <>
      <Toast ref={toastRef} className="toast-custom" position="top-right" />
      <div className="flex justify-between">
        <h4 className="text-dark pt-1 text-xl font-semibold dark:text-white">
          Sim Cards
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
            <div className="flex justify-between gap-4">
              <div
                className={`mx-auto mt-8 w-full ${
                  validationErrors.sim_number ? "p-error" : ""
                }`}
              >
                <span className="p-float-label">
                  <InputText
                    id="sim_number"
                    name="sim_number"
                    onChange={handleChange}
                    className={`border py-2 pl-2 ${
                      validationErrors.sim_number ? "border-red-600" : ""
                    }`}
                  />
                  <label htmlFor="sim_number" className="dark:text-gray-300">
                    Sim Number
                  </label>
                </span>
                {validationErrors.sim_number && (
                  <small className="text-red-600">Device ID is required</small>
                )}
              </div>
              <div
                className={`mx-auto mt-8 w-full ${
                  validationErrors.sim_data_pack ? "p-error" : ""
                }`}
              >
                <span className="p-float-label">
                  <InputText
                    id="sim_data_pack"
                    name="sim_data_pack"
                    onChange={handleChange}
                    className={`border py-2 pl-2 ${
                      validationErrors.sim_data_pack ? "border-red-600" : ""
                    }`}
                  />
                  <label htmlFor="sim_data_pack" className="dark:text-gray-300">
                    Data Pack
                  </label>
                </span>
                {validationErrors.sim_data_pack && (
                  <small className="text-red-600">Device ID is required</small>
                )}
              </div>
            </div>
            <div className="flex justify-between gap-4">
              <div
                className={`mx-auto mt-8 w-full ${
                  validationErrors.sim_tag ? "p-error" : ""
                }`}
              >
                <span className="p-float-label">
                  <InputText
                    id="sim_tag"
                    name="sim_tag"
                    onChange={handleChange}
                    className={`border py-2 pl-2 ${
                      validationErrors.sim_tag ? "border-red-600" : ""
                    }`}
                  />
                  <label htmlFor="sim_tag" className="dark:text-gray-300">
                    Sim Tag
                  </label>
                </span>
                {validationErrors.sim_tag && (
                  <small className="text-red-600">Device ID is required</small>
                )}
              </div>
              <div
                className={`mx-auto mt-8 w-full ${
                  validationErrors.sim_owner ? "p-error" : ""
                }`}
              >
                <span className="p-float-label">
                  <InputText
                    id="sim_owner"
                    name="sim_owner"
                    onChange={handleChange}
                    className={`border py-2 pl-2 ${
                      validationErrors.sim_owner ? "border-red-600" : ""
                    }`}
                  />
                  <label htmlFor="sim_owner" className="dark:text-gray-300">
                    Sim Owner
                  </label>
                </span>
                {validationErrors.sim_owner && (
                  <small className="text-red-600">Device ID is required</small>
                )}
              </div>
            </div>
            <div className="card p-fluid mt-6 flex flex-wrap gap-3">
              <div className="flex-auto">
                <span className="p-float-label">
                  <Calendar
                    inputId="start_date"
                    value={activationDate ? new Date(activationDate) : null}
                    onChange={(e) => {
                      const formattedDate = formatDateToYYYYMMDD(e.value);
                      setActivationDate(formattedDate);
                    }}
                    className={`rounded-lg border border-gray-300 `}
                  />
                  <label
                    htmlFor="start_date"
                    className="text-gray-600 dark:text-gray-150"
                  >
                    From
                  </label>
                </span>
              </div>
              <div className="flex-auto">
                <span className="p-float-label">
                  <Calendar
                    inputId="end_date"
                    value={validity ? new Date(validity) : null}
                    onChange={(e) => {
                      const formattedDate = formatDateToYYYYMMDD(e.value);
                      setValidity(formattedDate);
                    }}
                    className={`rounded-lg border border-gray-300 `}
                  />
                  <label
                    htmlFor="start_date"
                    className="text-gray-600  dark:text-gray-150"
                  >
                    To
                  </label>
                </span>

                {/* {!endDateValid ? (
                  <small className="text-red-500">To date is required.</small>
                ) : (
                  <small className="text-gray-400 dark:text-gray-150">
                    Click to Select
                  </small>
                )} */}
              </div>
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
        <div className="pt-2">
          <button
            className={`${
              isListView === true
                ? "list-btn bg-gray-150 px-2 py-1  dark:bg-gray-700  "
                : "list-btn bg-white px-2 py-1  dark:bg-gray-150 "
            }`}
            onClick={handleToggleView}
          >
            <BsListUl />
          </button>
          <button
            className={`${
              isListView === false
                ? "grid-btn bg-gray-150 px-2 py-1  dark:bg-gray-700  "
                : "grid-btn bg-white px-2 py-1  dark:bg-gray-150 "
            }`}
            onClick={handleToggleView}
          >
            <BsGrid />
          </button>
        </div>
      </div>
      <button
        className="flex items-center rounded-lg bg-blue-500 px-2 py-1 text-left text-sm font-normal text-white hover:bg-blue-600"
        onClick={openDialog}
      >
        <FiPlus />
        &nbsp;New Sim Card
      </button>
      {!isListView && (
        <div className="opacity-100 transition-opacity duration-500">
          {loaded ? (
            <SimGrid
              data={data}
              // deviceType={devicesOptions()}
              onEditDevice={handleEditDevice}
              onDeleteDevice={handleDeleteDevice}
            />
          ) : (
            <div className="mt-6">
              <PreloaderGrid />
            </div>
          )}
        </div>
      )}
      {isListView && (
        <div className="opacity-100 transition-opacity duration-500">
          {loaded ? (
            <SimList
              data={data}
              // deviceType={devicesOptions()}
              onEditDevice={handleEditDevice}
              onDeleteDevice={handleDeleteDevice}
            />
          ) : (
            <div className="mt-6">
              <PreloaderList />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default SimCards;
