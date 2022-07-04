import data from "../data/data"

export const INITIAL_STATE = {
  apiDados: [],
  apiSerie: [],
  populares: [],
  apiTemporadas: [],
  minhas_series: [],
  botaoAdcTodasTemp: true,
  imgModal: data,
  ultimoProxEp: {
    ep: '',
    exibir: false
  },
  usuario: {
    nome: '',
    id: ''
  },
  titulo: '',
  epChecked: false
}



export function reducer(state, action) {
  switch (action.type) {
    case 'PESQUISA': {
      const newState = { ...state }

      newState.titulo = action.payload

      return newState
    }
    case 'RESETA_PAGE': {
      const newState = { ...state }

      newState.apiTemporadas = []
      newState.apiSerie = []

      return newState
    }
    case 'ATUALIZA_HOME': {
      const newState = { ...state }

      newState.populares = action.payload
      
      return newState
    }
    case 'ATUALIZA_MINHA_LISTA': {
      const newState = { ...state }
      
      newState.minhas_series = action.payload
      
      return newState
    }
    case 'API_DADOS': {
      const newState = { ...state }

      newState.apiDados = action.payload
      newState.titulo = ''
      newState.apiTemporadas = []
      newState.apiSerie = []

      return newState
    }
    case 'ATUALIZA_SERIE': {
      const newState = { ...state }

      newState.apiSerie = action.payload

      return newState
    }
    case 'ATUALIZA_STATUS_PROX_EP': {
      const newState = { ...state }
      //newState.ultimoProxEp.ep = ''
      newState.ultimoProxEp.ep = action.payload || ''
      newState.ultimoProxEp.exibir = action.exibir
      
      return newState
    }
    case 'ATUALIZA_MODAL_IMG': {
      const newState = { ...state}
      
      newState.imgModal[action.id].class = action.payload

      return newState
    }
    case 'ATUALIZA_MODAL_USUARIO': {
      const newState = { ...state} 
      
      newState.usuario.nome = action.nome
      newState.usuario.id = action.id 
      console.log(newState.usuario.nome, newState.usuario.id)
      return newState
    }
    case 'ATUALIZA_TEMP': {
      const newState = { ...state }

      newState.apiTemporadas = action.payload

      return newState
    }
    case 'ATUALIZA_CHECK': {
      const newState = { ...state }

      return newState
    }
    default:
      return state;
  }

}