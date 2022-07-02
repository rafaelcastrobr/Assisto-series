
export const INITIAL_STATE = {
  apiDados: [],
  apiSerie: [],
  populares: [],
  apiTemporadas: [],
  minhas_series: [],
  botaoAdcTodasTemp: true,
  ultimoProxEp: {
    ep: '',
    exibir: false
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