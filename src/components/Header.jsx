import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Logo } from "../assets";
import useUser from "../hooks/useUser";
import { AnimatePresence, motion } from "framer-motion";
import { PuffLoader } from "react-spinners";
import { HiLogout } from "react-icons/hi";
import { fadeInOut, slideUpDownMenu } from "../animation";
import { auth } from "../config/firebase.config";
import { useQueryClient } from "@tanstack/react-query";
import { adminid } from "../utils/helpers";
import useFilters from "../hooks/useFilters";
const Header = () => {
  const { data, isLoading, isError } = useUser();
  const [isMenuActive, setIsMenuActive] = useState(false);

  const queryClient = useQueryClient();
  const signOutUser = async () => {
    await auth.signOut().then(() => {
      queryClient.setQueryData(["user"], null);
    });
  };

const {data:filterData}=useFilters();


const handleSearchFilter=(e)=>{
  queryClient.setQueryData(["globalFilters"],{...queryClient.getQueryData(["globalFilters"]),searchTerm:e.target.value});
}


const clearFilters=()=>{
  queryClient.setQueryData(["globalFilters"],{...queryClient.getQueryData(["globalFilters"]),searchTerm:""});

}



  return (
    <header className="w-full flex items-center justify-between px-4 py-3 lg:px-8 border-b border-gray-300 bg-bgPrimary z-50 gap-12 sticky top-0 ">
      {/* logo */}

      <Link to={"/"}>
        <img src={Logo} alt="logo" className="w-12 h-auto object-contain " />
      </Link>

      {/* searchbar input */}

      <div className="flex-1 border border-gray-300 rounded-md flex items-center justify-between bg-gray-200 px-4 py-1">
        <input
          value={filterData?.searchTerm?filterData.searchTerm:""}
          onChange={handleSearchFilter}
          className=" outline-none flex-1 h-10 bg-transparent text-base font-semibold border-none"
          type="text"
          placeholder="Search in here..."
        />

        <AnimatePresence>
       {filterData?.searchTerm.length>0 &&   <motion.div {...fadeInOut} onClick={clearFilters} className=" cursor-pointer w-8 h-8 flex items-center justify-center bg-gray-300 rounded-md active:scale-95">
            <p className="text-xl text-black">X</p>
          </motion.div>}
        </AnimatePresence>
      </div>

      {/* profile */}

      <AnimatePresence>
        {isLoading ? (
          <PuffLoader color="#698fcd" size={40} />
        ) : (
          <>
            {data ? (
              <motion.div
                {...fadeInOut}
                className=" relative"
                onClick={() => setIsMenuActive(!isMenuActive)}
              >
                {data.photoURL ? (
                  <div className="w-12 h-12 flex items-center justify-center  cursor-pointer rounded-md">
                    <img
                      src={data.photoURL}
                      referrerPolicy="no-referrer"
                      alt=""
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 flex items-center justify-center  cursor-pointer bg-blue-700 rounded-md shadow-md">
                    <p className="text-white text-lg">{data.email[0]}</p>
                  </div>
                )}

                {/* dropdown menu */}
                <AnimatePresence>
                  {isMenuActive && (
                    <motion.div
                      {...slideUpDownMenu}
                      onMouseLeave={() => setIsMenuActive(!isMenuActive)}
                      className=" absolute px-4 py-3 pt-8 right-0 top-14 rounded-md bg-white flex flex-col items-center justify-start gap-3 w-64 shadow-md"
                    >
                      {data.photoURL ? (
                        <div className="w-20 h-20 flex items-center justify-center  cursor-pointer rounded-full">
                          <img
                            src={data.photoURL}
                            referrerPolicy="no-referrer"
                            alt=""
                            className="w-full h-full object-cover rounded-full"
                          />
                        </div>
                      ) : (
                        <div className="w-20 h-20 flex items-center justify-center  cursor-pointer bg-blue-700 rounded-md shadow-md">
                          <p className="text-white text-3xl">{data.email[0]}</p>
                        </div>
                      )}
                      {data.displayName && (
                        <p className="text-txtdark text-lg  text-center">
                          {data.displayName}
                        </p>
                      )}
                      <div className="flex flex-col items-start pt-6 gap-8 w-full ">
                        <Link
                          className=" text-txtLight hover:text-txtDark whitespace-nowrap text-base"
                          to={`/profile/${data.uid}`}
                        >
                          My Account
                        </Link>
                        {
                            adminid.includes(data.uid) &&   <Link
                            className=" text-txtLight hover:text-txtDark whitespace-nowrap text-base"
                            to={"/template/create"}
                          >
                            Add New Tempelate
                          </Link>
                        }
                      
                        <div
                          onClick={signOutUser}
                          className=" w-full border-t border-gray-300 px-2 py-2 flex items-center justify-between group cursor-pointer"
                        >
                          <p className=" text-txtLight group-hover:text-txtDark">
                            SignOut
                          </p>
                          <HiLogout className=" text-txtLight group-hover:text-txtDark" />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <Link to={"/auth"}>
                <motion.button
                  type="button"
                  className="border border-gray-300 bg-gray-200 px-4 py-3 active:scale-95 rounded-md hover:shadow-md duration-150"
                  {...fadeInOut}
                >
                  Login
                </motion.button>
              </Link>
            )}
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
