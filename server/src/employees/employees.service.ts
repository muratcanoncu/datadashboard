import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { Employee } from './entities/employees.entity'


@Injectable()
export class EmployeesService {

	constructor(
		@InjectRepository(Employee) private readonly employeeRepo: Repository<Employee>
	) {}

	async createEmployee(dto: CreateEmployeeDto): Promise<Employee> {
		return this.employeeRepo.manager.transaction(async tx =>{
			const newEmployee = tx.getRepository(Employee).create({
				name: dto.name,
				surname: dto.surname,
				email: dto.email,
				level: dto.level
			})
			try {
				const saved = await tx.getRepository(Employee).save(newEmployee)
				return await tx.getRepository(Employee).findOneOrFail({
					where: { id: saved.id }
				})
			} catch (error) {
				if (error instanceof QueryFailedError) {
					throw new ConflictException('Email already in use')
				}
				throw error
			}

		});
	}

	async findAllEmployees(): Promise<Employee[]> {
		return this.employeeRepo.find({
			relations: {
				completedTrainings: true
			}
		});
	}

	async findOne(id: number): Promise<Employee> {
		return this.employeeRepo.findOne( { 
			where: { id },
		})
	}

	async update(id: number, updateEmployeeDto: UpdateEmployeeDto): Promise<Employee> {
		const employee = await this.employeeRepo.findOneBy({id})
		if(!employee){
			throw new NotFoundException('Employee can not be found ID: ' + id)
		}
		const updated = this.employeeRepo.merge(employee, updateEmployeeDto)
		return await this.employeeRepo.save(updated);

	}

	async remove(id: number): Promise<Record<string, string>> {
		const result = await this.employeeRepo.delete({ id });
		if(result.affected === 0){
			throw new NotFoundException(`Employee with ${id} ID can not be found`)
		}
		return {
			message: `Employee with ${id} is successfully deleted`
		}
	}
}
