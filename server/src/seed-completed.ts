import { DataSource } from 'typeorm';
import { Employee } from './employees/entities/employees.entity';
import { Training } from './trainings/entities/trainings.entity';
import { CompletedTraining } from './completed-trainings/entities/completed-trainings.entity';

const dataSource = new DataSource({
	type: 'postgres',
	host: 'localhost',
	port: 5432,
	username: 'admin',
	password: 'admin',
	database: 'tesladb',
	entities: [Employee, Training, CompletedTraining],
	synchronize: false,
});

async function seed() {
	await dataSource.initialize();
	const employeeRepo = dataSource.getRepository(Employee);
	const trainingRepo = dataSource.getRepository(Training);
	const completedRepo = dataSource.getRepository(CompletedTraining);

	const employees = await employeeRepo.find();
	const trainings = await trainingRepo.find();
	if (employees.length === 0 || trainings.length === 0) {
		throw new Error('Need employees and trainings seeded first.');
	}

	// The table has a UNIQUE (training_id, employee_id) constraint, so build a
	// set of DISTINCT pairs first, then create one record per pair.
	const target = 300;
	const seen = new Set<string>();
	const pairs: { employee: Employee; training: Training }[] = [];
	const maxPairs = employees.length * trainings.length;
	const want = Math.min(target, maxPairs);

	while (pairs.length < want) {
		const employee = employees[Math.floor(Math.random() * employees.length)];
		const training = trainings[Math.floor(Math.random() * trainings.length)];
		const key = `${training.id}-${employee.id}`;
		if (seen.has(key)) continue;
		seen.add(key);
		pairs.push({ employee, training });
	}

	// Spread completed_at between 2026-05-01 and 2026-06-21.
	const oldest = new Date('2026-05-01T00:00:00').getTime();
	const newest = new Date('2026-06-21T00:00:00').getTime();

	const records = pairs.map(({ employee, training }, i) =>
		completedRepo.create({
			name: training.name,
			training,
			employee,
			completedAt:
				i === 0
					? new Date(oldest)
					: new Date(oldest + Math.random() * (newest - oldest)),
		}),
	);

	await completedRepo.save(records);
	console.log(`Inserted ${records.length} completed-training records.`);

	await dataSource.destroy();
}

seed()
	.then(() => process.exit(0))
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});
