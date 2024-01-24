import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FilterMatchMode } from "primereact/api";
import { DataView } from "primereact/dataview";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { LiaSimCardSolid } from "react-icons/lia";
import { Toast } from "primereact/toast";
import Cookies from "js-cookie";
import { Tag } from "primereact/tag";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { TiInputChecked } from "react-icons/ti";

const applyFilters = (filters, allData) => {
  let filteredData = allData;
  //condition to exclude these fields for global search
  if (filters.global.value) {
    filteredData = filteredData.filter((item) =>
      Object.entries(item).some(
        ([key, value]) =>
          key !== "created_at" &&
          key !== "updated_at" &&
          key !== "_id" &&
          key !== "status" &&
          String(value)
            .toLowerCase()
            .includes(filters.global.value.toLowerCase())
      )
    );
  }

  return filteredData;
};

export default function SimGrid({ data, onDeleteDevice, onEditDevice }) {
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    device_type: { value: null, matchMode: FilterMatchMode.IN },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [editedDevice, setEditedDevice] = useState(null);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
  const [isEditDialogVisible, setIsEditDialogVisible] = useState(false);
  const [listCustomers, setListCustomers] = useState([]);
  const toastRef = useRef(null);
  const token = Cookies.get("token");
  //dropdown options
  const devicesOptions = [
    { label: "ECU", value: "ECU" },
    { label: "IoT", value: "IoT" },
    { label: "DMS", value: "DMS" },
  ];

  const stateOptions = [
    { label: "Active", value: 1 },
    { label: "Deactive", value: 2 },
  ];

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/devices/get-customerlist`, {
        headers: { authorization: `bearer ${token}` },
      })
      .then((res) => {
        setListCustomers(res.data.users);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [token]);

  const Customersoptions = () => {
    return listCustomers?.map((el) => ({
      key: el.user_uuid,
      label: el.first_name + " " + el.last_name,
      value: el.user_uuid,
    }));
  };

  //global search
  useEffect(() => {
    setAllData(data);
    const filteredData = applyFilters(filters, data);
    setFilteredData(filteredData);
  }, [data, filters]);

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    setGlobalFilterValue(value);
    const updatedFilters = {
      ...filters,
      global: { value, matchMode: FilterMatchMode.CONTAINS },
    };
    const filteredData = applyFilters(updatedFilters, allData);
    setFilters(updatedFilters);
    setFilteredData(filteredData);
  };

  const clearSearch = () => {
    setGlobalFilterValue("");
    const updatedFilters = {
      ...filters,
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    };
    const filteredData = applyFilters(updatedFilters, allData);
    setFilters(updatedFilters);
    setFilteredData(filteredData);
  };

  //edit api call
  const handleEdit = (device) => {
    setEditedDevice(device);
    setIsEditDialogVisible(true);
  };

  //delete api call
  const handleDelete = (device) => {
    setSelectedDevice(device);
    setIsDeleteDialogVisible(true);
  };

  const confirmDelete = async () => {
    try {
      await onDeleteDevice(selectedDevice.device_id);

      const updatedData = allData.filter(
        (device) => device.device_id !== selectedDevice.device_id
      );

      setAllData(updatedData);
      const filteredData = applyFilters(filters, updatedData);
      setFilteredData(filteredData);
      setSelectedDevice(null);
      setIsDeleteDialogVisible(false);
    } catch (error) {
      console.error("Delete error:", error);
      setIsDeleteDialogVisible(false);
      toastRef.current.show({
        severity: "danger",
        summary: "Error",
        detail: "Error while deleting",
        life: 3000,
      });
    }
  };

  //card
  const itemTemplate = (item) => {
    const tagSeverity = item?.sim_is_active === 1 ? "success" : "danger";
    const formattedValidity =
      item.sim_validity &&
      new Date(item.sim_validity).toLocaleDateString("en-GB");
    return (
      <div className="mb-4 w-[28.8vw] rounded-lg bg-gray-50 transition duration-300 ease-in-out hover:shadow-lg dark:bg-gray-900 dark:text-gray-150 dark:hover:bg-navy-700 md-max:w-[88vw]">
        <div className="card">
          <div className="card-header flex justify-between rounded-t-lg bg-[#ddd] dark:border-none dark:bg-navy-800">
            <div className="text-sm font-semibold">{item.sim_number}</div>
            <div className="text-sm font-semibold">
              <Tag
                className="mr-2 bg-gray-200 text-gray-800"
                icon="pi pi-tag"
                style={{
                  width: "fit-content",
                  height: "25px",
                }}
                value={item.sim_tag}
              />
            </div>
          </div>
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="mb-1 ml-1 text-sm">
                  Valid till - {formattedValidity}
                </span>
                <span className="mb-1 ml-1 text-sm">
                  Data Pack - {item.sim_data_pack}
                </span>
                <span className="flex text-sm">
                  <TiInputChecked
                    className={`h-6 w-6 ${
                      item.linked === null ? "text-green-600" : "text-red-500"
                    }`}
                  />
                  {item.linked === null ? "Available" : "Not Available"}
                </span>
              </div>

              <div className="pl-3">
                <LiaSimCardSolid className="text-5xl text-gray-500" />
              </div>
            </div>
          </div>
          <div className="flex justify-between rounded-b-lg border-t-2 py-2 dark:border-gray-700">
            <div className="ml-4">
              <Tag
                value={item.sim_is_active === 1 ? "Active" : "Deactive"}
                severity={tagSeverity}
                className="h-5 rounded-sm text-xs font-normal"
              />
            </div>
            <div className="flex">
              <FaRegEdit
                title="Edit"
                onClick={() => handleEdit(item)}
                className="cursor-pointer text-gray-700"
              />
              <RiDeleteBin6Line
                title="Delete"
                onClick={() => handleDelete(item)}
                className="ml-2 mr-4 cursor-pointer text-red-600"
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Edit Dialog

  const EditDeviceDialog = ({ visible, onHide, device }) => {
    const [editedDeviceData, setEditedDeviceData] = useState(device || {});

    const isSimNumberValidationEnabled = editedDeviceData.device_type !== "ECU";

    const isFormValid = Object.keys(editedDeviceData).every((key) => {
      const val = editedDeviceData[key];

      if (key === "sim_number" && !isSimNumberValidationEnabled) {
        return true;
      }

      return (
        (typeof val === "string" && val.trim() !== "") ||
        typeof val === "number"
      );
    });

    const onSave = async () => {
      for (const key in editedDeviceData) {
        console.log(`${key}:`, typeof editedDeviceData[key]);
      }

      if (!isFormValid) {
        toastRef.current.show({
          severity: "warn",
          summary: "Warning",
          detail: "Please fill in all required fields.",
          life: 3000,
        });
        return;
      }

      try {
        await onEditDevice(device?.device_id, editedDeviceData);

        const updatedData = allData.map((item) =>
          item.device_id === device.device_id
            ? { ...item, ...editedDeviceData }
            : item
        );

        setAllData(updatedData);
        const filteredData = applyFilters(filters, updatedData);
        setFilteredData(filteredData);
        setEditedDevice(null);
        setIsEditDialogVisible(false);
      } catch (error) {
        console.error("Save error:", error);
        toastRef.current.show({
          severity: "danger",
          summary: "Error",
          detail: "Error while saving",
          life: 3000,
        });
      }
    };

    const handleInputChange = (e, name) => {
      const value = e.target.value;
      const updatedEditedDeviceData = { ...editedDeviceData, [name]: value };
      setEditedDeviceData(updatedEditedDeviceData);
    };

    return (
      <Dialog
        visible={visible}
        onHide={onHide}
        style={{ width: "45rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Edit the Device"
        modal
        className="p-fluid dark:bg-gray-900"
      >
        <div className="mx-auto mt-8 w-full">
          <span className="p-float-label">
            <InputText
              id="device_id"
              name="device_id"
              onChange={(e) => handleInputChange(e, "device_id")}
              value={editedDeviceData?.device_id || ""}
              className={`border py-2 pl-2
                ${
                  !editedDeviceData.device_id && !isFormValid
                    ? "border-red-600"
                    : ""
                }
              `}
            />
            <label htmlFor="device_id" className="dark:text-gray-300">
              DeviceId
            </label>
          </span>
        </div>
        <div className="mx-auto mt-8 w-full">
          <span className="p-float-label">
            <Dropdown
              id="device_type"
              name="device_type"
              options={devicesOptions}
              optionLabel="label"
              optionValue="value"
              value={editedDeviceData?.device_type || ""}
              placeholder={selectedDevice?.device_type}
              className="p-dropdown border"
              onChange={(e) => handleInputChange(e, "device_type")}
            />
            <label htmlFor="device_type" className="dark:text-gray-300">
              Device_type
            </label>
          </span>
        </div>

        <div className="mx-auto mt-8 w-full">
          <span className="p-float-label">
            <Dropdown
              id="user_uuid"
              name="user_uuid"
              options={Customersoptions()}
              optionLabel="label"
              optionValue="value"
              className="p-dropdown border"
              value={editedDeviceData?.user_uuid || ""}
              onChange={(e) => handleInputChange(e, "user_uuid")}
            />

            <label htmlFor="customer_id" className="dark:text-gray-300">
              Customer List
            </label>
          </span>
        </div>
        <div className="mx-auto mt-8 w-full">
          <span className="p-float-label">
            <Dropdown
              id="status"
              name="device_status"
              options={stateOptions}
              optionLabel="label"
              optionValue="value"
              className="p-dropdown border"
              value={editedDeviceData?.device_status || ""}
              placeholder={selectedDevice?.device_status}
              onChange={(e) => handleInputChange(e, "device_status")}
            />
            <label htmlFor="status" className="dark:text-gray-300">
              Status
            </label>
          </span>
        </div>
        {editedDeviceData?.device_type !== "ECU" && (
          <div className={`mx-auto mt-8 w-full`}>
            <span className="p-float-label">
              <InputText
                id="sim_number"
                name="sim_number"
                value={editedDeviceData?.sim_number || ""}
                onChange={(e) => handleInputChange(e, "sim_number")}
                className={`border py-2 pl-2 ${
                  !editedDeviceData?.sim_number ? "p-invalid" : ""
                }`}
              />
              <label htmlFor="sim_number" className="dark:text-gray-300">
                Sim Number
              </label>
            </span>
          </div>
        )}
        <div className="mt-6 flex justify-center">
          <button
            type="submit"
            className="rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-600"
            onClick={onSave}
          >
            Edit Device
          </button>
        </div>
      </Dialog>
    );
  };

  //Searchbox
  return (
    <div>
      <div className="mb-4 mt-2 flex justify-end align-middle">
        <div className="flex items-center">
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
          </span>
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Keyword Search"
            className="searchbox w-[25vw] cursor-pointer rounded-full border py-2 pl-8 text-sm font-normal dark:bg-gray-950 dark:text-gray-50"
          />
          {globalFilterValue && (
            <div>
              <Button
                icon="pi pi-times"
                className="p-button-rounded p-button-text py-auto dark:text-gray-50 dark:hover:text-gray-50"
                onClick={clearSearch}
              />
            </div>
          )}
        </div>
      </div>
      <Toast ref={toastRef} className="toast-custom" position="top-right" />
      {/* Gridview */}
      <DataView
        value={filteredData}
        layout="grid"
        itemTemplate={itemTemplate}
        paginator
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        rows={6}
        rowsPerPageOptions={[6, 12, 18]}
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
        emptyMessage="No sim cards found."
      />
      {/* Delete dialog */}
      <Dialog
        visible={isDeleteDialogVisible}
        onHide={() => setIsDeleteDialogVisible(false)}
        header="Confirm Delete"
        footer={
          <div>
            <Button
              label="Delete"
              icon="pi pi-check"
              className="mr-2 bg-red-500 px-3 py-2 text-white dark:hover:bg-red-500 dark:hover:text-white"
              onClick={confirmDelete}
            />
            <Button
              label="Cancel"
              icon="pi pi-times"
              className="bg-gray-600 px-3 py-2 text-white dark:text-gray-850 dark:hover:bg-gray-600 dark:hover:text-gray-850"
              onClick={() => setIsDeleteDialogVisible(false)}
            />
          </div>
        }
      >
        <div>Are you sure you want to delete {selectedDevice?.device_id}?</div>
      </Dialog>
      <EditDeviceDialog
        visible={isEditDialogVisible}
        onHide={() => setIsEditDialogVisible(false)}
        device={editedDevice}
      />
    </div>
  );
}
