import { useEffect, useState } from 'react'
import './CompletedTrainingsTable.css'
import type { CompletedTraining } from '../types'

function CompletedTrainingsTable() {
	const [trainings, setTrainings] = useState<CompletedTraining[]>([])
	const [filteredTrainings, setFilteredTrainings] = useState<CompletedTraining[]>([])
	const [lastPage, setLastPage] = useState<number>(0)
	const [currentPage, setCurrentPage] = useState<number>(1)
	const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

	const fetchTrainings = async (page: number, limit: number, date?: string): Promise<void> =>{
		setLoading(true)
		setError(null)

		const API_URL = "http://localhost:3000/completed-trainings"
		const url = date
            ? `${API_URL}/${date}`
            : `${API_URL}?page=${page}&limit=${limit}`
		
		try {
			const result = await fetch(url);
			if(!result.ok) {
				const errData = await result.json();
				setError(errData.message || 'Failed to fetch completed trainings')
				return;
			}
			
			const data:{
				trainings: CompletedTraining[],
				page: number,
				lastPage: number
			} = await result.json();
			
			setTrainings(data.trainings)
			setFilteredTrainings(data.trainings)
			setLastPage(data.lastPage)
			setCurrentPage(data.page)
		} catch (error: unknown) {
			console.error('failed to fetch items, error: ', error)
			setError((error as Error).message || 'Unknown error message')
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		fetchTrainings(1, 50)
	}, [])

	function filterByName(input: HTMLInputElement): void {	
		if (input.value.length > 2) {
			const filteredByName = trainings.filter(trainingRecord => {
				const comparisonName = (input.name === 'employee' ? trainingRecord.employee.name.concat(' ',trainingRecord.employee.surname) : trainingRecord.training.name).toLowerCase();
				const loverCasedValue = input.value.toLowerCase().trim()
				return comparisonName.includes(loverCasedValue)
			})
			setFilteredTrainings(filteredByName)
		}	else {
			setFilteredTrainings(trainings)
		}
	}

	async function applyDateFilter(){
		const dateInput = document.getElementById('filter-date') as HTMLInputElement;
		if (dateInput.value.toString() !== 'Invalid Date') {
			await fetchTrainings(1,50, dateInput.value)
		}
	}

	function clearAllFilters(){
		const container = document.querySelector('.js-filterContainer') as HTMLDivElement;
		container.querySelectorAll('input').forEach(input => input.value = '')
	}
	
  return (
    <section className="ct-card">
      <header className="ct-card__header">
        <h2 className="ct-card__title">Completed Trainings</h2>
        <p className="ct-card__subtitle">
          Filter by employee, training, or completion date.
        </p>
      </header>

      {/* ---- Filter bar ---- */}
      <div className="ct-filters js-filterContainer">
        <div className="ct-field">
          <label className="ct-field__label" htmlFor="filter-employee">
            Employee name
          </label>
          <input
            id="filter-employee"
			name='employee'
            className="ct-field__input"
            type="text"
            placeholder="e.g. Zeynep Miller"
            autoComplete="off"
			onInput={(e) => filterByName(e.currentTarget)}
          />
        </div>

        <div className="ct-field">
          <label className="ct-field__label" htmlFor="filter-training">
            Training name
          </label>
          <input
            id="filter-training"
            className="ct-field__input"
			name='training'
            type="text"
            placeholder="e.g. Fire Safety"
            autoComplete="off"
			onInput={(e) => filterByName(e.currentTarget)}
          />
        </div>

        <div className="ct-field">
          <label className="ct-field__label" htmlFor="filter-date">
            Completed on
          </label>
          <input id="filter-date" className="ct-field__input" type="date" />
        </div>

        <div className="ct-field ct-field--actions">
          <button id="btn-apply" className="ct-btn ct-btn--primary" type="button" onClick={() => applyDateFilter()}>
            Apply
          </button>

		<button id="btn-revert" className="ct-btn ct-btn--ghost" type="button" 
			onClick={() => {
				fetchTrainings(1,50)
				clearAllFilters()
			}}>
            Full List
        </button>
        </div>
      </div>

      {/* ---- Table ---- */}
      <div className="ct-table-wrap">
        <table className="ct-table">
          <thead>
            <tr>
              <th scope="col">Employee</th>
              <th scope="col">Email</th>
              <th scope="col">Training</th>
              <th scope="col" className="ct-col--center">Mandatory</th>
              <th scope="col">Completed at</th>
            </tr>
          </thead>

          <tbody id="ct-tbody">
			{filteredTrainings.map((t) => (
				<tr key={t.id}>
					<td>{t.employee ? `${t.employee.name} ${t.employee.surname}` : 'Deleted Employee'}</td>
					<td className="ct-cell--muted">{t.employee ? t.employee.email : 'Deleted Employee'}</td>
					<td>{t.training.name}</td>
					<td className="ct-col--center">
						<span className={`ct-badge ${t.training.mandatory ? 'ct-badge--yes' : 'ct-badge--no'}`}>
							{t.training.mandatory ? 'Yes' : 'No'}
						</span>
					</td>
					<td className="ct-cell--muted">
						{new Date(t.completedAt).toLocaleDateString('de-DE',{
							day: '2-digit',
							month: '2-digit',
							year: 'numeric'
						})}
					</td>
				</tr>
			))}
            <tr className="ct-empty"  hidden={filteredTrainings.length !== 0}>
              <td colSpan={5}>No completed trainings match your filters.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <footer className="ct-card__footer">
		{trainings.length > 25 && (
			<span id="ct-count" className="ct-count">
				{trainings.length * (currentPage - 1) + 1} - {trainings.length * currentPage} records
			</span>
			)
		}	

        {lastPage > 1 && (
          <nav className="ct-pagination" aria-label="Table pagination">
			
            <button
              id="page-prev"
              className="ct-page-btn ct-page-btn--nav"
              type="button"
              disabled={currentPage === 1 ? true : false}
			  onClick={() => fetchTrainings(currentPage - 1, 50)}
            >
              ‹ Prev
            </button>

			<button
			id="page-next"
			className="ct-page-btn ct-page-btn--nav"
			type="button"
			disabled={currentPage < lastPage ? false : true}
			onClick={() => fetchTrainings(currentPage + 1, 50)}
			>
			Next ›
			</button>
          </nav>
        )}
      </footer>
    </section>
  )
}

export default CompletedTrainingsTable
