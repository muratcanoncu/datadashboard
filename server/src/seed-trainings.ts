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

const TRAINING_TOPICS = [
	'Workplace Safety', 'Fire Safety', 'First Aid', 'Data Privacy (GDPR)',
	'Information Security Awareness', 'Anti-Harassment', 'Code of Conduct',
	'Diversity & Inclusion', 'Time Management', 'Effective Communication',
	'Leadership Fundamentals', 'Conflict Resolution', 'Project Management Basics',
	'Agile & Scrum', 'Git Version Control', 'Clean Code Practices',
	'Unit Testing', 'CI/CD Pipelines', 'Docker Fundamentals', 'Kubernetes Basics',
	'Cloud Computing 101', 'AWS Essentials', 'SQL Fundamentals', 'NoSQL Databases',
	'TypeScript Deep Dive', 'React Fundamentals', 'NestJS Basics', 'REST API Design',
	'GraphQL Introduction', 'Microservices Architecture', 'System Design',
	'Performance Optimization', 'Accessibility (a11y)', 'UX Design Principles',
	'Customer Service Excellence', 'Sales Techniques', 'Negotiation Skills',
	'Financial Literacy', 'Budgeting Basics', 'Public Speaking',
	'Presentation Skills', 'Email Etiquette', 'Remote Work Best Practices',
	'Stress Management', 'Mental Health Awareness', 'Ergonomics',
	'Onboarding Essentials', 'Performance Review Process', 'Ethics & Compliance',
	'Environmental Sustainability',
];

const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

async function seed() {
	await dataSource.initialize();
	const employeeRepo = dataSource.getRepository(Employee);
	const trainingRepo = dataSource.getRepository(Training);
	const completedRepo = dataSource.getRepository(CompletedTraining);

	const employees = await employeeRepo.find();
	if (employees.length === 0) {
		throw new Error('No employees found. Run the employee seed first.');
	}

	// 1) Create 50 trainings.
	const trainings = await trainingRepo.save(
		TRAINING_TOPICS.slice(0, 50).map((name) =>
			trainingRepo.create({ name, mandatory: Math.random() < 0.4 }),
		),
	);
	console.log(`Inserted ${trainings.length} trainings.`);

	// 2) Create 250 completed-training records.
	// Oldest completed_at is pinned to 2026-05-01; the rest are spread between
	// that date and 2026-06-20.
	const oldest = new Date('2026-05-01T00:00:00').getTime();
	const newest = new Date('2026-06-20T00:00:00').getTime();

	const completed = Array.from({ length: 250 }, (_, i) => {
		const training = pick(trainings);
		// Guarantee at least one row sits exactly at the oldest date.
		const completedAt =
			i === 0
				? new Date(oldest)
				: new Date(oldest + Math.random() * (newest - oldest));
		return completedRepo.create({
			name: training.name,
			training,
			employee: pick(employees),
			completedAt,
		});
	});

	await completedRepo.save(completed);
	console.log(`Inserted ${completed.length} completed-training records.`);

	await dataSource.destroy();
}

seed()
	.then(() => process.exit(0))
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});
