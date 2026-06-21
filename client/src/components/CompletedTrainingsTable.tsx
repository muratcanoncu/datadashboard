import { useEffect, useState } from 'react'
import './CompletedTrainingsTable.css'

interface CompletedTraining {
	id: number,
	name: string,
	training: {
		id:  number,
		name: string,
		mandatory: boolean
	}
	employee: {
		id:  number,
		name: string,
		surname: string
		email: string,
		level: string
	}
	completedAt: string,
	createdAt: string,
	updatedAt: string,

}
function CompletedTrainingsTable() {
	const [ trainings, setTrainings ] = useState<CompletedTraining[]>([])
	const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

	const fetchTrainings = async (): Promise<CompletedTraining[] | undefined> =>{
		setLoading(true)
		setError(null)

		try {
			const result = await fetch('http://localhost:3000/completed-trainings');
			if(!result.ok) {
				const errData = await result.json();
				setError(errData)
				return;
			}
			
			const data:CompletedTraining[] = await result.json();
			console.log(data)
			setTrainings(data)
			
		} catch (error: unknown) {
			console.error('failed to fetch items, error: ', error)
			setError((error as Error).message || 'Unknown error message')
		} finally {
			setLoading(false)
		}

	}

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		fetchTrainings()
	}, [])
	
  return (
    <section className="ct-card">
      <header className="ct-card__header">
        <h2 className="ct-card__title">Completed Trainings</h2>
        <p className="ct-card__subtitle">
          Filter by employee, training, or completion date.
        </p>
      </header>

      {/* ---- Filter bar ---- */}
      <div className="ct-filters">
        <div className="ct-field">
          <label className="ct-field__label" htmlFor="filter-employee">
            Employee name
          </label>
          <input
            id="filter-employee"
            className="ct-field__input"
            type="text"
            placeholder="e.g. Zeynep Miller"
            autoComplete="off"
          />
        </div>

        <div className="ct-field">
          <label className="ct-field__label" htmlFor="filter-training">
            Training name
          </label>
          <input
            id="filter-training"
            className="ct-field__input"
            type="text"
            placeholder="e.g. Fire Safety"
            autoComplete="off"
          />
        </div>

        <div className="ct-field">
          <label className="ct-field__label" htmlFor="filter-date">
            Completed on
          </label>
          <input id="filter-date" className="ct-field__input" type="date" />
        </div>

        <div className="ct-field ct-field--actions">
          <button id="btn-apply" className="ct-btn ct-btn--primary" type="button">
            Apply
          </button>
          <button id="btn-full-list" className="ct-btn ct-btn--ghost" type="button">
            Full list
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
			{trainings.map((t) => (
				<tr key={t.id}>
					<td>{t.employee.name} {t.employee.surname}</td>
					<td className="ct-cell--muted">{t.employee.email}</td>
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
            <tr className="ct-empty"  hidden={trainings.length !== 0}>
              <td colSpan={5}>No completed trainings match your filters.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <footer className="ct-card__footer">
        <span id="ct-count" className="ct-count">{trainings.length} records</span>

        {trainings.length > 25 && (
          <nav className="ct-pagination" aria-label="Table pagination">
            <button
              id="page-prev"
              className="ct-page-btn ct-page-btn--nav"
              type="button"
              disabled
            >
              ‹ Prev
            </button>

            <div className="ct-page-numbers">
              <button className="ct-page-btn ct-page-btn--active" type="button" data-page={1}>1</button>
              <button className="ct-page-btn" type="button" data-page={2}>2</button>
              <button className="ct-page-btn" type="button" data-page={3}>3</button>
              <span className="ct-page-ellipsis">…</span>
            </div>

            <button
              id="page-next"
              className="ct-page-btn ct-page-btn--nav"
              type="button"
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
