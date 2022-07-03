import './Modal.css'
import data from '../../data/data'
import { useState } from 'react'

// jogar no dispatch e atualizar

export default function ModalHome() {
  const [escolhido, setEscolhido] = useState('')
  function oi(e) {
    if (e.target.id === e.target.id) {
      if (escolhido === '') {
        setEscolhido('escolhido')
      } else {
        setEscolhido('')
      }
    }
  }
  return (
    <div className="Home-modal-container">
      <div className='Home-modal'>
        <h3>OLÁ :D</h3>
        <label>Escolha sua imagem</label>
        <div >
          {data.map(imgs => {
            return (
              <img id={imgs.id} onClick={oi} className={escolhido} src={imgs.img} />
            )
          })}
        </div>
        <div>
          <label> Seu Nome</label>
          <input type="text" />
        </div>
      </div>
    </div>
  )
}