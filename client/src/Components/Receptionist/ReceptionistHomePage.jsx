import React from 'react'
import Image from '../Image'
import MainContent from '../MainContent'
import Footer from '../Footer'
import ReceptionistContent from './ReceptionistContent'
import Navbar2 from './Navbar2'


const ReceptionistHomePage = () => {
     return (
    <div >
      <Navbar2/>
      <Image/>
      <ReceptionistContent/>
      <Footer/>
    </div>
  )
}

export default ReceptionistHomePage