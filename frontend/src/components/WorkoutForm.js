import { useState } from "react"
import { useWorkoutsContext } from "../hooks/useWorkoutsContext"
import { useAuthContext } from '../hooks/useAuthContext'
import { useNavigate } from 'react-router-dom';


const WorkoutForm = () => {
  const { dispatch } = useWorkoutsContext()
  const { user } = useAuthContext()

  const [title, setTitle] = useState('')
  const [load, setLoad] = useState('')
  const [reps, setReps] = useState('')
  const [area, setArea] = useState('')
  const [full_name, setFull_name] = useState('')
  const [cnic, setCnic] = useState('')
  const [designation, setDesignation] = useState('')
  const [contact_no, setContact_no] = useState('')
  const [vehicle_number, setVehicle_number] = useState('')
  const [vehicle_make, setVehicle_make] = useState('')
  const [vehicle_model, setVehicle_model] = useState('')
  const [sales, setSales] = useState('')
  const [cash_returned, setCash_returned] = useState('')

  const [error, setError] = useState(null)
  const [emptyFields, setEmptyFields] = useState([])

  // const navigate = useNavigate();

//   const navigateToAnotherPage = () => {
//     navigate('/Daily_Visits');
// };

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!user) {
      setError('You must be logged in')
      return
    }

    const workout = {area, full_name, cnic, designation, 
      contact_no, vehicle_number, vehicle_make, 
      vehicle_model, sales, cash_returned}

    const response = await fetch('/api/workouts', {
      method: 'POST',
      body: JSON.stringify(workout),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      }
    })
    const json = await response.json()

    if (!response.ok) {
      setError(json.error)
      setEmptyFields(json.emptyFields)
    }
    if (response.ok) {
      setArea('')
      setFull_name('')
      setCnic('')
      setDesignation('')
      setContact_no('')
      setVehicle_number('')
      setVehicle_make('')
      setVehicle_model('')
      setSales('')
      setCash_returned('')

      setError(null)
      setEmptyFields([])
      dispatch({type: 'CREATE_WORKOUT', payload: json})
    }
  }

  return (
    <form className="create" style={{width: '100vh', margin: '20vh', marginLeft: '50vh'}} onSubmit={handleSubmit}>
      <h3>Add a New Workout</h3>

      <label>Excersize Title:</label>
      <input 
        type="text"
        onChange={(e) => setTitle(e.target.value)}
        value={title}
        className={emptyFields.includes('title') ? 'error' : ''}
      />

      <label>Load (in kg):</label>
      <input 
        type="number"
        onChange={(e) => setLoad(e.target.value)}
        value={load}
        className={emptyFields.includes('load') ? 'error' : ''}
      />

      <label>Reps:</label>
      <input 
        type="number"
        onChange={(e) => setReps(e.target.value)}
        value={reps}
        className={emptyFields.includes('reps') ? 'error' : ''}
      />

      <button>Add Workout</button>
      {error && <div className="error">{error}</div>}
      {/* <button onClick={navigateToAnotherPage}>Just Checking</button> */}
    </form>
  )
}

export default WorkoutForm