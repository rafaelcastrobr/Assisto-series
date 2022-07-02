import './Search.css'
import '../../assets/style/loading.css'

import { useContext, useState } from "react"
import { Link } from "react-router-dom"
import { ContentContext } from "../../context/ContentProvider"

import { img_png_url } from '../../assets/img/ImportImg'


export default function Search() {
  const { state: { apiDados } } = useContext(ContentContext)
  const [loading, setLoading] = useState(true)

  setTimeout(() => {
    setLoading(false)
  }, 1000);

  return (
    <>
    {loading && <span class="loader"></span>}
    <div className='Search-container'>
      
      {apiDados.map(apiDado => {
        return (
          
            <div className="Search-unidade" >
              <Link to={`/serie/${apiDado.id}`} >
                {apiDado.poster_path === null ? (
                  <img src={img_png_url} style={{ width: '92px' }} alt='poster' />
                )
                  :
                  (
                    <img src={`https://image.tmdb.org/t/p/w92${apiDado.poster_path}`} alt='poster' />
                  )
                }
                <p>{apiDado.name}</p>
              </Link>
            </div>
          
        )
      })}

    </div>
  </>
  )
}
