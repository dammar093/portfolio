import React, { useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import image from "../../assets/image.png"
import { IoMdPerson, IoMdCall } from "react-icons/io";
import { VscGithub } from "react-icons/vsc";
import { RiComputerFill } from "react-icons/ri";
import { MdMail } from "react-icons/md";
import { FaFileAlt, FaInstagram, FaLinkedin } from "react-icons/fa";
import resume from '../../assets/resume.pdf'
import gsap from 'gsap';
import "./Home.css"
import { useGSAP } from '@gsap/react';

const Home = () => {
  const [stop, setStop] = useState(false)

  const links = [
    {
      id: 1,
      icon: IoMdPerson,
      to: "about",
      style: "absolute top-[-30px] left-[40%]",
      title: "about"
    },
    {
      id: 2,
      icon: RiComputerFill,
      to: "project",
      style: "absolute top-[10%] right-[0px]",
      title: "project"
    },
    {
      id: 3,
      icon: MdMail,
      to: "contact",
      style: "absolute top-[50%] right-[-40px]",
      title: "contact"

    },
    {
      id: 4,
      icon: IoMdCall,
      to: "tel:+9779809498493",
      style: "absolute bottom-[20px] right-[5%]",
      title: "call"
    },
    {
      id: 5,
      icon: FaLinkedin,
      to: "https://www.linkedin.com/in/dammar-rana-983077238/",
      style: "absolute bottom-[-30px] left-[40%]",
      title: "linkedin"

    },
    {
      id: 6,
      icon: FaInstagram,
      to: "https://www.instagram.com/dyams_singh/",
      style: "absolute top-[50%] left-[-40px]",
      title: "instagram"
    },
    {
      id: 7,
      icon: VscGithub,
      to: "https://github.com/dammar093",
      style: "absolute bottom-[20px] left-[5%]",
      title: "github"
    },
    {
      id: 8,
      icon: FaFileAlt,
      to: resume,
      style: "absolute top-[10%] left-[0px]",
      title: "resume"
    },
  ]

  useGSAP(() => {
    gsap.from('#text', {
      scale: 0,
      opacity: 0,

    })

    gsap.from('#image', {
      opacity: 0,
      scale: 0,

    })

    let links = document.querySelectorAll(".link")
    links.forEach((link, index) => {
      gsap.from(link, {
        opacity: 0,
        duration: index * 2 + 1,
        stagger: 1,
        scale: 0
      })
    })

  })


  return (

    <section className="h-screen w-full overflow-hidden bgColor flex justify-center items-center flex-col p-2 md:p-4" id='home'  >

      <div className="text-center" id='text'>
        <p className="text-white md:text-3xl uppercase font-extrabold text-sm mt-20 ">👋 Hello It's me Dammar</p>
        <p className='text-white md:text-xl uppercase font-semibold text-sm'>Front-End Developer</p>
      </div>

      <div className='w-full flex justify-center items-center'>
        <div className=" ">
          {
            links.map((link, index) => {
              if (index > 3) {
                return (<NavLink to={link.to} className={` w-12 h-12 rounded-full link `} key={link.id} >
                  <div className='w-12 h-12 rounded-full icons flex justify-center items-center text-white hover:text-slate-500 my-4' title={link.title}>
                    <link.icon className='text-2xl dyams' />
                  </div>
                </NavLink>)
              }
            })
          }
        </div>
        <div>
          <img className='h-[80vh]  w-full object-cover  mt-20' src={image} alt="dyams" id='image' />
        </div>
        <div className="">
          {
            links.map((link, index) => {
              if (index < 4) {
                return (<NavLink to={link.to} className={` w-12 h-12 rounded-full link `} key={link.id} >
                  <div className='w-12 h-12 rounded-full icons flex justify-center items-center text-white hover:text-slate-500 my-4' title={link.title}>
                    <link.icon className='text-2xl dyams' />
                  </div>
                </NavLink>)
              }
            })
          }
        </div>
      </div>
    </section >

  )
}

export default Home