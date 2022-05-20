import React from 'react'
import './contact.css'
import {MdOutlineEmail} from 'react-icons/md'
import {BsDiscord, BsLinkedin} from 'react-icons/bs'

function Contact() {
  return (
    <section id="contact">
      <h5>Get In Touch</h5>
      <h2>Contact Me</h2>

      <div className="container contact__container">
        <div className="contact__options">
          <article className="contact__option">
            <MdOutlineEmail className="contact__option-icon"/>
            <h4>Email</h4>
            <h5>farid_khan75@hotmail.com</h5>
            <a href="mailto:farid_khan75@hotmail.com">Send a message</a>
          </article>
          <article className="contact__option" >
            <BsDiscord className="contact__option-icon"/> 
            <h4>Discord</h4>
            <h5>Farid Khan</h5>
            <a href="http://discord.com/users/760082645438169139" target="_blank">Send a message</a>
          </article>
          <article className="contact__option">
            <BsLinkedin className="contact__option-icon"/> 
            <h4>LinkedIn</h4>
            <h5>Farid Khan</h5>
            <a href="https://www.linkedin.com/in/faridmkhan/" target="_blank">Send a message</a>
          </article>
        </div>
        {/* END OF CONTACT OPTIONS */}
        

        <form action="">
          <input type="text" name="name" placeholder="Your Full Name" required />
          <input type="email" name="email" placeholder="Your Email" required />
          <textarea name="message" rows="7" placeholder="Your Message" required ></textarea>
          <button type="submit" className="btn btn-primary">Send Message</button>
        </form>
      </div>
    </section>
  )
}

export default Contact