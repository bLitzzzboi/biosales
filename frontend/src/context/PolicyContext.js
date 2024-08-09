import { createContext, useReducer } from 'react'

export const PolicysContext = createContext()

export const policysReducer = (state, action) => {
  switch (action.type) {
    case 'SET_POLICYS': 
      return {
        policys: action.payload || [] // Ensure payload is an array
      }
    case 'CREATE_POLICY':
      return {
        policys: [action.payload, ...(state.policys || [])] // Safe spread
      }
    case 'DELETE_POLICY':
      return {
        policys: (state.policys || []).filter((w) => w._id !== action.payload._id) // Safe filter
      }
    default:
      return state
  }
}

export const PolicysContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(policysReducer, {
    policys: [] // Initialize as an empty array
  })

  return (
    <PolicysContext.Provider value={{ ...state, dispatch }}>
      { children }
    </PolicysContext.Provider>
  )
}
