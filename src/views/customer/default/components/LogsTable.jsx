import axios from "axios";
import Cookies from "js-cookie";
import { Card } from "primereact/card";
import { Dialog } from "primereact/dialog";
import { ScrollPanel } from "primereact/scrollpanel";
import { useEffect, useState } from "react";
import { BsInfoCircle } from "react-icons/bs";

const LogsTable = () => {
  const token = Cookies.get("token");
  const userUUID = Cookies.get("user_uuid");
  const [logs, setLogs] = useState([]);
  const [toplogs, setToplogs] = useState([]);
  const [viewAll, setViewAll] = useState(false);
  const [visibleLogs, setVisibleLogs] = useState(10);

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/dashboardCustomers/get-alert/${userUUID}`,
        {
          headers: { authorization: `bearer ${token}` },
        }
      )
      .then((res) => {
        setLogs(res.data.trip_data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [token, userUUID]);

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/dashboardCustomers/get-ten-alerts/${userUUID}`,
        {
          headers: { authorization: `bearer ${token}` },
        }
      )
      .then((res) => {
        setToplogs(res.data.trip_data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [token, userUUID]);

  const formatTimestamp = (time) => {
    let formattedDate = new Date(time * 1000);
    let formatDta = formattedDate.toLocaleString();
    return formatDta;
  };

  const openDialog = () => {
    setViewAll(true);
  };

  const handleReadMore = () => {
    setVisibleLogs((prevVisibleLogs) => prevVisibleLogs + 10);
  };

  return (
    <>
      <Card className="!z-5 s-screen relative flex flex-col rounded-lg bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:shadow-none">
        <h1 className="align-self-center mb-3 font-bold sm:text-2xl">
          Alert Logs
        </h1>

        <div className="flex flex-col gap-3 dark:!bg-navy-700 dark:text-white dark:shadow-none ">
          {toplogs.length !== 0 ? (
            <ScrollPanel
              style={{ width: "100%", height: "350px" }}
              className="custombar1 dark:bg-navy-800"
            >
              {toplogs.map((log, index) => (
                <div className="mb-5 flex w-full items-start " key={index}>
                  <div className="mt-1 flex justify-center rounded-xl bg-yellow-500 text-2xl text-white ">
                    <BsInfoCircle />
                  </div>
                  <div className="ml-2 flex h-full w-full flex-col justify-center rounded-lg px-1 text-sm">
                    <p className="text-left text-base font-bold text-gray-700 dark:text-white">
                      Alert{" "}
                      <span className="text-gray-900 dark:text-navy-300">
                        {log.event === "LMP" ? (
                          <span>Limp Mode</span>
                        ) : log.event === "ACC" ? (
                          <span>Acceleration Cut Off</span>
                        ) : log.event === "ACD" ? (
                          <span>Accident Happened</span>
                        ) : log.event === "DMS" ? (
                          <span>DMS</span>
                        ) : null}
                      </span>{" "}
                      Generated for Vehicle- {log.vehicle_name} (
                      {log.vehicle_registration})
                    </p>
                    <p>
                      <small>{formatTimestamp(log.timestamp)}</small>
                    </p>
                  </div>
                </div>
              ))}
              <div className="text-right">
                <button
                  className="text-normal ml-auto w-fit cursor-pointer rounded bg-gray-150 px-2 text-right font-semibold text-navy-700 dark:bg-gray-600 dark:text-gray-50"
                  onClick={() => {
                    openDialog();
                  }}
                >
                  View All
                </button>
              </div>
            </ScrollPanel>
          ) : (
            <ScrollPanel
              style={{ width: "100%", height: "350px" }}
              className="custombar1 dark:bg-navy-800"
            >
              <p>No Alert Logs found</p>
            </ScrollPanel>
          )}
        </div>
      </Card>
      <Dialog
        visible={viewAll}
        onHide={() => {
          setViewAll(false);
          setVisibleLogs(10);
        }}
        style={{ width: "45rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Notifications"
        modal
        className="p-fluid dark:bg-gray-900"
      >
        {logs.slice(0, visibleLogs).map((log, index) => (
          <div className="mb-5 flex w-full items-start " key={index}>
            <div className="mt-1 flex justify-center rounded-xl bg-yellow-500 text-2xl text-white ">
              <BsInfoCircle />
            </div>
            <div className="ml-2 flex h-full w-full flex-col justify-center rounded-lg px-1 text-sm">
              <p className="text-left text-base font-bold text-gray-700 dark:text-white">
                Alert{" "}
                <span className="text-gray-900 dark:text-navy-300">
                  {log.event === "LMP" ? (
                    <span>Limp Mode</span>
                  ) : log.event === "ACC" ? (
                    <span>Acceleration Cut Off</span>
                  ) : log.event === "ACD" ? (
                    <span>Accident Happened</span>
                  ) : log.event === "DMS" ? (
                    <span>DMS</span>
                  ) : null}
                </span>{" "}
                Generated for Vehicle- {log.vehicle_name} (
                {log.vehicle_registration})
              </p>
              <p>
                <small>{formatTimestamp(log.timestamp)}</small>
              </p>
              <hr />
            </div>
          </div>
        ))}
        {logs.length > visibleLogs && (
          <div className="mt-4 flex justify-end">
            <button
              className="rounded bg-gray-700 px-3 py-1 text-gray-50"
              onClick={handleReadMore}
            >
              Read More
            </button>
          </div>
        )}
      </Dialog>
    </>
  );
};

export default LogsTable;
