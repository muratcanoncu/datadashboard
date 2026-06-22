import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from 'src/employees/entities/employees.entity';
import { Training } from 'src/trainings/entities/trainings.entity';
import { CompletedTraining } from 'src/completed-trainings/entities/completed-trainings.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([Employee, Training, CompletedTraining])
	],
	controllers:[DashboardController],
	providers:[DashboardService]
})
export class DashboardModule {}
