import './Serie.css'
import '../../assets/style/loading.css'

import axios from "axios"
import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { ContentContext } from "../../context/ContentProvider"


export default function Serie() {
  const { state: { apiTemporadas, apiSerie }, dispatch } = useContext(ContentContext)
  //console.log('apiSerie: ', apiSerie);

  //const [dados, setDados] = useState([])
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
    return data.toLocaleDateString('pt-BR', { timeZone: 'UTC' })
  }

  function organizaArray(dataApi) {
    const array = []

    dataApi.map(gen => {
      return array.push(gen.name)
    })

    return array.join(' - ')
  }

  function corrigeStatus(dataApi) {
    switch (dataApi) {
      case 'Ended':
        return 'Finalizada'
      case 'Canceled':
        return 'Cancelada'
      case 'Returning Series':
        return 'Em Exibição'
    }
  }

  async function serieApi() {



    await axios.get(`https://api.themoviedb.org/3/tv/${id}?api_key=${process.env.REACT_APP_LKA_KEY}&language=pt-BR`)
      .then(resp => {
        const { name, poster_path, overview, number_of_seasons, last_episode_to_air, backdrop_path, first_air_date, genres, status, networks, episode_run_time } = resp.data

        //console.log(resp.data)
        const dadosSerieApi = [{
          id,
          titulo: name,
          poster: poster_path,
          capa_fundo: backdrop_path,
          temporada: number_of_seasons,
          sinopse: overview,
          data_inicio: arrumaData(first_air_date).slice(-4),
          generos: organizaArray(genres),
          status: corrigeStatus(status),
          canal: organizaArray(networks),
          tempo: episode_run_time,
          ultimo_ep: last_episode_to_air
        }]

        serieTemporada(number_of_seasons)


        dispatch({ type: 'ATUALIZA_SERIE', payload: dadosSerieApi })
      })

  }

  function adicionarFilmeNaLista() {

    const ep_n = apiSerie[0].ultimo_ep.episode_number
    const s_n = apiSerie[0].ultimo_ep.season_number

    const dados = {
      id: apiSerie[0].id,
      titulo: apiSerie[0].titulo,
      poster: apiSerie[0].poster,
      ultimo_ep: `${s_n}x${ep_n}`,

    }
    //console.log(apiSerie)
    if (localStorage.getItem('MINHA_SERIE') === null) {
      localStorage.setItem('MINHA_SERIE', JSON.stringify([dados]))
    }
    else {
      localStorage.setItem('MINHA_SERIE', JSON.stringify([
        ...JSON.parse(localStorage.getItem('MINHA_SERIE')),
        dados
      ]))
    }
  }


  async function serieTemporada(number_of_seasons) {
    const temporadas = []


    for (let i = 1; i <= number_of_seasons; i++) {
      await axios.get(`https://api.themoviedb.org/3/tv/${id}/season/${i}?api_key=${process.env.REACT_APP_LKA_KEY}&language=pt-BR`)
        .then(resp => {

          console.log(resp.data)
          const { episodes, season_number } = resp.data
          const numEps = +episodes.length

          temporadas.push({
            episodes: episodes.slice(0).reverse(),
            season_number,
            numero_ep: numEps
          })

          dispatch({ type: 'ATUALIZA_TEMP', payload: temporadas.slice(0).reverse() })
          //console.log(temporadas.numero_ep)
        })

    }

  }


  return (
    <>
      {apiSerie.map(serie => {
        return (
          <>
            <div>
              <div className='Serie-image'>
                <img src={`https://image.tmdb.org/t/p/w1280${serie.capa_fundo}`} alt="" />
              </div>

              <div className='Serie-dados'>
                {loading && <span class="loader"></span>}
                <div className='Serie-dados-agrupamento'>
                  <div>
                    <img className='Serie-dados-image' src={`https://image.tmdb.org/t/p/w154${serie.poster}`} alt="" />
                    <button onClick={adicionarFilmeNaLista}>ADICIONAR</button>
                  </div>

                  <div className='Serie-dados-box-content'>
                    <h1 className='Serie-dados-titulo'>{`${serie.titulo} (${serie.data_inicio})`}</h1>
                    <div className='Serie-dados-numero-temporada'>
                      <p style={{ color: '#b6283f' }}><strong>{exibir && `Status: ${serie.status} | ${serie.generos}`}</strong></p>
                      <p><strong>{exibir && `${serie.canal} `}{+serie.tempo.length !== 0 ? `| ${serie.tempo}min` : ''}</strong></p>
                    </div>
                    <p className='Serie-dados-sinopse'>{serie.sinopse}</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )
      })}

      <div className='Serie-apiDados-agrupamento'>
        {apiTemporadas.map(temporada => {
          return (
            <>
              <details>
                <summary>{`Temporada: ${temporada.season_number} - ${temporada.numero_ep > 1 ? 'Episódios:' : 'Episódio:'} ${temporada.numero_ep}`}</summary>

                {temporada.episodes.map(ep => {
                  const data_ep = arrumaData(ep.air_date)
                  return (
                    <>
                      <p>{ep.episode_number} - {ep.name} - <span style={{ color: '#b6283f' }}>{data_ep}</span></p>
                    </>
                  )
                })}
              </details>
            </>
          )
        })}
      </div>


    </>
  )
}