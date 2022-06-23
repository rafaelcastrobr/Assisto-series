
export const INITIAL_STATE = {
  apiDados: [],
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

      return newState
    }
    default:
      return state;
  }

}