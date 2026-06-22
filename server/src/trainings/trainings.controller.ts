import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
} from '@nestjs/common';
import { TrainingsService } from './trainings.service';

@Controller('trainings')
export class Trainings {
	constructor(private readonly TrainingsService: TrainingsService) {}


	@Get()
	findAll() {
		return this.TrainingsService.findAllTrainings();
	}

	@Get(':id')
	findById(@Param('id') id: string){
		return this.TrainingsService.findOneBy(parseInt(id));
	}


}
