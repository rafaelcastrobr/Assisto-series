import axios from "axios"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"


export default function Serie() {
  const [dados, setDados] = useState({})

  const { id } = useParams()

  useEffect(() => {
    serieApi()
  }, []);

  function serieApi() {
    axios.get(`https://api.themoviedb.org/3/tv/${id}?api_key=${process.env.REACT_APP_LKA_KEY}&language=pt-BR`)
      .then(resp => {
        console.log(resp.data)
        const { name, poster_path, overview, seasons } = resp.data


        seasons.map(season => {
          setDados({
            ...dados,
            numeroTemporada: [...numeroTemporada, season.season_number]
          })
        })


        setDados({
          id,
          titulo: name,
          poster: `https://image.tmdb.org/t/p/w92${poster_path}`,
          sinopse: overview,
          numeroTemporada: []
        })

      })

  }

  function serieTemporada() {
    axios.get(`https://api.themoviedb.org/3/tv/${id}/season/{season_number}?api_key=${process.env.REACT_APP_LKA_KEY}&language=en-US`)
  }


  return (
    <>
      <div>
        <img src={dados.poster} alt="" />
        <h1>{dados.titulo}</h1>
        <p>{dados.sinopse}</p>

        {console.log(dados)}
      </div>
    </>
  )
}