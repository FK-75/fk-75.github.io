import React from 'react'
import CV from '../../assets/Farid_Khan_CV.pdf'

const Call_To_Action = () => {
  return (
    <div className="cta">
        <a href={CV} download className="btn">Download CV</a>
        <a href="#contact" className="btn btn-primary">Contact me</a>
    </div>
  )
}

export default Call_To_Action