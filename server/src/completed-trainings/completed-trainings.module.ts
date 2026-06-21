import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompletedTrainingsController } from './completed-trainings.controller';
import { CompletedTrainingsService } from './completed-trainings.service';
import { CompletedTraining } from './entities/completed-trainings.entity';

@Module({
	imports: [TypeOrmModule.forFeature([CompletedTraining])],
	controllers: [CompletedTrainingsController],
	providers: [CompletedTrainingsService],
	exports: [CompletedTrainingsService]
})
export class CompletedTrainingsModule {}
