import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm'
import { CompletedTraining } from './entities/completed-trainings.entity'
// import { CreateEmployeeDto } from './dto/create-employee.dto';
// import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class CompletedTrainingsService {
	constructor(
    	@InjectRepository(CompletedTraining) private readonly completedTrainingRepo: Repository<CompletedTraining>,
  	) {}
	// create(createEmployeeDto: CreateEmployeeDto) {
	// 	return 'This action adds a new employee';
	// }

	async findAllTrainings() {
		return await this.completedTrainingRepo.find({
			relations: {
				employee: true,
				training: true
			}
		})
	}

	async findByEmployee(employeeId: number): Promise<{
		employeeId: number, 
		count:number,
		trainings: CompletedTraining[]}> {
		const trainings = await this.completedTrainingRepo.find({
			where: { employee: { id: employeeId } },
			relations: { training: true },
			order: { completedAt: 'DESC'}
		})
		return { 
			employeeId, 
			count: trainings.length, 
			trainings 
		};
	}

	async findByDate(date: string): Promise<CompletedTraining[]> {
		const parsedDate = new Date(date);
		const start = new Date(parsedDate);
		start.setHours(0, 0, 0, 0);
		const end = new Date(start);
		end.setDate(end.getDate() + 1);

		const trainings = await this.completedTrainingRepo.find({
			where: { completedAt: Between(start, end) },
			relations: { employee: true, training: true},
			order: { completedAt: 'DESC'}
		})
		return trainings;
	}

	// findOne(id: number) {
	// 	return `This action returns a #${id} employee`;
	// }

	// update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
	// 	return `This action updates a #${id} employee`;
	// }

	// remove(id: number) {
	// 	return `This action removes a #${id} employee`;
	// }
}
