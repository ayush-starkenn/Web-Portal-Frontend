import React, { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import AddFeatureSet from "./AddFeatureSet";
import { FilterMatchMode } from "primereact/api";
import { InputText } from "primereact/inputtext";
import axios from "axios";
import EditFeatureset from "./EditFeatureset";
import Cookies from "js-cookie";
import { useContext } from "react";
import { AppContext } from "context/AppContext";
import { Toast } from "primereact/toast";
import { Tag } from "primereact/tag";
import { FiPlus } from "react-icons/fi";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import PreloaderList from "components/skeleton-preloader/PreloaderList";

const FeatureList = () => {
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [isDialogVisible1, setIsDialogVisible1] = useState(false);
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [myData, setMyData] = useState();
  const [fs, setFs] = useState();
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [data, setData] = useState([]);
  const [loaded, setLoaded] = useState(true);
  const toastRef = useRef(null);
  const token = Cookies.get("token");
  const user_uuid = Cookies.get("user_uuid");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const { updateData, resetState } = useContext(AppContext);

  //get list of featureset

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_AWS_URL}/getFeatureset`,

        {
          headers: { Authorization: token },
        }
      )
      .then((res) => {
        const formattedData = res.data.data.map((item, index) => ({
          ...item,
          serialNo: index + 1,
          key: index + 1,
        }));
        setData(formattedData);
        setLoaded(false);
      })
      .catch((err) => console.log(err));
  }, [token, fs]);

  //opens delete dialog
  const openDeleteDialog = (rowData) => {
    setSelectedFeature(rowData);
    setIsDeleteDialogVisible(true);
  };

  //closes delete dialog
  const closeDeleteDialog = () => {
    setFs(updateData);
    setIsDeleteDialogVisible(false);
  };

  const statusBodyTemplate = (rowData) => {
    return rowData.featureset_status === 1 ? (
      <Tag
        value={"Active"}
        severity={"success"}
        className="h-5 rounded-sm text-xs font-normal"
      ></Tag>
    ) : (
      <Tag
        value={"Deactive"}
        severity={"danger"}
        className="h-5 rounded-sm text-xs font-normal"
      ></Tag>
    );
  };
  //delete api call
  const handleDeleteConfirmation = async () => {
    if (selectedFeature) {
      try {
        await axios.put(
          `${process.env.REACT_APP_API_URL}/featuresets/delete-featureset/${selectedFeature?.featureset_uuid}`,
          { user_uuid },
          {
            headers: { authorization: `bearer ${token}` },
          }
        );

        setFs(myData); // Fetch the updated list of featuresets after the delete operation
        setData(fs);
        closeDeleteDialog();

        toastRef.current.show({
          severity: "success",
          summary: "Success",
          detail: `Feature Set ${selectedFeature?.featureset_name} deleted successfully`,
          life: 3000,
        });
      } catch (error) {
        console.error("Error during delete:", error);

        closeDeleteDialog();

        if (error.response) {
          // Server responded with a status code other than 2xx
          toastRef.current.show({
            severity: "danger",
            summary: "Error",
            detail: error.response.data.message || "An error occurred",
            life: 3000,
          });
        } else if (error.request) {
          // The request was made but no response was received
          toastRef.current.show({
            severity: "danger",
            summary: "Error",
            detail: "No response received from the server",
            life: 3000,
          });
        } else {
          // Something happened in setting up the request
          toastRef.current.show({
            severity: "danger",
            summary: "Error",
            detail: "Error while deleting feature set",
            life: 3000,
          });
        }
      }
    }
  };

  //add FS success toast
  const handleAddSuccess = (fs_name) => {
    setIsDialogVisible(false);
    toastRef.current.show({
      severity: "success",
      summary: "Success",
      detail: `Feature Set ${fs_name} added successfully`,
      life: 3000,
    });
    setFs(updateData); // Fetch the updated list of featuresets
  };

  //edit FS success toast
  const handleEditSuccess = (fs_name) => {
    setIsDialogVisible1(false);
    toastRef.current.show({
      severity: "success",
      summary: "Success",
      detail: `Feature Set ${fs_name} updated successfully`,
      life: 3000,
    });
    setFs(myData);
  };
  //open add dialog
  const openDialog = () => {
    setIsDialogVisible(true);
  };
  //closes add dialog
  const closeDialog = () => {
    setIsDialogVisible(false);
    resetState();
  };
  //opens edit dialog
  const openDialog1 = (rowData) => {
    setMyData(rowData); // Set the rowData to myData state
    setIsDialogVisible1(true);
  };
  //closes edit dialog
  const closeDialog1 = () => {
    setIsDialogVisible1(false);
    resetState();
  };

  //global search dialog
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

  //searchbox
  const header = (
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

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="flex text-lg">
        <FaRegEdit
          title="Edit"
          onClick={() => openDialog1(rowData)}
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

  return (
    <>
      <div>
        <button
          className="flex items-center rounded-lg bg-blue-500 px-2 py-1 text-left text-sm font-normal text-white hover:bg-blue-600"
          onClick={openDialog}
        >
          <FiPlus />
          &nbsp;New Featureset
        </button>
      </div>

      {/* edit dialog */}
      <Dialog
        visible={isDialogVisible1}
        onHide={closeDialog1}
        style={{ width: "70vw" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Featureset Details"
        modal
        className="p-fluid dark:bg-gray-900"
      >
        <EditFeatureset
          parameters={{ propValue: myData }}
          onSuccess={handleEditSuccess}
        />
      </Dialog>
      {/* add dialog */}
      <Dialog
        visible={isDialogVisible}
        onHide={closeDialog}
        style={{ width: "70vw" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Fill the details"
        modal
        className="p-fluid dark:bg-gray-900"
      >
        <p className="text-right text-sm text-red-400">
          All Fields Are Required<span className="text-red-500">**</span>
        </p>
        <AddFeatureSet onSuccess={handleAddSuccess} />
      </Dialog>

      <Toast ref={toastRef} className="toast-custom" position="top-right" />
      {/* delete dialog */}
      <Dialog
        visible={isDeleteDialogVisible}
        onHide={closeDeleteDialog}
        header="Confirm Delete"
        footer={
          <div>
            <Button
              label="Delete"
              icon="pi pi-check"
              className="mr-2 bg-red-500 px-3 py-2 text-white"
              onClick={handleDeleteConfirmation}
            />
            <Button
              label="Cancel"
              icon="pi pi-times"
              className="bg-gray-600 px-3 py-2 text-white dark:text-gray-850 "
              onClick={closeDeleteDialog}
            />
          </div>
        }
      >
        <div>
          Are you sure you want to delete {selectedFeature?.featureset_name}?
        </div>
      </Dialog>
      {/* List View */}
      {loaded ? (
        <PreloaderList />
      ) : (
        <DataTable
          removableSort
          value={data}
          dataKey="featureset_uuid"
          paginator
          rows={5}
          rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
          filterDisplay="menu"
          filters={filters}
          globalFilterFields={["featureset_name", "featureset_users"]}
          emptyMessage="No featureset found."
          header={header}
        >
          <Column
            field="serialNo"
            header="Sr. No."
            style={{ minWidth: "3rem" }}
            className="border-b text-sm dark:bg-navy-800 dark:text-gray-200"
          />
          <Column
            field="featureset_name"
            header="Featureset Name"
            style={{ minWidth: "12rem" }}
            className="border-b text-sm dark:bg-navy-800 dark:text-gray-200"
          />
          <Column
            field="featureset_type"
            header="Featureset Type"
            // body={usersBodyTemplate}
            style={{ minWidth: "16rem" }}
            className="border-b text-sm dark:bg-navy-800 dark:text-gray-200"
          />
          <Column
            field="featureset_status"
            header="Featureset Status"
            body={statusBodyTemplate}
            sortable
            style={{ minWidth: "8rem" }}
            className="border-b text-sm dark:bg-navy-800 dark:text-gray-200"
          />
          <Column
            body={actionBodyTemplate}
            header="Action"
            className="border-b text-sm dark:bg-navy-800 dark:text-gray-200"
            style={{ minWidth: "8rem" }}
          />
        </DataTable>
      )}
    </>
  );
};

export default FeatureList;
