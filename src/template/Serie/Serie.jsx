import './Serie.css'
import '../../assets/style/loading.css'

import axios from "axios"
import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { ContentContext } from "../../context/ContentProvider"
import { epTrue_svg, epFalse_svg } from '../../assets/img/ImportImg'

//continuar verificar

export default function Serie() {
  const { state: { apiTemporadas, apiSerie, ultimoProxEp }, dispatch } = useContext(ContentContext)

  const [loading, setLoading] = useState(true)
  const [exibirEpAdicionar, setExibirEpAdicionar] = useState(false)
  const [adicionado, setAdicionado] = useState(false)
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

  function verificaUltimoEp(ultProxEp, status, temporadas) {

    if (status === "Em Exibição" && ultProxEp !== null) {

      const data = arrumaData(ultProxEp.air_date)
      const epNumber = ultProxEp.episode_number
      const tempNumber = ultProxEp.season_number
      const dados = `${data} - ${tempNumber}x${epNumber}`

      dispatch({ type: 'ATUALIZA_STATUS_PROX_EP', payload: dados, exibir: true })

    } else if (status !== "Em Exibição" && ultProxEp === null) {

      dispatch({ type: 'ATUALIZA_STATUS_PROX_EP', exibir: false })
    }

    if (status === "Em Exibição" && ultProxEp === null) {

      const dados = `T${+temporadas + 1}..`
      dispatch({ type: 'ATUALIZA_STATUS_PROX_EP', payload: dados, exibir: true })

    }

  }

  function buscaTemporadaBotao(temporada_id) {
    let check = true
    const series = JSON.parse(localStorage.getItem('MINHA_SERIE')) || []
    series.map(serie => {
      serie.temporadas.map(temp_id => {
        if (+temp_id == +temporada_id) {
          return check = false
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
        const { name, poster_path, overview, number_of_seasons, next_episode_to_air, backdrop_path, first_air_date, genres, status, networks, episode_run_time } = resp.data

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
        }]

        serieTemporada(number_of_seasons, corrigeStatus(status))
        verificaUltimoEp(next_episode_to_air, corrigeStatus(status), number_of_seasons)

        dispatch({ type: 'ATUALIZA_SERIE', payload: dadosSerieApi })
      })

  }

  function adicionarSerieNaLista() {
    setAdicionado(true)

    if (adicionado) return

    dispatch({ type: 'ATUALIZA_CHECK' })

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

  async function serieTemporada(number_of_seasons, status) {
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
            data_temp: arrumaData(air_date).slice(-4),
            status
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
      const todasTemp = []

      if (+serie.id === +id) {
        dispatch({ type: 'ATUALIZA_CHECK' })
        serie.eps.push(id_episodio)

        apiTemporadas.map(temporada => {
          if (+id_temporada === temporada.id) {
            const proxEp = +num_ep + 1
            const temporadaAtual = num_temporada
            const tamanhoEps = +temporada.episodes.length
            const tamanhoTemp = +apiTemporadas.length
            const status = temporada.status

            todasTemp.push(id_temporada)
            const temporadas = serie.temporadas
            serie.temporadas = todasTemp.concat(temporadas)

            serie.ultimo_ep_visto = verificaProxEp(proxEp, temporadaAtual, tamanhoEps, tamanhoTemp, status)

            serie.eps.map(ep => {
              temporada.episodes.map(id => {
                if (+ep === +id.id) {
                  dispatch({ type: 'ATUALIZA_CHECK' })

                } else {
                  dispatch({ type: 'ATUALIZA_CHECK' })

                }
              })

            })
          }
        })
      }
    })
    localStorage.setItem('MINHA_SERIE', JSON.stringify(series))
  }

  function verificaProxEp(proxEp, temporadaAtual, tamanhoEps, tamanhoTemp, status) {
    const proxTemp = +temporadaAtual + 1
    
    if (+proxEp <= +tamanhoEps) {

      return `${temporadaAtual}x${proxEp}`
    }
    if (+proxEp > +tamanhoEps && proxTemp <= +tamanhoTemp) {
      return `${proxTemp}x1`
    }

    if (+proxTemp > +tamanhoTemp && status !== 'Em Exibição') {
      return `Completa`
    }

    if (+proxEp > +tamanhoEps && proxTemp > +tamanhoTemp) {
      return `T${proxTemp}..`
    }


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
    let ultEp = ''
    const series = JSON.parse(localStorage.getItem('MINHA_SERIE'))


    apiTemporadas.map(temporada => {
      if (id_temporada === temporada.id) {
        const proxEp = +temporada.numero_ep + 1
        const temporadaAtual = temporada.season_number
        const tamanhoEps = temporada.episodes.length
        const tamanhoTemp = apiTemporadas.length
        const status = temporada.status

        ultEp = verificaProxEp(proxEp, temporadaAtual, tamanhoEps, tamanhoTemp, status)

        todasTemp.push(id_temporada)

        temporada.episodes.map(id_ep => {

          dispatch({ type: 'ATUALIZA_CHECK' })
          todosEp.push(id_ep.id)
        })

      }
    })
    series.map(serie => {
      if (+serie.id === +id) {
        dispatch({ type: 'ATUALIZA_CHECK' })
        const episodios = serie.eps
        const temporadas = serie.temporadas
        serie.eps = todosEp.concat(episodios)
        serie.temporadas = todasTemp.concat(temporadas)
        serie.ultimo_ep_visto = ultEp


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
                      <p>{ultimoProxEp.exibir && `Próx Exibição: ${ultimoProxEp.ep}`}</p>

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
          const botaoAdcTodasTemp = buscaTemporadaBotao(temporada.id)

          return (
            <>
              <details id={temporada.id}>
                <summary >{`Temporada: ${temporada.season_number} - ${temporada.numero_ep > 1 ? 'Episódios:' : 'Episódio:'} ${temporada.numero_ep} - ${temporada.data_temp}`}</summary>
                <div className='Serie-apiDados-agrupamento-BotaoAdcTemporadaInteira'>
                  {exibirEpAdicionar && <>
                    {botaoAdcTodasTemp ?
                      <button onClick={() => adcTodosEp(temporada.id)}>MARCAR TODA TEMP</button> : ''}
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
                              {epTrue_svg}
                            </div>
                            :
                            <div onClick={() => adicioneiEp(ep.id, temporada.season_number, ep.episode_number, temporada.id)} >
                              {epFalse_svg}
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