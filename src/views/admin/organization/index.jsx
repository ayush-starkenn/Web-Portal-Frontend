import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useRef, useState } from "react";
import { FiPlus } from "react-icons/fi";
import OrgList from "./components/OrgList";
import { Toast } from "primereact/toast";
import axios from "axios";

const Organization = () => {
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [orgTypes, setOrgTypes] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState();
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState();
  const [emptyFields, setEmptyFields] = useState([]);
  const [formData, setFormData] = useState({
    org_name: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });
  const toastRef = useRef();

  const openDialog = () => {
    setIsDialogVisible(true);
    setSelectedOrg(false);
    setEmptyFields([]);
  };

  useEffect(() => {
    axios
      .post(`${process.env.REACT_APP_AWS_URL}/userOrganization`)
      .then((response) => {
        setOrgTypes(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
    axios
      .post(`${process.env.REACT_APP_AWS_URL}/plans`)
      .then((response) => {
        setPlans(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const orgOptions = () => {
    return orgTypes?.map((el) => ({
      key: el.orgTypeId,
      label: el.orgTypeName,
      value: el.orgTypeId,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setEmptyFields((prevEmptyFields) =>
      prevEmptyFields.filter((field) => field !== name)
    );
  };

  const handleDropdownChange = (fieldName) => {
    setEmptyFields((prevEmptyFields) =>
      prevEmptyFields.filter((field) => field !== fieldName)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requiredFields = [
      "org_name",
      "selectedOrg",
      "selectedPlan",
      "address",
      "city",
      "state",
      "pincode",
    ];
    const newEmptyFields = requiredFields.filter((field) => !formData[field]);
    setEmptyFields(newEmptyFields);

    // Display an error message or handle the validation appropriately
    if (newEmptyFields.length > 0) {
      toastRef.current.show({
        severity: "warn",
        summary: "Fill Required Fields",
        detail: "Please fill in all the required details.",
        life: 3000,
      });
      return;
    }
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/add-org`,
        {
          formData,
          selectedOrg,
          selectedPlan,
        }
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Toast ref={toastRef} className="toast-custom" position="top-right" />
      <h4 className="text-dark pt-3 text-2xl font-bold dark:text-white">
        Organizations
      </h4>
      <button
        className="mt-2 flex h-10 items-center rounded-lg bg-blue-500 px-3 py-2 text-left font-semibold text-white hover:bg-blue-600"
        onClick={openDialog}
      >
        <FiPlus className="mr-2" />
        New Organization
      </button>
      <OrgList />
      <Dialog
        visible={isDialogVisible}
        onHide={() => {
          setIsDialogVisible(false);
        }}
        style={{ width: "45rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Fill the details"
        modal
        className="p-fluid dark:bg-gray-900"
      >
        <form className="mx-auto" onSubmit={handleSubmit}>
          <div className="flex justify-evenly gap-4">
            <div className="card justify-content-center mt-5 flex-auto">
              <span className="p-float-label">
                <InputText
                  id="org_name"
                  name="org_name"
                  keyfilter="alpha"
                  className={`border py-2 pl-2 ${
                    emptyFields.includes("org_name") ? "border-red-500" : ""
                  }`}
                  autoComplete="off"
                  onChange={handleInputChange}
                />
                <label htmlFor="org_name" className="dark:text-gray-300">
                  Organization Name
                </label>
              </span>
              {emptyFields.includes("org_name") && (
                <small className="text-red-500">
                  Organization name is required.
                </small>
              )}
            </div>
          </div>
          <div className="mt-8 flex justify-evenly gap-4">
            <div className="card justify-content-center flex-auto">
              <span className="p-float-label">
                <Dropdown
                  id="org_type"
                  name="selectedOrg"
                  value={selectedOrg || ""}
                  options={orgOptions()}
                  onChange={(e) => {
                    setSelectedOrg(e.value);
                    handleDropdownChange("selectedOrg");
                  }}
                  className={`h-11 border ${
                    emptyFields.includes("selectedOrg") ? "border-red-500" : ""
                  }`}
                  optionLabel="label"
                />

                <label htmlFor="org_type" className="dark:text-gray-300">
                  Organization Type
                </label>
              </span>
              {emptyFields.includes("selectedOrg") && (
                <small className="text-red-500">
                  Organization type is required.
                </small>
              )}
            </div>
            <div className="card justify-content-center flex-auto">
              <span className="p-float-label">
                <Dropdown
                  id="plan"
                  value={selectedPlan || ""}
                  options={plans}
                  onChange={(e) => {
                    setSelectedPlan(e.value);
                    handleDropdownChange("selectedPlan");
                  }}
                  className={`h-11 border ${
                    emptyFields.includes("selectedPlan") ? "border-red-500" : ""
                  }`}
                  optionLabel="label"
                />
                <label htmlFor="plan" className="dark:text-gray-300">
                  Select Plan
                </label>
              </span>
              {emptyFields.includes("selectedPlan") && (
                <small className="text-red-500">Plan is required.</small>
              )}
              <small className="ml-2 text-blue-600 underline dark:text-blue-400">
                <a href="/admin/plans">Explore Plans</a>
              </small>
            </div>
          </div>
          <div className="mb-6 ml-2 mt-4">
            <span>Address:</span>
          </div>
          <div className="flex justify-evenly gap-4">
            <div className="card justify-content-center flex-auto">
              <span className="p-float-label">
                <InputText
                  id="address"
                  type="text"
                  name="address"
                  className={`border py-2 pl-2 ${
                    emptyFields.includes("address") ? "border-red-500" : ""
                  }`}
                  autoComplete="off"
                  onChange={handleInputChange}
                />
                <label htmlFor="address" className="dark:text-gray-300">
                  Flat No./ Plot No., Area/Society
                </label>
              </span>
              {emptyFields.includes("address") && (
                <small className="text-red-500">Address is required.</small>
              )}
            </div>
            <div className="card justify-content-center flex-auto">
              <span className="p-float-label">
                <InputText
                  id="city"
                  type="text"
                  name="city"
                  className={`border py-2 pl-2 ${
                    emptyFields.includes("city") ? "border-red-500" : ""
                  }`}
                  autoComplete="off"
                  onChange={handleInputChange}
                />
                <label htmlFor="city" className="dark:text-gray-300">
                  City
                </label>
              </span>
              {emptyFields.includes("city") && (
                <small className="text-red-500">City is required.</small>
              )}
            </div>
          </div>
          <div className="mt-8 flex justify-evenly gap-4">
            <div className="card justify-content-center flex-auto">
              <span className="p-float-label">
                <InputText
                  id="state"
                  type="text"
                  name="state"
                  className={`border py-2 pl-2 ${
                    emptyFields.includes("state") ? "border-red-500" : ""
                  }`}
                  autoComplete="off"
                  onChange={handleInputChange}
                />
                <label htmlFor="state" className="dark:text-gray-300">
                  State
                </label>
              </span>
              {emptyFields.includes("state") && (
                <small className="text-red-500">State is required.</small>
              )}
            </div>
            <div className="card justify-content-center flex-auto">
              <span className="p-float-label">
                <InputText
                  id="pincode"
                  type="text"
                  name="pincode"
                  className={`border py-2 pl-2 ${
                    emptyFields.includes("pincode") ? "border-red-500" : ""
                  }`}
                  autoComplete="off"
                  onChange={handleInputChange}
                />
                <label htmlFor="pincode" className="dark:text-gray-300">
                  Pincode
                </label>
              </span>
              {emptyFields.includes("pincode") && (
                <small className="text-red-500">Pincode is required.</small>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <button
              type="submit"
              className="rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-600"
            >
              Add Organization
            </button>
          </div>
        </form>
      </Dialog>
    </>
  );
};

export default Organization;
