import {useQuery} from '@tanstack/react-query'

const useFilters = () => {
 const {data,isLoading,isError,refetch}=useQuery(
    {
queryKey:['globalFilters'],
queryFn:async()=>({searchTerm:""}),
refetchOnWindowFocus:false
    }
 )

 return {data,isLoading,isError,refetch}
}

export default useFilters