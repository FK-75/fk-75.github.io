import React from 'react'
import {BsLinkedin, BsDiscord} from 'react-icons/bs'
import {FaGithub} from 'react-icons/fa'

const HeaderSocials = () => {
  return (
    <div className="header__socials">
        <a href="https://www.linkedin.com/in/faridmkhan/" target="_blank"><BsLinkedin /></a>
        <a href="https://github.com/FK-75" target="_blank"><FaGithub /></a>
        <a href="http://discord.com/users/760082645438169139" target="_blank"><BsDiscord /></a>
    </div>
  )
}

export default HeaderSocials