import './Serie.css'
import '../../assets/style/loading.css'

import axios from "axios"
import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { ContentContext } from "../../context/ContentProvider"


export default function Serie() {
  const { state: { apiTemporadas, apiSerie }, dispatch } = useContext(ContentContext)

  const [loading, setLoading] = useState(true)
  const [exibirEpAdicionar, setExibirEpAdicionar] = useState(false)
  const [adicionado, setAdicionado] = useState(false)
  const [epChecked, setEpChecked] = useState(false)
  const { id } = useParams()

  useEffect(() => {

    dispatch({ type: 'RESETA_PAGE' })

    setTimeout(() => {
      serieApi()
      buscaSerieId()
      setLoading(false)
    }, 1000);
    // eslint-disable-next-line
  }, [id]);


  function buscaSerieId() {
    if (localStorage.getItem('MINHA_SERIE')) {
      const series = JSON.parse(localStorage.getItem('MINHA_SERIE'))
      series.forEach(serie => {
        if (serie.id === id) {
          setAdicionado(true)
          setExibirEpAdicionar(true)

        }
      })
    }
  }

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
      default:
        return '-'
    }
  }

  async function serieApi() {

    await axios.get(`https://api.themoviedb.org/3/tv/${id}?api_key=${process.env.REACT_APP_LKA_KEY}&language=pt-BR`)
      .then(resp => {
        const { name, poster_path, overview, number_of_seasons, last_air_date, backdrop_path, first_air_date, genres, status, networks, episode_run_time } = resp.data

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
          ultimo_ep: arrumaData(last_air_date)
        }]

        serieTemporada(number_of_seasons)


        dispatch({ type: 'ATUALIZA_SERIE', payload: dadosSerieApi })
      })

  }

  function adicionarSerieNaLista() {
    setAdicionado(true)

    if (adicionado) return

    setExibirEpAdicionar(true)
    //console.log(apiTemporadas)

    function separaEp() {
      const temp = []
      apiTemporadas.map(temporada => {
        temp.push({
          temporada: temporada.season_number,
          episodios: temporada.episodes.map(ep => {
            return {
              num: ep.episode_number,
              id: ep.id,
              checkIn: false,
            }

          })
        })
      })
      return temp
    }

    const dados = {
      id: apiSerie[0].id,
      titulo: apiSerie[0].titulo,
      poster: apiSerie[0].poster,
      eps: {
        idTemps: [],
        idEps: []
      }
    }

    //console.log(dados)
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

  function removerSerieDaLista() {

    const series = JSON.parse(localStorage.getItem('MINHA_SERIE'))
    series.forEach(serie => {
      if (serie.id === id) (
        setAdicionado(false)
      )
    })

    setExibirEpAdicionar(false)

    const dadosDelet = series.filter(serie => id !== serie.id)

    localStorage.setItem('MINHA_SERIE', JSON.stringify(dadosDelet))

  }

  async function serieTemporada(number_of_seasons) {
    const temporadas = []


    for (let i = 1; i <= number_of_seasons; i++) {
      await axios.get(`https://api.themoviedb.org/3/tv/${id}/season/${i}?api_key=${process.env.REACT_APP_LKA_KEY}&language=pt-BR`)
        .then(resp => {

          //console.log(resp.data)
          const { episodes, season_number, id } = resp.data
          const numEps = +episodes.length

          temporadas.push({
            episodes: episodes.slice(0).reverse(),
            season_number,
            numero_ep: numEps,
            id
          })


          dispatch({ type: 'ATUALIZA_TEMP', payload: temporadas.slice(0).reverse() })
          //console.log(temporadas.numero_ep)
        })
    }
  }

  //id_episodio, id_temporada
  function adicioneiEp(e) {
    const id_episodio = e.target.attributes.idEp.value
    const id_temporada = e.target.attributes.idTemp.value

    const series = JSON.parse(localStorage.getItem('MINHA_SERIE'))
    series.map(serie => {
      serie.eps.idEps.push(id_episodio)
      serie.eps.idTemps.push(id_temporada)
    })

    //console.log(series)

    localStorage.setItem('MINHA_SERIE', JSON.stringify(series))

  }

  function epCheck(id_episodio, id_temporada) {
    let check;
    const series = JSON.parse(localStorage.getItem('MINHA_SERIE'))
    series.map(serie => {
      serie.eps.idTemps.map(idTemp => {
        serie.eps.idEps.map(idEp => {
          if (+idEp === +id_episodio && +idTemp === +id_temporada) {
            return check = true
          }
        })
      })
    })

    return check
  }


  return (
    <>
      <div className='loading-class'>{loading && <span class="loader"></span>}</div>
      {apiSerie.map(serie => {
        return (
          <>
            <div>
              <div className='Serie-image'>
                <img src={`https://image.tmdb.org/t/p/w1280${serie.capa_fundo}`} alt="" />
              </div>

              <div className='Serie-dados'>

                <div className='Serie-dados-agrupamento'>
                  <div className='Serie-dados-poster-btn'>
                    <img className='Serie-dados-poster' src={`https://image.tmdb.org/t/p/w154${serie.poster}`} alt="" />
                    {adicionado ?
                      <button className='Serie-dados-btn RemoverSerie' onClick={removerSerieDaLista}>Remover Série</button>
                      :
                      <button className='Serie-dados-btn AdicionarSerie' onClick={adicionarSerieNaLista}>Adicionar Série</button>}
                  </div>

                  <div className='Serie-dados-box-content'>
                    <h1 className='Serie-dados-titulo'>{`${serie.titulo} (${serie.data_inicio})`}</h1>
                    <div className='Serie-dados-numero-temporada'>
                      <p style={{ color: '#b6283f' }}><strong>{`Status: ${serie.status} | ${serie.generos}`}</strong></p>
                      <p><strong>{`${serie.canal} `}{+serie.tempo.length !== 0 ? `| ${serie.tempo}min` : ''}</strong></p>
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
              <details id={temporada.id}>
                <summary >{`Temporada: ${temporada.season_number} - ${temporada.numero_ep > 1 ? 'Episódios:' : 'Episódio:'} ${temporada.numero_ep} - ${temporada.id}`}</summary>

                {temporada.episodes.map(ep => {

                  const data_ep = arrumaData(ep.air_date)
                  return (
                    <>
                      <p>
                        {ep.episode_number} - {ep.name} <span style={{ color: '#b6283f' }}>{data_ep}</span>
                        {exibirEpAdicionar && <input className='checkinpu' idEp={ep.id} idTemp={temporada.id} defaultChecked={epCheck(ep.id, temporada.id)} type="checkbox" onChange={adicioneiEp} /> }
                        
                      </p>
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