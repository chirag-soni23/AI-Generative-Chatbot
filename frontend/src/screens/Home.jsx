import React from 'react'
import { useUser } from '../context/user.context'

const Home = () => {
  const {user} = useUser();
  return (
    <div>
      {JSON.stringify(user)}
    </div>
  )
}

export default Home