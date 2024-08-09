import { createContext, useReducer } from 'react'

export const OrdersContext = createContext()

export const ordersReducer = (state, action) => {
  switch (action.type) {
    case 'SET_ORDERS': 
      return {
        orders: action.payload || [] // Ensure payload is an array
      }
    case 'CREATE_FARMER_MEETING':
      return {
        orders: [action.payload, ...(state.orders || [])] // Safe spread
      }
    case 'DELETE_FARMER_MEETING':
      return {
        orders: (state.orders || []).filter((w) => w._id !== action.payload._id) // Safe filter
      }
    default:
      return state
  }
}

export const OrdersContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(ordersReducer, {
    orders: [] // Initialize as an empty array
  })

  return (
    <OrdersContext.Provider value={{ ...state, dispatch }}>
      { children }
    </OrdersContext.Provider>
  )
}
