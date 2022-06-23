import './Search.css'
import '../../assets/style/loading.css'

import { useContext, useState } from "react"
import { Link } from "react-router-dom"
import { ContentContext } from "../../context/ContentProvider"


export default function Search() {
  const { state: { titulo, apiDados }, dispatch } = useContext(ContentContext)
  const [loading, setLoading] = useState(true)


  const img = 'https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-38-picture-grey-c2ebdbb057f2a7614185931650f8cee23fa137b93812ccb132b9df511df1cfac.svg'

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
                  <img src={img} style={{ width: '92px' }} alt='poster' />
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
