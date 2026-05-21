import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { MedicinesService } from './medicines.service';
import { CreateMedicineDto } from './dto/create-medicine.dto';

@Controller('medicines')
export class MedicinesController {
  constructor(private readonly medicinesService: MedicinesService) {}

  @Get()
  async findAll() {
    const data = await this.medicinesService.findAll();
    return { success: true, data };
  }

  @Get('expiring')
  async findExpiring() {
    const data = await this.medicinesService.findExpiring();
    return { success: true, data };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.medicinesService.findOne(id);
    return { success: true, data };
  }

  @Post()
  async create(@Body() dto: CreateMedicineDto) {
    const data = await this.medicinesService.create(dto);
    return { success: true, data };
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: CreateMedicineDto) {
    const data = await this.medicinesService.update(id, dto);
    return { success: true, data };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.medicinesService.remove(id);
    return { success: true, message: 'Medicine deleted successfully' };
  }
}