import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm';
import { Training } from './entities/trainings.entity'
import { Repository } from 'typeorm';



@Injectable()
export class TrainingsService {
	constructor(
		@InjectRepository(Training) private readonly trainingsRepo: Repository<Training>
	) {}

	async findAllTrainings() {
		return await this.trainingsRepo.find({
			relations: {
				completedTrainings: true
			}
		})
	}

	async findOneBy(id: number):Promise<Training> {
		return await this.trainingsRepo.findOneBy({id})
	}

}