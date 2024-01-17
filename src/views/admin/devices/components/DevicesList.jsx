import React, { useRef, useState } from "react";
import { FilterMatchMode } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Toast } from "primereact/toast";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { Tag } from "primereact/tag";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";

export default function DevicesList({
  data,
  onEditDevice,
  deviceType,
  onDeleteDevice,
}) {
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [editData, setEditData] = useState({});
  const [rowId, setRowId] = useState();
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const toastRef = useRef(null);

  //Global search logic
  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters["global"].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const clearSearch = () => {
    setGlobalFilterValue(""); // Clear the search input value
    const _filters = { ...filters };
    _filters["global"].value = null; // Clear the global filter value
    setFilters(_filters);
  };

  //Opens delete dialog
  const openDeleteDialog = (rowData) => {
    setSelectedDevice(rowData);
    setDeleteDialogVisible(true);
  };

  //Searchbox
  const renderHeader = () => {
    return (
      <div className="my-4 flex justify-end">
        <div className="justify-content-between align-items-center flex flex-wrap gap-2">
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText
              value={globalFilterValue}
              onChange={onGlobalFilterChange}
              placeholder="Keyword Search"
              className="searchbox w-[25vw] cursor-pointer rounded-full border py-2 pl-8 text-sm font-normal dark:bg-gray-950 dark:text-gray-50"
            />
            {globalFilterValue && (
              <Button
                icon="pi pi-times"
                className="p-button-rounded p-button-text dark:text-gray-50 dark:hover:text-gray-50"
                onClick={clearSearch}
              />
            )}
          </span>
        </div>
      </div>
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="flex text-lg">
        <FaRegEdit
          tooltip="Edit"
          tooltipOptions={{ position: "mouse" }}
          onClick={() => openDialog(rowData)}
          className="mr-2 text-gray-700"
        />
        <RiDeleteBin6Line
          tooltip="Delete"
          tooltipOptions={{ position: "mouse" }}
          onClick={() => openDeleteDialog(rowData)}
          className="mx-2 text-red-600"
        />
      </div>
    );
  };

  const header = renderHeader();

  //Delete dialog
  const DeleteDeviceDialog = ({ visible, onHide }) => {
    const handleConfirmDelete = async () => {
      try {
        await onDeleteDevice(selectedDevice?.device_id);
        onHide();
      } catch (error) {
        console.error(error);
        onHide();
      }
    };
    // delete dialog
    return (
      <Dialog
        visible={visible}
        onHide={onHide}
        header="Confirm Delete"
        footer={
          <div>
            <Button
              label="Delete"
              icon="pi pi-check"
              className="mr-2 bg-red-500 px-3 py-2 text-white dark:hover:bg-red-500 dark:hover:text-white"
              onClick={handleConfirmDelete}
            />
            <Button
              label="Cancel"
              icon="pi pi-times"
              className="bg-gray-600 px-3 py-2 text-white dark:text-gray-850 dark:hover:bg-gray-600 dark:hover:text-gray-850"
              onClick={onHide}
            />
          </div>
        }
      >
        <div>Are you sure you want to delete {selectedDevice?.device_id}?</div>
      </Dialog>
    );
  };

  // Opens edit dialog
  const openDialog = (rowData) => {
    setIsDialogVisible(true);
    // getDeviceData(rowData);
    setEditData(rowData);
    setRowId(rowData);
  };

  //Closes edit dialog
  const closeDialog = () => {
    setIsDialogVisible(false);
  };

  const stateOptions = [
    { label: "Active", value: 1 },
    { label: "Deactive", value: 2 },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const requiredFields = ["device_id", "device_type_id", "device_status"];
    const isAnyFieldEmpty = requiredFields.some((field) => !editData[field]);

    console.log(isAnyFieldEmpty);
    if (isAnyFieldEmpty) {
      toastRef.current.show({
        severity: "error",
        summary: "Error",
        detail: "Please fill in all required fields.",
      });
    } else {
      onEditDevice(rowId?.device_id, editData);
      closeDialog();
    }
  };

  const handleChange = (e, name) => {
    const value = e.target ? e.target.value : e.value;
    setEditData((prevEditData) => ({
      ...prevEditData,
      [name]: value,
    }));
  };

  // Status body
  const getStatusSeverity = (option) => {
    switch (option) {
      case 1:
        return "success";

      case 2:
        return "danger";

      default:
        return null;
    }
  };

  const statusBodyTemplate = (rowData) => {
    return (
      <Tag
        value={rowData.device_status === 1 ? "Active" : "Deactive"}
        severity={getStatusSeverity(rowData.device_status)}
        className="h-5 rounded-sm text-xs font-normal"
      />
    );
  };

  console.log(editData);

  //edit dialog
  return (
    <div className="card">
      <Dialog
        visible={isDialogVisible}
        onHide={closeDialog}
        style={{ width: "45rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Edit the Device"
        modal
        className="p-fluid dark:bg-gray-900"
      >
        <form onSubmit={handleSubmit} className="mx-auto">
          <div className="mx-auto mt-8 w-full">
            <span className="p-float-label">
              <InputText
                id="device_id"
                name="device_id"
                value={editData?.device_id || ""}
                onChange={(e) => handleChange(e, "device_id")}
                className={`border py-2 pl-2 text-sm ${
                  !editData?.device_id ? "p-invalid" : ""
                }`}
              />
              <label htmlFor="device_id" className="dark:text-gray-300">
                Device ID
              </label>
            </span>
          </div>
          <div className="mx-auto mt-8 w-full">
            <span className="p-float-label">
              <Dropdown
                id="device_type"
                // name="device_type_id"
                options={deviceType}
                optionLabel="label"
                optionValue="value"
                value={editData?.device_type_id || ""}
                className="p-dropdown border"
                onChange={(e) => handleChange(e, "device_type_id")}
              />
              <label htmlFor="device_type" className="dark:text-gray-300">
                Device_type
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
                value={editData?.device_status || ""}
                onChange={(e) => handleChange(e, "device_status")}
              />
              <label htmlFor="status" className="dark:text-gray-300">
                Status
              </label>
            </span>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-600"
            >
              Update
            </button>
          </div>
        </form>
      </Dialog>
      <Toast ref={toastRef} className="toast-custom" position="top-right" />
      {/* List View  */}
      <DataTable
        value={data}
        removableSort
        paginator
        header={header}
        rows={5}
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        rowsPerPageOptions={[5, 10, 25]}
        filters={filters}
        filterDisplay="menu"
        globalFilterFields={[
          "device_id",
          "device_type",
          "sim_number",
          "user_uuid",
        ]}
        emptyMessage="No devices found."
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
      >
        <Column
          field="serialNo"
          header="Sr. No."
          className="border-b py-1 text-sm dark:bg-navy-800 dark:text-gray-200"
          style={{ minWidth: "4rem", textAlign: "left" }}
        ></Column>
        <Column
          field="device_id"
          header="Device ID"
          sortable
          className="border-b text-sm dark:bg-navy-800 dark:text-gray-200"
          style={{ minWidth: "12rem" }}
        ></Column>
        <Column
          field="device_type_id"
          header="Device Type"
          sortField="device_type_id"
          sortable
          className="border-b text-sm dark:bg-navy-800 dark:text-gray-200"
          style={{ minWidth: "10rem" }}
          body={(rowData) => {
            const deviceTypeId = rowData.device_type_id;
            const matchedDevice = Array.isArray(deviceType)
              ? deviceType.find((type) => type.value === deviceTypeId)
              : null;

            return (
              <span>{matchedDevice ? matchedDevice.label : "Unknown"}</span>
            );
          }}
        ></Column>

        <Column
          field="device_status"
          header="Status"
          body={statusBodyTemplate}
          sortable
          className="border-b text-sm dark:bg-navy-800 dark:text-gray-200"
          style={{ minWidth: "10rem" }}
        ></Column>

        <Column
          body={actionBodyTemplate}
          header="Action"
          className="border-b text-sm dark:bg-navy-800 dark:text-gray-200"
          style={{ minWidth: "9rem" }}
        ></Column>
      </DataTable>
      <DeleteDeviceDialog
        visible={deleteDialogVisible}
        onHide={() => setDeleteDialogVisible(false)}
      />
    </div>
  );
}
