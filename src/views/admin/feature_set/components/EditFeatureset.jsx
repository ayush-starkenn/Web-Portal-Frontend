import React, { useEffect, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { useState } from "react";
import { Toast } from "primereact/toast";
import { useContext } from "react";
import { AppContext } from "context/AppContext";
import Cookies from "js-cookie";
import axios from "axios";

// import { Tag } from "primereact/tag";

const EditFeatureset = ({ parameters, onSuccess }) => {
  //this is the edit featureset component
  const [featuresetDetails, setFeaturesetDetails] = useState({
    featureset_name: "",
  });
  const [featuresetData, setFeaturesetData] = useState({});
  // const [featuresetUsers, setFeaturesetUsers] = useState([]);
  const [invalidFields, setInvalidFields] = useState([]);
  const { updateFunc } = useContext(AppContext);
  const [selectedValue, setSelectedValue] = useState("");
  const [customers, setCustomers] = useState([]);
  const [listCustomers, setListCustomers] = useState([]);
  const toastRef = useRef(null);

  const token = Cookies.get("token");
  const user_uuid = Cookies.get("user_uuid");

  //get featureset Deatils
  useEffect(() => {
    setFeaturesetDetails(parameters?.propValue);
  }, [parameters.propValue]);
  useEffect(() => {
    if (featuresetDetails.featureset_data) {
      try {
        const featuresetDataParse = JSON.parse(
          featuresetDetails.featureset_data
        );
        setFeaturesetData(featuresetDataParse);
      } catch (error) {
        console.error("Error parsing featureset_data:", error);
      }
    }
    if (featuresetDetails.featureset_users) {
      try {
        const featuresetUsersParse = JSON.parse(
          featuresetDetails.featureset_users
        );
        setCustomers(featuresetUsersParse);
      } catch (err) {
        console.log("Error in parsing the featureset users");
      }
    }
  }, [featuresetDetails]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/customers/get-all-customer`, {
        headers: { authorization: `bearer ${token}` },
      })
      .then((res) => {
        setListCustomers(res.data.customers);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [token]);

  useEffect(() => {
    if (
      featuresetDetails &&
      featuresetDetails.featureset_users &&
      listCustomers
    ) {
      let usersinFeatureset = JSON.parse(featuresetDetails?.featureset_users);

      const mapfeaturesetusers = usersinFeatureset.map((el) => el.user_uuid);

      const k = listCustomers?.filter((el) =>
        mapfeaturesetusers.includes(el.user_uuid)
      );
      if (k.length > 0) {
        // setFeaturesetUsers(k);
      }
    }
  }, [listCustomers, featuresetDetails]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFeaturesetDetails({ ...featuresetDetails, [name]: value });

    if (name === "featureset_name") {
      setInvalidFields(
        invalidFields.filter((field) => field !== "featureset_name")
      );
    }
    if (name === "featureset_users") {
      setInvalidFields(
        invalidFields.filter((field) => field !== "featureset_users")
      );
    }
  };

  const handleDetails = (e) => {
    const { name, value } = e.target;
    setFeaturesetData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  //validate form function

  function validateForm(data, values) {
    const requiredFields = [
      "mode",
      "CASMode",
      "activationSpeed",
      "alarmThreshold",
      "brakeThreshold",
      "brakeSpeed",
      "detectStationaryObject",
      "allowCompleteBrake",
      "detectOncomingObstacle",
      "safetyMode",
      "ttcThreshold",
      "brakeOnDuration",
      "brakeOffDuration",
      "start_time",
      "stop_time",
      "brk_bypas_typ",
      "brk_type",
      "brk_bypas_dur",
      // // sleep alert
      "sleepAlertMode",
      "preWarning",
      "sleepAlertInterval",
      "sa_activationSpeed",
      "startTime",
      "stopTime",
      "brakeActivateTime",
      "braking",
      //Driver Evaluation
      "driverEvalMode",
      "maxLaneChangeThreshold",
      "minLaneChangeThreshold",
      "maxHarshAccelerationThreshold",
      "minHarshAccelerationThreshold",
      "suddenBrakingThreshold",
      "maxSpeedBumpThreshold",
      "minSpeedBumpThreshold",
      //speed Governer
      "GovernerMode",
      "speedLimit",
      //Cruize
      "cruiseMode",
      "cruiseactivationSpeed",
      "vehicleType",
      //OBD
      "obdMode",
      "protocolType",
      //TPMS
      "tpmsMode",
      //Vehicle settings
      "acceleratorType",
      //SENSOR
      "lazerMode",
      "rfSensorMode",
      "rfAngle",
      "rdr_act_spd",
      "rdr_type",
      "Sensor_res1",
      "Sensor_res2",
      //speed settings
      "speedSource",
      "slope",
      "offset",
      "spdSet_spd",
      //shutdown delay
      "delay",
      //RF name
      "rfNameMode",
      //Time based errors
      "noAlarm",
      "speed",
      "accelerationBypass",
      "tim_err_tpms",
      //spd based errors
      "rfSensorAbsent",
      "gyroscopeAbsent",
      "hmiAbsent",
      "spd_rtc",
      "brk_cyl",
      "tpmsError",
      "obdAbsent",
      "spd_err_fuel",
      "spd_err_ldr",
      "rfidAbsent",
      "iotAbsent",
      "spd_err_load",
      "SBE_dd",
      "SBE_alcohol",
      "SBE_temp",
      //Firmware OTA
      "firmwareOtaUpdate",
      "firewarereserver1",
      "firewarereserver2",
      //Alcohol Detection
      "alcoholDetectionMode",
      "alcoholinterval",
      "alcoholact_spd",
      "alcoholstart_time",
      "alcoholstop_time",
      "alcoholmode",
      //Driver Drowsiness
      "driverDrowsinessMode",
      "dd_act_spd",
      "dd_acc_cut",
      "dd_strt_tim",
      "dd_stop_tim",
      "dd_res1",
      //temperature
      "temp_sts",
      "temp_thrsh",
      "temp_res1",
      //Load Sensor
      "load_sts",
      "load_max_cap",
      "load_acc",
      //Fuel
      "fuelMode",
      "fuel_tnk_cap",
      "fuel_intvl1",
      "fuel_intvl2",
      "fuel_acc",
      "fuel_thrsh",
    ];
    const invalidFieldsArray = [];

    for (const field of requiredFields) {
      if (!values[field]) {
        invalidFieldsArray.push(field);
      }
    }

    if (!data.featureset_name) {
      invalidFieldsArray.push("featureset_name");
    }
    if (!customers.length) {
      invalidFieldsArray.push("featureset_users");
    }

    if (values.activationSpeed < 0 || values.activationSpeed > 150) {
      invalidFieldsArray.push("activationSpeed");
    }

    if (values.alarmThreshold < 0 || values.alarmThreshold > 10) {
      invalidFieldsArray.push("alarmThreshold");
    }

    if (values.brakeThreshold < 0 || values.brakeThreshold > 10) {
      invalidFieldsArray.push("brakeThreshold");
    }

    if (values.brakeSpeed < 0 || values.brakeSpeed >= 150) {
      invalidFieldsArray.push("brakeSpeed");
    }
    if (values.ttcThreshold < 0 || values.ttcThreshold > 99.99) {
      invalidFieldsArray.push("ttcThreshold");
    }
    if (values.brakeOnDuration < 0 || values.brakeOnDuration > 9999.99) {
      invalidFieldsArray.push("brakeOnDuration");
    }
    if (values.brakeOffDuration < 0 || values.brakeOffDuration > 9999.99) {
      invalidFieldsArray.push("brakeOffDuration");
    }
    if (values.start_time < 0 || values.start_time > 24) {
      invalidFieldsArray.push("start_time");
    }
    if (values.stop_time < 0 || values.stop_time > 24) {
      invalidFieldsArray.push("stop_time");
    }
    if (values.brk_bypas_dur < 0 || values.brk_bypas_dur > 30) {
      invalidFieldsArray.push("brk_bypas_dur");
    }
    //sleep alert
    if (values.preWarning < 0 || values.preWarning > 50) {
      invalidFieldsArray.push("preWarning");
    }
    if (values.sleepAlertInterval < 0 || values.sleepAlertInterval > 999) {
      invalidFieldsArray.push("sleepAlertInterval");
    }
    if (values.sa_activationSpeed < 0 || values.sa_activationSpeed > 150) {
      invalidFieldsArray.push("sa_activationSpeed");
    }
    if (values.startTime < 0 || values.startTime > 24) {
      invalidFieldsArray.push("startTime");
    }
    if (values.stopTime < 0 || values.stopTime > 24) {
      invalidFieldsArray.push("stopTime");
    }
    if (values.brakeActivateTime < 0 || values.brakeActivateTime > 50) {
      invalidFieldsArray.push("brakeActivateTime");
    }

    //Driver Eval

    if (
      values.maxLaneChangeThreshold < -99 ||
      values.maxLaneChangeThreshold > 99
    ) {
      invalidFieldsArray.push("maxLaneChangeThreshold");
    }
    if (
      values.minLaneChangeThreshold < -99 ||
      values.minLaneChangeThreshold > 99
    ) {
      invalidFieldsArray.push("minLaneChangeThreshold");
    }
    if (
      values.maxHarshAccelerationThreshold < -99 ||
      values.maxHarshAccelerationThreshold > 99
    ) {
      invalidFieldsArray.push("maxHarshAccelerationThreshold");
    }
    if (
      values.minHarshAccelerationThreshold < -99 ||
      values.minHarshAccelerationThreshold > 99
    ) {
      invalidFieldsArray.push("minHarshAccelerationThreshold");
    }
    if (
      values.suddenBrakingThreshold < -99 ||
      values.suddenBrakingThreshold > 99
    ) {
      invalidFieldsArray.push("suddenBrakingThreshold");
    }
    if (
      values.maxSpeedBumpThreshold < -99 ||
      values.maxSpeedBumpThreshold > 99
    ) {
      invalidFieldsArray.push("maxSpeedBumpThreshold");
    }
    if (
      values.minSpeedBumpThreshold < -99 ||
      values.minSpeedBumpThreshold > 99
    ) {
      invalidFieldsArray.push("minSpeedBumpThreshold");
    }
    //speed governer
    if (values.speedLimit < 0 || values.speedLimit > 200) {
      invalidFieldsArray.push("speedLimit");
    }
    //cruize
    if (
      values.cruiseactivationSpeed < 0 ||
      values.cruiseactivationSpeed > 150
    ) {
      invalidFieldsArray.push("cruiseactivationSpeed");
    }
    //sensor
    if (values.rfAngle < 0 || values.rfAngle > 360) {
      invalidFieldsArray.push("rfAngle");
    }
    if (values.rdr_act_spd < 0 || values.rdr_act_spd > 150) {
      invalidFieldsArray.push("rdr_act_spd");
    }
    //speed settings
    if (values.slope < -200 || values.slope > 200) {
      invalidFieldsArray.push("slope");
    }
    if (values.offset < -200 || values.offset > 200) {
      invalidFieldsArray.push("offset");
    }
    if (values.spdSet_spd < 0 || values.spdSet_spd > 255) {
      invalidFieldsArray.push("spdSet_spd");
    }
    //shutdowndelay
    if (values.delay < -200 || values.delay > 200) {
      invalidFieldsArray.push("delay");
    }
    //Time based errors
    if (values.noAlarm < 0 || values.noAlarm > 60) {
      invalidFieldsArray.push("noAlarm");
    }
    if (values.speed < 0 || values.speed > 60) {
      invalidFieldsArray.push("speed");
    }
    if (values.accelerationBypass < 0 || values.accelerationBypass > 60) {
      invalidFieldsArray.push("accelerationBypass");
    }
    if (values.tim_err_tpms < 0 || values.tim_err_tpms > 200) {
      invalidFieldsArray.push("tim_err_tpms");
    }

    //speed based errors

    if (values.rfSensorAbsent < 0 || values.rfSensorAbsent > 200) {
      invalidFieldsArray.push("rfSensorAbsent");
    }
    if (values.gyroscopeAbsent < 0 || values.gyroscopeAbsent > 200) {
      invalidFieldsArray.push("gyroscopeAbsent");
    }
    if (values.hmiAbsent < 0 || values.hmiAbsent > 200) {
      invalidFieldsArray.push("hmiAbsent");
    }
    if (values.spd_rtc < 0 || values.spd_rtc > 200) {
      invalidFieldsArray.push("spd_rtc");
    }
    if (values.brk_cyl < 0 || values.brk_cyl > 200) {
      invalidFieldsArray.push("brk_cyl");
    }
    if (values.tpmsError < 0 || values.tpmsError > 200) {
      invalidFieldsArray.push("tpmsError");
    }
    if (values.obdAbsent < 0 || values.obdAbsent > 200) {
      invalidFieldsArray.push("obdAbsent");
    }
    if (values.spd_err_fuel < 0 || values.spd_err_fuel > 200) {
      invalidFieldsArray.push("spd_err_fuel");
    }
    if (values.spd_err_ldr < 0 || values.spd_err_ldr > 200) {
      invalidFieldsArray.push("spd_err_ldr");
    }
    if (values.rfidAbsent < 0 || values.rfidAbsent > 200) {
      invalidFieldsArray.push("rfidAbsent");
    }
    if (values.iotAbsent < 0 || values.iotAbsent > 200) {
      invalidFieldsArray.push("iotAbsent");
    }
    if (values.spd_err_load < 0 || values.spd_err_load > 200) {
      invalidFieldsArray.push("spd_err_load");
    }
    if (values.SBE_dd < 0 || values.SBE_dd > 200) {
      invalidFieldsArray.push("SBE_dd");
    }
    if (values.SBE_alcohol < 0 || values.SBE_alcohol > 200) {
      invalidFieldsArray.push("SBE_alcohol");
    }
    if (values.SBE_temp < 0 || values.SBE_temp > 200) {
      invalidFieldsArray.push("SBE_temp");
    }

    //alcohol detection
    if (values.alcoholinterval < 0 || values.alcoholinterval > 1440) {
      invalidFieldsArray.push("alcoholinterval");
    }
    if (values.alcoholact_spd < 0 || values.alcoholact_spd > 150) {
      invalidFieldsArray.push("alcoholact_spd");
    }
    if (values.alcoholstart_time < 0 || values.alcoholstart_time > 24) {
      invalidFieldsArray.push("alcoholstart_time");
    }
    if (values.alcoholstop_time < 0 || values.alcoholstop_time > 24) {
      invalidFieldsArray.push("alcoholstop_time");
    }

    //Driver Drowsiness

    if (values.dd_act_spd < 0 || values.dd_act_spd > 150) {
      invalidFieldsArray.push("dd_act_spd");
    }
    if (values.dd_strt_tim < 0 || values.dd_strt_tim > 24) {
      invalidFieldsArray.push("dd_strt_tim");
    }
    if (values.dd_stop_tim < 0 || values.dd_stop_tim > 24) {
      invalidFieldsArray.push("dd_stop_tim");
    }

    //load Sensor

    if (values.load_max_cap < 0 || values.load_max_cap > 100) {
      invalidFieldsArray.push("load_max_cap");
    }

    //Fuel Sensor

    if (values.fuel_tnk_cap < 0 || values.fuel_tnk_cap > 500) {
      invalidFieldsArray.push("fuel_tnk_cap");
    }

    if (values.fuel_thrsh < 0 || values.fuel_thrsh > 100) {
      invalidFieldsArray.push("fuel_thrsh");
    }

    return invalidFieldsArray;
  }

  //making api call to update FS
  const handleSubmit = (e) => {
    e.preventDefault();

    const invalidFieldsArray = validateForm(featuresetDetails, featuresetData);

    setInvalidFields(invalidFieldsArray);

    // If there are invalid fields, show a toast and return
    if (invalidFieldsArray.length > 0) {
      toastRef.current.show({
        severity: "error",
        summary: "Error",
        detail: "Please fill in all required fields.",
        life: 3000,
      });
      return;
    }
    const editData = {
      user_uuid,
      featureset_name: featuresetDetails.featureset_name,
      featureset_users: customers,
      featuerset_version: featuresetDetails.featuerset_version || 1,
      featureset_data: featuresetData,
      featureset_status: featuresetDetails.featureset_status,
    };

    axios
      .put(
        `${process.env.REACT_APP_API_URL}/featuresets/edit-featureset/${featuresetDetails.featureset_uuid}`,
        editData,
        {
          headers: { authorization: `bearer ${token}` },
        }
      )
      .then((res) => {
        updateFunc();

        if (onSuccess) {
          onSuccess(editData.featureset_name);
        }
      })
      .catch((err) => {
        console.log({ error: err });
      });
  };

  //dropdown options

  //CAS

  const SafetyModeoptions = [
    { label: "Relaxed", value: "0" },
    { label: "Normal", value: "1" },
    { label: "Strict", value: "2" },
  ];

  const StationaryObjectoptions = [
    { label: "Yes", value: "1" },
    { label: "No", value: "0" },
  ];

  const CompleteBrakeoptions = [
    { label: "Yes", value: "1" },
    { label: "No", value: "0" },
  ];

  const OncomingObstacleptions = [
    { label: "Yes", value: "1" },
    { label: "No", value: "0" },
  ];

  const brkBypassType = [
    { label: "Accelerator Based", value: "0" },
    { label: "Steering Based", value: "1" },
    { label: "Both", value: "2" },
    { label: "Disable", value: "3" },
  ];

  const BrakingOptions = [
    {
      label: "PWM Braking",
      value: "0",
    },
    {
      label: "Non PWM",
      value: "1",
    },
    {
      label: "Actuator",
      value: "2",
    },
  ];

  //Sleep alert

  const Braking = [
    { label: "Enable", value: "1" },
    { label: "Disable", value: "0" },
  ];

  //Cruise

  const VehicleTypeoptions = [
    { label: "12V Pedal", value: "1" },
    { label: "24V Pedal", value: "2" },
    { label: "Truck", value: "3" },
    { label: "Car", value: "4" },
  ];

  //obd
  const ProtocolTypeoptions = [
    { label: "SAEJ1939", value: "0" },
    {
      label: "ISO_15765_4",
      value: "1",
    },
  ];

  //vehicle settings

  const AcceleratorTypeoptions = [
    {
      label: "Sensor",
      value: "1",
    },
    {
      label: "Cylinder",
      value: "2",
    },
    {
      label: "Solenoid",
      value: "3",
    },
  ];

  //Sensors

  const radarOptions = [
    { label: "Radar 1", value: "1" },
    { label: "Radar 2", value: "2" },
    { label: "Radar 3", value: "3" },
  ];

  const SpeedSourceoptions = [
    { label: "Speed Wire", value: "1" },
    { label: "OBD", value: "2" },
    { label: "GPS", value: "3" },
    { label: "Constant", value: "4" },
  ];

  const loadOptions = [
    { label: "Enable", value: "1" },
    { label: "Disable", value: "0" },
  ];

  const DDACCoptions = [
    { label: "Enable", value: "1" },
    { label: "Disable", value: "0" },
  ];

  const FuelACCoptions = [
    { label: "Enable", value: "1" },
    { label: "Disable", value: "0" },
  ];

  const activeOption = [
    { label: "Active", value: 1 },
    { label: "Deactive", value: 0 },
  ];

  //fetching customers
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/customers/get-all-customer`, {
        headers: { authorization: `bearer ${token}` },
      })
      .then((res) => {
        setListCustomers(res.data.customerData);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [token]);

  const Customersoptions = () => {
    return listCustomers?.map((el) => ({
      key: el.user_uuid,
      label: el.first_name + " " + el.last_name,
      value: {
        user_uuid: el.user_uuid,
      },
    }));
  };

  useEffect(() => {
    let k = listCustomers?.filter((el) => {
      return el.user_uuid.includes(customers[0]?.user_uuid);
    });

    if (k?.length > 0) {
      setSelectedValue(k[0].first_name + " " + k[0].last_name);
    }
  }, [listCustomers, customers]);

  const handleSelectCustomer = (e) => {
    const { value } = e.target;
    setCustomers([
      {
        user_uuid: value.user_uuid,
      },
    ]);
    setInvalidFields(
      invalidFields.filter((field) => field !== "featureset_users")
    );
  };

  //edit dialog
  return (
    <>
      <Toast ref={toastRef} className="toast-custom" position="top-right" />

      <form onSubmit={handleSubmit}>
        <div className="card">
          <div className="mt-2 flex" style={{ flexDirection: "column" }}>
            <label htmlFor="username" className="font-bold">
              Feature Set Name
            </label>
            <InputText
              id="username"
              style={{
                borderRadius: "5px",
              }}
              name="featureset_name"
              className={`border py-2 pl-2 ${
                invalidFields.includes("featureset_name")
                  ? "border-red-600"
                  : ""
              }`}
              onChange={handleChange}
              defaultValue={featuresetDetails?.featureset_name || ""}
            />
          </div>
          <div className="mt-2 flex" style={{ flexDirection: "column" }}>
            <label htmlFor="username" className="font-bold">
              Featureset Version
            </label>
            <InputText
              id="featuerset_version"
              type="number"
              style={{
                borderRadius: "5px",
              }}
              name="featuerset_version"
              onChange={handleChange}
              placeholder="Featureset Version"
              value={featuresetDetails?.featureset_version || ""}
              className="border py-2 pl-2"
            />
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="ecu">Select Customer</label>
            <Dropdown
              name="featureset_users"
              onChange={handleSelectCustomer}
              id="featureset_users"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              options={Customersoptions()}
              optionLabel="label"
              optionValue="value"
              placeholder={selectedValue ? selectedValue : "Tap to Select"}
              className={`md:w-14rem mt-2 w-full border ${
                invalidFields.includes("featureset_users")
                  ? "border-red-600"
                  : ""
              }`}
              value={featuresetDetails?.featureset_users || selectedValue}
            />
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="active" className="font-bold">
              Select Status
            </label>
            <Dropdown
              name="featureset_status"
              id="active"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              onChange={handleChange}
              options={activeOption}
              optionLabel="label"
              className="md:w-14rem mt-2 w-full border"
              value={featuresetDetails?.featureset_status || 1}
            />
          </div>
          <p className="mt-4 font-bold ">System Type</p>
          {invalidFields.includes("mode") && (
            <span className="p-error">Please select any option.</span>
          )}
          <div className="my-3 flex flex-wrap gap-3">
            <div className="align-items-center flex">
              <input
                type="radio"
                name="mode"
                onChange={handleDetails}
                value={1}
                checked={featuresetData?.mode === "1"}
              />
              <label htmlFor="ingredient2" className="ml-2">
                Online Mode
              </label>
            </div>
            <div className="align-items-center flex">
              <input
                type="radio"
                name="mode"
                onChange={handleDetails}
                value={0}
                checked={featuresetData?.mode === "0"}
              />
              <label htmlFor="ingredient1" className="ml-2">
                Offline Mode
              </label>
            </div>
          </div>
        </div>
        <hr style={{ borderColor: "#333" }} />
        <p className="mt-4 font-bold ">Collision Avoidance System</p>
        {invalidFields.includes("CASMode") && (
          <span className="p-error">Please select any option.</span>
        )}
        <div className="card justify-content-center mb-3 mt-2 flex gap-4">
          <div className="align-items-center flex">
            <input
              type="radio"
              name="CASMode"
              value={1}
              checked={featuresetData?.CASMode === "1"}
              onChange={handleDetails}
            />
            <label htmlFor="ingredient2" className="ml-2">
              Enable
            </label>
          </div>
          <div className="align-items-center flex">
            <input
              type="radio"
              name="CASMode"
              value={0}
              checked={featuresetData?.CASMode === "0"}
              onChange={handleDetails}
            />
            <label htmlFor="ingredient1" className="ml-2">
              Disable
            </label>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="activationSpeed">Activation Speed</label>
            <InputText
              type="number"
              id="activationSpeed"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("activationSpeed")
                  ? "border-red-600"
                  : ""
              }`}
              placeholder="Enter a value"
              value={featuresetData?.activationSpeed || ""}
              name="activationSpeed"
              onChange={handleDetails}
              autoComplete="off"
              disabled={featuresetData.CASMode === "0"}
            />
            {invalidFields.includes("activationSpeed") && (
              <small className="text-red-600">
                Activation speed should be greater than 0 and less than 150
              </small>
            )}
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="alarmThreshold">Alarm Threshold</label>
            <InputText
              type="number"
              id="alarmThreshold"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              placeholder="Enter a value"
              value={featuresetData?.alarmThreshold || ""}
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("alarmThreshold") ? "border-red-600" : ""
              }`}
              name="alarmThreshold"
              onChange={handleDetails}
              autoComplete="off"
              disabled={featuresetData.CASMode === "0"}
            />
            {invalidFields.includes("alarmThreshold") && (
              <small className="text-red-600">
                Alarm threshold should be greater than 0 and less than 10
              </small>
            )}
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="brakeThreshold">Brake Threshold</label>
            <InputText
              type="number"
              id="brakeThreshold"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              placeholder="Enter a value"
              value={featuresetData?.brakeThreshold || ""}
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("brakeThreshold") ? "border-red-600" : ""
              }`}
              name="brakeThreshold"
              onChange={handleDetails}
              autoComplete="off"
              disabled={featuresetData.CASMode === "0"}
            />
            {invalidFields.includes("brakeThreshold") && (
              <small className="text-red-600">
                Brake threshold should be greater than 0 and less than 10
              </small>
            )}
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="brake_speed">Brake Speed</label>
            <InputText
              type="number"
              id="brake_speed"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              placeholder="Enter a value"
              value={featuresetData?.brakeSpeed || ""}
              name="brakeSpeed"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("brakeSpeed") ? "border-red-600" : ""
              }`}
              onChange={handleDetails}
              autoComplete="off"
              disabled={featuresetData.CASMode === "0"}
            />
            {invalidFields.includes("brakeSpeed") && (
              <small className="text-red-600">
                Brake Speed should be greater than 0 and less than 150
              </small>
            )}
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[63vw]">
            <label htmlFor="detectStationaryObject">
              Detect Stationary Object
            </label>
            <Dropdown
              id="detectStationaryObject"
              options={StationaryObjectoptions}
              optionLabel="label"
              optionValue="value"
              placeholder={
                featuresetData.detectStationaryObject
                  ? `Selected: ${featuresetData.detectStationaryObject}`
                  : "Select an option"
              }
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="detectStationaryObject"
              onChange={handleDetails}
              value={featuresetData.detectStationaryObject || null}
              className={`md:w-14rem  $dark:bg-gray-900 mt-2 w-full border ${
                invalidFields.includes("detectStationaryObject")
                  ? "border-red-600"
                  : ""
              }`}
              disabled={featuresetData.CASMode === "0"}
            />
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="allowCompleteBrake">Allow Complete Brake</label>
            <Dropdown
              name="allowCompleteBrake"
              onChange={handleDetails}
              id="allowCompleteBrake"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              options={CompleteBrakeoptions}
              placeholder={
                featuresetData.allowCompleteBrake
                  ? featuresetData.allowCompleteBrake
                  : "Select an option"
              }
              value={featuresetData.allowCompleteBrake || null}
              optionLabel="label"
              optionValue="value"
              className={`md:w-14rem $dark:bg-gray-900 mt-2 w-full border ${
                invalidFields.includes("allowCompleteBrake")
                  ? "border-red-600"
                  : ""
              }`}
              disabled={featuresetData.CASMode === "0"}
            />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[63vw]">
            <label htmlFor="detectOncomingObstacle">
              Detect Oncoming Obstacle
            </label>
            <Dropdown
              name="detectOncomingObstacle"
              id="detectOncomingObstacle"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              options={OncomingObstacleptions}
              value={featuresetData?.detectOncomingObstacle || null}
              placeholder={
                featuresetData.detectOncomingObstacles
                  ? featuresetData.detectOncomingObstacles
                  : "Select an option"
              }
              optionLabel="label"
              optionValue="value"
              onChange={handleDetails}
              className={`md:w-14rem $dark:bg-gray-900 mt-2 w-full border ${
                invalidFields.includes("detectOncomingObstacle")
                  ? "border-red-600"
                  : ""
              }`}
              disabled={featuresetData.CASMode === "0"}
            />
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="safetyMode">Safety Mode</label>
            <Dropdown
              name="safetyMode"
              id="safetyMode"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              options={SafetyModeoptions}
              value={featuresetData?.safetyMode || null}
              placeholder={
                featuresetData.safetyMode
                  ? featuresetData.safetyMode
                  : "Select an option"
              }
              onChange={handleDetails}
              optionLabel="label"
              optionValue="value"
              className={`md:w-14rem $dark:bg-gray-900 mt-2 w-full border ${
                invalidFields.includes("safetyMode") ? "border-red-600" : ""
              }`}
              disabled={featuresetData.CASMode === "0"}
            />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="ttcThreshold">TTC Threshold</label>
            <InputText
              type="number"
              id="ttcThreshold"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              placeholder="Enter a value"
              value={featuresetData?.ttcThreshold || ""}
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("ttcThreshold") ? "border-red-600" : ""
              }`}
              name="ttcThreshold"
              onChange={handleDetails}
              autoComplete="off"
              disabled={featuresetData.CASMode === "0"}
            />
            {invalidFields.includes("ttcThreshold") && (
              <small className="text-red-600">
                TTCThreshold should be greater than 0 and less than 99.99
              </small>
            )}
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="brakeOnDuration">Brake ON Duration</label>
            <InputText
              type="number"
              id="brakeOnDuration"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="brakeOnDuration"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("brakeOnDuration")
                  ? "border-red-600"
                  : ""
              }`}
              onChange={handleDetails}
              placeholder="Enter a value"
              value={featuresetData?.brakeOnDuration || ""}
              autoComplete="off"
              disabled={featuresetData.CASMode === "0"}
            />
            {invalidFields.includes("brakeOnDuration") && (
              <small className="text-red-600">
                Brake on duration should be greater than 0 and less than 9999.99
              </small>
            )}
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="brakeOffDuration">Brake OFF Duration</label>
            <InputText
              type="number"
              id="brakeOffDuration"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="brakeOffDuration"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("brakeOffDuration")
                  ? "border-red-600"
                  : ""
              }`}
              onChange={handleDetails}
              placeholder="Enter a value"
              value={featuresetData?.brakeOffDuration || ""}
              autoComplete="off"
              disabled={featuresetData.CASMode === "0"}
            />
            {invalidFields.includes("brakeOffDuration") && (
              <small className="text-red-600">
                Brake off duration should be greater than 0 and less than
                9999.99
              </small>
            )}
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="start_time">Start Time</label>
            <InputText
              type="number"
              id="start_time"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="start_time"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("start_time") ? "border-red-600" : ""
              }`}
              onChange={handleDetails}
              placeholder="Enter a value"
              value={featuresetData?.start_time || ""}
              autoComplete="off"
              disabled={featuresetData.CASMode === "0"}
            />
            {invalidFields.includes("start_time") && (
              <small className="text-red-600">
                Start time should be greater than 0 hour and less than 24 hours
              </small>
            )}
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="stop_time">Stop Time</label>
            <InputText
              type="number"
              id="stop_time"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="stop_time"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("stop_time") ? "border-red-600" : ""
              }`}
              onChange={handleDetails}
              placeholder="Enter a value"
              value={featuresetData?.stop_time || ""}
              autoComplete="off"
              disabled={featuresetData.CASMode === "0"}
            />
            {invalidFields.includes("stop_time") && (
              <small className="text-red-600">
                Stop time should be greater than 0 hour and less than 24 hours
              </small>
            )}
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="brk_bypas_typ">Brake Bypass type</label>
            <Dropdown
              name="brk_bypas_typ"
              id="brk_bypas_typ"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              options={brkBypassType}
              value={featuresetData.brk_bypas_typ || "1"}
              placeholder="Select an option"
              onChange={handleDetails}
              optionLabel="label"
              optionValue="value"
              className={`md:w-14rem h-11 w-full border dark:bg-gray-900 ${
                invalidFields.includes("brk_bypas_typ") ? "border-red-600" : ""
              }`}
              disabled={featuresetData.CASMode === "0"}
            />
          </div>
        </div>

        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="brk_type">Brake type</label>
            <Dropdown
              name="brk_type"
              id="brk_type"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              options={BrakingOptions}
              value={featuresetData.brk_type || "1"}
              placeholder="Select an option"
              onChange={handleDetails}
              optionLabel="label"
              optionValue="value"
              className={`md:w-14rem h-11 w-full border dark:bg-gray-900 ${
                invalidFields.includes("brk_type") ? "border-red-600" : ""
              }`}
              disabled={featuresetData.CASMode === "0"}
            />
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="brk_bypas_dur">Brake Bypass Duration</label>
            <InputText
              type="number"
              id="brk_bypas_dur"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="brk_bypas_dur"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("brk_bypas_dur") ? "border-red-600" : ""
              }`}
              onChange={handleDetails}
              placeholder="Enter a value"
              autoComplete="off"
              disabled={featuresetData.CASMode === "0"}
              value={featuresetData.brk_bypas_dur}
            />
            {invalidFields.includes("brk_bypas_dur") && (
              <small className="text-red-600">
                Brake Bypass should be greater than 0 sec and less than 30 sec
              </small>
            )}
          </div>
        </div>

        <hr style={{ borderColor: "#333" }} />
        <p className="mt-4 font-bold ">Sleep Alert</p>
        {invalidFields.includes("sleepAlertMode") && (
          <span className="p-error">Please select any option.</span>
        )}
        <div className="mb-3 mt-2 flex flex-wrap gap-3">
          <div className="align-items-center flex">
            <input
              type="radio"
              id="op2"
              name="sleepAlertMode"
              onChange={handleDetails}
              value={1}
              checked={featuresetData.sleepAlertMode === "1"}
            />
            <label htmlFor="op2" className="ml-2">
              Enable
            </label>
          </div>
          <div className="align-items-center flex">
            <input
              type="radio"
              id="op1"
              name="sleepAlertMode"
              onChange={handleDetails}
              value={0}
              checked={featuresetData.sleepAlertMode === "0"}
            />
            <label htmlFor="op1" className="ml-2">
              Disable
            </label>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="preWarning">Pre Warning</label>
            <InputText
              type="number"
              id="preWarning"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              placeholder="Enter a value"
              value={featuresetData?.preWarning || ""}
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("preWarning") ? "border-red-600" : ""
              }`}
              name="preWarning"
              onChange={handleDetails}
              autoComplete="off"
              disabled={featuresetData.sleepAlertMode === "0"}
            />
            {invalidFields.includes("preWarning") && (
              <small className="text-red-600">
                Prewarning should be greater than 0 hour and less than 24 hours
              </small>
            )}
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="sleepAlertInterval">Sleep Alert Interval</label>
            <InputText
              type="number"
              id="sleepAlertInterval"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="sleepAlertInterval"
              className={`border  py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("sleepAlertInterval")
                  ? "border-red-600"
                  : ""
              }`}
              onChange={handleDetails}
              placeholder="Enter a value"
              value={featuresetData?.sleepAlertInterval || ""}
              autoComplete="off"
              disabled={featuresetData.sleepAlertMode === "0"}
            />
            {invalidFields.includes("sleepAlertInterval") && (
              <small className="text-red-600">
                Sleep alert interval should be greater than 0 and less than 999
              </small>
            )}
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="sa_activationSpeed">Activation Speed</label>
            <InputText
              type="number"
              id="sa_activationSpeed"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="sa_activationSpeed"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("sa_activationSpeed")
                  ? "border-red-600"
                  : ""
              }`}
              onChange={handleDetails}
              placeholder="Enter a value"
              value={featuresetData?.sa_activationSpeed || ""}
              autoComplete="off"
              disabled={featuresetData.sleepAlertMode === "0"}
            />
            {invalidFields.includes("sa_activationSpeed") && (
              <small className="text-red-600">
                Activation speed interval should be greater than 0 and less than
                150
              </small>
            )}
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="startTime">Start Time</label>
            <InputText
              type="number"
              id="startTime"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="startTime"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("startTime") ? "border-red-600" : ""
              }`}
              onChange={handleDetails}
              placeholder="Enter a value"
              value={featuresetData?.startTime || ""}
              autoComplete="off"
              disabled={featuresetData.sleepAlertMode === "0"}
            />
            {invalidFields.includes("startTime") && (
              <small className="text-red-600">
                Stop time should be greater than 0 and less than 24
              </small>
            )}
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="stopTime">Stop Time</label>
            <InputText
              type="number"
              id="stopTime"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="stopTime"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("stopTime") ? "border-red-600" : ""
              }`}
              onChange={handleDetails}
              placeholder="Enter a value"
              value={featuresetData?.stopTime || ""}
              autoComplete="off"
              disabled={featuresetData.sleepAlertMode === "0"}
            />
            {invalidFields.includes("stopTime") && (
              <small className="text-red-600">
                Stop time should be greater than 0 and less than 24
              </small>
            )}
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="brakeActivateTime">Brake Activate Time</label>
            <InputText
              type="number"
              id="brakeActivateTime"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="brakeActivateTime"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("brakeActivateTime")
                  ? "border-red-600"
                  : ""
              }`}
              onChange={handleDetails}
              placeholder="Enter a value"
              value={featuresetData?.brakeActivateTime || ""}
              autoComplete="off"
              disabled={featuresetData.sleepAlertMode === "0"}
            />
            {invalidFields.includes("brakeActivateTime") && (
              <small className="text-red-600">
                Brake activation time should be greater than 0 and less than 50
              </small>
            )}
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="braking">Braking</label>
            <Dropdown
              name="braking"
              value={featuresetData?.braking || null}
              onChange={handleDetails}
              id="braking"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              options={Braking}
              placeholder={
                featuresetData.braking
                  ? featuresetData.braking
                  : "Select an option"
              }
              optionLabel="label"
              optionValue="value"
              className={`md:w-14rem $dark:bg-gray-900 mt-2 w-full border ${
                invalidFields.includes("braking") ? "border-red-600" : ""
              }`}
              disabled={featuresetData.sleepAlertMode === "0"}
            />
          </div>
        </div>
        <hr style={{ borderColor: "#333" }} />
        <p className="mt-4 font-bold ">Driver Evaluation</p>
        {invalidFields.includes("driverEvalMode") && (
          <span className="p-error">Please select any option.</span>
        )}
        <div className="mb-3 mt-2 flex flex-wrap gap-3">
          <div className="align-items-center flex">
            <input
              type="radio"
              id="driverEvalMode"
              name="driverEvalMode"
              value={1}
              checked={featuresetData?.driverEvalMode === "1"}
              onChange={handleDetails}
            />
            <label htmlFor="ingredient2" className="ml-2">
              Enable
            </label>
          </div>
          <div className="align-items-center flex">
            <input
              type="radio"
              id="ingredient1"
              name="driverEvalMode"
              value={0}
              checked={featuresetData?.driverEvalMode === "0"}
              onChange={handleDetails}
            />
            <label htmlFor="ingredient1" className="ml-2">
              Disable
            </label>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="maxLaneChangeThreshold">
              Max Lane Change Threshold
            </label>
            <InputText
              type="number"
              id="maxLaneChangeThreshold"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="maxLaneChangeThreshold"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("maxLaneChangeThreshold")
                  ? "border-red-600"
                  : ""
              }`}
              onChange={handleDetails}
              placeholder="Enter a value"
              value={featuresetData?.maxLaneChangeThreshold || ""}
              autoComplete="off"
              disabled={featuresetData.driverEvalMode === "0"}
            />
            {invalidFields.includes("maxLaneChangeThreshold") && (
              <small className="text-red-600">
                Max lane change threshold should be greater than -99 and less
                than 99
              </small>
            )}
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="minLaneChangeThreshold">
              Min Lane Change Threshold
            </label>
            <InputText
              type="number"
              id="minLaneChangeThreshold"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="minLaneChangeThreshold"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("minLaneChangeThreshold")
                  ? "border-red-600"
                  : ""
              }`}
              onChange={handleDetails}
              placeholder="Enter a value"
              value={featuresetData?.minLaneChangeThreshold || ""}
              autoComplete="off"
              disabled={featuresetData.driverEvalMode === "0"}
            />
            {invalidFields.includes("minLaneChangeThreshold") && (
              <small className="text-red-600">
                Min lane change threshold should be greater than -99 and less
                than 99
              </small>
            )}
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="maxHarshAccelerationThreshold">
              Max Harsh Acceleration Threshold
            </label>
            <InputText
              type="number"
              id="maxHarshAccelerationThreshold"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="maxHarshAccelerationThreshold"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("maxHarshAccelerationThreshold")
                  ? "border-red-600"
                  : ""
              }`}
              onChange={handleDetails}
              placeholder="Enter a value"
              value={featuresetData?.maxHarshAccelerationThreshold || ""}
              autoComplete="off"
              disabled={featuresetData.driverEvalMode === "0"}
            />
            {invalidFields.includes("maxHarshAccelerationThreshold") && (
              <small className="text-red-600">
                Max harsh acceleration should be greater than -99 and less than
                99
              </small>
            )}
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="minHarshAccelerationThreshold">
              Min Harsh Acceleration Threshold
            </label>
            <InputText
              type="number"
              id="minHarshAccelerationThreshold"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="minHarshAccelerationThreshold"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("minHarshAccelerationThreshold")
                  ? "border-red-600"
                  : ""
              }`}
              onChange={handleDetails}
              placeholder="Enter a value"
              value={featuresetData?.minHarshAccelerationThreshold || ""}
              autoComplete="off"
              disabled={featuresetData.driverEvalMode === "0"}
            />
            {invalidFields.includes("minHarshAccelerationThreshold") && (
              <small className="text-red-600">
                Min harsh acceleration should be greater than -99 and less than
                99
              </small>
            )}
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="suddenBrakingThreshold">
              Sudden Braking Threshold
            </label>
            <InputText
              type="number"
              id="suddenBrakingThreshold"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="suddenBrakingThreshold"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("suddenBrakingThreshold")
                  ? "p-invalid"
                  : ""
              }`}
              onChange={handleDetails}
              placeholder="Enter a value"
              value={featuresetData?.suddenBrakingThreshold || ""}
              autoComplete="off"
              disabled={featuresetData.driverEvalMode === "0"}
            />
            {invalidFields.includes("suddenBrakingThreshold") && (
              <small className="text-red-600">
                Sudden Braking threshold should be greater than -99 and less
                than 99
              </small>
            )}
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="maxSpeedBumpThreshold">
              Max Speed Bump Threshold
            </label>
            <InputText
              type="number"
              id="maxSpeedBumpThreshold"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="maxSpeedBumpThreshold"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("maxSpeedBumpThreshold")
                  ? "border-red-600"
                  : ""
              }`}
              onChange={handleDetails}
              placeholder="Enter a value"
              value={featuresetData?.maxSpeedBumpThreshold || ""}
              autoComplete="off"
              disabled={featuresetData.driverEvalMode === "0"}
            />
            {invalidFields.includes("maxSpeedBumpThreshold") && (
              <small className="text-red-600">
                Max speed bump should be greater than -99 and less than 99
              </small>
            )}
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="minSpeedBumpThreshold">
              Min Speed Bump Threshold
            </label>
            <InputText
              type="number"
              id="minSpeedBumpThreshold"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="minSpeedBumpThreshold"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("minSpeedBumpThreshold")
                  ? "border-red-600"
                  : ""
              }`}
              onChange={handleDetails}
              placeholder="Enter a value"
              value={featuresetData?.minSpeedBumpThreshold || ""}
              autoComplete="off"
              disabled={featuresetData.driverEvalMode === "0"}
            />
            {invalidFields.includes("minSpeedBumpThreshold") && (
              <small className="text-red-600">
                Min speed bump should be greater than -99 and less than 99
              </small>
            )}
          </div>
        </div>
        <hr style={{ borderColor: "#333" }} />
        <p className="mt-4 font-bold ">Speed Governor</p>
        {invalidFields.includes("GovernerMode") && (
          <span className="p-error">Please select any option.</span>
        )}
        <div className="mb-3 mt-2 flex flex-wrap gap-3">
          <div className="align-items-center flex">
            <input
              type="radio"
              id="GovernerMode"
              onChange={handleDetails}
              name="GovernerMode"
              value={1}
              checked={featuresetData.GovernerMode === "1"}
            />
            <label htmlFor="ingredient2" className="ml-2">
              Enable
            </label>
          </div>
          <div className="align-items-center flex">
            <input
              type="radio"
              id="GovernerMode"
              name="GovernerMode"
              value={0}
              checked={featuresetData?.GovernerMode === "0"}
              onChange={handleDetails}
            />
            <label htmlFor="off" className="ml-2">
              Disable
            </label>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="speedLimit">Speed Limit</label>
            <InputText
              type="number"
              id="speedLimit"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="speedLimit"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("speedLimit") ? "border-red-600" : ""
              }`}
              onChange={handleDetails}
              placeholder="Enter a value"
              value={featuresetData?.speedLimit || ""}
              autoComplete="off"
              disabled={featuresetData.GovernerMode === "0"}
            />
            {invalidFields.includes("speedLimit") && (
              <small className="text-red-600">
                Speed limit should be greater than 0 and less than 200
              </small>
            )}
          </div>
        </div>
        <hr style={{ borderColor: "#333" }} />
        <p className="mt-4 font-bold ">Cruise</p>
        {invalidFields.includes("cruiseMode") && (
          <span className="p-error">Please select any option.</span>
        )}
        <div className="mb-3 mt-2 flex flex-wrap gap-3">
          <div className="align-items-center flex">
            <input
              type="radio"
              id="cruiseMode"
              name="cruiseMode"
              value={1}
              onChange={handleDetails}
              checked={featuresetData?.cruiseMode === "1"}
            />
            <label htmlFor="mode2" className="ml-2">
              Enable
            </label>
          </div>
          <div className="align-items-center flex">
            <input
              type="radio"
              id="cruiseMode"
              onChange={handleDetails}
              name="cruiseMode"
              value={0}
              checked={featuresetData.cruiseMode === "0"}
            />
            <label htmlFor="mode1" className="ml-2">
              Disable
            </label>
          </div>
        </div>
        <div className="field my-3 w-[30vw]">
          <label htmlFor="cruiseactivationSpeed">Activation Speed</label>
          <InputText
            type="number"
            id="cruiseactivationSpeed"
            style={{
              width: "30vw",
              borderRadius: "5px",
            }}
            name="cruiseactivationSpeed"
            className={`border py-2 pl-2 dark:bg-gray-900 ${
              invalidFields.includes("cruiseactivationSpeed")
                ? "border-red-600"
                : ""
            }`}
            onChange={handleDetails}
            placeholder="Enter a value"
            value={featuresetData?.cruiseactivationSpeed || ""}
            autoComplete="off"
            disabled={featuresetData.cruiseMode === "0"}
          />
          {invalidFields.includes("cruiseactivationSpeed") && (
            <small className="text-red-600">
              Cruise activation speed should be greater than 0 and less than 150
            </small>
          )}
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="vehicleType">Vehicle Type</label>
            <Dropdown
              id="vehicleType"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="vehicleType"
              onChange={handleDetails}
              options={VehicleTypeoptions}
              value={featuresetData?.vehicleType || null}
              placeholder={
                featuresetData.vehicleType
                  ? featuresetData.vehicleType
                  : "Select an option"
              }
              optionLabel="label"
              optionValue="value"
              className={`md:w-14rem $dark:bg-gray-900 mt-2 w-full border ${
                invalidFields.includes("vehicleType") ? "border-red-600" : ""
              }`}
              disabled={featuresetData.cruiseMode === "0"}
            />
          </div>
        </div>
        <hr style={{ borderColor: "#333" }} />
        <p className="mt-4 font-bold ">OBD</p>
        {invalidFields.includes("obdMode") && (
          <span className="p-error">Please select any option.</span>
        )}
        <div className="mb-3 mt-2 flex flex-wrap gap-3">
          <div className="align-items-center flex">
            <input
              type="radio"
              id="enable"
              name="obdMode"
              value={1}
              checked={featuresetData?.obdMode === "1"}
              onChange={handleDetails}
            />
            <label htmlFor="enable" className="ml-2">
              Enable
            </label>
          </div>
          <div className="align-items-center flex">
            <input
              type="radio"
              id="disable"
              name="obdMode"
              value={0}
              checked={featuresetData?.obdMode === "0"}
              onChange={handleDetails}
            />
            <label htmlFor="disable" className="ml-2">
              Disable
            </label>
          </div>
        </div>

        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="protocolType">Protocol Type</label>
            <Dropdown
              id="protocolType"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="protocolType"
              onChange={handleDetails}
              options={ProtocolTypeoptions}
              value={featuresetData?.protocolType || null}
              optionLabel="label"
              optionValue="value"
              className={`md:w-14rem $dark:bg-gray-900 mt-2 w-full border ${
                invalidFields.includes("protocolType") ? "border-red-600" : ""
              }`}
              disabled={featuresetData.obdMode === "0"}
              placeholder={
                featuresetData.protocolType
                  ? featuresetData.protocolType
                  : "Select an option"
              }
            />
          </div>
        </div>
        <hr style={{ borderColor: "#333" }} />
        <p className="mt-4 font-bold ">TPMS</p>
        {invalidFields.includes("tpmsMode") && (
          <span className="p-error">Please select any option.</span>
        )}
        <div className="mb-3 mt-2 flex flex-wrap gap-3">
          <div className="align-items-center flex">
            <input
              type="radio"
              id="tpmsMode"
              name="tpmsMode"
              value={1}
              onChange={handleDetails}
              checked={featuresetData?.tpmsMode === "1"}
            />
            <label htmlFor="online" className="ml-2">
              Enable
            </label>
          </div>
          <div className="align-items-center flex">
            <input
              type="radio"
              name="tpmsMode"
              id="tpmsMode"
              value={0}
              checked={featuresetData?.tpmsMode === "0"}
              onChange={handleDetails}
            />
            <label htmlFor="offline" className="ml-2">
              Disable
            </label>
          </div>
        </div>
        <hr style={{ borderColor: "#333" }} />
        <p className="mt-4 font-bold ">Vehicle Settings</p>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="acceleratorType">Accelerator Type</label>
            <Dropdown
              id="acceleratorType"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              value={featuresetData?.acceleratorType || null}
              placeholder={
                featuresetData.acceleratorType
                  ? featuresetData.acceleratorType
                  : "Select an option"
              }
              optionLabel="label"
              optionValue="value"
              name="acceleratorType"
              onChange={handleDetails}
              options={AcceleratorTypeoptions}
              className={`md:w-14rem $dark:bg-gray-900 mt-2 w-full border ${
                invalidFields.includes("acceleratorType")
                  ? "border-red-600"
                  : ""
              }`}
            />
          </div>
        </div>

        <hr style={{ borderColor: "#333" }} />
        <p className="mt-4 font-bold ">Sensor</p>
        <p className="mt-4 font-bold ">Laser Sensor</p>
        {invalidFields.includes("lazerMode") && (
          <span className="p-error">Please select any option.</span>
        )}
        <div className="mb-3 mt-2 flex flex-wrap gap-3">
          <div className="align-items-center flex">
            <input
              type="radio"
              id="lazerMode"
              name="lazerMode"
              value={1}
              checked={featuresetData?.lazerMode === "1"}
              onChange={handleDetails}
            />
            <label htmlFor="lm_on" className="ml-2">
              Enable
            </label>
          </div>
          <div className="align-items-center flex">
            <input
              type="radio"
              id="lm_off"
              name="lazerMode"
              value={0}
              checked={featuresetData?.lazerMode === "0"}
              onChange={handleDetails}
            />
            <label htmlFor="lazerMode" className="ml-2">
              Disable
            </label>
          </div>
        </div>
        <p className="mt-4 font-bold ">RF Sensor</p>
        {invalidFields.includes("rfSensorMode") && (
          <span className="p-error">Please select any option.</span>
        )}
        <div className="mb-3 mt-2 flex flex-wrap gap-3">
          <div className="align-items-center flex">
            <input
              type="radio"
              id="rfSensorMode"
              name="rfSensorMode"
              value={1}
              checked={featuresetData?.rfSensorMode === "1"}
              onChange={handleDetails}
            />
            <label htmlFor="rfSensorMode" className="ml-2">
              Enable
            </label>
          </div>
          <div className="align-items-center flex">
            <input
              type="radio"
              id="rf_dis"
              name="rfSensorMode"
              value={0}
              checked={featuresetData?.rfSensorMode === "0"}
              onChange={handleDetails}
            />
            <label htmlFor="rfSensorMode" className="ml-2">
              Disable
            </label>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="rfAngle">RF Angle</label>
            <InputText
              type="number"
              id="rfAngle"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="rfAngle"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("rfAngle") ? "border-red-600" : ""
              }`}
              onChange={handleDetails}
              placeholder="Enter a value"
              value={featuresetData?.rfAngle || ""}
              autoComplete="off"
            />
            {invalidFields.includes("rfAngle") && (
              <small className="text-red-600">
                RFAngle should be greater than 0 and less than 360
              </small>
            )}
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="rdr_act_spd">Radar activation speed</label>
            <InputText
              type="number"
              id="rdr_act_spd"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="rdr_act_spd"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("rdr_act_spd") ? "border-red-600" : ""
              }`}
              onChange={handleDetails}
              placeholder="Enter a value"
              value={featuresetData?.rdr_act_spd || ""}
              autoComplete="off"
            />
            {invalidFields.includes("rdr_act_spd") && (
              <small className="text-red-600">
                Activation speed should be greater than 0 and less than 150
              </small>
            )}
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="rdr_type">Radar type</label>
            <Dropdown
              id="rdr_type"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="rdr_type"
              value={featuresetData?.rdr_type || null}
              placeholder={
                featuresetData.rdr_type
                  ? featuresetData.rdr_type
                  : "Enter a value"
              }
              options={radarOptions}
              optionLabel="label"
              optionValue="value"
              onChange={handleDetails}
              className={`md:w-14rem $dark:bg-gray-900 mt-2 w-full border ${
                invalidFields.includes("rdr_type") ? "border-red-600" : ""
              }`}
            />
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="Sensor_res1">Reserved 1</label>
            <InputText
              type="number"
              id="Sensor_res1"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="Sensor_res1"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("Sensor_res1") ? "border-red-600" : ""
              }`}
              onChange={handleDetails}
              placeholder="Enter a value"
              value={featuresetData?.Sensor_res1 || ""}
              autoComplete="off"
            />
          </div>
        </div>

        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="Sensor_res2">Reserved 2</label>
            <InputText
              type="number"
              id="Sensor_res2"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="Sensor_res2"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("Sensor_res2") ? "border-red-600" : ""
              }`}
              onChange={handleDetails}
              placeholder="Enter a value"
              value={featuresetData?.Sensor_res2 || ""}
              autoComplete="off"
            />
          </div>
        </div>

        <hr style={{ borderColor: "#333" }} />
        <p className="mt-4 font-bold ">Speed Settings</p>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="speedSource">Speed Source</label>
            <Dropdown
              id="speedSource"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="speedSource"
              value={featuresetData?.speedSource || null}
              placeholder={
                featuresetData.speedSource
                  ? featuresetData.speedSource
                  : "Enter a value"
              }
              options={SpeedSourceoptions}
              optionLabel="label"
              optionValue="value"
              onChange={handleDetails}
              className={`md:w-14rem $dark:bg-gray-900 mt-2 w-full border ${
                invalidFields.includes("speedSource") ? "border-red-600" : ""
              }`}
            />
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="spdSet_spd">Speed</label>
            <InputText
              type="number"
              id="spdSet_spd"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="spdSet_spd"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("spdSet_spd") ? "border-red-600" : ""
              }`}
              onChange={handleDetails}
              placeholder="Enter a value"
              disabled={featuresetData.speedSource !== "4"}
              value={featuresetData?.spdSet_spd || ""}
              autoComplete="off"
            />
            {invalidFields.includes("spdSet_spd") && (
              <small className="text-red-600">
                Speed should be greater than -0 and less than 255
              </small>
            )}
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="slope">Slope</label>
            <InputText
              type="number"
              id="slope"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="slope"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("slope") ? "border-red-600" : ""
              }`}
              onChange={handleDetails}
              placeholder="Enter a value"
              value={featuresetData?.slope || ""}
              autoComplete="off"
            />
            {invalidFields.includes("slope") && (
              <small className="text-red-600">
                Slope should be greater than -200 and less than 200
              </small>
            )}
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="offset">Offset</label>
            <InputText
              type="number"
              id="offset"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="offset"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("offset") ? "border-red-600" : ""
              }`}
              onChange={handleDetails}
              placeholder="Enter a value"
              value={featuresetData?.offset || ""}
              autoComplete="off"
            />
            {invalidFields.includes("offset") && (
              <small className="text-red-600">
                Slope should be greater than -200 and less than 200
              </small>
            )}
          </div>
        </div>
        <hr style={{ borderColor: "#333" }} />
        <p className="mt-4 font-bold ">Shutdown Delay</p>
        <div className="field my-3 w-[30vw]">
          <label htmlFor="delay">Delay</label>
          <InputText
            type="number"
            id="delay"
            style={{
              width: "30vw",
              borderRadius: "5px",
            }}
            name="delay"
            className={`border py-2 pl-2 dark:bg-gray-900 ${
              invalidFields.includes("delay") ? "border-red-600" : ""
            }`}
            onChange={handleDetails}
            placeholder="Enter a value"
            value={featuresetData?.delay || ""}
            autoComplete="off"
          />
          {invalidFields.includes("delay") && (
            <small className="text-red-600">
              Delay should be greater than 0 and less than 200
            </small>
          )}
        </div>
        <hr style={{ borderColor: "#333" }} />
        <p className="mt-4 font-bold ">RFID</p>
        {invalidFields.includes("rfNameMode") && (
          <span className="p-error">Please select any option.</span>
        )}
        <div className="mb-3 mt-2 flex flex-wrap gap-3">
          <div className="align-items-center flex">
            <input
              type="radio"
              id="rfNameMode"
              name="rfNameMode"
              value={1}
              checked={featuresetData?.rfNameMode === "1"}
              onChange={handleDetails}
            />
            <label htmlFor="rfNameMode" className="ml-2">
              Enable
            </label>
          </div>
          <div className="align-items-center flex">
            <input
              type="radio"
              id="rfNameMode"
              name="rfNameMode"
              value={0}
              checked={featuresetData?.rfNameMode === "0"}
              onChange={handleDetails}
            />
            <label htmlFor="rfNameMode" className="ml-2">
              Disable
            </label>
          </div>
        </div>
        <hr style={{ borderColor: "#333" }} />
        <p className="mt-4 font-bold ">Time Based Errors</p>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="noAlarm">No Alarm</label>
            <InputText
              type="number"
              id="noAlarm"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="noAlarm"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("noAlarm") ? "border-red-600" : ""
              }`}
              onChange={handleDetails}
              placeholder="Enter a value"
              value={featuresetData?.noAlarm || ""}
              autoComplete="off"
            />
            {invalidFields.includes("noAlarm") && (
              <small className="text-red-600">
                No alarm should be greater than 0 and less than 60
              </small>
            )}
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="speed">Speed</label>
            <InputText
              type="number"
              id="speed"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="speed"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("speed") ? "border-red-600" : ""
              }`}
              onChange={handleDetails}
              placeholder="Enter a value"
              value={featuresetData?.speed || ""}
              autoComplete="off"
            />
            {invalidFields.includes("speed") && (
              <small className="text-red-600">
                Speed should be greater than 0 and less than 60
              </small>
            )}
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="accelerationBypass">Acceleration Bypass</label>
            <InputText
              type="number"
              id="accelerationBypass"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="accelerationBypass"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("accelerationBypass")
                  ? "border-red-600"
                  : ""
              }`}
              onChange={handleDetails}
              placeholder="Enter a value"
              value={featuresetData?.accelerationBypass || ""}
              autoComplete="off"
            />
            {invalidFields.includes("accelerationBypass") && (
              <small className="text-red-600">
                Acceleration bypass should be greater than 0 and less than 60
              </small>
            )}
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="tim_err_tpms">TPMS</label>
            <InputText
              type="number"
              id="tim_err_tpms"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="tim_err_tpms"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("tim_err_tpms") ? "border-red-600" : ""
              }`}
              onChange={handleDetails}
              placeholder="Enter a value"
              value={featuresetData?.tim_err_tpms || ""}
              autoComplete="off"
            />
            {invalidFields.includes("tim_err_tpms") && (
              <small className="text-red-600">
                TPMS should be greater than 0 and less than 200
              </small>
            )}
          </div>
        </div>
        <hr style={{ borderColor: "#333" }} />
        <p className="mt-4 font-bold ">Speed Based Errors</p>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="rfSensorAbsent">RF Sensor</label>
            <InputText
              type="number"
              id="rfSensorAbsent"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="rfSensorAbsent"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("rfSensorAbsent") ? "border-red-600" : ""
              }`}
              onChange={handleDetails}
              placeholder="Enter a value"
              value={featuresetData?.rfSensorAbsent || ""}
              autoComplete="off"
            />
            {invalidFields.includes("rfSensorAbsent") && (
              <small className="text-red-600">
                RF Sensor should be greater than 0 and less than 200
              </small>
            )}
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="gyroscopeAbsent">Gyroscope</label>
            <InputText
              type="number"
              id="gyroscopeAbsent"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="gyroscopeAbsent"
              className={`border  py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("gyroscopeAbsent")
                  ? "border-red-600"
                  : ""
              }`}
              onChange={handleDetails}
              placeholder="Enter a value"
              value={featuresetData?.gyroscopeAbsent || ""}
              autoComplete="off"
            />
            {invalidFields.includes("gyroscopeAbsent") && (
              <small className="text-red-600">
                Gyroscope should be greater than 0 and less than 200
              </small>
            )}
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="hmiAbsent">HMI</label>
            <InputText
              type="number"
              id="hmiAbsent"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="hmiAbsent"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("hmiAbsent") ? "border-red-600" : ""
              }`}
              onChange={handleDetails}
              placeholder="Enter a value"
              value={featuresetData?.hmiAbsent || ""}
              autoComplete="off"
            />
            {invalidFields.includes("hmiAbsent") && (
              <small className="text-red-600">
                HMI should be greater than 0 and less than 200
              </small>
            )}
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="spd_rtc">RTC</label>
            <InputText
              type="number"
              id="spd_rtc"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="spd_rtc"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("spd_rtc") ? "border-red-600" : ""
              }`}
              onChange={handleDetails}
              placeholder="Enter a value"
              value={featuresetData?.spd_rtc || ""}
              autoComplete="off"
            />
            {invalidFields.includes("spd_rtc") && (
              <small className="text-red-600">
                RTC should be greater than 0 and less than 200
              </small>
            )}
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="brk_cyl">Brake Cylinder</label>
            <InputText
              type="number"
              id="brk_cyl"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="brk_cyl"
              className={`border  py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("brk_cyl") ? "border-red-600" : ""
              }`}
              onChange={handleDetails}
              placeholder="Enter a value"
              value={featuresetData?.brk_cyl || ""}
              autoComplete="off"
            />
            {invalidFields.includes("brk_cyl") && (
              <small className="text-red-600">
                Brake cylinder should be greater than 0 and less than 200
              </small>
            )}
          </div>

          <div className="field my-3 w-[30vw]">
            <label htmlFor="tpmsError">TPMS</label>
            <InputText
              type="number"
              id="tpmsError"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="tpmsError"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("tpmsError") ? "border-red-600" : ""
              }`}
              onChange={handleDetails}
              placeholder="Enter a value"
              value={featuresetData?.tpmsError || ""}
              autoComplete="off"
            />
            {invalidFields.includes("tpmsError") && (
              <small className="text-red-600">
                TPMS should be greater than 0 and less than 200
              </small>
            )}
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="obdAbsent">OBD</label>
            <InputText
              type="number"
              id="obdAbsent"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="obdAbsent"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("obdAbsent") ? "border-red-600" : ""
              }`}
              onChange={handleDetails}
              placeholder="Enter a value"
              value={featuresetData?.obdAbsent || ""}
              autoComplete="off"
            />
            {invalidFields.includes("obdAbsent") && (
              <small className="text-red-600">
                OBD should be greater than 0 and less than 200
              </small>
            )}
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="spd_err_fuel">Fuel</label>
            <InputText
              type="number"
              id="spd_err_fuel"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="spd_err_fuel"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("spd_err_fuel") ? "border-red-600" : ""
              }`}
              onChange={handleDetails}
              placeholder="Enter a value"
              autoComplete="off"
              value={featuresetData.spd_err_fuel}
            />
            {invalidFields.includes("spd_err_fuel") && (
              <small className="text-red-600">
                Fuel should be greater than 0 and less than 200
              </small>
            )}
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="spd_err_ldr">Lidar</label>
            <InputText
              type="number"
              id="spd_err_ldr"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="spd_err_ldr"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("spd_err_ldr") ? "border-red-600" : ""
              }`}
              onChange={handleDetails}
              placeholder="Enter a value"
              value={featuresetData?.spd_err_ldr || ""}
              autoComplete="off"
            />
            {invalidFields.includes("spd_err_ldr") && (
              <small className="text-red-600">
                Lidar should be greater than 0 and less than 200
              </small>
            )}
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="rfidAbsent">RFID</label>
            <InputText
              type="number"
              id="rfidAbsent"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="rfidAbsent"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("rfidAbsent") ? "border-red-600" : ""
              }`}
              onChange={handleDetails}
              placeholder="Enter a value"
              value={featuresetData?.rfidAbsent || ""}
              autoComplete="off"
            />
            {invalidFields.includes("rfidAbsent") && (
              <small className="text-red-600">
                RFID should be greater than 0 and less than 200
              </small>
            )}{" "}
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="iotAbsent">IoT</label>
            <InputText
              type="number"
              id="iotAbsent"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="iotAbsent"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("iotAbsent") ? "border-red-600" : ""
              }`}
              onChange={handleDetails}
              placeholder="Enter a value"
              value={featuresetData?.iotAbsent || ""}
              autoComplete="off"
            />
            {invalidFields.includes("iotAbsent") && (
              <small className="text-red-600">
                IoT should be greater than 0 and less than 200
              </small>
            )}{" "}
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="spd_err_load">Load</label>
            <InputText
              type="number"
              id="spd_err_load"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="spd_err_load"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("spd_err_load") ? "border-red-600" : ""
              }`}
              onChange={handleDetails}
              placeholder="Enter a value"
              value={featuresetData?.spd_err_load || ""}
              autoComplete="off"
            />
            {invalidFields.includes("spd_err_load") && (
              <small className="text-red-600">
                load should be greater than 0 and less than 200
              </small>
            )}{" "}
          </div>
        </div>

        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="SBE_dd">Driver Drowsiness</label>
            <InputText
              type="number"
              id="SBE_dd"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="SBE_dd"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("SBE_dd") ? "border-red-600" : ""
              }`}
              onChange={handleDetails}
              placeholder="Enter a value"
              value={featuresetData?.SBE_dd || ""}
              autoComplete="off"
            />
            {invalidFields.includes("SBE_dd") && (
              <small className="text-red-600">
                Driver Drowsiness should be greater than 0 and less than 200
              </small>
            )}{" "}
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="SBE_alcohol">Alcohol Sensor</label>
            <InputText
              type="number"
              id="SBE_alcohol"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="SBE_alcohol"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("SBE_alcohol") ? "border-red-600" : ""
              }`}
              onChange={handleDetails}
              placeholder="Enter a value"
              value={featuresetData?.SBE_alcohol || ""}
              autoComplete="off"
            />
            {invalidFields.includes("SBE_alcohol") && (
              <small className="text-red-600">
                Alcohol should be greater than 0 and less than 200
              </small>
            )}{" "}
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="SBE_temp">Temperature Sensor</label>
            <InputText
              type="number"
              id="SBE_temp"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="SBE_temp"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("SBE_temp") ? "border-red-600" : ""
              }`}
              onChange={handleDetails}
              placeholder="Enter a value"
              value={featuresetData?.SBE_temp || ""}
              autoComplete="off"
            />
            {invalidFields.includes("SBE_temp") && (
              <small className="text-red-600">
                Temperature should be greater than 0 and less than 200
              </small>
            )}{" "}
          </div>
        </div>

        <hr style={{ borderColor: "#333" }} />
        <p className="mt-4 font-bold ">Firmware OTA Update</p>
        {invalidFields.includes("firmwareOtaUpdate") && (
          <span className="p-error">Please select any option.</span>
        )}
        <div className="mb-3 mt-2 flex flex-wrap gap-3">
          <div className="align-items-center flex">
            <input
              type="radio"
              id="firmwareOtaUpdate"
              name="firmwareOtaUpdate"
              value={1}
              checked={featuresetData?.firmwareOtaUpdate === "1"}
              onChange={handleDetails}
            />
            <label htmlFor="firmwareOtaUpdate" className="ml-2">
              Enable
            </label>
          </div>
          <div className="align-items-center flex">
            <input
              type="radio"
              id="ota_nav"
              name="firmwareOtaUpdate"
              value={0}
              checked={featuresetData?.firmwareOtaUpdate === "0"}
              onChange={handleDetails}
            />
            <label htmlFor="ota_nav" className="ml-2">
              Disable
            </label>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="firewarereserver1">Reserved 1</label>
            <InputText
              type="number"
              id="firewarereserver1"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="firewarereserver1"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("firewarereserver1")
                  ? "border-red-600"
                  : ""
              }`}
              onChange={handleDetails}
              placeholder="Enter a value"
              value={featuresetData?.firewarereserver1 || ""}
              autoComplete="off"
              disabled={featuresetData.firmwareOtaUpdate === "0"}
            />
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="firewarereserver2">Reserved 2</label>
            <InputText
              type="number"
              id="firewarereserver2"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="firewarereserver2"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("firewarereserver2")
                  ? "border-red-600"
                  : ""
              }`}
              onChange={handleDetails}
              placeholder="Enter a value"
              value={featuresetData?.firewarereserver2 || ""}
              autoComplete="off"
              disabled={featuresetData.firmwareOtaUpdate === "0"}
            />
          </div>
        </div>
        <hr style={{ borderColor: "#333" }} />
        <p className="mt-4 font-bold ">Alcohol Detection</p>
        {invalidFields.includes("alcoholDetectionMode") && (
          <span className="p-error">Please select any option.</span>
        )}
        <div className="mb-3 mt-2 flex flex-wrap gap-3">
          <div className="align-items-center flex">
            <input
              type="radio"
              id="alc_on"
              name="alcoholDetectionMode"
              value={1}
              checked={featuresetData?.alcoholDetectionMode === "1"}
              onChange={handleDetails}
            />
            <label htmlFor="alc_on" className="ml-2">
              Enable
            </label>
          </div>
          <div className="align-items-center flex">
            <input
              type="radio"
              id="alc_off"
              name="alcoholDetectionMode"
              value={0}
              checked={featuresetData?.alcoholDetectionMode === "0"}
              onChange={handleDetails}
            />
            <label htmlFor="alc_off" className="ml-2">
              Disable
            </label>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="alcoholinterval">Interval</label>
            <InputText
              type="number"
              id="alcoholinterval"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="alcoholinterval"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("alcoholinterval")
                  ? "border-red-600"
                  : ""
              }`}
              onChange={handleDetails}
              placeholder="Enter a value"
              value={featuresetData?.alcoholinterval || ""}
              autoComplete="off"
              disabled={featuresetData.alcoholDetectionMode === "0"}
            />
            {invalidFields.includes("alcoholinterval") && (
              <small className="text-red-600">
                Alcohol should be greater than 0 and less than 1440
              </small>
            )}{" "}
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="alcoholact_spd">Activation Speed</label>
            <InputText
              type="number"
              id="alcoholact_spd"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="alcoholact_spd"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("alcoholact_spd") ? "border-red-600" : ""
              }`}
              onChange={handleDetails}
              placeholder="Enter a value"
              value={featuresetData?.alcoholact_spd || ""}
              autoComplete="off"
              disabled={featuresetData.alcoholDetectionMode === "0"}
            />
            {invalidFields.includes("alcoholact_spd") && (
              <small className="text-red-600">
                Activation speed should be greater than 0 and less than 150
              </small>
            )}{" "}
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="alcoholstart_time">Start time</label>
            <InputText
              type="number"
              id="alcoholstart_time"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="alcoholstart_time"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("alcoholstart_time")
                  ? "border-red-600"
                  : ""
              }`}
              onChange={handleDetails}
              placeholder="Enter a value"
              value={featuresetData?.alcoholstart_time || ""}
              autoComplete="off"
              disabled={featuresetData.alcoholDetectionMode === "0"}
            />
            {invalidFields.includes("alcoholstart_time") && (
              <small className="text-red-600">
                Start time should be greater than 0 and less than 24
              </small>
            )}{" "}
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="alcoholstop_time">Stop time</label>
            <InputText
              type="number"
              id="alcoholstop_time"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="alcoholstop_time"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("alcoholstop_time")
                  ? "border-red-600"
                  : ""
              }`}
              onChange={handleDetails}
              placeholder="Enter a value"
              value={featuresetData?.alcoholstop_time || ""}
              autoComplete="off"
              disabled={featuresetData.alcoholDetectionMode === "0"}
            />
            {invalidFields.includes("alcoholstop_time") && (
              <small className="text-red-600">
                Stop time should be greater than 0 and less than 24
              </small>
            )}
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="alcoholmode">Alcohol Threshold Mode</label>
            <InputText
              type="number"
              id="alcoholmode"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="alcoholmode"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("alcoholmode") ? "border-red-600" : ""
              }`}
              onChange={handleDetails}
              placeholder="Enter a value"
              autoComplete="off"
              disabled={featuresetData.alcoholDetectionMode === "0"}
              value={featuresetData.alcoholmode}
            />
          </div>
        </div>

        <hr style={{ borderColor: "#333" }} />
        <p className="mt-4 font-bold ">Driver Drowsiness</p>
        {invalidFields.includes("driverDrowsinessMode") && (
          <span className="p-error">Please select any option.</span>
        )}
        <div className="mb-3 mt-2 flex flex-wrap gap-3">
          <div className="align-items-center flex">
            <input
              type="radio"
              id="driverDrowsinessMode"
              name="driverDrowsinessMode"
              value={1}
              checked={featuresetData?.driverDrowsinessMode === "1"}
              onChange={handleDetails}
            />
            <label htmlFor="driverDrowsinessMode" className="ml-2">
              Enable
            </label>
          </div>
          <div className="align-items-center flex">
            <input
              type="radio"
              id="driverDrowsinessMode"
              name="driverDrowsinessMode"
              value={0}
              checked={featuresetData?.driverDrowsinessMode === "0"}
              onChange={handleDetails}
            />
            <label htmlFor="driverDrowsinessMode" className="ml-2">
              Disable
            </label>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="dd_act_spd">Activation Speed</label>
            <InputText
              type="number"
              id="dd_act_spd"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="dd_act_spd"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("dd_act_spd") ? "border-red-600" : ""
              }`}
              onChange={handleDetails}
              placeholder="Enter a value"
              value={featuresetData?.dd_act_spd || ""}
              autoComplete="off"
              disabled={featuresetData.driverDrowsinessMode === "0"}
            />
            {invalidFields.includes("dd_act_spd") && (
              <small className="text-red-600">
                Activation speed should be greater than 0 and less than 150
              </small>
            )}
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="dd_acc_cut">ACC Cut Status</label>
            <Dropdown
              id="dd_acc_cut"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="dd_acc_cut"
              value={featuresetData?.dd_acc_cut || null}
              placeholder={
                featuresetData.dd_acc_cut
                  ? featuresetData.dd_acc_cut
                  : "Enter a value"
              }
              options={DDACCoptions}
              optionLabel="label"
              optionValue="value"
              onChange={handleDetails}
              className={`md:w-14rem $dark:bg-gray-900 mt-2 w-full border ${
                invalidFields.includes("dd_acc_cut") ? "p-invalid" : ""
              }`}
              disabled={featuresetData.driverDrowsinessMode === "0"}
            />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="dd_strt_tim">Start Time</label>
            <InputText
              type="number"
              id="dd_strt_tim"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="dd_strt_tim"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("dd_strt_tim") ? "border-red-600" : ""
              }`}
              onChange={handleDetails}
              placeholder="Enter a value"
              value={featuresetData?.dd_strt_tim || ""}
              autoComplete="off"
              disabled={featuresetData.driverDrowsinessMode === "0"}
            />
            {invalidFields.includes("dd_act_spd") && (
              <small className="text-red-600">
                Start time should be greater than 0 and less than 24
              </small>
            )}
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="dd_stop_tim">Stop Time</label>
            <InputText
              type="number"
              id="dd_stop_tim"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="dd_stop_tim"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("dd_stop_tim") ? "border-red-600" : ""
              }`}
              onChange={handleDetails}
              placeholder="Enter a value"
              value={featuresetData?.dd_stop_tim || ""}
              autoComplete="off"
              disabled={featuresetData.driverDrowsinessMode === "0"}
            />
            {invalidFields.includes("dd_stop_tim") && (
              <small className="text-red-600">
                Stop time should be greater than 0 and less than 24
              </small>
            )}
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="dd_res1">Reserved 1</label>
            <InputText
              type="number"
              id="dd_res1"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="dd_res1"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("dd_res1") ? "border-red-600" : ""
              }`}
              onChange={handleDetails}
              placeholder="Enter a value"
              value={featuresetData?.dd_res1 || ""}
              autoComplete="off"
              disabled={featuresetData.driverDrowsinessMode === "0"}
            />
          </div>
        </div>
        <hr style={{ borderColor: "#333" }} />
        <p className="mt-4 font-bold ">Temperature</p>
        {invalidFields.includes("temp_sts") && (
          <span className="p-error">Please select any option.</span>
        )}
        <div className="mb-3 mt-2 flex flex-wrap gap-3">
          <div className="align-items-center flex">
            <input
              type="radio"
              id="temp_sts"
              name="temp_sts"
              value={1}
              onChange={handleDetails}
              checked={featuresetData.temp_sts === "1"}
            />
            <label htmlFor="temp_sts" className="ml-2">
              Enable
            </label>
          </div>
          <div className="align-items-center flex">
            <input
              type="radio"
              id="temp_sts"
              name="temp_sts"
              value={0}
              onChange={handleDetails}
              checked={featuresetData.temp_sts === "0"}
            />
            <label htmlFor="temp_sts" className="ml-2">
              Diable
            </label>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="temp_thrsh">Threshold</label>
            <InputText
              type="number"
              id="temp_thrsh"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="temp_thrsh"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("temp_thrsh") ? "border-red-600" : ""
              }`}
              onChange={handleDetails}
              placeholder="Enter a value"
              autoComplete="off"
              disabled={featuresetData.temp_sts === "0"}
              value={featuresetData.temp_thrsh}
            />
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="temp_res1">Reserved 1</label>
            <InputText
              type="number"
              id="temp_res1"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="temp_res1"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("temp_res1") ? "border-red-600" : ""
              }`}
              onChange={handleDetails}
              placeholder="Enter a value"
              autoComplete="off"
              disabled={featuresetData.temp_sts === "0"}
              value={featuresetData.temp_res1}
            />
          </div>
        </div>
        <hr style={{ borderColor: "#333" }} />
        <p className="mt-4 font-bold ">Load Sensor</p>
        {invalidFields.includes("load_sts") && (
          <span className="p-error">Please select any option.</span>
        )}
        <div className="mb-3 mt-2 flex flex-wrap gap-3">
          <div className="align-items-center flex">
            <input
              type="radio"
              id="load_sts"
              name="load_sts"
              value={1}
              checked={featuresetData?.load_sts === "1"}
              onChange={handleDetails}
            />
            <label htmlFor="load_sts" className="ml-2">
              Enable
            </label>
          </div>
          <div className="align-items-center flex">
            <input
              type="radio"
              id="load_sts"
              name="load_sts"
              value={0}
              checked={featuresetData?.load_sts === "0"}
              onChange={handleDetails}
            />
            <label htmlFor="load_sts" className="ml-2">
              Disabled
            </label>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="load_max_cap">Max Capacity</label>
            <InputText
              type="number"
              id="load_max_cap"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="load_max_cap"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("load_max_cap") ? "border-red-600" : ""
              }`}
              onChange={handleDetails}
              placeholder="Enter a value"
              value={featuresetData?.load_max_cap || ""}
              autoComplete="off"
              disabled={featuresetData.load_sts === "0"}
            />
            {invalidFields.includes("load_max_cap") && (
              <small className="text-red-600">
                Maximum capacity should be greater than 0 and less than 100
              </small>
            )}
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="load_acc">Accelerator cut status</label>
            <Dropdown
              id="load_acc"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="load_acc"
              value={featuresetData?.load_acc || null}
              placeholder={
                featuresetData.load_acc
                  ? featuresetData.load_acc
                  : "Enter a value"
              }
              options={loadOptions}
              optionLabel="label"
              optionValue="value"
              onChange={handleDetails}
              className={`md:w-14rem $dark:bg-gray-900 mt-2 w-full border ${
                invalidFields.includes("load_acc") ? "p-invalid" : ""
              }`}
              disabled={featuresetData.load_sts === "0"}
            />
          </div>
        </div>
        <hr style={{ borderColor: "#333" }} />
        <p className="mt-4 font-bold ">Fuel</p>
        {invalidFields.includes("fuelMode") && (
          <span className="p-error">Please select any option.</span>
        )}
        <div className="mb-3 mt-2 flex flex-wrap gap-3">
          <div className="align-items-center flex">
            <input
              type="radio"
              id="fuelMode"
              name="fuelMode"
              value={1}
              checked={featuresetData?.fuelMode === "1"}
              onChange={handleDetails}
            />
            <label htmlFor="fuelMode" className="ml-2">
              Enable
            </label>
          </div>
          <div className="align-items-center flex">
            <input
              type="radio"
              id="fuelMode"
              name="fuelMode"
              value={0}
              checked={featuresetData?.fuelMode === "0"}
              onChange={handleDetails}
            />
            <label htmlFor="fuelMode" className="ml-2">
              Disable
            </label>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="fuel_tnk_cap">Tank Capacity</label>
            <InputText
              type="number"
              id="fuel_tnk_cap"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="fuel_tnk_cap"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("fuel_tnk_cap") ? "border-red-600" : ""
              }`}
              onChange={handleDetails}
              placeholder="Enter a value"
              value={featuresetData?.fuel_tnk_cap || ""}
              autoComplete="off"
              disabled={featuresetData.fuelMode === "0"}
            />
            {invalidFields.includes("fuel_tnk_cap") && (
              <small className="text-red-600">
                Fuel tank should be greater than 0 and less than 500
              </small>
            )}
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="fuel_intvl1">Interval 1</label>
            <InputText
              type="number"
              id="fuel_intvl1"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="fuel_intvl1"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("fuel_intvl1") ? "border-red-600" : ""
              }`}
              onChange={handleDetails}
              placeholder="Enter a value"
              value={featuresetData?.fuel_intvl1 || ""}
              autoComplete="off"
              disabled={featuresetData.fuelMode === "0"}
            />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="field my-3 w-[30vw]">
            <label htmlFor="fuel_intvl2">Interval 2</label>
            <InputText
              type="number"
              id="fuel_intvl2"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="fuel_intvl2"
              className={`border py-2 pl-2 dark:bg-gray-900 ${
                invalidFields.includes("fuel_intvl2") ? "border-red-600" : ""
              }`}
              onChange={handleDetails}
              placeholder="Enter a value"
              value={featuresetData?.fuel_intvl2}
              autoComplete="off"
              disabled={featuresetData.fuelMode === "0"}
            />
          </div>
          <div className="field my-3 w-[30vw]">
            <label htmlFor="fuel_acc">Accelerator cut status</label>
            <Dropdown
              id="fuel_acc"
              style={{
                width: "30vw",
                borderRadius: "5px",
              }}
              name="fuel_acc"
              value={featuresetData?.fuel_acc || null}
              placeholder={
                featuresetData.fuel_acc
                  ? featuresetData.fuel_acc
                  : "Enter a value"
              }
              options={FuelACCoptions}
              optionLabel="label"
              optionValue="value"
              onChange={handleDetails}
              className={`md:w-14rem $dark:bg-gray-900 mt-2 w-full border ${
                invalidFields.includes("fuel_acc") ? "p-invalid" : ""
              }`}
              disabled={featuresetData.fuelMode === "0"}
            />
          </div>
        </div>
        <div className="field my-3 w-[30vw]">
          <label htmlFor="fuel_thrsh">Threshold</label>
          <InputText
            type="number"
            id="fuel_thrsh"
            style={{
              width: "30vw",
              borderRadius: "5px",
            }}
            name="fuel_thrsh"
            className={`border py-2 pl-2 dark:bg-gray-900 ${
              invalidFields.includes("fuel_thrsh") ? "border-red-600" : ""
            }`}
            onChange={handleDetails}
            placeholder="Enter a value"
            value={featuresetData?.fuel_thrsh || ""}
            autoComplete="off"
            disabled={featuresetData.fuelMode === "0"}
          />
          {invalidFields.includes("fuel_thrsh") && (
            <small className="text-red-600">
              Threshold should be greater than 0 and less than 100
            </small>
          )}
        </div>

        <div className="text-right">
          <button
            type="submit"
            className="rounded bg-blue-600 px-3 py-2 text-white dark:bg-gray-150 dark:font-bold dark:text-blue-800"
          >
            Edit Feature Set
          </button>
        </div>
      </form>
    </>
  );
};

export default EditFeatureset;
