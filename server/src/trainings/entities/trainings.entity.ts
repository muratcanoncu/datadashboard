import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	OneToMany
} from 'typeorm';

import { CompletedTraining } from '../../completed-trainings/entities/completed-trainings.entity';

@Entity()
export class Training {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column({ type: 'boolean' })
	mandatory: boolean;

	@OneToMany(()=> CompletedTraining, (completedTraining) => completedTraining.training)
	completedTrainings: CompletedTraining[];

}
