import React from 'react'
import { MdHome } from "react-icons/md";
import { Link } from 'react-router-dom';
import "./Project.css"
import ss from '../../assets/ss.png'
import db from '../../assets/db.png'
import ec from '../../assets/ec.png'
import clz from '../../assets/clz.png'
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger)

const Project = () => {

  const data = [
    {
      id: 1,
      image: ss,
      titel: "eSound Store",
      about: ">This Project is a ecommerce project where sound system is sell. This is a Frontend project where it shows the design and developmen",
      demo: "https://dammar093.github.io/eSound/"
    },


    {
      id: 2,
      image: ec,
      titel: "Dyams Shop",
      about: ">This Project is an ecommerce project where clothes  is sell. This is a Frontend project where it shows the design and development.",
      demo: "https://dyams-shop.vercel.app/",
      tech: "React, ReduxToolkit, CSS and React Router"
    },
    {
      id: 3,
      image: db,
      titel: "Dashboard",
      about: ">This Project is an  admin panel where all activities are shows . This is a Frontend project where it shows the design and development.",
      demo: "https://admin-dashboard-nu-plum.vercel.app/",
      tech: "React, ReduxToolkit, Tailwind and React Router"
    },
    {
      id: 4,
      image: clz,
      titel: "College website",
      about: ">This Project a college website project. This is a Frontend project where it shows the design and development.",
      demo: "https://dammar093.github.io/jmc3.0/",
      tech: "HTML, Bootstrap and JS"
    },
    {
      id: 5,
      image: clz,
      titel: "College website",
      about: ">This Project a college website project. This is a Frontend project where it shows the design and development.",
      demo: "https://dammar093.github.io/jmc3.0/",
      tech: "HTML, Bootstrap and JS"
    },
    {
      id: 6,
      image: clz,
      titel: "College website",
      about: ">This Project a college website project. This is a Frontend project where it shows the design and development.",
      demo: "https://dammar093.github.io/jmc3.0/",
      tech: "HTML, Bootstrap and JS"
    },


  ]

  useGSAP(() => {
    gsap.from("#about", {
      y: 120,
      opacity: 0
    });
    const projects = document.querySelectorAll(".project")
    projects.forEach((project) => {
      gsap.from(project, {
        opacity: 0,
        y: 100,
        stagger: 1,
        scrollTrigger: {
          trigger: project,
          start: "0 90%",
          end: "top 20%"

        },
        ease: "power1.inOut",
      });
    });

  });

  return (
    <section className='bgColor min-h-screen w-full md:px-10 p-2'>

      <div className='w-10 h-10 sticky top-10 z-10'>
        <Link to="/" className='w-10 h-10 rounded-full p-10 sticky top-0 z-10'>
          <div className='icons w-10 h-10 rounded-full text-2xl text-white flex justify-center items-center'>
            <MdHome />
          </div>
        </Link>
      </div>
      <h2 className='text-white text-3xl font-semibold text-center uppercase'>Projects</h2>

      <div className='w-full mt-10 flex justify-center gap-4 flex-wrap'>
        {
          data.map((item) => (
            <div className='glassEffect w-[300px] p-4 project ' key={item.id}>
              <img className='w-full h-[200px] object-contain' src={item.image} alt={item.titel} />
              <div className='w-full p-2'>
                <h2 className='text-white text-md font-semibold'>{item.titel}</h2>
                <p className='text-white text-sm text-justify'>{item.about}</p>
                <p className='text-white text-sm text-justify'>{item.tech}</p>
              </div>
              <div className='w-full'>
                <Link to={item.demo} className='bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500 text-white w-20 h-12 px-4 py-2 text-sm rounded'>Live Demo</Link>
              </div>
            </div>
          ))
        }
      </div>
    </section >
  )
}

export default Project