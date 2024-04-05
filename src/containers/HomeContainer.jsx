import React from "react";
import { Filters, MainSpinner } from "../components";
import useTemplates from "../hooks/useTemplates";
import TemplateDesignPin from "../components/TemplateDesignPin";

const HomeContainer = () => {
  const {
    data: templates,
    isLoading: temp_isLoading,
    isError: temp_isError,
    refetch: temp_refetch,
  } = useTemplates();

  if (temp_isLoading) {
    return <MainSpinner />;
  }

  return (
    <div className="flex flex-col items-center justify-start px-4 lg:px-12 py-6 gap-4">
      {/* Filters */}
      <Filters />
      {/* templates */}
      {temp_isError || !templates.length>0  ? (
        <React.Fragment>
          <div className="absolute left-0 top-[50%]  w-full flex items-center justify-center grow">
            <p className="text-lg text-txtPrimary ">No Data Found</p>
          </div>
        </React.Fragment>
      ) : (
        <React.Fragment>
         <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-6 gap-4">
         {
            templates && templates.length>0 &&(
              templates.map(
                (item,index)=>(
                  <TemplateDesignPin key={item?._id} data={item} index={index}/>
                ) 
              )
            )
          }
         </div>
        </React.Fragment>
      )}
    </div>
  );
};

export default HomeContainer;
