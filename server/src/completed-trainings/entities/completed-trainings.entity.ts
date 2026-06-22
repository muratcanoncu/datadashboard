import {
	Entity,
	Unique,
	PrimaryGeneratedColumn,
	Column,
	UpdateDateColumn,
	CreateDateColumn,
	ManyToOne,
	JoinColumn,
	Index
} from 'typeorm';

import { Training } from '../../trainings/entities/trainings.entity';
import { Employee } from '../../employees/entities/employees.entity';

@Entity()
@Unique(['training', 'employee'])
@Index(['training', 'employee', 'completedAt'])
export class CompletedTraining {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@ManyToOne(() => Training, (training) => training.completedTrainings, { onDelete:'CASCADE' })
	@JoinColumn({ name: 'training_id'})
	training: Training;

	@ManyToOne(() => Employee, (employee) => employee.completedTrainings, { onDelete:'SET NULL' })
	@JoinColumn({ name: 'employee_id'})
	employee: Employee;

	@Column({ name: 'completed_at', type: 'timestamp', nullable: false})
	completedAt: Date;

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt: Date;

}
