import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
} from '@nestjs/common';
import { CompletedTrainingsService } from './completed-trainings.service';

@Controller('completed-trainings')
export class CompletedTrainingsController {
	constructor(private readonly CompletedTrainingsService: CompletedTrainingsService) {}


	@Get()
	findAll() {
		return this.CompletedTrainingsService.findAllTrainings();
	}

	@Get(':date')
	findByDate(@Param('date') date: string){
		return this.CompletedTrainingsService.findByDate(date);
	}

}
