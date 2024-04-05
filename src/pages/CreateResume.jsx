import React from 'react'
import {Routes,Route} from 'react-router-dom'
import { TemplateData } from '../utils/helpers'

const CreateResume = () => {
  return (
    <div className=' w-full flex flex-col items-center justify-start py-4'>
          <Routes>
            {
              TemplateData.map(template=>(
                  <Route key={template.id} path={`/${template.name}`} Component={template.component}/>
              ))
            }
       
          </Routes>
    </div>
  )
}

export default CreateResume