import axios from "axios";
import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { ContentContext } from "../../context/ContentProvider";
import './Home.css'
import { EmAlta_svg, MinhaLista_svg, ListaBookNull_svg, img_png_url } from "../../assets/img/ImportImg";
document.title = 'Assisto Série'


export default function Home() {
  const { state: { populares, minhas_series }, dispatch } = useContext(ContentContext)



  useEffect(() => {
    getSeriesPopular()
    pegaDadosApiMinhaSerie()

    // eslint-disable-next-line
  }, []);



  function pegaDadosApiMinhaSerie() {
    if (localStorage.getItem('MINHA_SERIE')) {

      const dados = JSON.parse(localStorage.getItem('MINHA_SERIE'))
      dados.sort((a, b) => {
        if (a.titulo < b.titulo) {
          return -1
        } else {
          return true
        }
      })

      dispatch({ type: 'ATUALIZA_MINHA_LISTA', payload: dados })
    }
  }

  async function getSeriesPopular() {
    await axios.get(`https://api.themoviedb.org/3/tv/popular?api_key=${process.env.REACT_APP_LKA_KEY}&language=pt-BR`)
      .then(resp => {
        const dados = resp.data.results
        dispatch({ type: 'ATUALIZA_HOME', payload: dados.slice(0, 10) })
      })
  }

  return (
    <>
      <h2 className="Home-titulos">Populares <span>{EmAlta_svg}</span></h2>
      <div className="Home-container">
        {populares.map(dados => {
          return (
            <>
              <div className="Home-populares">
                <Link to={`/serie/${dados.id}`}>

                  {dados.poster_path === null ? (
                    <img src={img_png_url} style={{ width: '92px' }} alt='poster' />
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

      <div>
        {minhas_series.length > 0 ? <h2 className="Home-titulos">Minha Lista <span>{MinhaLista_svg}</span></h2>
          :
          <div className="Home-titulo-null">
            <span>{ListaBookNull_svg}</span>
            <p>ADICIONE SÉRIES NA SUA LISTA!</p>
          </div>
        }
        <div className="Home-minhas-series">
          {minhas_series.map(dados => {
            return (
              <>
                <div className="Home-populares">
                  <Link to={`/serie/${dados.id}`}>

                    {dados.poster === null ? (
                      <img src={img_png_url} style={{ width: '92px' }} alt='poster' />
                    )
                      :
                      (
                        <img src={`https://image.tmdb.org/t/p/w92${dados.poster}`} alt={dados.titulo} />
                      )
                    }

                  </Link>
                  <p>{dados.titulo}</p>
                  {dados.ultimo_ep_visto.length === 0 ? '' : <p style={{ color: '#b6283f' }}>{dados.ultimo_ep_visto === 'Completa' ? '' : 'Prox:'} {dados.ultimo_ep_visto}</p>}

                </div>

              </>
            )
          })}
        </div>
      </div>
    </>
  )
}