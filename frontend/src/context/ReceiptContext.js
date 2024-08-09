import { createContext, useReducer } from 'react'

export const ReceiptsContext = createContext()

export const receiptsReducer = (state, action) => {
  switch (action.type) {
    case 'SET_RECEIPTS': 
      return {
        receipts: action.payload
      }
    case 'CREATE_RECEIPT':
      return {
        receipts: [action.payload, ...state.receipts]
      }
    case 'DELETE_RECEIPT':
      return {
        receipts: state.receipts.filter((w) => w._id !== action.payload._id)
      }
    case 'UPDATE_RECEIPT':
      return {
        receipts: state.receipts.map((w) => w._id === action.payload._id ? action.payload : w)
      }
    default:
      return state
  }
}

export const ReceiptsContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(receiptsReducer, {
    receipts: null
  })

  return (
    <ReceiptsContext.Provider value={{...state, dispatch}}>
      { children }
    </ReceiptsContext.Provider>
  )
}