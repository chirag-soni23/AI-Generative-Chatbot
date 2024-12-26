import React from 'react'
import { useLocation } from 'react-router-dom'

const Project = () => {
    const location = useLocation();
    console.log(location.state)
  return (
    <main className='h-screen w-screen flex'>
        <section className='left h-full min-w-60 bg-red-300'>

        </section>
    </main>
  )
}

export default Project;