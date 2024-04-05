import React, { useState } from "react";
import useUser from "../hooks/useUser";
import useTemplates from "../hooks/useTemplates";
import TemplateDesignPin from "../components/TemplateDesignPin";
import { MainSpinner } from "../components";
import { getSavedResumes } from "../api";
import {useQuery} from '@tanstack/react-query'

const Profile = () => {
  const { data: user } = useUser();
  const [activeTab, setactiveTab] = useState("collections");
  const {
    data: templates,
    isLoading: temp_isLoading,
    isError: temp_isError,
    refetch: temp_refetch,
  } = useTemplates();


  const {data:savedResume}=useQuery(
    {
        queryKey:["savedResumes"],
        // queryFn:()=>getSavedResumes('115045004950519981244')
        queryFn:()=>getSavedResumes(user?.uid)
    }
  )


  if(temp_isLoading){
    return <MainSpinner/>
  }

  return (
    <div className="w-full flex flex-col items-center justify-start py-12 gap-28">
      <div className=" w-full h-72 bg-blue-50">
        <img
          src="https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          alt=""
          className=" w-full h-full object-cover"
        />
        <div className="flex items-center justify-center flex-col gap-2">
          {user?.photoURL ? (
            <div className="w-20 h-20 flex items-center justify-center  cursor-pointer rounded-full">
              <img
                src={user?.photoURL}
                referrerPolicy="no-referrer"
                alt=""
                className="w-full h-full object-cover rounded-full -mt-16"
              />
            </div>
          ) : (
            <div className="w-20 h-20 flex items-center justify-center  cursor-pointer bg-blue-700 rounded-md shadow-md">
              <p className="text-white text-3xl">{user?.email[0]}</p>
            </div>
          )}
          {user?.displayName && (
            <p className="text-txtdark text-2xl  text-center font-semibold">
              {user.displayName}
            </p>
          )}
        </div>
      </div>
      <div>
          {/* Tabs */}
          <div className="flex items-center justify-center gap-4 py-12">
              <div
              onClick={()=>setactiveTab("collections")}
                className={`flex items-center justify-center group cursor-pointer `}
              >
                <p className={`text-base text-txtPrimary group-hover:text-blue-600 px-4 py-1 rounded-full ${
                  activeTab === "collections"
                    ? " font-semibold bg-white shadow-md text-blue-600"
                    : ""
                }`}>Collections</p>
              </div>
              <div
              onClick={()=>setactiveTab("resumes")}
                className={`flex items-center justify-center group cursor-pointer `}
              >
                <p className={`text-base text-txtPrimary group-hover:text-blue-600 px-4 py-1 rounded-full ${
                  activeTab === "resumes"
                    ? "  font-semibold bg-white shadow-md text-blue-600"
                    : ""
                }`}>Resumes</p>
              </div>
            </div>

    {/* Tab Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-6 gap-4 px-8">
            { activeTab==='collections' && <>
                {
                  user?.collections?.length>0 ? <>
                  {
                    templates && templates.length>0 &&(
                      templates.filter((item)=>user?.collections?.includes(item?._id)).map(
                        (item,index)=>(
                          <TemplateDesignPin key={item?._id} data={item} index={index}/>
                        ) 
                      )
                    )
                  }
                  </>:<div>Nothing in User Collections</div>
                }


            </>
            }
            { activeTab==='resumes' && <>
                {
                  savedResume?.length>0 ? <>
                  {
                    savedResume.map(
                        (item,index)=>(
                          <TemplateDesignPin key={item?._id} data={item} index={index}/>
                        ) 
                      )
                    
                  }
                  </>:<div>Nothing in User Resumes</div>
                }


            </>
            }
            
            
            
          </div>
      </div>
    </div>
  );
};

export default Profile;
