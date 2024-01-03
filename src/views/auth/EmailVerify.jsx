import React, { useEffect, useState } from "react";
import axios from "axios";
import gif from "../../assets/img/verified.gif";

const Verify = () => {
  // Get the token from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");
  const [redirect, setRedirect] = useState(false);
  console.log(token);

  useEffect(() => {
    if (token) {
      axios
        .post(`${process.env.REACT_APP_AWS_URL}/verifyToken`, {
          token,
        })
        .then((response) => {
          console.log("Response", response);
          alert(response.data.message);
        })
        .catch((e) => {
          console.log("Error ::", e);
        });
    }

    // Redirect after 10 seconds
    const redirectTimeout = setTimeout(() => {
      window.location.href = `${process.env.REACT_APP_BASE_URL}/reset-password`; // Replace with your desired URL
    }, 4000);

    // Clear the timeout on component unmount to avoid memory leaks
    return () => clearTimeout(redirectTimeout);
  }, [token]);

  useEffect(() => {
    setTimeout(() => {
      setRedirect(true);
    }, 2000);
  });

  return (
    <>
      {redirect ? (
        <div className={`flex h-screen flex-col items-center justify-center`}>
          <div class="dots"></div>
          <br />
          <p>Redirecting to reset password page</p>
        </div>
      ) : (
        <div className={`flex h-screen items-center justify-center`}>
          <p className={`flex align-middle text-lg`}>
            <img src={gif} alt="" className="rounded-full bg-gray-600 p-2" />
            <span>&nbsp;Your email ID is verified successfully!</span>
          </p>
        </div>
      )}
    </>
  );
};

export default Verify;
