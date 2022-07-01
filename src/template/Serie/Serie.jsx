import './Serie.css'
import '../../assets/style/loading.css'

import axios from "axios"
import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { ContentContext } from "../../context/ContentProvider"


export default function Serie() {
  const { state: { apiTemporadas, epChecked, apiSerie }, dispatch } = useContext(ContentContext)

  const [loading, setLoading] = useState(true)
  const [exibirEpAdicionar, setExibirEpAdicionar] = useState(false)
  const [adicionado, setAdicionado] = useState(false)
  const [botaoAdcTemporadaCompleta, setBotaoAdcTemporadaCompleta] = useState(false)
  //const [epChecked, setEpChecked] = useState(false)
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

  function buscaTemporadaBotao(temporada_id) {
    let check = false
    const series = JSON.parse(localStorage.getItem('MINHA_SERIE')) || []
    series.map(serie => {
      serie.temporadas.map(temp_id => {
        if (+temp_id === +temporada_id) {
          return check = true
        }
      })
    })
    return check
  }


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

    const dados = {
      id: apiSerie[0].id,
      titulo: apiSerie[0].titulo,
      poster: apiSerie[0].poster,
      eps: [],
      ultimo_ep_visto: '1x1',
      temporadas: []
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
          const { episodes, season_number, id, air_date } = resp.data
          const numEps = +episodes.length

          temporadas.push({
            episodes: episodes.slice(0).reverse(),
            season_number,
            numero_ep: numEps,
            id,
            data_temp: arrumaData(air_date).slice(-4)
          })

          dispatch({ type: 'ATUALIZA_TEMP', payload: temporadas.slice(0).reverse() })
        })
    }
  }

  function excluirEp(id_episodio, id_temporada) {

    const series = JSON.parse(localStorage.getItem('MINHA_SERIE'))
    series.map(serie => {
      if (+serie.id === +id) {
        dispatch({ type: 'ATUALIZA_CHECK' })
        const listaAppAtt = serie.eps.filter(ep => +ep !== +id_episodio)
        const listaTempAtt = serie.temporadas.filter(temporadas => +temporadas !== +id_temporada)
        serie.temporadas.length = 0
        serie.temporadas = listaTempAtt
        serie.eps.length = 0
        serie.eps = listaAppAtt
        serie.ultimo_ep_visto = ''
      }
    })

    localStorage.setItem('MINHA_SERIE', JSON.stringify(series))

  }

  function adicioneiEp(id_episodio, num_temporada, num_ep, id_temporada) {

    const series = JSON.parse(localStorage.getItem('MINHA_SERIE'))
    series.map(serie => {
      if (+serie.id === +id) {
        dispatch({ type: 'ATUALIZA_CHECK' })
        serie.eps.push(id_episodio)

        apiTemporadas.map(temporadas => {
          if (+id_temporada === temporadas.id) {
            const proxEp = +num_ep + 1
            const proxTemp = +num_temporada + 1

            if (proxEp <= +temporadas.episodes.length) {

              serie.ultimo_ep_visto = `${num_temporada}x${proxEp}`
            }
            if (proxEp > +temporadas.episodes.length && proxTemp <= +apiTemporadas.length) {
              serie.ultimo_ep_visto = `${proxTemp}x1`
            }

            if (proxEp > +temporadas.episodes.length && proxTemp > +apiTemporadas.length) {
              serie.ultimo_ep_visto = `T${proxTemp}..`
            }



          }
        })
      }
    })

    localStorage.setItem('MINHA_SERIE', JSON.stringify(series))
  }

  function epCheck(id_episodio) {

    const series = JSON.parse(localStorage.getItem('MINHA_SERIE')) || []
    let check = false;
    series.map(serie => {
      serie.eps.map(ep => {
        if (+ep === +id_episodio) {
          return check = true
        }
      })
    })
    return check
  }

  function adcTodosEp(id_temporada) {
    const todosEp = []
    const todasTemp = []
    const series = JSON.parse(localStorage.getItem('MINHA_SERIE'))

    apiTemporadas.map(temporadas => {
      if (id_temporada === temporadas.id) {
        todasTemp.push(id_temporada)
        temporadas.episodes.map(id_ep => {

          dispatch({ type: 'ATUALIZA_CHECK' })
          todosEp.push(id_ep.id)

        }
        )
      }
    })
    //console.log(todosEp)

    series.map(serie => {
      if (+serie.id === +id) {
        dispatch({ type: 'ATUALIZA_CHECK' })
        const episodios = serie.eps
        const temporadas = serie.temporadas
        serie.eps = todosEp.concat(episodios)
        serie.temporadas = todasTemp.concat(temporadas)
      }
    })

    localStorage.setItem('MINHA_SERIE', JSON.stringify(series))
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
                      <button className='Serie-dados-btn RemoverSerie' onClick={removerSerieDaLista}>REMOVER SÉRIE</button>
                      :
                      <button className='Serie-dados-btn AdicionarSerie' onClick={adicionarSerieNaLista}>ADICIONAR SÉRIE</button>
                    }
                  </div>

                  <div className='Serie-dados-box-content'>
                    <h1 className='Serie-dados-titulo'>{`${serie.titulo} (${serie.data_inicio})`}</h1>
                    <div className='Serie-dados-numero-temporada'>
                      <p style={{ color: '#b6283f' }}><strong>{`${serie.generos}`}</strong></p>
                      <p><strong>{`${serie.canal}`}{+serie.tempo.length !== 0 ? ` | ${serie.tempo}min | ` : ' | '} {`${serie.status}`}</strong></p>
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
          const botaoAdcTemporadaCompleta = buscaTemporadaBotao(temporada.id)

          return (
            <>
              <details id={temporada.id}>
                <summary >{`Temporada: ${temporada.season_number} - ${temporada.numero_ep > 1 ? 'Episódios:' : 'Episódio:'} ${temporada.numero_ep} - ${temporada.data_temp}`}</summary>
                <div className='Serie-apiDados-agrupamento-BotaoAdcTemporadaInteira'>
                  {exibirEpAdicionar && <>
                    {botaoAdcTemporadaCompleta ? '' :
                      <button onClick={() => adcTodosEp(temporada.id)}>MARCAR TODA TEMP</button>}
                  </>}
                </div>
                {temporada.episodes.map(ep => {
                  const data_ep = arrumaData(ep.air_date)
                  const epChecked = epCheck(ep.id, temporada.id)

                  return (
                    <>
                      <div className='Serie-apiDados-agrupamento-ep' id={ep.id} >
                        <p>{ep.episode_number} - {ep.name} <span style={{ color: '#b6283f' }}>{data_ep}</span></p>
                        {exibirEpAdicionar && <>

                          {epChecked ?

                            <div onClick={() => excluirEp(ep.id, temporada.id)}>
                              <svg color='green' xmlns="http://www.w3.org/2000/svg" className="inputchecktrue" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            </div>
                            :
                            <div onClick={() => adicioneiEp(ep.id, temporada.season_number, ep.episode_number, temporada.id)} >

                              <svg color='gray' xmlns="http://www.w3.org/2000/svg" className="inputcheckfalse" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            </div>
                          }

                        </>}
                      </div>
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