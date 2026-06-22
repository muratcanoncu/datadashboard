import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

import { EmployeeLevel } from '../entities/employees.entity';

export class CreateEmployeeDto {
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsString()
	@IsNotEmpty()
	surname: string;

	@IsEmail()
	@Length(1,64)
	email: string;

	@IsOptional()
	@IsEnum(EmployeeLevel)
	level?: string;
}
