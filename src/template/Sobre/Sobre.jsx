import './Sobre.css'

export default function Sobre() {
  return (
    <div className="Sobre-container">
      <div>
        <h2>Sobre</h2>
      </div>
      <div>
        <p>
          Assisto Séries é um projeto baseado no site <a href="https://bancodeseries.com.br/">Banco de Séries</a>.

        </p>
        <p>
          Construido em ReactJS, usando localStorage do navegador para salvar as informações.
        </p>
        <p>
          Você pode adicionar a série na lista marcando cada ep que assiste para não se perder no emaranhado de séries.
        </p>
        <p>
          Mais <a href="https://github.com/rafaelcastrobr/Assisto-series">infos</a>.
        </p>
      </div>
    </div>
  )
}