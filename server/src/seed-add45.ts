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

	// Build the set of pairs that already exist so we only add NEW ones.
	const existing = await completedRepo.find({ relations: { employee: true, training: true } });
	const seen = new Set(
		existing
			.filter((c) => c.training && c.employee) // skip rows whose employee was SET NULL on delete
			.map((c) => `${c.training.id}-${c.employee.id}`),
	);

	// Guard: can't add more unique pairs than remain available.
	const capacity = employees.length * trainings.length - seen.size;
	const toAdd = Math.min(45, capacity);

	const oldest = new Date('2026-05-01T00:00:00').getTime();
	const newest = new Date('2026-06-21T00:00:00').getTime();

	const records: CompletedTraining[] = [];
	while (records.length < toAdd) {
		const employee = employees[Math.floor(Math.random() * employees.length)];
		const training = trainings[Math.floor(Math.random() * trainings.length)];
		const key = `${training.id}-${employee.id}`;
		if (seen.has(key)) continue;
		seen.add(key);
		records.push(
			completedRepo.create({
				name: training.name,
				training,
				employee,
				completedAt: new Date(oldest + Math.random() * (newest - oldest)),
			}),
		);
	}

	await completedRepo.save(records);
	console.log(`Inserted ${records.length} new completed-training records.`);

	await dataSource.destroy();
}

seed()
	.then(() => process.exit(0))
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});
