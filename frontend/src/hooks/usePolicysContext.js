import { PolicysContext } from '../context/PolicyContext'
import { useContext } from 'react'

export const usePolicysContext = () => {
  const context = useContext(PolicysContext)

  if (!context) {
    throw Error('usePolicysContext must be used inside an PolicysContextProvider')
  }

  return context
}