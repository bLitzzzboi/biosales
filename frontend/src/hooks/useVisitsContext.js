import { VisitsContext } from '../context/VisitContext'
import { useContext } from 'react'

export const useVisitsContext = () => {
  const context = useContext(VisitsContext)

  if (!context) {
    throw Error('useVisitsContext must be used inside an VisitsContextProvider')
  }

  return context
}