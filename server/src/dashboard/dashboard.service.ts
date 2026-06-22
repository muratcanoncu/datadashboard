import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CompletedTraining } from "src/completed-trainings/entities/completed-trainings.entity";
import { Employee } from "src/employees/entities/employees.entity";
import { Training } from "src/trainings/entities/trainings.entity";
import { Repository } from "typeorm";


@Injectable()
export class DashboardService {
	constructor(
		@InjectRepository(Employee) private readonly employeeRepo:Repository<Employee>,
		@InjectRepository(Training) private readonly trainingsRepo:Repository<Training>,
		@InjectRepository(CompletedTraining) private readonly completeTrainingRepo:Repository<CompletedTraining>,
	) {}
	
	async getSummary(): Promise<Record<string, number>>{
		const totalEmployees = await this.employeeRepo.count();
		const totalTrainings = await this.trainingsRepo.count();
		const totalCompletedTrainings = await this.completeTrainingRepo.count();
		const totalCompletedMandatoryTrainings= await this.completeTrainingRepo
			.createQueryBuilder('ct')// get left table
			.innerJoinAndSelect('ct.training', 'training') // get left table relationship object, and right table
			.where('training.mandatory = :mandatory', { mandatory: true }) // pick the column and value
			.getCount();
		return {
			totalTrainings,
			totalEmployees,
			totalCompletedTrainings,
			totalCompletedMandatoryTrainings,
		}
	}

}