import { createContext, useReducer } from 'react'

export const ProductsContext = createContext()

const initialState = {
  products: [] // Initialize products as an empty array
};

export const productsReducer = (state, action) => {
  switch (action.type) {
    case 'SET_PRODUCTS': 
      return {
        products: action.payload
      }
    case 'CREATE_PRODUCT':
      return {
        products: [action.payload, ...state.products]
      }
    case 'DELETE_PRODUCT':
      return {
        products: state.products.filter((w) => w._id !== action.payload._id)
      }
    case 'UPDATE_PRODUCT':
      return {
        products: state.products.map(w => w._id === action.payload._id ? action.payload : w)
      }
    default:
      return state
  }
}

export const ProductsContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(productsReducer, {
    products: null
  })

  return (
    <ProductsContext.Provider value={{...state, dispatch}}>
      { children }
    </ProductsContext.Provider>
  )
}