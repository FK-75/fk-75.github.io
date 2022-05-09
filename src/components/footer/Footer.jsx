import React from 'react'
import './footer.css'
import {BsLinkedin, BsDiscord} from 'react-icons/bs'
import {FaGithub} from 'react-icons/fa'

const Footer = () => {
  return (
    <footer>
      <a href="#" className="footer__logo">Farid Khan</a>

      <ul className="permalinks">
        <li><a href="#">Home</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#experience">Experience</a></li>
        <li><a href="#portfolio">Portfolio</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>

      <div className="footer__socials">
        <a href="https://www.linkedin.com/in/faridmkhan/" target="_blank"><BsLinkedin /></a>
        <a href="https://github.com/FK-75" target="_blank"><FaGithub /></a>
        <a href="http://discord.com/users/760082645438169139" target="_blank"><BsDiscord /></a>
      </div>

      <div className="footer__copyright">
        <small>&copy; Farid Khan. All rights reserved.</small>
      </div>
    </footer>
  )
}

export default Footer