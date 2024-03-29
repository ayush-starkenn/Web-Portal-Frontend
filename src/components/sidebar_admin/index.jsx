import React, { useEffect, useState } from "react";
import { HiX } from "react-icons/hi";
import { routes_admin } from "routes.js";
import SidebarLinks from "./components/Links";
import { RiMenu2Fill } from "react-icons/ri";

const Sidebar = ({ open, onClose }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768 && open) {
        onClose();
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [open, onClose]);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      className={`${
        isMobile ? "sm:hidden" : "sm:flex"
      } linear duration-900 fixed z-40 flex min-h-full flex-col shadow-2xl shadow-white/5 transition ease-in-out dark:!bg-navy-800 dark:text-white dark:shadow-none  ${
        open ? "translate-x-0" : "-translate-x-96"
      }`}
    >
      {/* {isMobile && (
      <span
        className="absolute right-4 top-4 block cursor-pointer xl:hidden"
        // onClick={onClose}
      >
        <HiX />
      </span>
    )} */}

      <div className={`mx-[37px] flex items-center`}>
        <div className="ml-1 h-2.5 font-poppins text-[26px] font-bold uppercase text-navy-700 dark:text-white"></div>
      </div>
      {/* Nav item */}

      <ul className="mb-auto transition-opacity">
        <div
          className={`${
            isMobile ? "sm:hidden" : "sm:flex"
          } duration-1200  fixed z-40 flex h-full min-h-full flex-col bg-white shadow-2xl shadow-white/5 transition-opacity duration-500 ease-in-out  dark:!bg-navy-800 dark:text-white dark:shadow-none ${
            open ? "opacity-100" : "opacity-0"
          } ${isHovered ? "w-[192px]" : "w-fit"}`}
        >
          <div
            className={`mx-auto flex py-5 ${
              isHovered && "w-[192px] justify-end"
            }`}
          >
            {!isHovered ? (
              <RiMenu2Fill
                className="mx-2 mt-[-13px] h-6 w-6 cursor-pointer text-gray-600 transition duration-700 ease-in-out"
                onClick={isMobile ? onClose : handleMouseEnter}
              />
            ) : (
              <HiX
                className="mx-2 my-auto cursor-pointer text-2xl text-gray-600 transition duration-700 ease-in-out"
                onClick={handleMouseLeave}
              />
            )}
          </div>

          <SidebarLinks routes={routes_admin} hover={isHovered} />
        </div>
      </ul>

      {/* Nav item end */}
    </div>
  );
};

export default Sidebar;
