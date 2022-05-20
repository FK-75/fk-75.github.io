import React from 'react'
import CV from '../../assets/Farid_Khan_CV.pdf'
import COVERLETTER from '../../assets/cover_letter.pdf'

const Call_To_Action = () => {
  return (
    <div className="cta">
        {/* <a href={CV} download className="btn">Download CV</a>
        <a href={COVERLETTER} download className="btn">Download Cover Letter for Borwell</a> */}
        <a href={CV} target="_blank" rel="noreferrer" className="btn">CV</a>
        <a href={COVERLETTER} target="_blank" rel="noreferrer" className="btn">Cover Letter for Borwell</a>
        <a href="#contact" className="btn btn-primary">Contact me</a>
    </div>
  )
}

export default Call_To_Action