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
    dispatch({type: 'FECHA_MODAL', payload: false})
  }

  function atualizaNome (e) {
    dispatch({type: 'ATUALIZA_MODAL_USUARIO', id: usuario.id, nome: e.target.value.toUpperCase()})
    setErrorNome({...errorNome, toggle: false})
  }


  return (
    <div className="Home-modal-container">
      <div className='Home-modal'>
        <h3>OLÁ{usuario.nome.length > 0 ? ', ' + usuario.nome : ''} :D</h3>
        {errorImg.toggle ? <span style={{color: 'red'}}>{errorImg.error}</span>  : 'Escolha um avatar'}
        <div className='Home-modal-img'>
          {imgModal.map(imgs => {
            return (
              <img id={imgs.id} onClick={_ => escolheImg(imgs.id)} className={imgs.class} src={imgs.img} />
            )
          })}
        </div>
         
        <div className='Home-modal-nome'>
          <label> Seu Nome</label>
          <input type="text" value={usuario.nome} onChange={e => atualizaNome(e)}/>
          <span style={{color: 'red'}}>{errorNome.toggle ? errorNome.error : ''}</span>
        </div>
        <button className='Home-modal-btn' onClick={entrar}>Entrar</button>
      </div>
    </div>
  )
}