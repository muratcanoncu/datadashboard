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

const COUNTRIES = [
	'Turkey', 'United States', 'Germany', 'France', 'United Kingdom',
	'Spain', 'Italy', 'Netherlands', 'Sweden', 'Norway',
	'Poland', 'Portugal', 'Greece', 'Ireland', 'Canada',
	'Brazil', 'Mexico', 'India', 'Japan', 'Australia',
];

const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

async function seed() {
	await dataSource.initialize();
	const employeeRepo = dataSource.getRepository(Employee);

	const employees = await employeeRepo.find();
	for (const employee of employees) {
		employee.country = pick(COUNTRIES);
	}

	await employeeRepo.save(employees);
	console.log(`Updated ${employees.length} employees with a random country.`);

	await dataSource.destroy();
}

seed()
	.then(() => process.exit(0))
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});
