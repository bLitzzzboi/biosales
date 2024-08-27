import { createContext, useReducer } from 'react'

export const CreditNotesContext = createContext()

export const creditnotesReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CREDITNOTES': 
      return {
        creditnotes: action.payload || [] // Ensure payload is an array
      }
    case 'CREATE_CREDITNOTE':
      return {
        creditnotes: [action.payload, ...(state.creditnotes || [])] // Safe spread
      }
    case 'DELETE_CREDITNOTE':
      return {
        creditnotes: (state.creditnotes || []).filter((w) => w._id !== action.payload._id) // Safe filter
      }
    default:
      return state
  }
}

export const CreditNotesContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(creditnotesReducer, {
    creditnotes: [] // Initialize as an empty array
  })

  return (
    <CreditNotesContext.Provider value={{ ...state, dispatch }}>
      { children }
    </CreditNotesContext.Provider>
  )
}
