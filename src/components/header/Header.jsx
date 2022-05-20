import React from 'react'
import './header.css'
import CTA from './Call_To_Action'
// import Me from '../../assets/me.png'
import Me from '../../assets/portfolio1.png'
import HeaderSocials from './HeaderSocials'

const Header = () => {
  return (
    <header>
      <div className="container header__container">
        <h5>Hello I'm</h5>
        <h1>Farid Khan</h1>
        <h5 className="text-light">Student at The University of Birmingham</h5>
        <CTA />
        <HeaderSocials />

        <div className="me">
          <img src={Me} alt="" />
          {/* <a href="#portfolio" target="_blank" rel="noreferrer" className="btn">CV</a> */}
          <a href="#portfolio" className="portfolio-btn">See Project</a>
        </div>

        <a href="#contact" className='scroll__down'>Scroll Down</a>
      </div>
    </header>
  )
}

export default Header