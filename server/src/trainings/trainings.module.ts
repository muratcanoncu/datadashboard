import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Training } from './entities/trainings.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Training])],
	controllers: [],
	providers: [],
})
export class TrainingsModule {}
