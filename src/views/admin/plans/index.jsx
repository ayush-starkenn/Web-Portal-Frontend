import PlanCard from "components/plans";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { useRef, useState } from "react";
import { FiPlus } from "react-icons/fi";

const Plans = () => {
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [plans, setPlans] = useState([]);
  const [showErrors, setShowErrors] = useState(false);
  const [newPlan, setNewPlan] = useState({
    type: "",
    price: "",
    subscription: "",
    description: "",
    items: [""],
  });

  const toggleDialog = () => {
    setIsDialogVisible(!isDialogVisible);
    setNewPlan({
      type: "",
      price: "",
      subscription: "",
      description: "",
      items: [""],
    });
    setShowErrors(false);
  };
  const toastRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Ensure that items is always an array
    const items = name === "items" ? value.split("\n") : newPlan.items;

    setNewPlan((prevPlan) => ({
      ...prevPlan,
      [name]: name === "items" ? items : value,
    }));
  };

  const addNewItem = () => {
    setNewPlan((prevPlan) => ({
      ...prevPlan,
    }));
  };
  const addNewField = () => {
    const lastItem = newPlan.items[newPlan.items.length - 1];

    // Check if the last item is not empty before adding a new item
    if (lastItem !== undefined && lastItem.trim() !== "") {
      setNewPlan((prevPlan) => ({
        ...prevPlan,
        items: [...prevPlan.items, ""],
      }));
    }
  };

  const renderFeatures = () => {
    return newPlan.items.map((item, index) => (
      <div key={index} className="card justify-content-center mt-8 flex-auto">
        <span className="p-float-label">
          <InputText
            id={`feature_${index}`}
            name={`items_${index}`}
            value={item}
            onChange={(e) => handleFeatureInputChange(e, index)}
            className={`border py-2 pl-2 ${
              showErrors && item.trim() === "" ? "border-red-500" : ""
            }`}
            autoComplete="off"
          />
          <label htmlFor={`feature_${index}`} className="dark:text-gray-300">
            Feature
          </label>
        </span>
        {showErrors && item.trim() === "" && (
          <small className="text-red-500">Feature is required.</small>
        )}
      </div>
    ));
  };
  const handleFeatureInputChange = (e, index) => {
    const { value } = e.target;
    setNewPlan((prevPlan) => {
      const updatedItems = [...prevPlan.items];
      updatedItems[index] = value;
      return { ...prevPlan, items: updatedItems };
    });
  };

  const submitForm = (e) => {
    e.preventDefault();

    // Check if required fields are filled
    if (
      newPlan.type.trim() === "" ||
      newPlan.price.trim() === "" ||
      newPlan.subscription.trim() === "" ||
      newPlan.description.trim() === "" ||
      newPlan.items.some((item) => item.trim() === "")
    ) {
      // Highlight empty fields in red and show missing text
      setNewPlan((prevPlan) => ({
        ...prevPlan,
        type: prevPlan.type,
        price: prevPlan.price,
        subscription: prevPlan.subscription,
        description: prevPlan.description,
        items: prevPlan.items.map((item) => item),
      }));
      setShowErrors(true);
      // Display an alert or set an error state to inform the user about the missing fields
      toastRef.current.show({
        severity: "warn",
        summary: "Fill Required Fields",
        detail: "Please fill in all the required details.",
        life: 3000,
      });
      return;
    }

    // All required fields are filled, proceed with adding the plan
    setPlans((prevPlans) => [...prevPlans, newPlan]);
    setIsDialogVisible(false);
  };

  return (
    <>
      <Toast ref={toastRef} className="toast-custom" position="top-right" />
      <h4 className="text-dark pt-3 text-2xl font-bold dark:text-white">
        Plans
      </h4>
      <button
        className="mt-2 flex h-10 items-center rounded-lg bg-blue-500 px-3 py-2 text-left font-semibold text-white hover:bg-blue-600"
        onClick={toggleDialog}
      >
        <FiPlus className="mr-2" />
        New Plan
      </button>
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
        <form className="mx-auto" onSubmit={submitForm}>
          <div className="flex justify-evenly gap-4">
            <div className="card justify-content-center mt-5 flex-auto">
              <span className="p-float-label">
                <InputText
                  id="type"
                  name="type"
                  value={newPlan.type}
                  onChange={handleInputChange}
                  className={`border py-2 pl-2 
                  ${
                    showErrors && newPlan.type.trim() === ""
                      ? "border-red-500"
                      : ""
                  }
                  `}
                  autoComplete="off"
                />
                <label htmlFor="type" className="dark:text-gray-300">
                  Plan Type
                </label>
              </span>
              {showErrors && newPlan.type.trim() === "" && (
                <small className="text-red-500">Plan Type is required.</small>
              )}
            </div>
            <div className="card justify-content-center mt-5 flex-auto">
              <span className="p-float-label">
                <InputText
                  keyfilter="pint"
                  id="price"
                  name="price"
                  value={newPlan.price}
                  onChange={handleInputChange}
                  className={`border py-2 pl-2 ${
                    showErrors && newPlan.price.trim() === ""
                      ? "border-red-500"
                      : ""
                  }`}
                  autoComplete="off"
                />
                <label htmlFor="price" className="dark:text-gray-300">
                  Price
                </label>
              </span>
              {showErrors && newPlan.price.trim() === "" && (
                <small className="text-red-500">Price is required.</small>
              )}
            </div>
          </div>
          <div className="flex justify-evenly gap-4">
            <div className="card justify-content-center mt-8 flex-auto">
              <span className="p-float-label">
                <InputText
                  id="subscription"
                  name="subscription"
                  value={newPlan.subscription}
                  onChange={handleInputChange}
                  keyfilter="alpha"
                  className={`border py-2 pl-2 ${
                    showErrors && newPlan.subscription.trim() === ""
                      ? "border-red-500"
                      : ""
                  }`}
                  autoComplete="off"
                />
                <label htmlFor="subscription" className="dark:text-gray-300">
                  Subscription
                </label>
              </span>
              {showErrors && newPlan.subscription.trim() === "" && (
                <small className="text-red-500">
                  Subscription is required.
                </small>
              )}
            </div>
            <div className="card justify-content-center mt-8 flex-auto">
              <span className="p-float-label">
                <InputText
                  id="description"
                  name="description"
                  value={newPlan.description}
                  onChange={handleInputChange}
                  className={`border py-2 pl-2 ${
                    showErrors && newPlan.description.trim() === ""
                      ? "border-red-500"
                      : ""
                  }`}
                  autoComplete="off"
                />
                <label htmlFor="description" className="dark:text-gray-300">
                  Description
                </label>
              </span>
              {showErrors && newPlan.description.trim() === "" && (
                <small className="text-red-500">Description is required.</small>
              )}
            </div>
          </div>
          <div className="card justify-content-center mt-8 flex-auto">
            {renderFeatures()}
            <div className="mt-2 flex items-center">
              <small
                className="flex cursor-pointer items-center rounded-lg bg-gray-150 px-3 py-2 underline dark:bg-gray-600 dark:text-[#444]"
                onClick={addNewField}
              >
                <FiPlus />
                Add Another
              </small>
            </div>
          </div>
          <div className="mt-6 flex justify-center">
            <button
              type="submit"
              className="rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-600"
              onClick={addNewItem}
            >
              Add Plan
            </button>
          </div>
        </form>
      </Dialog>
      <div className="pt-5">
        <PlanCard plans={plans} />
      </div>
    </>
  );
};

export default Plans;
