import React, { useState } from "react";
import {
  fadeInOut,
  scaleUpDown,
  slideleftScaleUpDown,
  slidenScaleUpDown,
} from "../animation";
import { AnimatePresence, motion } from "framer-motion";
import { GoHeart,GoHeartFill } from "react-icons/go";
import { MdFolder ,MdOutlineCreateNewFolder } from "react-icons/md";
import useUser from "../hooks/useUser";
import {toast} from "react-toastify";
import { saveToCollection, saveToFavourites } from "../api";
import useTemplates from "../hooks/useTemplates";
import {useNavigate} from 'react-router-dom'

const TemplateDesignPin = ({ data, index }) => {

  const [isPinHovered, setisPinHovered] = useState(false);

  const {data:user,refetch:user_refetch}=useUser();
  const {data:templates,refetch:temp_refetch}=useTemplates();
  const navigate=useNavigate();


  const handleaddToCollection = async(e) => {
    e.stopPropagation();
 
    try {
  
        await saveToCollection(data,user);
        user_refetch();
    } catch (error) {

        toast.error(`Error : ${error.message}`)
    }
  };

  const handleaddToFavourites = async(e) => {
    e.stopPropagation();

    try {
        await saveToFavourites(data,user);
        temp_refetch();
    } catch (error) {

        toast.error(`Error : ${error.message}`)
    }
  };


  const handleRouteNavigation=()=>{
    navigate(`/resumedetail/${data?._id}`);
  }

  return (
    <motion.div {...scaleUpDown(index)}>
      <div
        onMouseEnter={() => setisPinHovered(true)}
        onMouseLeave={() => setisPinHovered(false)}
        className="w-full h-[400px] bg-gray-300 rounded-md overflow-hidden relative"
        onClick={handleRouteNavigation}
      >
        <img
          src={data?.imageURL}
          alt=""
          className="w-full h-full object-cover"
        />

        <AnimatePresence>
          {isPinHovered &&
            <motion.div
              {...fadeInOut}
              className="absolute top-0 left-0 w-full h-full inset-1 bg-[rgba(0,0,0,0.4)] flex flex-col px-4 py-3 items-center justify-start cursor-pointer z-50"
            >
              <div className="w-full flex flex-col items-end justify-start gap-8">
                <InnerBoxCard
                  label={`${user?.collections?.includes(data?._id)?"Added to Collection":"Add to Collection"}`}
                  Icon={user?.collections?.includes(data?._id)?MdFolder:MdOutlineCreateNewFolder}
                  onHandle={handleaddToCollection}
                />
                <InnerBoxCard
                  label={`${data?.favourites?.includes(user?.uid)?"Added to Favourites":"Add to Favourites"}`}
                  Icon={data?.favourites?.includes(user?.uid)?GoHeartFill:GoHeart}
                  onHandle={handleaddToFavourites}
                />
              </div>
            </motion.div>
          }
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const InnerBoxCard = ({ label, Icon, onHandle }) => {
  const [isIconHovered, setisIconHovered] = useState(false);
  return (
    <div
    onClick={onHandle}
      className="flex w-10 h-10 rounded-md  items-center justify-center bg-gray-200 relative hover:shadow-md"
      onMouseEnter={() => setisIconHovered(true)}
      onMouseLeave={() => setisIconHovered(false)}
    >
      <Icon className="text-lg text-txtPrimary" />
     <AnimatePresence>
     {isIconHovered && (
        <motion.div
          {...slideleftScaleUpDown}
          className="bg-gray-200 px-3 py-2 absolute -left-44  rounded-md after:w-2 after:h-2 after:bg-gray-200 after:absolute after:-right-1 after:top-[45%] after:rotate-45"
        >
          <p className="text-sm whitespace-nowrap">{label}</p>
        </motion.div>
      )}
     </AnimatePresence>
    </div>
  );
};

export default TemplateDesignPin;
