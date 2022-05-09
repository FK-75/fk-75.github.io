import React from 'react'
import './portfolio.css'
import IMG1 from '../../assets/portfolio1.png'
import IMG2 from '../../assets/portfolio2.png'
import IMG3 from '../../assets/portfolio3.png'
import IMG4 from '../../assets/portfolio4.png'
import IMG5 from '../../assets/portfolio5.png'
import IMG6 from '../../assets/portfolio6.png'

const data = [
  {
    id: 1,
    image: IMG1,
    title: 'Image Noise Remover',
    github: 'https://github.com/FK-75/Image-Noise-Remover'
  },
  {
    id: 2,
    image: IMG2,
    title: 'Portfolio Website',
    github: 'https://github.com/FK-75/FK-75.github.io'
  },
  {
    id: 3,
    image: IMG3,
    title: 'Student Marking System',
    github: 'https://github.com/FK-75/Student-Marking-System'
  },
  {
    id: 4,
    image: IMG4,
    title: 'Rock Paper Scissors',
    github: 'https://github.com/FK-75/RockPaperScissors'
  },
  {
    id: 5,
    image: IMG5,
    title: 'Caesar Cipher',
    github: 'https://github.com/FK-75/Caesar-Cipher'
  },
  {
    id: 6,
    image: IMG6,
    title: 'Word-Frequency',
    github: 'https://github.com/FK-75/Word-Frequency'
  }
]

const Portfolio = () => {
  return (
    <section id="portfolio">
      <h5>My Recent Projects</h5>
      <h2>Portfolio</h2>

      <div className="container portfolio__container">
        {
          data.map(({id, image, title, github}) => {
            return (
              <article key={id} className="portfolio__item">
              <div className="portfolio__item-image">
                <img src={image} alt={title} />
              </div>
              <h3>{title}</h3>
              <div className="portfolio__item-cta">
                <a href={github} className="btn" target="_blank">Github</a>
                {/* <a href="https://github.com/" className="btn btn-primary">Live Demo</a> */}
              </div>
            </article>
            )
          })
        }
      </div>
    </section>
  )
}

export default Portfolio