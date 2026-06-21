import { Module } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './entities/employees.entity';
import { CompletedTrainingsModule } from '../completed-trainings/completed-trainings.module'

@Module({
	imports: [
		TypeOrmModule.forFeature([Employee]), 
		CompletedTrainingsModule
	],
	controllers: [EmployeesController],
	providers: [EmployeesService],
})
export class EmployeesModule {}
