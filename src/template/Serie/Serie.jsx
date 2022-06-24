import './Serie.css'
import '../../assets/style/loading.css'

import axios from "axios"
import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { ContentContext } from "../../context/ContentProvider"


export default function Serie() {
  const { state: { apiTemporadas }, dispatch } = useContext(ContentContext)

  const [dados, setDados] = useState([])
  const [loading, setLoading] = useState(true)
  const [exibir, setExibir] = useState(false)

  const { id } = useParams()

  useEffect(() => {
    setTimeout(() => {
      serieApi()
      setLoading(false)
      setExibir(true)
    }, 1000);
  }, [id]);

  function arrumaData(dataApi) {
    const data = new Date(dataApi)
    return data.toLocaleDateString('pt-BR', {timeZone: 'UTC'})
  }

  function organizaGenero(dataApi) {
    const genero = []

    dataApi.map(gen => {
      return genero.push(gen.name) 
    })

    return genero.join(' - ')
  }

  async function serieApi() {
    await axios.get(`https://api.themoviedb.org/3/tv/${id}?api_key=${process.env.REACT_APP_LKA_KEY}&language=pt-BR`)
      .then(resp => {
        const { name, poster_path, overview, number_of_seasons, backdrop_path, first_air_date, genres } = resp.data

        console.log(resp.data)
        setDados({
          id,
          titulo: name,
          poster: `https://image.tmdb.org/t/p/w154${poster_path}`,
          capa_fundo: `https://image.tmdb.org/t/p/w1280${backdrop_path}`,
          temporada: number_of_seasons,
          sinopse: overview,
          data_inicio: arrumaData(first_air_date),
          generos: organizaGenero(genres),
        })

        serieTemporada(number_of_seasons)

      })

  }


  async function serieTemporada(number_of_seasons) {
    const temporadas = []


    for (let i = 1; i <= number_of_seasons; i++) {
      await axios.get(`https://api.themoviedb.org/3/tv/${id}/season/${i}?api_key=${process.env.REACT_APP_LKA_KEY}&language=pt-BR`)
        .then(resp => {

          //console.log(resp.data)
          const { episodes, season_number } = resp.data

          temporadas.push({
            episodes: episodes.slice(0).reverse(),
            season_number,
          })

          dispatch({ type: 'ATUALIZA_TEMP', payload: temporadas.slice(0).reverse() })
          //console.log(temporadas)
        })

    }

  }


  return (
    <>
      <div className='Serie-image'>
        <img src={dados.capa_fundo} alt="" />
      </div>

      <div className='Serie-dados'>
        {loading && <span class="loader"></span>}
        <div className='Serie-dados-agrupamento'>
          <div>
            <img className='Serie-dados-image' src={dados.poster} alt="" />
          </div>

          <div className='Serie-dados-box-content'>
            <h1 className='Serie-dados-titulo'>{dados.titulo}</h1>
            <p className='Serie-dados-numero-temporada'>
              {exibir && `
                ${dados.temporada} ${dados.temporada > 1 ? 'Temporadas' : 'Temporada'} | 
                ${dados.data_inicio} | 
                ${dados.generos}
              `}
            </p>

            <p className='Serie-dados-sinopse'>{dados.sinopse}</p>
          </div>
        </div>


        {console.log(apiTemporadas)}
        <div className='Serie-apiDados-agrupamento'>
          {apiTemporadas.map(temporada => {
            return (
              <>
                <details>
                  <summary>Temporada: {temporada.season_number}</summary>

                  {temporada.episodes.map(ep => {
                    const data_ep = arrumaData(ep.air_date)
                    return (
                      <>
                        <p>{ep.episode_number} - {ep.name} - <span style={{color: '#931026'}}>{data_ep}</span></p>
                      </>
                    )
                  })}
                </details>
              </>
            )
          })}
        </div>

      </div>
    </>
  )
}