import { FilterMatchMode } from "primereact/api";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { RadioButton } from "primereact/radiobutton";
import { Tag } from "primereact/tag";
import { Toast } from "primereact/toast";
import React, { useRef, useState } from "react";
import { FaPhoneAlt, FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import axios from "axios";
import { MdDeleteOutline, MdEmail } from "react-icons/md";

const ContactsList = ({ contactsData, editContacts, deleteContact }) => {
  const [isDialog, setIsDialog] = useState(false);
  const [editData, setEditData] = useState({});
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const toastRef = useRef(null);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [deleteName, setDeleteName] = useState("");
  const [editId, setEditId] = useState("");
  const [fieldValidities, setFieldValidities] = useState({
    contact_first_name: true,
    contact_last_name: true,
    contact_email: true,
    contact_mobile: true,
    contact_status: true,
  });

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const clearSearch = () => {
    setGlobalFilterValue("");
    const _filters = { ...filters };
    _filters["global"].value = null;
    setFilters(_filters);
  };

  const openDialog = (rowData) => {
    console.log("raw data : ", rowData);
    setIsDialog(true);
    setEditId(rowData.contact_id);
    setEditData({
      ...rowData,
      contact_active: rowData.contact_active.toString(),
    });
  };

  const closeDialog = () => {
    setIsDialog(false);
    setFieldValidities({
      contact_first_name: true,
      contact_last_name: true,
      contact_email: true,
      contact_mobile: true,
      contact_status: true,
    });
  };

  const openDeleteDialog = (rowData) => {
    setDeleteDialog(true);
    setDeleteId(rowData.contact_id);
    setDeleteName(rowData.contact_name);
  };
  const closeDeleteDialog = () => {
    setDeleteDialog(false);
  };

  const handleDelete = () => {
    if (deleteId !== "") {
      deleteContact(deleteId, deleteName);
      closeDeleteDialog();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid = Object.values(editData).every((value) => value !== "");
    const isValidPhoneNumber = (phoneNumber) => {
      // Regular expression to check for exactly 10 digits
      const phonePattern = /^\d{10}$/;
      return phonePattern.test(phoneNumber);
    };
    // Update field validities based on the check
    const newFieldValidities = {};
    for (const key in editData) {
      if (editData.hasOwnProperty(key)) {
        newFieldValidities[key] = editData[key] !== "";
      }
    }
    setFieldValidities(newFieldValidities);
    if (!isValid) {
      toastRef.current.show({
        severity: "warn",
        summary: "Fill Required Fields",
        detail: "Please fill in all the required details.",
        life: 3000,
      });
    }
    if (editData.contact_type == "phone") {
      if (!isValidPhoneNumber(editData.contact_info)) {
        toastRef.current.show({
          severity: "warn",
          summary: "Invalid Phone Number",
          detail: "Please enter a 10-digit valid phone number.",
          life: 3000,
        });
      }
      return;
    }
    if (isValid) {
      editContacts(editId, {
        contact_name: editData.contact_name,
        contact_primary: editData.contact_primary,
        contact_type: editData.contact_type,
        contact_info: editData.contact_info,
      });
      closeDialog();
    }
  };
  const getClassName = (fieldName) => {
    return fieldValidities[fieldName] ? "" : "border-red-600";
  };

  const stateOptions = [
    { label: "Active", value: "1" },
    { label: "Deactive", value: "2" },
  ];

  //onChange function
  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFieldValidities = { ...fieldValidities };

    // Check if the value is not empty and update the field validity
    newFieldValidities[name] = value !== "";
    setFieldValidities(newFieldValidities);

    setEditData({ ...editData, [name]: value });
  };

  //
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
  const header = renderHeader();

  //
  const renderStatusCell = (rowData) => {
    const tagValue = rowData?.contact_active === 1 ? "Active" : "Deactive";
    const tagSeverity = rowData?.contact_active === 1 ? "success" : "danger";

    return (
      <Tag
        value={tagValue}
        severity={tagSeverity}
        className="h-5 rounded-sm text-xs font-normal"
      />
    );
  };
  //
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

  const optionsAdd = [
    { label: "Phone", value: "Phone" },
    { label: "Email", value: "Email" },
  ];

  return (
    <>
      <Toast ref={toastRef} className="toast-custom" position="top-right" />
      <div>
        <DataTable
          value={contactsData}
          paginator
          dataKey="contact_uuid"
          header={header}
          rows={5}
          removableSort
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          rowsPerPageOptions={[5, 10, 25]}
          filters={filters}
          filterDisplay="menu"
          globalFilterFields={[
            "contact_first_name",
            "contact_last_name",
            "contact_email",
            "contact_mobile",
            "contact_status",
          ]}
          emptyMessage="No contacts found."
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
        >
          <Column
            field="serialNo"
            header="Sr. No."
            sortable
            className="border-b text-sm dark:bg-navy-800 dark:text-gray-200"
            style={{ minWidth: "4rem" }}
          ></Column>
          <Column
            field="full_name"
            header="Name"
            sortable
            className="border-b text-sm dark:bg-navy-800 dark:text-gray-200"
            style={{ minWidth: "8rem" }}
          ></Column>
          <Column
            field="contact_info"
            header="Contact_info"
            className="border-b text-sm dark:bg-navy-800 dark:text-gray-200"
            style={{ minWidth: "8rem" }}
          ></Column>
          <Column
            field="contact_type"
            header="Contact_type"
            body={(rowData) => (
              <Tag
                className="my-1 mr-2 bg-gray-200 text-gray-800"
                icon={
                  rowData.contact_type === "Phone" ? (
                    <FaPhoneAlt className="text-xs text-gray-500 mr-2" />
                  ) : (
                    <MdEmail className="text-xs text-gray-500  mr-2" />
                  )
                }
                style={{
                  width: "fit-content",
                  height: "25px",
                  lineHeight: "40px",
                }}
                value={rowData.contact_type}
              />
            )}
            className="border-b text-sm dark:bg-navy-800 dark:text-gray-200"
            style={{ minWidth: "8rem" }}
          />
          
          <Column
            field="contact_status"
            header="Status"
            sortable
            className="border-b text-sm dark:bg-navy-800 dark:text-gray-200"
            style={{ minWidth: "6rem" }}
            body={renderStatusCell}
          ></Column>
          <Column
            body={actionBodyTemplate}
            header="Action"
            className="border-b text-sm dark:bg-navy-800 dark:text-gray-200"
            style={{ minWidth: "6rem" }}
          ></Column>
        </DataTable>
        {/* Dialog to Edit contact */}
        <Dialog
          visible={isDialog}
          onHide={closeDialog}
          style={{ width: "45vw" }}
          breakpoints={{ "960px": "75vw", "641px": "90vw" }}
          header="Edit the details"
          modal
          className="p-fluid text-sm dark:bg-gray-900"
        >
          <form onSubmit={handleSubmit}>
            <div className="mx-auto mt-8">
              {console.log(editData)}
              <span className={`p-float-label `}>
                <InputText
                  id="contact_name"
                  name="contact_name"
                  onChange={handleChange}
                  value={editData?.contact_name}
                  className={`border py-2 pl-2 ${getClassName(
                    "contact_first_name"
                  )}`}
                />
                <label
                  htmlFor="contact_name"
                  className="text-sm  dark:text-gray-300"
                >
                  Full Name
                </label>
              </span>
            </div>

            <div className="mx-auto mt-7">
              <span className="p-float-label">
                <Dropdown
                  id="status"
                  name="contact_active"
                  options={stateOptions}
                  optionLabel="label"
                  optionValue="value"
                  onChange={(e) => {
                    handleChange(e, "contact_active");
                  }}
                  value={editData?.contact_active}
                  className="border"
                />
                <label htmlFor="status" className="dark:text-gray-300">
                  Status
                </label>
              </span>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                className="flex items-center rounded-lg bg-blue-500 px-2 py-1 text-left text-sm font-normal text-white hover:bg-blue-600"
              >
                Edit Contact
              </button>
            </div>
          </form>
        </Dialog>
        {/* Delete vehicle Data */}
        <Dialog
          visible={deleteDialog}
          onHide={closeDeleteDialog}
          header="Confirm Delete"
          footer={
            <div>
              <Button
                label="Delete"
                className="mr-2 bg-red-500 px-2 py-1 text-xs text-white dark:hover:bg-red-500 dark:hover:text-white"
                onClick={handleDelete}
              />
              <Button
                label="Cancel"
                className="bg-gray-700 px-2 py-1 text-xs text-white dark:text-gray-850 dark:hover:bg-gray-600 dark:hover:text-gray-850"
                onClick={closeDeleteDialog}
              />
            </div>
          }
        >
          <div className="flex items-center">
            <MdDeleteOutline className="text-2xl text-blue-400" />
            <span className="text-sm font-semibold">
              Are you sure you want to delete {deleteName}?
            </span>
          </div>
        </Dialog>
      </div>
    </>
  );
};

export default ContactsList;
