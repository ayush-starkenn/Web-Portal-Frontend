import React, { useEffect, useRef, useState } from "react";
import { FilterMatchMode } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Toast } from "primereact/toast";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import axios from "axios";
import Cookies from "js-cookie";
import { Tag } from "primereact/tag";
import { TiInputChecked } from "react-icons/ti";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";

export default function SimList({ data, onEditDevice, onDeleteDevice }) {
  const token = Cookies.get("token");

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [editData, setEditData] = useState();
  const [listCustomers, setListCustomers] = useState([]);
  const [deviceData, setDeviceData] = useState();
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
      <div className="my-4 flex justify-end align-middle">
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
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="flex text-lg">
        <FaRegEdit
          title="Edit"
          onClick={() => openDialog(rowData)}
          className="mr-2 cursor-pointer text-gray-700"
        />
        <RiDeleteBin6Line
          title="Delete"
          onClick={() => openDeleteDialog(rowData)}
          className="mx-2 cursor-pointer text-red-600"
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
    getDeviceData(rowData);
    setEditData(rowData);
    setRowId(rowData);
  };

  //Closes edit dialog
  const closeDialog = () => {
    setIsDialogVisible(false);
  };

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
  }, [token, deviceData]);

  const Customersoptions = () => {
    return listCustomers?.map((el) => ({
      key: el.user_uuid,
      label: el.first_name + " " + el.last_name,
      value: el.user_uuid,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const requiredFields = [
      "device_id",
      "device_type",
      "user_uuid",
      "device_status",
    ];

    if (editData.device_type !== "ECU") {
      requiredFields.push("sim_number");
    }

    const isAnyFieldEmpty = requiredFields.some((field) => !editData[field]);

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

  const getDeviceData = (rowData) => {
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/devices/get-device-by-id/${rowData.device_id}`,
        { headers: { authorization: `bearer ${token}` } }
      )
      .then((res) => {
        setDeviceData(res.data.device);
      })
      .catch((err) => {
        console.log(err);
      });
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
        value={rowData.sim_is_active === 1 ? "Active" : "Deactive"}
        severity={getStatusSeverity(rowData.sim_is_active)}
        className="h-5 rounded-sm text-xs font-normal"
      />
    );
  };

  const availabilityTemplate = (rowData) => {
    return (
      <TiInputChecked
        className={`h-6 w-6 ${
          rowData.linked === null ? "text-green-600" : "text-red-500"
        }`}
      />
    );
  };
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
                className={`border py-2 pl-2 ${
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
                name="device_type"
                options={devicesOptions}
                optionLabel="label"
                optionValue="value"
                value={editData?.device_type || ""}
                className="p-dropdown border"
                onChange={(e) => handleChange(e, "device_type")}
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
                value={editData?.user_uuid || ""}
                onChange={(e) => handleChange(e, "user_uuid")}
              />

              <label htmlFor="user_uuid" className="dark:text-gray-300">
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
                value={editData?.device_status || ""}
                placeholder={deviceData?.device_status}
                onChange={(e) => handleChange(e, "device_status")}
              />
              <label htmlFor="status" className="dark:text-gray-300">
                Status
              </label>
            </span>
          </div>

          {editData?.device_type !== "ECU" && (
            <div className={`mx-auto mt-8 w-full`}>
              <span className="p-float-label">
                <InputText
                  id="device_id"
                  name="device_id"
                  value={editData?.sim_number || ""}
                  onChange={(e) => handleChange(e, "sim_number")}
                  className={`border py-2 pl-2 ${
                    !editData?.sim_number ? "p-invalid" : ""
                  }`}
                />
                <label htmlFor="device_id" className="dark:text-gray-300">
                  Sim Number
                </label>
              </span>
            </div>
          )}
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
          className="border-b text-sm dark:bg-navy-800 dark:text-gray-200"
          style={{ minWidth: "4rem", textAlign: "center" }}
        ></Column>
        <Column
          field="sim_number"
          header="Sim Number"
          sortable
          className="border-b text-sm dark:bg-navy-800 dark:text-gray-200"
          style={{ minWidth: "10rem" }}
        ></Column>

        <Column
          header="Sim Tag"
          sortable
          className="border-b text-sm dark:bg-navy-800 dark:text-gray-200"
          style={{ minWidth: "6rem" }}
          body={(rowData) => (
            <Tag
              className="my-1 mr-2 bg-gray-200 text-gray-800"
              icon="pi pi-tag"
              style={{
                width: "fit-content",
                height: "25px",
              }}
              value={rowData.sim_tag}
            />
          )}
        ></Column>
        <Column
          field="sim_validity"
          header="Sim Validity"
          sortable
          body={(rowData) => {
            const simValidityDate = rowData.sim_validity
              ? new Date(rowData.sim_validity)
              : null;

            return simValidityDate
              ? simValidityDate.toLocaleDateString("en-GB")
              : "--";
          }}
          className="border-b text-sm dark:bg-navy-800 dark:text-gray-200"
          style={{ minWidth: "14rem" }}
        ></Column>
        <Column
          field="sim_data_pack"
          header="Data Pack"
          sortable
          className="border-b text-sm dark:bg-navy-800 dark:text-gray-200"
          style={{ minWidth: "7rem" }}
        ></Column>

        <Column
          header="Status"
          body={statusBodyTemplate}
          sortable
          className="border-b text-sm dark:bg-navy-800 dark:text-gray-200"
          style={{ minWidth: "8rem" }}
        ></Column>
        <Column
          field="linked"
          header="Availability"
          sortable
          body={availabilityTemplate}
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
