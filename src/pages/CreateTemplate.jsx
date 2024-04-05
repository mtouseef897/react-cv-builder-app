import React, { useEffect, useState } from "react";
import { FaTrash, FaUpload } from "react-icons/fa6";
import { PuffLoader } from "react-spinners";
import { toast } from "react-toastify";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
import { db, storage } from "../config/firebase.config";
import { AnimatePresence, motion } from "framer-motion";
import { fadeInOut } from "../animation";
import { adminid, initialTags } from "../utils/helpers";
import { deleteDoc, doc, serverTimestamp, setDoc } from "firebase/firestore";
import useTemplates from "../hooks/useTemplates";
import useUser from "../hooks/useUser";
import {useNavigate} from 'react-router-dom'

const CreateTemplate = () => {
  const [formData, setformData] = useState({
    title: "",
    imageURL: null,
  });

  const [imageAsset, setImageAsset] = useState({
    isLoading: false,
    uri: null,
    progress: 0,
  });

  const [selectedTags, setselectedTags] = useState([]);

  const {
    data: templates,
    isLoading: templatesIsLoading,
    isError: templatesIsError,
    refetch: templatesRefetch,
  } = useTemplates();


  const {data:user,isLoading}=useUser();
  const navigate=useNavigate();
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setformData((prevRec) => ({ ...prevRec, [name]: value }));
  };

  const handleFileSelect = async (e) => {
    setImageAsset((prevRec) => ({ ...prevRec, isLoading: true }));
    const file = e.target.files[0];

    if (file && isAllowed(file)) {
      const fileRef = ref(storage, `Templates/${Date.now()}-${file.name}`);
      const uploadTask = uploadBytesResumable(fileRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageAsset((prevRec) => ({
            ...prevRec,
            progress: (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
          }));
        },
        (error) => {
          // Handle unsuccessful uploads
          if (error.message.includes("storage/unauthorized")) {
            toast.error("Error: Authorization Revoked");
          } else {
            toast.error(`Error :  ${error.message}`);
          }
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageAsset((prevRec) => ({ ...prevRec, uri: downloadURL }));
          });

          toast.success("Image Uploaded Successfully");

          setInterval(() => {
            setImageAsset((prevRec) => ({ ...prevRec, isLoading: false }));
          }, 2000);
        }
      );
    } else {
      toast.info("Invalid File Type Selected !");
    }
  };

  const isAllowed = (file) => {
    const AllowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    return AllowedTypes.includes(file.type);
  };

  const handleDeleteImageObject = async () => {
    setInterval(() => {
      setImageAsset((prevRec) => ({ ...prevRec, progress: 0, uri: null }));
    }, 1000);

    const deleteRef = ref(storage, imageAsset.uri);
    deleteObject(deleteRef).then(() => {
      toast.success("Image Removed");
    });
  };

  const handleSelectedTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setselectedTags(selectedTags.filter((selected) => selected !== tag));
    } else {
      setselectedTags([...selectedTags, tag]);
    }
  };

  const handlePushToCloud = async () => {
    const timestamp = serverTimestamp();
    const id = `${Date.now()}`;

    const _doc = {
      _id: id,
      title: formData.title,
      imageURL: imageAsset.uri,
      name:
        templates && templates.length > 0
          ? `Template${templates.length + 1}`
          : "Template1",
      tags:selectedTags,
      timestamp: timestamp,
    };

    try {
      await setDoc(doc(db, "templates", id), _doc);
      setformData((prevRec) => ({ ...prevRec, imageURL: null, title: "" }));
      setImageAsset((prevRec) => ({
        ...prevRec,
        uri: null,
        isLoading: false,
        progress: 0,
      }));
      setselectedTags([]);
      templatesRefetch();
      toast.success("Data Pushed to Cloud");
    } catch (error) {
      toast.error(`Error :${error.message}`);
    }
  };

  const removeTemplate = async (template) => {
   const deleteRef=ref(storage,template.imageURL);
 try {
  await deleteObject(deleteRef)
  await deleteDoc(doc(db,"templates",template._id))
  toast.success("Template Removed");
  templatesRefetch();
 } catch (error) {
  toast.error("Error Removing Template")
 }
  };

  useEffect(
    ()=>{
      if(!isLoading && !adminid.includes(user.uid)){
        navigate('/',{replace:true})
      }
    },[user, isLoading]
  )
  return (
    <div className="w-full px-4 lg:px-10 2xl:px-32 py-4 grid grid-cols-1 lg:grid-cols-12 h-full gap-4">
      {/* left container */}
      <div className=" col-span-12 lg:col-span-4 2xl:col-span-3  flex-1 flex flex-col items-center justify-start gap-4 px-2 ">
        {/* section title */}
        <div className="w-full">
          <p className=" text-lg text-txtPrimary">Create New Template</p>
        </div>

        {/* tempelate id */}
        <div className="w-full flex items-center justify-end">
          <p className=" text-base font-semibold text-txtLight uppercase">
            tempid : {"  "}{" "}
          </p>
          <p className=" text-sm font-bold text-txtDark capitalize">
            {templates && templates.length > 0
              ? `template${templates.length + 1}`
              : "template1"}
          </p>
        </div>

        {/* Template Title input */}
        <input
          type="text"
          name="title"
          placeholder="Template Title"
          value={FormData.title}
          onChange={handleInputChange}
          className="w-full px-4 py-3 rounded-md focus:shadow-md outline-none text-lg bg-transparent border  border-gray-300 text-txtPrimary focus:text-txtDark"
        />

        {/* Image Uploader */}
        <div className="w-full flex-1 bg-gray-100 border-2 border-gray-300 border-dashed  rounded-md cursor-pointer flex items-center justify-center">
          {imageAsset.isLoading ? (
            <>
              <div className="flex flex-col items-center justify-center gap-4">
                <PuffLoader color={"#498Fcd"} size={40} />
                <p>{imageAsset.progress.toFixed(2)}%</p>
              </div>
            </>
          ) : (
            <>
              {!imageAsset.uri ? (
                <label className=" w-full h-full flex items-center justify-center cursor-pointer">
                  <div className="flex flex-col gap-4 items-center justify-center">
                    <FaUpload className=" text-lg " />
                    <p className=" text-lg text-txtPrimary ">Click to Upload</p>
                  </div>
                  <input
                    type="file"
                    accept=".jpeg, .jpg, .png"
                    onChange={handleFileSelect}
                    className="w-0 h-0"
                  />
                </label>
              ) : (
                <>
                  <motion.div
                    // {...fadeInOut}
                    className="relative w-full h-[300px] overflow-hidden rounded-md"
                  >
                    <img
                      src={imageAsset.uri}
                      className=" w-full h-full object-contain"
                      loading="lazy"
                      alt=""
                    />

                    <div
                      onClick={handleDeleteImageObject}
                      className=" w-8 h-8 absolute rounded-md flex items-center justify-center right-4 top-4 bg-red-600 hover:bg-red-500 active:bg-red-700"
                    >
                      <FaTrash className="text-white " />
                    </div>
                  </motion.div>
                </>
              )}
            </>
          )}
        </div>

        {/* Tags Section */}
        <div className="w-full flex flex-wrap gap-2">
          {initialTags.map((tag, i) => {
            return (
              <div
                key={i}
                className={`border border-gray-300 rounded-md px-2 py-1 cursor-pointer ${
                  selectedTags.includes(tag) ? " bg-blue-500 text-white" : ""
                }`}
                onClick={() => handleSelectedTag(tag)}
              >
                <p className="text-xs">{tag}</p>
              </div>
            );
          })}
        </div>

        {/* Button */}
        <button
          className="w-full py-2 bg-blue-700 text-white rounded-md cursor-pointer"
          onClick={handlePushToCloud}
        >
          Save
        </button>
      </div>

      {/* right container */}
      <div className=" col-span-12 lg:col-span-8 2xl:col-span-9 w-full flex-1 py-4">
        {templatesIsLoading ? (
          <div className="border w-full h-full flex items-center justify-center">
            <PuffLoader color="#498fcd" size={40} />
          </div>
        ) : (
          <>
            {templates && templates.length > 0 ? (
              <div className="grid w-full grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4">
                {templates.map((template) => (
                  <div className="relative rounded-md overflow-hidden w-full " key={template._id}>
                    <img
                      src={`${template.imageURL}`}
                      className=" w-full h-full object-cover"
                      alt=""
                    />
                       <div
                      onClick={()=>removeTemplate(template)}
                      className=" w-8 h-8 absolute rounded-md flex items-center justify-center right-4 top-4 bg-red-600 hover:bg-red-500 active:bg-red-700"
                    >
                      <FaTrash className="text-white " />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border w-full h-full flex flex-col gap-4 items-center justify-center">
                <PuffLoader color="#498fcd" size={40} />
                <p className="text-xl tracking-wider capitalize text-txtPrimary">
                  No Data Available
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CreateTemplate;
