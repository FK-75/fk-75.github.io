import React from 'react'
import './portfolio.css'
import IMG1 from '../../assets/portfolio1.png'
import {IMG2} from '../../assets/portfolio1.png'
import {IMG3} from '../../assets/portfolio1.png'
import {IMG4} from '../../assets/portfolio1.png'
import {IMG5} from '../../assets/portfolio1.png'
import {IMG6} from '../../assets/portfolio1.png'

const Portfolio = () => {
  return (
    <section id="portfolio">
      <h5>My Recent Projects</h5>
      <h2>Portfolio</h2>

      <div className="container portfolio__container">
        <article className="portfolio__item">
          <div className="portfolio__item-image">
            <img src={IMG1} alt="" />
          </div>
          <h3>This is a portfolio item title</h3>
          <a href="https://github.com/" className="btn" target="_blank">Github</a>
          {/* <a href="https://github.com/" className="btn btn-primary">Live Demo</a> */}
        </article>
      </div>
    </section>
  )
}

export default Portfolio