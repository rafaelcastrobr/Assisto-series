import axios from "axios"
import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { ContentContext } from "../../context/ContentProvider"


export default function Serie() {
  const { state: { apiTemporadas }, dispatch } = useContext(ContentContext)

  const [dados, setDados] = useState([])

  const { id } = useParams()

  useEffect(() => {
    serieApi()
  }, [id]);

  function serieApi() {
    axios.get(`https://api.themoviedb.org/3/tv/${id}?api_key=${process.env.REACT_APP_LKA_KEY}&language=pt-BR`)
      .then(resp => {
        const { name, poster_path, overview, number_of_seasons } = resp.data


        setDados({
          id,
          titulo: name,
          poster: `https://image.tmdb.org/t/p/w92${poster_path}`,
          sinopse: overview,
        })

        serieTemporada(number_of_seasons)
      })

  }


  function serieTemporada(number_of_seasons) {
    const temporadas = []

    for (let i = 1; i <= number_of_seasons; i++) {
      axios.get(`https://api.themoviedb.org/3/tv/${id}/season/${i}?api_key=${process.env.REACT_APP_LKA_KEY}&language=pt-BR`)
        .then(resp => {
          

          const { episodes, season_number } = resp.data
          
          temporadas.push({
              episodes,
              season_number
            }
          )
          
          dispatch({ type: 'ATUALIZA_TEMP', payload: temporadas })
        })
        
        console.log(temporadas)
    }

  }


  return (
    <>
      <div>
        <img src={dados.poster} alt="" />
        <h1>{dados.titulo}</h1>
        <p>{dados.sinopse}</p>

        {console.log(apiTemporadas)}
        {apiTemporadas.map(temporada => {
          return (
            <>

              <h3>Temporadas: {temporada.season_number}</h3>

              {temporada.episodes.map(ep => {
                return (
                  <>
                    <p>{ep.episode_number} - {ep.name}</p>
                  </>
                )
              })}
            </>
          )
        })}

      </div>
    </>
  )
}