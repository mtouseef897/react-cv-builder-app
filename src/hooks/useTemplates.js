import React from 'react'
import {useQuery} from '@tanstack/react-query'
import {toast} from 'react-toastify'
import { getTemplates } from '../api'

const useTemplates = () => {

    const {data,isLoading,isError,refetch}=useQuery({
        queryKey:['templates'],
        queryFn:async()=>{
            try {
          
                const templates=await getTemplates();
                return templates;
            } catch (error) {
                
                    toast.err("Something Went Wrong :(")
                
            }
        },


    }  )

    return {data,isLoading,isError,refetch}
}

export default useTemplates