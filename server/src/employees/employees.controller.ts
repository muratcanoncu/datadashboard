import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { CompletedTrainingsService } from '../completed-trainings/completed-trainings.service';

@Controller('employees')
export class EmployeesController {
	constructor(
		private readonly employeesService: EmployeesService, 
		private readonly completedTrainingsService: CompletedTrainingsService
	) {}

	@Post()
	create(@Body() createEmployeeDto: CreateEmployeeDto) {
		return this.employeesService.createEmployee(createEmployeeDto);
	}

	@Get()
	findAll() {
		return this.employeesService.findAllEmployees();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.employeesService.findOne(+id);
	}

	@Patch(':id')
	update(
		@Param('id') id: string,
		@Body() updateEmployeeDto: UpdateEmployeeDto,
	) {
		return this.employeesService.update(+id, updateEmployeeDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.employeesService.remove(+id);
	}

	@Get(':id/completed-trainings')
	getCompletedTrainings(@Param('id') id:string) {
		return this.completedTrainingsService.findByEmployee(+id)
	}
}
