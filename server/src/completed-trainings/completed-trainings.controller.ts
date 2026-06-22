import {
	Controller,
	Query,
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
	findAll(
		@Query('page') page:string,
		@Query('limit') limit:string
	) {
		return this.CompletedTrainingsService.findAllTrainings(page, limit);
	}
	
	// @Get()
	// findAll() {
	// 	return this.CompletedTrainingsService.findAllTrainings();
	// }

	@Get(':date')
	findByDate(@Param('date') date: string){
		return this.CompletedTrainingsService.findByDate(date);
	}


}
