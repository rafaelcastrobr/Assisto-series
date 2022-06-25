
export const INITIAL_STATE = {
  apiDados: [],
  apiSerie: [],
  apiTemporadas: [],
  titulo: ''
}



export function reducer(state, action) {
  switch (action.type) {
    case 'PESQUISA': {
      const newState = { ...state }

      newState.titulo = action.payload

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
    case 'ATUALIZA_TEMP': {
      const newState = { ...state }

      newState.apiTemporadas = action.payload

      return newState
    }
    default:
      return state;
  }

}