import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from "./pages/home/Home"
import About from "./pages/about/About"
import Project from "./pages/project/Project"
import Contact from "./pages/contact/Contact"

const App = () => {



  return (
    <Routes>
      <Route path='/' exact={<Home />} element={<Home />} />
      <Route path='/about' exact={<About />} element={<About />} />
      <Route path='/project' exact={<Project />} element={<Project />} />
      <Route path='/contact' exact={<Contact />} element={<Contact />} />
    </Routes>
  )
}

export default App