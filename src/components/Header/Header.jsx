import './Header.css'
import tv from '../../assets/img/tv.png'
import pesquisar from '../../assets/img/pesquisar.svg'
import { useContext, useState } from 'react'
import { ContentContext } from '../../context/ContentProvider'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'

export default function Header() {

  const [CampoPesquisa, setCampoPesquisa] = useState(false)
  const { state: {titulo}, dispatch } = useContext(ContentContext)
  const navigation = useNavigate();


  function abreCampoPesquisa() {
    setCampoPesquisa(!CampoPesquisa)
  }

  function escreveTitulo(e) {
    const {value} = e.target
    dispatch({type: 'PESQUISA', payload: value})
  }

  function BuscaTitulo() {
    axios.get(`https://api.themoviedb.org/3/search/tv?api_key=${process.env.REACT_APP_LKA_KEY}&language=pt-BR&query=${titulo}`)
    .then(resp => dispatch({type: 'API_DADOS', payload: resp.data.results}))
  }

  function pesquisaSerie (e) {
    if(e.key === 'Enter') {
      BuscaTitulo()
      setCampoPesquisa(false)
      navigation(`/search/${titulo}`);

    }
  }


  return (
    <>
      <div className='Header-navBar'>
        <ul>
          <li>
          <Link to='/' replace><img className='Header-navBar-imgTV' src={tv} alt="tv" /></Link>
          </li>
          <li>
            <h1><Link to='/' replace>Assisto Séries</Link></h1>
          </li>
          <li onClick={abreCampoPesquisa}>
            <img className='Header-navBar-imgPesquisar' src={pesquisar} alt="lupa" />
          </li>
        </ul>
      </div>
      {CampoPesquisa &&
        <div className='Header-pesquisa'>
          <input type="text" value={titulo}  onChange={escreveTitulo} onKeyPress={pesquisaSerie}/>
        </div>
      }

    </>

  )
}