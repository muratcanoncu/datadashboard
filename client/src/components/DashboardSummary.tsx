import { useEffect, useState } from 'react'
import './CompletedTrainingsTable.css' // reuse the .ct-card / theme variables
import './DashboardSummary.css'

interface DashboardSummary {
	totalEmployees: number
	totalTrainings: number
	totalCompletions: number
	mandatoryCompletions: number
}

function DashboardSummary({updateNumbers}: {updateNumbers:number}) {
	const [summary, setSummary] = useState<DashboardSummary>({
		totalEmployees: 0,
		totalTrainings: 0,
		totalCompletions: 0,
		mandatoryCompletions: 0,
	})
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const fetchTotals= async () => {
		setLoading(true)
		try {			
			const result = await fetch('http://localhost:3000/dashboard/summary');
			if (!result.ok) {
				const errorData = await result.json();
				setError(errorData.message || 'Failed to fetch')
				return;
			}
	
			const data: Record<string,number> = await result.json();
			setSummary({
				totalEmployees: data.totalEmployees,
				totalTrainings: data.totalTrainings,
				totalCompletions: data.totalCompletedTrainings,
				mandatoryCompletions: data.totalCompletedMandatoryTrainings,
			})
		} catch (error:unknown) {
			console.error('failed to fetch metrics, error: ', error)
			setError((error as Error).message || 'unknown error message')
		} finally {
			setLoading(false)
		}
	}
	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		fetchTotals();
	}, [updateNumbers])


	return (
		<section className="ct-card">
			<header className="ct-card__header">
				<h2 className="ct-card__title">Dashboard</h2>
				<p className="ct-card__subtitle">Training completion at a glance.</p>
			</header>

			<div className="dash-grid">
				<article className="dash-kpi">
					<span className="dash-kpi__label">Employees</span>
					<span className="dash-kpi__value">{summary.totalEmployees}</span>
				</article>

				<article className="dash-kpi">
					<span className="dash-kpi__label">Trainings</span>
					<span className="dash-kpi__value">{summary.totalTrainings}</span>
				</article>

				<article className="dash-kpi">
					<span className="dash-kpi__label">Completions</span>
					<span className="dash-kpi__value">{summary.totalCompletions}</span>
				</article>

				<article className="dash-kpi dash-kpi--accent">
					<span className="dash-kpi__label">Mandatory done</span>
					<span className="dash-kpi__value">{summary.mandatoryCompletions}</span>
				</article>

			</div>
		</section>
	)
}

export default DashboardSummary
