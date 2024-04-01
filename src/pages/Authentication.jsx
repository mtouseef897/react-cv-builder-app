import React, { useEffect } from 'react'
import { Footer } from '../containers'
import { Logo } from '../assets'
import { AuthButtonWithProvider, MainSpinner } from '../components'
import {FaGoogle,FaGithub} from 'react-icons/fa6'
import useUser from '../hooks/useUser'
import {Link, useNavigate} from 'react-router-dom'


const Authentication = () => {
  const {data,isLoading,isError}=useUser();
  const navigate=useNavigate();

  useEffect(
    ()=>{
        if(!isLoading && data){
          navigate('/',{replace:true})
        }
    },[isLoading,data]
  )

  if(isLoading){
    return <MainSpinner/>
  }
  return (
    <div className='auth-section'>
        {/* top section */}
        <Link to={"/"}>
        <img src={Logo} className='w-12 h-auto object-contain' alt='logo image' />
        </Link>
   
        {/* main section */}
        <div className='w-full flex-1  flex flex-col items-center justify-center gap-6'>
            <h1 className=' text-3xl lg:text-4xl text-blue-700 whitespace-nowrap'>Welcome to CV Builder</h1>
            <p className=' text-gray-600 text-base'>Best Way to Create Resume</p>
            <h2 className=' text-2xl text-gray-600'>Authenticate</h2>
            <div className='w-full lg:w-96 flex flex-col items-center justify-start gap-6 p-2 rounded-md'>
                <AuthButtonWithProvider Icon={FaGoogle} label={"Sign in with Google"} provider={"GoogleAuthProvider"}/>
                <AuthButtonWithProvider Icon={FaGithub} label={"Sign in with GitHub"} provider={"GithubAuthProvider"}/>
               
            </div>
        </div>
        {/* footer section */}
        <Footer/>
    </div>
  )
}

export default Authentication