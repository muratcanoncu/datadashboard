import { DataSource } from 'typeorm';
import { Employee } from './employees/entities/employees.entity';

const dataSource = new DataSource({
	type: 'postgres',
	host: 'localhost',
	port: 5432,
	username: 'admin',
	password: 'admin',
	database: 'tesladb',
	entities: [Employee],
	synchronize: false,
});

const FIRST_NAMES = [
	'James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda',
	'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica',
	'Thomas', 'Sarah', 'Charles', 'Karen', 'Ahmet', 'Ayşe', 'Mehmet', 'Fatma',
	'Mustafa', 'Emine', 'Ali', 'Zeynep', 'Hüseyin', 'Elif', 'Can', 'Deniz',
];

const LAST_NAMES = [
	'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
	'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Wilson', 'Anderson', 'Taylor',
	'Yılmaz', 'Kaya', 'Demir', 'Şahin', 'Çelik', 'Yıldız', 'Aydın', 'Öztürk', 'Arslan',
];


const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

async function seed() {
	await dataSource.initialize();
	const employeeRepo = dataSource.getRepository(Employee);


	const employees = Array.from({ length: 120 }, () =>
		employeeRepo.create({
			name: pick(FIRST_NAMES),
			surname: pick(LAST_NAMES),
		}),
	);

	await employeeRepo.save(employees);
	console.log(`Inserted ${employees.length} employees.`);

	await dataSource.destroy();
}

seed()
	.then(() => process.exit(0))
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});
