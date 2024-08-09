import { createContext, useReducer } from 'react'

export const DealersContext = createContext()

export const dealersReducer = (state, action) => {
  switch (action.type) {
    case 'SET_DEALERS': 
      return {
        dealers: action.payload
      }
    case 'CREATE_DEALER':
      return {
        dealers: [action.payload, ...state.dealers]
      }
    case 'DELETE_DEALER':
      return {
        dealers: state.dealers.filter((w) => w._id !== action.payload._id)
      }
    case 'UPDATE_DEALER':
      return {
        dealers: state.dealers.map((w) => w._id === action.payload._id ? action.payload : w)
      }
    default:
      return state
  }
}

export const DealersContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(dealersReducer, {
    dealers: null
  })

  return (
    <DealersContext.Provider value={{...state, dispatch}}>
      { children }
    </DealersContext.Provider>
  )
}