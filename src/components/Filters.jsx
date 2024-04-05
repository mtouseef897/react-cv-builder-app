import React, { useState } from "react";
import { MdLayersClear } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import { slidenScaleUpDown } from "../animation";
import { FiltersData } from "../utils/helpers";
import useFilters from "../hooks/useFilters";
import {useQueryClient} from '@tanstack/react-query'

const Filters = () => {
  const [isClearHovered, setisClearHovered] = useState(false);
  const {
    data: filtersData,
    isLoading: filtersisLoading,
    isError: filtersisError,
  } = useFilters();

 
  const queryClient=useQueryClient();

  const handleFilterValue=(value)=>{
    const previousState=queryClient.getQueryData("globalFilters");
    const updatedState={...previousState,searchTerm: value};
    queryClient.setQueryData(["globalFilters"],updatedState)
  }

  const clearFilter=()=>{
    const previousState=queryClient.getQueryData("globalFilters");
    const updatedState={...previousState,searchTerm: ""};
    queryClient.setQueryData(["globalFilters"],updatedState)
  }
  return (
    <div className="w-full flex items-center justify-start pt-4 gap-2">
      <div
        className="border border-gray-300 bg-gray-200 rounded-md px-3 py-2 hover:shadow-md cursor-pointer relative"
        onMouseEnter={() => setisClearHovered(true)}
        onMouseLeave={() => setisClearHovered(false)}
        onClick={clearFilter}
      >
        <MdLayersClear className=" text-lg" />
        <AnimatePresence>
          {isClearHovered && (
            <motion.div
              {...slidenScaleUpDown}
              className="absolute rounded-md px-2 py-1  bg-white whitespace-nowrap  -left-4 -top-8 text-sm"
            >
              Clear All
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="w-full overflow-x-scroll flex items-center justify-start gap-6 scrollbar-none">
        {FiltersData &&
          FiltersData.map((item) => (
            <div
              onClick={()=>handleFilterValue(item.value)}
              key={item.id}
              className={`border border-gray-300 rounded-md px-3 py-2 cursor-pointer group hover:shadow-md ${filtersData?.searchTerm===item.value && "bg-gray-300 shadow-md"}`}
            >
              <p className=" text-sm text-txtPrimary group-hover:text-txtDark whitespace-nowrap">
                {" "}
                {item.label}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Filters;
