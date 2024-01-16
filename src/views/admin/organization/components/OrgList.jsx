import React, { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { FilterMatchMode } from "primereact/api";
import { InputText } from "primereact/inputtext";
import axios from "axios";
import Cookies from "js-cookie";

const OrgList = () => {
  const token = Cookies.get("token");
  console.log("token:::::", token);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    device_type: { value: null, matchMode: FilterMatchMode.IN },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [data, setData] = useState();

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_AWS_URL}/organizationDetailsGet`, {
        headers: {
          Authorization: token,
        },
      })

      .then((res) => {
        // const formattedData = res.data.devices.map((item, index) => ({
        //   ...item,
        //   serialNo: index + 1,
        //   key: index + 1,
        // }));
        // setData(formattedData);
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [token]);

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
  const actionBodyTemplate = (rowData) => {
    return (
      <>
        <Button
          icon="pi pi-pencil"
          rounded
          tooltip="Edit"
          tooltipOptions={{ position: "mouse" }}
          className="mr-3 border border-gray-700 text-gray-700"
          style={{ width: "2rem", height: "2rem" }}
          //   onClick={() => openDialog(rowData)}
        />
        <Button
          icon="pi pi-trash"
          rounded
          tooltip="Delete"
          tooltipOptions={{ position: "mouse" }}
          style={{ width: "2rem", height: "2rem" }}
          className="border border-red-600 text-red-600"
          //   onClick={() => openDeleteDialog(rowData)}
        />
      </>
    );
  };
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
              className="searchbox w-[25vw] cursor-pointer rounded-full border py-3 pl-8 dark:bg-gray-950 dark:text-gray-50"
            />
            {globalFilterValue && (
              <Button
                icon="pi pi-times"
                className="p-button-rounded  p-button-text dark:text-gray-50 dark:hover:text-gray-50"
                onClick={clearSearch}
              />
            )}
          </span>
        </div>
      </div>
    );
  };
  const header = renderHeader();
  return (
    <>
      <DataTable
        value={data}
        header={header}
        removableSort
        paginator
        dataKey="threshold_uuid"
        rows={5}
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        rowsPerPageOptions={[5, 10, 25]}
        filters={filters}
        filterDisplay="menu"
        globalFilterFields={["title", "user_uuid"]}
        emptyMessage="No organizations found."
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
      >
        <Column
          field="serialNo"
          header="Sr. No."
          className="border-b dark:bg-navy-800 dark:text-gray-200"
          style={{ minWidth: "5rem" }}
        ></Column>
        <Column
          field="title"
          header="Name"
          sortable
          className="border-b dark:bg-navy-800 dark:text-gray-200"
          style={{ minWidth: "10rem" }}
        ></Column>
        <Column
          field="title"
          header="Type"
          sortable
          className="border-b dark:bg-navy-800 dark:text-gray-200"
          style={{ minWidth: "8rem" }}
        ></Column>
        <Column
          field="title"
          header="Address"
          sortable
          className="border-b dark:bg-navy-800 dark:text-gray-200"
          style={{ minWidth: "14rem" }}
        ></Column>
        <Column
          field="title"
          header="Contact Person"
          sortable
          className="border-b dark:bg-navy-800 dark:text-gray-200"
          style={{ minWidth: "14rem" }}
        ></Column>
        <Column
          field="title"
          header="Plan"
          sortable
          className="border-b dark:bg-navy-800 dark:text-gray-200"
          style={{ minWidth: "12rem" }}
        ></Column>
        <Column
          body={actionBodyTemplate}
          header="Action"
          className="border-b dark:bg-navy-800 dark:text-gray-200"
          style={{ minWidth: "10rem" }}
        ></Column>
      </DataTable>
    </>
  );
};

export default OrgList;
