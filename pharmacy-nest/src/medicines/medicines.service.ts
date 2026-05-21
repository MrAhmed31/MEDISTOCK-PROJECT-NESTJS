import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Medicine, MedicineDocument } from './schemas/medicine.schema';
import { CreateMedicineDto } from './dto/create-medicine.dto';

@Injectable()
export class MedicinesService {
  constructor(
    @InjectModel(Medicine.name)
    private medicineModel: Model<MedicineDocument>,
  ) {}

  async findAll(): Promise<MedicineDocument[]> {
    return this.medicineModel.find().exec();
  }

  async findOne(id: string): Promise<MedicineDocument | null> {
    return this.medicineModel.findById(id).exec();
  }

  async create(dto: CreateMedicineDto): Promise<MedicineDocument> {
    const medicine = new this.medicineModel(dto);
    return medicine.save();
  }

  async update(id: string, dto: CreateMedicineDto): Promise<MedicineDocument | null> {
    return this.medicineModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  async remove(id: string): Promise<MedicineDocument | null> {
    return this.medicineModel.findByIdAndDelete(id).exec();
  }

  async findExpiring(): Promise<MedicineDocument[]> {
    const today = new Date();
    const next30Days = new Date();
    next30Days.setDate(today.getDate() + 30);
    return this.medicineModel.find({
      expiryDate: { $gte: today, $lte: next30Days },
    }).exec();
  }
}