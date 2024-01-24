import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import ContactsList from "./components/ContactsList";
import { Toast } from "primereact/toast";
import { FiPlus } from "react-icons/fi";

import { RadioButton } from 'primereact/radiobutton';
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Checkbox } from "primereact/checkbox";
        

const Contacts = () => {
  const token = Cookies.get("token");
  const user_uuid = Cookies.get("user_uuid");
  const [isDialog, setIsDialog] = useState(false);
  const [addData, setAddData] = useState({});
  const [primary, setPrimary] = useState('2');
  const [contactsData, setContactsData] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [refresh, setRefresh] = useState(false);
  const toastRef = useRef(null);
  const [contactType , setContactType] = useState("phone");
  const [primaryType, setPrimaryType] = useState("yes");
  const isValidPhoneNumber = (phoneNumber) => {
    // Regular expression to check for exactly 10 digits
    const phonePattern = /^\d{10}$/;
    return phonePattern.test(phoneNumber);
  };

  const validateForm = () => {
    let errors = {};

    if (!addData.contact_name) {
      errors.contact_name = "Name is required";
    }

    if (!addData.contact_info) {
      errors.contact_info = "Field is required";
    }


    return errors;
  };

 
  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_AWS_URL}/getContact`,
        {
          headers: { Authorization: `${token}` },
        }
      )
      .then((res) => {
        console.log(res.data.data);
        const formatedData = res.data.data.map((item, ind) => ({
          ...item,
          serialNo: ind + 1,
          full_name: item.contact_name
        }));
        setContactsData(formatedData);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [refresh, token, user_uuid]);

  const openDialog = () => {
    setIsDialog(true);
  };

  const closeDialog = () => {
    setIsDialog(false);
    setFormErrors({});
  };

  //onChange function
  const handleChange = (e) => {
    const { name, value } = e.target;

    const updatedFormErrors = { ...formErrors };
    updatedFormErrors[name] = undefined;

    setFormErrors(updatedFormErrors);
    setAddData({ ...addData, [name]: value });
  };

  //handleSubmit

  const handleSubmit = (e) => {
    e.preventDefault();

    const errors = validateForm();
    setFormErrors(errors);
    if(addData.contact_type == 'phone'){
      if (!isValidPhoneNumber(addData.contact_info)) {
        toastRef.current.show({
          severity: "warn",
          summary: "Invalid Phone Number",
          detail: "Please enter a 10-digit valid phone number.",
          life: 3000,
        });
        return;
      }
    }

    
    



    if (Object.keys(errors).length === 0) {
      if(addData.contact_primary!=='1'){
        addData.contact_primary='2'
      }

      axios
        .post(
          `${process.env.REACT_APP_AWS_URL}/addContact`,
          addData,
          {
            headers: { Authorization: `${token}` },
          }
        )
        .then((res) => {
          setRefresh(!refresh);
          toastRef.current.show({
            severity: "success",
            summary: "Success",
            detail: `Contact ${
              addData.conatct_name
            } added successfully!`,
            life: 3000,
          });
          closeDialog();
        })
        .catch((err) => {
          if (err.response.request.status === 400) {
            toastRef.current.show({
              severity: "error",
              summary: "Error",
              detail:
                "Contact already exists with the provided email or mobile",
              life: 3000,
            });
          } else {
            toastRef.current.show({
              severity: "error",
              summary: "Error",
              detail: "Failed to add contact. Please try again.",
              life: 3000,
            });
          }
        });
    } else {
      toastRef.current.show({
        severity: "warn",
        summary: "Incomplete form",
        detail: "Please fill in all the required details.",
        life: 3000,
      });
    }
  };

  //edit contacts api
  const editContacts = (contact_uuid, editData) => {
    axios
      .put(
        `${process.env.REACT_APP_AWS_URL}/editContact/${contact_uuid}`,
        {"contact_name":editData.contact_name,"contact_primary":editData.contact_primary,"contact_type":editData.contact_type,"contact_info":editData.contact_info},

        {
          headers: { Authorization: `${token}` },
        }
      )
      .then((res) => {
        setRefresh(!refresh);
        toastRef.current.show({
          severity: "success",
          summary: "Success",
          detail: `Contact ${
            editData.contact_name
          } updated successfully!`,
          life: 3000,
        });
      })
      .catch((err) => {
        if (err.response.request.status === 400) {
          toastRef.current.show({
            severity: "error",
            summary: "Error",
            detail: "Contact already exists with the provided email or mobile",
            life: 3000,
          });
        } else {
          toastRef.current.show({
            severity: "error",
            summary: "Error",
            detail: "Failed to edit contact. Please try again.",
            life: 3000,
          });
        }
      });
  };

  const deleteContact = (contact_uuid, contact_name) => {
    console.log(contact_uuid);
    axios
      .put(
        `${process.env.REACT_APP_AWS_URL}/deleteContact/${contact_uuid}`,{},
        {
          headers: { Authorization:`${token}` },
        }
      )
      .then((res) => {
        console.log("response:::",res);
        setRefresh(!refresh);
        toastRef.current.show({
          severity: "success",
          summary: "Success",
          detail: `Contact ${contact_name} deleted successfully!`,
          life: 3000,
        });
      })
      .catch((err) => {
        console.log("errr:::",err);
        toastRef.current.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to delete contact. Please try again.",
          life: 3000,
        });
      });
  };
  const optionsAdd = [{label : 'Phone', value:'Phone'} , {label : 'Email', value:'Email'}]

  return (
    <>
      <Toast ref={toastRef} position="top-right" />
      <div className="flex-col justify-between">
        <h4 className="text-dark pt-3 text-xl font-bold dark:text-white">
          Contacts
        </h4>
        <div>
        <button
        className="flex items-center rounded-lg bg-blue-500 px-2 py-1 text-left text-sm font-normal text-white hover:bg-blue-600"
        onClick={openDialog}
      >
        <FiPlus />
        &nbsp;New Contact
      </button>
        </div>
        {/* dialog to add contact */}
        <Dialog
          visible={isDialog}
          onHide={closeDialog}
          style={{ width: "40rem" }}
          breakpoints={{ "960px": "75vw", "641px": "90vw" }}
          header="Fill the details"
          modal
          className="p-fluid dark:bg-gray-900"
        >
          <form onSubmit={handleSubmit} className="dark:text-gray-900">
            <div className="mx-auto mt-8 ">
              <span className={`p-float-label `}>
                <InputText
                  id="contact_name"
                  name="contact_name"
                  onChange={handleChange}
                  className={`border py-2 pl-2 text-sm${
                    formErrors.contact_name ? "border-red-600" : ""
                  }`}
                />
                <label
                  htmlFor="contact_name"
                  className="dark:text-gray-300 text-sm"
                >
                  Full Name
                </label>
              </span>
              {formErrors.contact_name && (
                <small className="text-red-600">
                  {formErrors.contact_name}
                </small>
              )}
            </div>
            
            {/*creating radio button here*/}
              <div className="flex flex-wrap gap-3 mx-auto mt-7">
              <span className="p-float-label w-[100%]">
                <Dropdown
                  id="contact_type"
                  name="contact_type"
                  options={optionsAdd}
                  optionLabel="label"
                  optionValue="value"
                  className={`p-dropdown h-10 border text-sm w-[100%]`}
                  onChange={handleChange}
                  value={addData.contact_type}
                />
                <label htmlFor="device_type" className="dark:text-gray-300 text-sm">
                  Contact Type
                </label>
              </span>
              
          </div>
            {/* End of radio button */}
            {console.log('add data : ' , addData.contact_type)}
            {addData.contact_type === "email" ? (<div className="mx-auto mt-7 ">
              <span className={`p-float-label`}>
                <InputText
                  id="contact_email"
                  name="contact_info"
                  type="email"
                  onChange={handleChange}
                  className={`border py-2 pl-2 text-sm${
                    formErrors.contact_info ? "border-red-600" : ""
                  }`}
                />
                <label htmlFor="contact_info" className="dark:text-gray-300 text-sm">
                  Email
                </label>
              </span>
              {formErrors.contact_info && (
                <small className="text-red-600">
                  {formErrors.contact_info}
                </small>
              )}
            </div>):(<div className="mx-auto mt-7 ">
              <span className={`p-float-label `}>
                <InputText
                  id="contact_mobile"
                  name="contact_info"
                  keyfilter="pint"
                  onChange={handleChange}
                  className={`border py-2 pl-2 text-sm ${
                    formErrors.contact_info ? "border-red-600" : ""
                  }`}
                />
                <label htmlFor="contact_info" className="dark:text-gray-300 text-sm">
                  Mobile Number
                </label>
              </span>

              {formErrors.contact_info && (
                <small className="text-red-600">
                  {formErrors.contact_info}
                </small>
              )}
            </div>)}
            {/* primary contact or not */}
            <div className="flex flex-wrap gap-3 mx-auto mt-7">
            <span className="w-[100%] ml-2 flex flex-wrap align-center">
            <input type='checkbox' onChange={handleChange} name='contact_primary' id='contact_primary' value='1'></input>
            <label htmlFor="contact_primary" className="dark:text-gray-300 ml-2 text-xs text-blue-600">
                  Set this as primary contact
                </label>
                </span>
              
          </div>
            {/* Primary contact ended */}
            
            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                className="flex items-center rounded-lg bg-blue-500 px-2 py-1 text-left text-sm font-normal text-white hover:bg-blue-600"
              >
                Add Contact
              </button>
            </div>
          </form>
        </Dialog>
        <div className="mt-[-4px]">
          <ContactsList
            contactsData={contactsData}
            editContacts={editContacts}
            deleteContact={deleteContact}
          />
        </div>
      </div>
    </>
  );
};

export default Contacts;
