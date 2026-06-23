import './CompletedTrainingsTable.css' // reuse .ct-card / .ct-table / .ct-btn / .ct-field
import './EmployeesTable.css'
import { useEffect, useState } from 'react'
import type { Employee } from '../types';

interface EmployeeFormData { name:string, surname: string, email: string, level: string }

function EmployeesTable({ onEmployeeChange }: { onEmployeeChange: (length: number) => void }) {
	const [employees, setEmployees] = useState<Employee[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [addEmployeeForm, setAddEmployeeForm] = useState<EmployeeFormData>({
		name: '',
		surname: '',
		email: '',
		level: 'ASSOCIATE'
	})

	const fetchEmployees = async () => {
		setLoading(true)
		try {		
			const result = await fetch('http://localhost:3000/employees')
			if(!result.ok) { // server responded with error
				const error = await result.json();
				setError(error.message || 'failed to fetch')
				return;
			}
			const data: Employee[] = await result.json();
			setEmployees(data)
			onEmployeeChange(data.length)
		} catch (error) { // request did not arrive server
			console.error('error: ', error)
			setError((error as Error).message || 'unknown error happened')
		} finally {
			setLoading(false)
		}
	}
	useEffect(() => {
	// eslint-disable-next-line react-hooks/set-state-in-effect
	  fetchEmployees()
	}, [])

	const deleteEmployee = async (employeeId: number): Promise<void> => {
		try {
			const result = await fetch(`http://localhost:3000/employees/${employeeId}`, {
				method: 'DELETE'
			})
			if(!result.ok) { // server responded with error
				const error = await result.json();
				setError(error.message || 'failed to fetch')
				return;
			}
			const data: Record<string, string> = await result.json();	
			void data;
			onEmployeeChange(employees.length - 1)	
			fetchEmployees();
		} catch (error) {
			console.error('Error: ',error)
			setError((error as Error).message || 'unknown error happened while sending request')
		}
	}

	const addNewEmployee = async (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault()

		const inputElements = e.currentTarget.querySelectorAll<HTMLInputElement|HTMLSelectElement>('input, select');
		let hasEmpty:boolean = false;
		inputElements.forEach((input): void => {
			if (input.value === '') {
				input.classList.add('invalid')
				hasEmpty = true
			}else{
				input.classList.remove('invalid')
			}
		})
		if (hasEmpty) {
			return;
		}
		try {
			const result = await fetch('http://localhost:3000/employees/', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name: addEmployeeForm.name,
					surname: addEmployeeForm.surname,
					email: addEmployeeForm.email,
					level: addEmployeeForm.level
				})
			});
			if (!result.ok) {
				const error: Error = await result.json();
				console.error('error details:', error.message)
				setError(error.message || 'Server error')
				return;
			}

			const data: Employee = await result.json();
			const newEmployeesArray:Employee[] = [...employees, data];
			setEmployees(newEmployeesArray);
			setAddEmployeeForm({
				name: '',
				surname: '',
				email: '',
				level: 'ASSOCIATE'
			})
		} catch (error:unknown) {
			console.error('failed to complete HTTP request: ', error)
			setError((error as Error).message || 'unknown http error')
		}
	}
	
	const handleChange = (e : React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
		setAddEmployeeForm({
			...addEmployeeForm,
			[e.target.name]: e.target.value
		})
	}

	return (
		<section className="ct-card">
			<header className="ct-card__header">
				<h2 className="ct-card__title">Employees</h2>
				<p className="ct-card__subtitle">Create, edit, and remove employees.</p>
			</header>

			{/* ---- Add employee form ---- */}
			<form onSubmit={(e)=> addNewEmployee(e)} noValidate className="ct-filters emp-add">
				<div className="ct-field">
					<label className="ct-field__label" htmlFor="emp-name">Name</label>
					<input id="emp-name" name='name' className="ct-field__input" type="text" autoComplete="off" placeholder="Zeynep" value={addEmployeeForm.name} onChange={(e)=> handleChange(e)} />
				</div>

				<div className="ct-field">
					<label className="ct-field__label" htmlFor="emp-surname">Surname</label>
					<input id="emp-surname" name='surname' className="ct-field__input" type="text" autoComplete="off" placeholder="Miller" value={addEmployeeForm.surname} onChange={(e)=> handleChange(e)} />
				</div>

				<div className="ct-field">
					<label className="ct-field__label" htmlFor="emp-email">Email</label>
					<input id="emp-email" name='email' className="ct-field__input" type="email" autoComplete="off" placeholder="zeynep@tesla.com" value={addEmployeeForm.email} onChange={(e)=> handleChange(e)} />
				</div>

				<div className="ct-field">
					<label className="ct-field__label" htmlFor="emp-level">Level</label>
					<select id="emp-level" name='level' className="ct-field__input" onChange={(e)=> handleChange(e)} value={addEmployeeForm.level}>
						<option value="ASSOCIATE">Associate</option>
						<option value="JUNIOR">Junior</option>
						<option value="SENIOR">Senior</option>
						<option value="LEAD">Lead</option>
					</select>
				</div>

				<div className="ct-field ct-field--actions">
					<button className="ct-btn ct-btn--primary" type="submit">Add</button>
				</div>
			</form>

			{/* ---- Table ---- */}
			<div className="ct-table-wrap">
				<table className="ct-table">
					<thead>
						<tr>
							<th scope="col">Name</th>
							<th scope="col">Surname</th>
							<th scope="col">Email</th>
							<th scope="col">Level</th>
							<th scope="col" className="ct-col--center">Actions</th>
						</tr>
					</thead>

					<tbody>
							{employees.map((e) => (
							<tr key={e.id}>
								<td>{e.name}</td>
								<td>{e.surname}</td>
								<td className="ct-cell--muted">{e.email}</td>
								<td><span className="emp-level">{e.level}</span></td>
								<td className="ct-col--center">
									<div className="emp-actions">
										<button className="ct-btn ct-btn--ghost emp-btn" type="button">Edit</button>
										<button className="ct-btn emp-btn emp-btn--danger" type="button"
										onClick={() => deleteEmployee(e.id)}>Delete</button>
									</div>
								</td>
							</tr>
						))}

						{/* ---- Static inline-edit row (shows the edit-mode styling) ---- */}
						<tr className="emp-row--editing">
							<td><input className="ct-field__input emp-edit-input" type="text" defaultValue="Arda" /></td>
							<td><input className="ct-field__input emp-edit-input" type="text" defaultValue="Yilmaz" /></td>
							<td><input className="ct-field__input emp-edit-input" type="email" defaultValue="arda@tesla.com" /></td>
							<td>
								<select className="ct-field__input emp-edit-input" defaultValue="SENIOR">
									<option value="JUNIOR">JUNIOR</option>
									<option value="ASSOCIATE">ASSOCIATE</option>
									<option value="SENIOR">SENIOR</option>
									<option value="LEAD">LEAD</option>
								</select>
							</td>
							<td className="ct-col--center">
								<div className="emp-actions">
									<button className="ct-btn ct-btn--primary emp-btn" type="button">Save</button>
									<button className="ct-btn ct-btn--ghost emp-btn" type="button">Cancel</button>
								</div>
							</td>
						</tr>

						{/* ---- Empty state (show when there are no employees) ---- */}
						<tr className="ct-empty" hidden>
							<td colSpan={5}>No employees yet — add one above.</td>
						</tr>
					</tbody>
				</table>
			</div>
		</section>
	)
}

export default EmployeesTable
