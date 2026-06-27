import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../Common/Header'
import Footer from '../Common/Footer'

const UserLayout = () => {
  return (
    <div>

        {/* Header */}
        <Header/>
        
        {/* Main Content */}
        <main>
            <Outlet />
        </main>

        {/* Footer */}
        <Footer/>

        {/* Live Chat Button */}
        <div className="fixed right-0 top-1/2 transform -translate-y-1/2 bg-[#832729] text-white px-2 py-6 rounded-l-md shadow-lg cursor-pointer hover:bg-[#6a1f21] transition-colors z-50">
          <span className="writing-vertical-rl transform rotate-180 text-sm font-semibold tracking-wider">
            LiveChat
          </span>
        </div>

    </div>
  )
}

export default UserLayout
