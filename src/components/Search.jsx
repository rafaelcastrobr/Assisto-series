import { useContext } from "react"
import { ContentContext } from "../context/ContentProvider"


export default function Search() {
  const { state: { titulo, apiDados }, dispatch } = useContext(ContentContext)

  const img = 'https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-38-picture-grey-c2ebdbb057f2a7614185931650f8cee23fa137b93812ccb132b9df511df1cfac.svg'


  return (
    <>
      {console.log(apiDados)}
      {apiDados.map(apiDado => {
        return (
          <>
            {apiDado.poster_path === null ? (
              <img src={img} style={{ width: '92px' }} alt='poster' />
            )
              :
              (
                <img src={`https://image.tmdb.org/t/p/w92${apiDado.poster_path}`} alt='poster' />
              )
            }
            <p>{apiDado.name}</p>
          </>
        )
      })}

    </>
  )
}

/*
{apiDado.poster_path === null ? (
              <span>OII</span>

            )

              :
              (
                <img src={`https://image.tmdb.org/t/p/w92${apiDado.poster_path}`} />

              )
            }
      */