import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	OneToMany,
} from 'typeorm';

import { CompletedTraining } from '../../completed-trainings/entities/completed-trainings.entity';

export enum EmployeeLevel {
  JUNIOR = 'Junior',
  ASSOCIATE = 'Associate',
  SENIOR = 'Senior',
  LEAD = 'Lead'
}


@Entity()
export class Employee {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column()
	surname: string;

	@Column({ type: 'varchar', length: 64, nullable: false, unique: true})
	email: string;

	@Column({
		type: 'enum',
		enum: EmployeeLevel,
        nullable: true,
	})
	level: string

	@OneToMany(() => CompletedTraining, (completedTraining) => completedTraining.employee)
	completedTrainings: CompletedTraining[];
}
