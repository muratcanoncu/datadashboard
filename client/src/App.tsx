import './App.css'
import DashboardSummary from './components/DashboardSummary'
import CompletedTrainingsTable from './components/CompletedTrainingsTable'
import EmployeesTable from './components/EmployeesTable'
import { useState } from 'react'

function App() {
	const [employeesLength, setEmployeesLength] = useState<number>(0)
  return (
    <main className="app-stack">
      <DashboardSummary updateNumbers={employeesLength} />
	  <div className='tables'>
		<CompletedTrainingsTable />
		<EmployeesTable onEmployeeChange={setEmployeesLength} />
	  </div>
    </main>
  )
}

export default App
