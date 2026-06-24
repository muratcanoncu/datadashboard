import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
	imports: [
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: 'localhost',
			port: 5432,
			username: 'admin',
			password: 'admin',
			database: 'tesladb',
			synchronize: true,
			entities: [__dirname + '/../**/*.entity.{js,ts}'],
			migrations: [__dirname + '/../migrations/*.{js,ts}'],
			autoLoadEntities: true,
		}),
	],
	controllers: [],
	providers: [],
})
export class DatabaseModule {}
