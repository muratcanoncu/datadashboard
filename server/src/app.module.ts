import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { TrainingsModule } from './trainings/trainings.module';
import { AuthServiceModule } from './auth-service/auth-service.module';
import { CompletedTrainingsModule } from './completed-trainings/completed-trainings.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { EmployeesModule } from './employees/employees.module';

@Module({
	imports: [
		DatabaseModule,
		TrainingsModule,
		AuthServiceModule,
		EmployeesModule,
		CompletedTrainingsModule,
		DashboardModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
