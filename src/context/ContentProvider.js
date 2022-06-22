import { createContext, useReducer } from "react";
import { INITIAL_STATE, reducer } from "./reducer";

export const ContentContext = createContext()


export default function ContentProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE)


  return (
    <ContentContext.Provider value={{ state, dispatch }}>
      {children}
    </ContentContext.Provider>
  )
}