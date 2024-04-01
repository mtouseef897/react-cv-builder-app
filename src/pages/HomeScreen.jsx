  import React, { Suspense } from "react";
  import { useQuery, useMutation,useQueryClient } from "@tanstack/react-query";
import { Header, MainSpinner } from "../components";
import {Routes,Route} from 'react-router-dom'
import {HomeContainer} from '../containers'
import {CreateTemplate,CreateResume,ResumePinDetails,Profile} from '../pages'


  const HomeScreen = () => {


    return (
      <div className="w-full h-screen flex flex-col  justify-center">

        <Header/>
        <main className="h-full">
          <Suspense fallback={<MainSpinner/>}>
              <Routes>
                <Route path="/" element={<HomeContainer/>} />
                <Route path="/template/create" element={<CreateTemplate/>} />
                <Route path="/profile/:uid" element={<Profile/>} />
                <Route path="/resume/*" element={<CreateResume/>} />
                <Route path="/resumedetail/:templateID" element={<ResumePinDetails/>} />
              </Routes>
          </Suspense>
        </main>
      </div>
    );
  };

  export default HomeScreen;
