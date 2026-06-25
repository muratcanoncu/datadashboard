import { Controller, Get } from '@nestjs/common'
import { DashboardService } from './dashboard.service'

@Controller('dashboard')
export class DashboardController {
	constructor(private readonly service: DashboardService ) {}

	@Get('summary') 
	getSummary(){
		return this.service.getSummary();
	}

	@Get('query-exercise')
	exerciseQuery(){
		return this.service.exerciseQuery()
	}
}