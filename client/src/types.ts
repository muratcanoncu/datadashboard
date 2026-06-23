export interface CompletedTraining {
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


export interface Employee {
	id: number,
	name: string,
	surname: string,
	email: string,
	level: string,
	completedTrainings: CompletedTraining[]
}