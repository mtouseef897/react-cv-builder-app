import React from 'react'
import { FaChevronRight } from 'react-icons/fa6'
import {GoogleAuthProvider,GithubAuthProvider, signInWithRedirect} from 'firebase/auth'
import { auth } from '../config/firebase.config';

const AuthButtonWithProvider = ({Icon, label, provider}) => {

    const googleAuthProvider=new GoogleAuthProvider();
    const githubAuthProvider=new GithubAuthProvider();
    const handleAuthentication=async()=>{
        switch(provider){
            case "GoogleAuthProvider":
                await signInWithRedirect(auth,googleAuthProvider).then(
                    (result)=>{
                        console.log(result)
                    }
                ).catch(
                    (error)=>{
                        console.log("Error:",error);
                    }
                )
                break;

            case "GithubAuthProvider":
                await signInWithRedirect(auth,githubAuthProvider).then(
                    (result)=>{
                        console.log(result)
                    }
                ).catch(
                    (error)=>{
                        console.log("Error:",error);
                    }
                )
                break;

            default:
                console.log("Google");
                break;
        }
    }
  return (
    <div onClick={handleAuthentication} className='w-full rounded-md border-blue-700 border-[2px] px-4 py-3 group hover:bg-blue-700 duration-150 hover:shadow-md active:scale-95 cursor-pointer flex items-center justify-between'>
        <Icon className='text-txtPrimary text-xl group-hover:text-white'/>
        <p className='text-lg group-hover:text-white'>{label}</p>
        <FaChevronRight className='group-hover:text-white'/>
    </div>
  )
}

export default AuthButtonWithProvider