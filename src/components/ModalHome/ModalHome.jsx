import './Modal.css'
import { useContext, useState } from 'react'
import { ContentContext } from '../../context/ContentProvider'

// jogar no dispatch e atualizar

export default function ModalHome() {
  const { state: { imgModal, usuario }, dispatch } = useContext(ContentContext)
  const [errorImg, setErrorImg] = useState({
    error : 'Escolha um avatar',
    toggle: false
  })
  const [errorNome, setErrorNome] = useState({
    error: 'Digite Um nome',
    toggle: false
  })

  function escolheImg(id) {

    if (imgModal[id].class === 'escolhido') {

      dispatch({ type: 'ATUALIZA_MODAL_IMG', payload: '', id: id })
      dispatch({ type: 'ATUALIZA_MODAL_USUARIO', id: '', nome: usuario.nome})

    } else {
      if (imgModal.find(img => img.class === 'escolhido')) return

      setErrorImg({...errorImg, toggle: false})

      dispatch({ type: 'ATUALIZA_MODAL_IMG', payload: 'escolhido', id: id })
      dispatch({ type: 'ATUALIZA_MODAL_USUARIO', id: id, nome: usuario.nome})
      console.log('id: ', id);
      
    }

  }

  function entrar () {
    if(usuario.nome.length === 0 || usuario.id === '') {
      if(usuario.id === '') setErrorImg({...errorImg, toggle: true})
      if(usuario.nome.length === 0) setErrorNome({...errorNome, toggle: true})
      return
    }
    
    const data = {
      nome: usuario.nome,
      id: usuario.id
    }
    localStorage.setItem('LOGIN', JSON.stringify(data))
  }

  function atualizaNome (e) {
    dispatch({type: 'ATUALIZA_MODAL_USUARIO', id: usuario.id, nome: e.target.value.toUpperCase()})
    setErrorNome({...errorNome, toggle: false})
  }


  return (
    <div className="Home-modal-container">
      <div className='Home-modal'>
        <h3>OLÁ{usuario.nome.length > 0 ? ', ' + usuario.nome : ''} :D</h3>
        <label>Escolha sua imagem</label>
        <div>
          {imgModal.map(imgs => {
            return (
              <img id={imgs.id} onClick={_ => escolheImg(imgs.id)} className={imgs.class} src={imgs.img} />
            )
          })}
          {errorImg.toggle ? errorImg.error : ''}
        </div>
        <div>
          <label> Seu Nome</label>
          <input type="text" value={usuario.nome} onChange={e => atualizaNome(e)}/>
          {errorNome.toggle ? errorNome.error : ''}
        </div>
        <button onClick={entrar}>Entrar</button>
      </div>
    </div>
  )
}