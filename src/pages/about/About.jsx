import React from 'react'
import { MdHome } from "react-icons/md";
import image from "../../assets/image.png"
import html from "../../assets/html.png"
import css from "../../assets/css.png"
import js from "../../assets/js.png"
import react from "../../assets/react.png"
import redux from "../../assets/redux.png"
import bootstrap from "../../assets/bootstrap.png"
import tailwind from "../../assets/tailwind.png"
import java from "../../assets/java.png"
import php from "../../assets/php.png"
import mysql from "../../assets/mysql.png"
import figma from "../../assets/figma.png"
import { Link } from 'react-router-dom';
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);
const About = () => {

  const data = [
    {
      id: 1,
      image: html
    },
    {
      id: 2,
      image: css
    },
    {
      id: 3,
      image: js
    },
    {
      id: 4,
      image: react
    },
    {
      id: 5,
      image: bootstrap
    },
    {
      id: 6,
      image: tailwind
    },
    {
      id: 7,
      image: redux
    },
    {
      id: 8,
      image: java
    },
    {
      id: 9,
      image: php
    },
    {
      id: 10,
      image: mysql
    },
    {
      id: 11,
      image: figma
    },

  ]
  useGSAP(() => {
    gsap.from("#about", {
      y: 120,
      opacity: 0
    });
    const images = document.querySelectorAll(".image")
    images.forEach((image) => {
      gsap.from(image, {
        opacity: 0,
        scale: 0,
        stagger: 1,
        scrollTrigger: {
          trigger: image,
          start: "bottom bottom",
          end: "top 20%",

        },
        ease: "power1.inOut",
      });
    });
    const progrss = document.querySelectorAll(".progress")

    progrss.forEach((progress) => {
      gsap.from(progress, {
        width: 0,

        scrollTrigger: {
          trigger: progress,
          start: "bottom bottom",
          end: "top 20%",

        },
        ease: "power1.inOut",
      });
    });



  });


  return (
    <section className="w-full min-h-screen bgColor md:px-10 px-2">

      <div className='w-10 h-10 sticky top-10 z-10'>
        <Link to="/" className='w-10 h-10 rounded-full'>
          <div className='icons w-10 h-10 rounded-full text-2xl text-white flex justify-center items-center'>
            <MdHome />
          </div>
        </Link>
      </div >

      <div className='h-screen w-full flex justify-between items-center flex-wrap ' id='about'>
        <div className='md:w-1/2 w-full'>
          <img className="w-full h-full object-cover" src={image} alt="image" />
        </div>
        <div className='md:w-1/2 w-full mt-4 md:mt-0'>
          <h2 className='text-white text-3xl font-bold text-center uppercase'>About me</h2>
          <div className='w-full md:p-4 p-2'>
            <p className='text-white text-justify'>It's me <i><b>Dammar Singh Rana</b></i>. I am a <i><b>BCA Student</b></i>I'm working as a Frontend Developer. I'm highly skilled with JavaScript 💻 and all its associated runtimes. I've build some frontend project in the past and have built applications from scratch with modern web technologies. I'm someone who is always on the lookout for modern tools that would improve the experience of both the developers and end-users. I'm a huge Productivity nerd who constantly tries to implement workflows and processes that would help me improve my productivity as a developer.</p>
          </div>
        </div>
      </div>
      <div className='w-full py-10'>
        <div className='w-full mt-12'>
          <h2 className='text-white text-3xl font-bold uppercase text-center'>Skills</h2>
          <div className='flex justify-center flex-wrap gap-6  mt-12'>
            {
              data.map(item => (
                <img className='w-20 h-20 aspect-square rounded-xl image' src={item.image} alt={item.id} key={item.id} />
              ))
            }
          </div>
        </div>
        <div className='mt-20' >
          <span className='text-white text-2xl font-semibold uppercase'>HTML</span>
          <div className='h-5 w-full bg-white rounded-xl ' >
            <div className='h-full w-[90%] bg-blue-700 rounded-xl progress'>
            </div>
          </div>
          <span className='text-white text-2xl font-semibold uppercase'>css</span>
          <div className='h-5 w-full bg-white rounded-xl '>
            <div className='h-full w-[70%] bg-blue-700 rounded-xl progress'>
            </div>
          </div>
          <span className='text-white text-2xl font-semibold uppercase'>js</span>
          <div className='h-5 w-full bg-white rounded-xl'>
            <div className='h-full w-[80%] bg-blue-700 rounded-xl progress'>
            </div>
          </div>
          <span className='text-white text-2xl font-semibold uppercase'>React</span>
          <div className='h-5 w-full bg-white rounded-xl'>
            <div className='h-full w-[70%] bg-blue-700 rounded-xl progress'>
            </div>
          </div>
          <span className='text-white text-2xl font-semibold uppercase'>redux</span>
          <div className='h-5 w-full bg-white rounded-xl'>
            <div className='h-full w-[60%] bg-blue-700 rounded-xl progress'>
            </div>
          </div>
          <span className='text-white text-2xl font-semibold uppercase'>bootstrap</span>
          <div className='h-5 w-full bg-white rounded-xl'>
            <div className='h-full w-[70%] bg-blue-700 rounded-xl progress'>
            </div>
          </div>
          <span className='text-white text-2xl font-semibold uppercase'>tailwind</span>
          <div className='h-5 w-full bg-white rounded-xl'>
            <div className='h-full w-[75%] bg-blue-700 rounded-xl progress'>
            </div>
          </div>
          <span className='text-white text-2xl font-semibold uppercase'>java</span>
          <div className='h-5 w-full bg-white rounded-xl'>
            <div className='h-full w-[60%] bg-blue-700 rounded-xl progress'>
            </div>
          </div>
          <span className='text-white text-2xl font-semibold uppercase'>php</span>
          <div className='h-5 w-full bg-white rounded-xl'>
            <div className='h-full w-[65%] bg-blue-700 rounded-xl progress'>
            </div>
          </div>
          <span className='text-white text-2xl font-semibold uppercase'>mysql</span>
          <div className='h-5 w-full bg-white rounded-xl '>
            <div className='h-full w-[60%] bg-blue-700 rounded-xl progress'>
            </div>
          </div>
        </div>
      </div>
    </section >
  )
}

export default About