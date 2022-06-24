import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './Home.css'

/*

setState({
          id,
          poster: `https://image.tmdb.org/t/p/w154${poster_path}`,
          titulo: name,
        })

        dispatch({ type: 'ADD_POPULARES', payload: state})



*/

export default function Home() {

  const [state, setState] = useState([])

  const img = 'https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-38-picture-grey-c2ebdbb057f2a7614185931650f8cee23fa137b93812ccb132b9df511df1cfac.svg'


  useEffect(() => {
    getSeriesPopular()
  }, []);

  async function getSeriesPopular() {
    await axios.get(`https://api.themoviedb.org/3/tv/popular?api_key=${process.env.REACT_APP_LKA_KEY}&language=pt-BR`)
      .then(resp => {

        setState(resp.data.results)
        console.log(state)
      })
  }

  return (
    <>
    <h2>Populares</h2>
    <div className="Home-container">
      {state.map(dados => {
        return (
          <>
            <div className="Home-populares">
              <Link to={`/serie/${dados.id}`}>

              {dados.poster_path === null ? (
                  <img src={img} style={{ width: '92px' }} alt='poster' />
                )
                  :
                  (
                    <img src={`https://image.tmdb.org/t/p/w92${dados.poster_path}`} alt={dados.name} />
                  )
                }
              </Link>
            </div>

          </>
        )
      })}
      </div>
    </>
  )
}