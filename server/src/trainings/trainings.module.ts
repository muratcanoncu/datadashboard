import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Training } from './entities/trainings.entity';
import { Trainings } from './trainings.controller'
import { TrainingsService } from './trainings.service'

@Module({
	imports: [TypeOrmModule.forFeature([Training])],
	controllers: [Trainings],
	providers: [TrainingsService],
})
export class TrainingsModule {}
