import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';

@Controller('suppliers')
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Get()
  async findAll() {
    const data = await this.suppliersService.findAll();
    return { success: true, data };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.suppliersService.findOne(+id);
    return { success: true, data };
  }

  @Post()
  async create(@Body() dto: CreateSupplierDto) {
    const data = await this.suppliersService.create(dto);
    return { success: true, data };
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: CreateSupplierDto) {
    const data = await this.suppliersService.update(+id, dto);
    return { success: true, data };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.suppliersService.remove(+id);
    return { success: true, message: 'Supplier deleted successfully' };
  }
}