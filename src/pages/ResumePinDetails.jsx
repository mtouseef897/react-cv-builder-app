import React from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getTemplateDetails, saveToCollection, saveToFavourites } from "../api";
import { MainSpinner } from "../components";
import { FaHeart, FaHouse } from "react-icons/fa6";
import { FiltersData, initialTags } from "../utils/helpers";
import useUser from "../hooks/useUser";
import {
  BiFolderPlus,
  BiHeart,
  BiSolidHeart,
  BiSolidFolderPlus,
} from "react-icons/bi";
import useTemplates from "../hooks/useTemplates";
import TemplateDesignPin from "../components/TemplateDesignPin";

const ResumePinDetails = () => {
  const { templateID } = useParams();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["templates", templateID],
    queryFn: () => getTemplateDetails(templateID),
  });

  const { data: user, refetch: user_refetch } = useUser();
  const { data: templates, refetch: temp_refetch } = useTemplates();

  const handleaddToCollection = async (e) => {
    e.stopPropagation();

    try {
      await saveToCollection(data, user);
      user_refetch();
    } catch (error) {
      toast.error(`Error : ${error.message}`);
    }
  };

  const handleaddToFavourites = async (e) => {
    e.stopPropagation();

    try {
      await saveToFavourites(data, user);
      temp_refetch();
      refetch();
    } catch (error) {
      toast.error(`Error : ${error.message}`);
    }
  };

  if (isLoading) return <MainSpinner />;
  if (isError)
    return (
      <div className="flex items-center justify-center w-full h-[60vh] flex-col">
        <p className="text-sm text-txtPrimary font-semibold">
          error While Fetching Data...Please Try again Later
        </p>
      </div>
    );
  return (
    <div className=" border-red-500 w-full flex flex-col justify-start items-center px-4 py-20">
      {/* bread crums */}
      <div className="w-full flex items-center pb-8 gap-2">
        <Link
          to={"/"}
          className="flex items-center justify-center gap-2 text-txtPrimary"
        >
          <FaHouse /> Home
        </Link>{" "}
        <p>/</p> <p>{data?.name}</p>
      </div>

      {/* Main Section */}
      <div className=" w-full grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* left Section */}
        <div className=" col-span-1 lg:col-span-8 flex flex-col items-start justify-start gap-4">
          {/* template Image */}
          <div className=" w-full rounded-md overflow-hidden ">
            <img
              src={data?.imageURL}
              alt=""
              className="w-full h-full object-contain"
            />
          </div>
          {/* title and other detail section */}
          <div className="w-full flex flex-col items-start justify-start gap-2">
            {/* title and likes */}
            <div className="w-full flex items-center justify-between">
              <p className="text-lg text-txtPrimary">{data?.title}</p>
              {data?.favourites?.length > 0 && (
                <div className="flex items-center justify-center gap-2">
                  <FaHeart className="text-red-600 text-lg" />
                  <p>{data?.favourites?.length} likes</p>
                </div>
              )}
            </div>

            {/* collection and Fav Buttons */}
            {user && (
              <div className="w-full flex items-center justify-start gap-4">
                <div
                  onClick={handleaddToCollection}
                  className="border border-gray-300 px-8 py-1 rounded-md flex items-center justify-center gap-1 cursor-pointer shadow-md active:shadow-none"
                >
                  {!user?.collections?.includes(data?._id) ? (
                    <>
                      <BiFolderPlus />
                      <p>Add to Collection</p>
                    </>
                  ) : (
                    <>
                      <BiSolidFolderPlus />
                      <p>Remove from Collection</p>
                    </>
                  )}
                </div>

                <div
                  onClick={handleaddToFavourites}
                  className="border border-gray-300 px-8 py-1 rounded-md flex items-center justify-center gap-1 cursor-pointer shadow-md active:shadow-none"
                >
                  {!data?.favourites?.includes(user?.uid) ? (
                    <>
                      <BiHeart />
                      <p>Add to Favourites</p>
                    </>
                  ) : (
                    <>
                      <BiSolidHeart />
                      <p>Remove from Favourites</p>
                    </>
                  )}
                </div>
              </div>
            )}


            {/* Suggestion */}
            {
              templates && templates.length>0 && <div className="py-12 flex flex-col items-start justify-start gap-6">
                <p className="font-semibold text-txtPrimary">You might also like</p>

              
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
                  {
                      
                        templates.filter((item)=>item._id!==data?._id ).map(
                          (item,index)=>(
                            <TemplateDesignPin key={item?._id} data={item} index={index}/>
                          ) 
                        )
                      
                    }
                   </div>
                </div>
          
            }
          </div>
        </div>

        {/* right Section */}
        <div className=" col-span-1 lg:col-span-4 flex flex-col items-start justify-start gap-6">
          <div
            className={` overflow-hidden relative rounded-md w-full h-[300px] flex items-center justify-center bg-[url('https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')] bg-center bg-cover `}
          >
            <div className="absolute h-full w-full left-0 top-0 inset-1 bg-[rgba(0,0,0,0.4)]"></div>
            <Link
              to={"/"}
              className="border-2 border-gray-300 px-3 py-2 text-white rounded-md z-10"
            >
              Discover More
            </Link>
          </div>

        {user&&  <Link to={`/resume/${data?.name}/?templateId=${templateID}`} className="w-full bg-emerald-500 rounded-md flex items-center justify-center px-4 py-3  shadow-md active:shadow-none">
            <p className="text-white font-semibold text-lg">Edit this Template</p>
          </Link>}

          {data?.tags?.length>0 && <div className="flex items-center justify-start gap-2 flex-wrap">
            {data?.tags?.map((item) => (
              <div className="flex items-center justify-center border border-gray-300 px-2 py-1 rounded-md">
                <p>{item}</p>
              </div>
            ))}
          </div>}
        </div>
      </div>
    </div>
  );
};

export default ResumePinDetails;
