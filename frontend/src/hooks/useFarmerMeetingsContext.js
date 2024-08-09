import { FarmerMeetingsContext } from '../context/FarmerMeetingContext'
import { useContext } from 'react'

export const useFarmerMeetingsContext = () => {
  const context = useContext(FarmerMeetingsContext)

  if (!context) {
    throw Error('useFarmerMeetingsContext must be used inside an FarmerMeetingsContextProvider')
  }

  return context
}