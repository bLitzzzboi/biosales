import { createContext, useReducer } from 'react'

export const VisitsContext = createContext()

export const visitsReducer = (state, action) => {
  switch (action.type) {
    case 'SET_VISITS': 
      return {
        visits: action.payload || [] // Ensure payload is an array
      }
    case 'CREATE_VISIT':
      return {
        visits: [action.payload, ...(state.visits || [])] // Safe spread
      }
    case 'DELETE_VISIT':
      return {
        visits: (state.visits || []).filter((w) => w._id !== action.payload._id) // Safe filter
      }
    default:
      return state
  }
}

export const VisitsContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(visitsReducer, {
    visits: [] // Initialize as an empty array
  })

  return (
    <VisitsContext.Provider value={{ ...state, dispatch }}>
      { children }
    </VisitsContext.Provider>
  )
}
