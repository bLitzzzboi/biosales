import { DealersContext } from '../context/DealerContext'
import { useContext } from 'react'

export const useDealersContext = () => {
  const context = useContext(DealersContext)

  if (!context) {
    throw Error('useDealersContext must be used inside an DealersContextProvider')
  }

  return context
}