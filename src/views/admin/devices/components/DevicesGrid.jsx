import React, { useState, useEffect, useRef } from "react";
import { FilterMatchMode } from "primereact/api";
import { DataView } from "primereact/dataview";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { MdDeleteOutline, MdOnDeviceTraining } from "react-icons/md";
import { Toast } from "primereact/toast";
import { Tag } from "primereact/tag";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";
import { TiInputChecked } from "react-icons/ti";

const applyFilters = (filters, allData) => {
  let filteredData = allData;
  //condition to exclude these fields for global search
  if (filters.global.value) {
    filteredData = filteredData.filter((item) =>
      Object.entries(item).some(
        ([key, value]) =>
          (key !== "linked" || String(value) === filters.global.value) &&
          (key === "device_type_id"
            ? String(
                item.device_type_id === 1
                  ? "ECU"
                  : item.device_type_id === 2
                  ? "IoT"
                  : "DMS"
              )
                .toLowerCase()
                .includes(filters.global.value.toLowerCase())
            : String(value)
                .toLowerCase()
                .includes(filters.global.value.toLowerCase()))
      )
    );
  }
  return filteredData;
};

export default function DevicesGrid({
  data,
  onDeleteDevice,
  deviceType,
  onEditDevice,
}) {
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [editedDevice, setEditedDevice] = useState(null);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
  const [isEditDialogVisible, setIsEditDialogVisible] = useState(false);
  const toastRef = useRef(null);

  const stateOptions = [
    { label: "Active", value: 1 },
    { label: "Deactive", value: 2 },
  ];

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
    const tagSeverity = item?.device_status === 1 ? "success" : "danger";
    return (
      <div className="mb-4 w-[28.8vw] rounded-lg bg-gray-50 transition duration-300 ease-in-out hover:shadow-lg dark:bg-gray-900 dark:text-gray-150 dark:hover:bg-navy-700 md-max:w-[88vw]">
        <div className="card">
          <div className="card-header flex justify-between rounded-t-lg bg-[#ddd] dark:border-none dark:bg-navy-800 ">
            <div className="text-sm font-semibold">{item.device_id}</div>
          </div>
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="mb-1 ml-1 text-sm">
                  {item.device_type_id === 1
                    ? "ECU"
                    : item.device_type_id === 2
                    ? "IoT"
                    : "DMS"}
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
                <MdOnDeviceTraining className="text-5xl text-gray-500" />
              </div>
            </div>
          </div>
          <div className="flex justify-between rounded-b-lg border-t-2 py-2 dark:border-gray-700">
            <div className="ml-4">
              <Tag
                value={item.device_status === 1 ? "Active" : "Deactive"}
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

    const onSave = async () => {
      for (const key in editedDeviceData) {
        console.log(`${key}:`, typeof editedDeviceData[key]);
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
        style={{ width: "35rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Edit the Device"
        modal
        className="p-fluid dark:bg-gray-900"
      >
        <div className="mx-auto mb-2 mt-8 w-full">
          <span className="p-float-label">
            <InputText
              id="device_id"
              name="device_id"
              onChange={(e) => handleInputChange(e, "device_id")}
              value={editedDeviceData?.device_id || ""}
              className={`text-normal border bg-[#ccc] py-2 pl-2 font-bold text-navy-900
                ${!editedDeviceData.device_id ? "border-red-600" : ""}
              `}
              disabled
            />
            <label htmlFor="device_id" className="dark:text-gray-300">
              Device ID
            </label>
          </span>
        </div>
        <div className="mx-auto mb-2 mt-8 w-full">
          <span className="p-float-label">
            <Dropdown
              id="device_type"
              name="device_type"
              options={deviceType}
              optionLabel="label"
              optionValue="value"
              value={editedDeviceData?.device_type_id || ""}
              placeholder={selectedDevice?.device_type_id}
              className="p-dropdown h-10 border"
              onChange={(e) => handleInputChange(e, "device_type_id")}
            />
            <label htmlFor="device_type" className="dark:text-gray-300">
              Device Type
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
              className="p-dropdown h-10 border text-sm"
              value={editedDeviceData?.device_status || ""}
              placeholder={selectedDevice?.device_status}
              onChange={(e) => handleInputChange(e, "device_status")}
            />
            <label htmlFor="status" className=" dark:text-gray-300">
              Status
            </label>
          </span>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onSave}
            className="flex items-center rounded-lg bg-blue-500 px-2 py-1 text-left text-sm font-normal text-white hover:bg-blue-600"
          >
            Update
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
        emptyMessage="No devices found."
      />

      {/* Delete dialog */}
      <Dialog
        visible={isDeleteDialogVisible}
        onHide={() => setIsDeleteDialogVisible(false)}
        header="Confirm Deletion"
        footer={
          <div>
            <Button
              label="Delete"
              className="mr-2 bg-red-500 px-2 py-1 text-xs text-white dark:hover:bg-red-500 dark:hover:text-white"
              onClick={confirmDelete}
            />
            <Button
              label="Cancel"
              className="bg-gray-700 px-2 py-1 text-xs text-white dark:text-gray-850 dark:hover:bg-gray-600 dark:hover:text-gray-850"
              onClick={() => setIsDeleteDialogVisible(false)}
            />
          </div>
        }
      >
        <div className="flex items-center">
          <MdDeleteOutline className="text-2xl text-blue-400" />
          <span className="text-sm font-semibold">
            Are you sure you want to delete {selectedDevice?.device_id}?
          </span>
        </div>
      </Dialog>
      <EditDeviceDialog
        visible={isEditDialogVisible}
        onHide={() => setIsEditDialogVisible(false)}
        device={editedDevice}
      />
    </div>
  );
}
