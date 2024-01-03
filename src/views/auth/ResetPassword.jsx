import React, { useState } from "react";

const ResetPassword = () => {
  // State to manage form input values
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetStatus, setResetStatus] = useState(null);

  // Function to handle form submission
  const handleResetPassword = async (e) => {
    e.preventDefault();

    // Validate input (you may want to add more validation)
    if (
      !email ||
      !password ||
      !confirmPassword ||
      password !== confirmPassword
    ) {
      setResetStatus("Invalid input or passwords do not match.");
      return;
    }

    // Assuming you have an API endpoint for password reset, you can make a call here
    // Example API call:
    // try {
    //   const response = await resetPasswordAPI(email, password);
    //   setResetStatus("Password reset successful!");
    // } catch (error) {
    //   setResetStatus("Password reset failed. Please try again.");
    // }

    // For the sake of this example, let's assume the reset is successful
    setResetStatus("Password reset successful!");
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="mx-auto h-fit w-[60%] rounded-md bg-gray-300 p-12">
        <h2 className="text-center text-3xl font-semibold">Reset Password</h2>

        <form className="mx-auto max-w-sm" onSubmit={handleResetPassword}>
          <div className="mb-5">
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Your email
            </label>
            <input
              type="email"
              id="email"
              value="sapna@starkenn.com"
              readOnly
              onChange={(e) => setEmail(e.target.value)}
              className="pointer-events-none block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              New password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Confirm password
            </label>
            <input
              type="password"
              id="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto"
          >
            Submit
          </button>
        </form>

        {resetStatus && <p>{resetStatus}</p>}
      </div>
    </div>
  );
};

export default ResetPassword;
