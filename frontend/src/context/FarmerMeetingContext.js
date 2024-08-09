import { createContext, useReducer } from 'react'

export const FarmerMeetingsContext = createContext()

export const farmermeetingsReducer = (state, action) => {
  switch (action.type) {
    case 'SET_FARMER_MEETINGS': 
      return {
        farmermeetings: action.payload || [] // Ensure payload is an array
      }
    case 'CREATE_FARMER_MEETING':
      return {
        farmermeetings: [action.payload, ...(state.farmermeetings || [])] // Safe spread
      }
    case 'DELETE_FARMER_MEETING':
      return {
        farmermeetings: (state.farmermeetings || []).filter((w) => w._id !== action.payload._id) // Safe filter
      }
    default:
      return state
  }
}

export const FarmerMeetingsContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(farmermeetingsReducer, {
    farmermeetings: [] // Initialize as an empty array
  })

  return (
    <FarmerMeetingsContext.Provider value={{ ...state, dispatch }}>
      { children }
    </FarmerMeetingsContext.Provider>
  )
}
