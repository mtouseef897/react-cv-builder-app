    import React, { Suspense } from 'react'
    import {Routes,Route} from 'react-router-dom'
import { Authentication, HomeScreen } from '../pages'
import {QueryClient,QueryClientProvider} from '@tanstack/react-query';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

    const App = () => {
      const queryClient=new QueryClient();
      return (
        <QueryClientProvider client={queryClient}>         
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path='/*' element={<HomeScreen/>} />
          <Route path='/auth' element={<Authentication/>} />
        </Routes>
      </Suspense>
      <ToastContainer theme='dark' position='top-right'/>
      <ReactQueryDevtools initialIsOpen={false}/>
      </QueryClientProvider>
      )
    }
    
    export default App