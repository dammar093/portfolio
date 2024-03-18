import React from 'react'
import { MdHome } from "react-icons/md";
import { Link } from 'react-router-dom'
const Contact = () => {
  return (
    <section className='h-screen w-full bgColor p-2 md:p-4'>
      <div className='w-10 h-10 sticky top-10 z-10'>
        <Link to="/" className='w-10 h-10 rounded-full p-10 sticky top-0 z-10'>
          <div className='icons w-10 h-10 rounded-full text-2xl text-white flex justify-center items-center'>
            <MdHome />
          </div>
        </Link>
      </div>
      <div className='w-full h-[80%] '>
        <h2 className='text-white text-3xl uppercase font-semibold text-center mb-10'>Contact Me</h2>
        <div className='md:w-[50%] m-auto w-full'>
          <form action="" className='w-full glassEffect p-6'>
            <div className='w-full'>
              <input className="px-4 py-2 w-full rounded" type="text" placeholder='Enter your name' required />

            </div>
            <div>
              <input className='px-4 py-2 w-full rounded mt-2' type="text" placeholder='Enter your email' required />

            </div>
            <div>
              <textarea className='px-4 py-2 w-full rounded mt-2 h-20 resize-none' name="" id="" cols="30" rows="10" placeholder='Message this is dummy mail doesn not send in furute I will make sending mail' required></textarea>

            </div>
            <button type='submit' className='bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500 text-white w-20 h-10 px-2 py-1 text-sm rounded'>Send</button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default Contact