import { CreditNotesContext } from '../context/CreditNoteContext'
import { useContext } from 'react'

export const useCreditNotesContext = () => {
  const context = useContext(CreditNotesContext)

  if (!context) {
    throw Error('useCreditNotesContext must be used inside an CreditNotesContextProvider')
  }

  return context
}