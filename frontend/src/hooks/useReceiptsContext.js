import { ReceiptsContext } from '../context/ReceiptContext'
import { useContext } from 'react'

export const useReceiptsContext = () => {
  const context = useContext(ReceiptsContext)

  if (!context) {
    throw Error('useReceiptsContext must be used inside an ReceiptsContextProvider')
  }

  return context
}