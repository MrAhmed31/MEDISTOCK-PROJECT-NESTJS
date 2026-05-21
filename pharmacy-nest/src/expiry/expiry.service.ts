import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Medicine, MedicineDocument } from '../medicines/schemas/medicine.schema';

@Injectable()
export class ExpiryService {
  constructor(
    @InjectModel(Medicine.name)
    private medicineModel: Model<MedicineDocument>,
  ) {}

  private getDateRanges() {
    const now = new Date();
    const endOfWeek = new Date();
    endOfWeek.setDate(now.getDate() + 7);
    const endOfMonth = new Date();
    endOfMonth.setDate(now.getDate() + 30);
    const endOfYear = new Date();
    endOfYear.setDate(now.getDate() + 365);
    return { now, endOfWeek, endOfMonth, endOfYear };
  }

  calculateTimeLeft(expiryDate: Date) {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffMs = expiry.getTime() - now.getTime();
    const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    return {
      daysLeft,
      weeksLeft: Math.floor(daysLeft / 7),
      monthsLeft: Math.floor(daysLeft / 30),
      yearsLeft: Math.floor(daysLeft / 365),
      isExpired: daysLeft < 0,
      status:
        daysLeft < 0 ? 'expired' :
        daysLeft <= 7 ? 'this_week' :
        daysLeft <= 30 ? 'this_month' :
        daysLeft <= 365 ? 'this_year' : 'healthy',
      color:
        daysLeft < 0 ? 'red' :
        daysLeft <= 7 ? 'orange' :
        daysLeft <= 30 ? 'yellow' :
        daysLeft <= 365 ? 'blue' : 'green',
    };
  }

  private mapWithTimeLeft(medicines: MedicineDocument[]) {
    return medicines.map((med) => ({
      ...med.toObject(),
      timeLeft: this.calculateTimeLeft(med.expiryDate),
    }));
  }

  async getExpiringThisWeek() {
    const { now, endOfWeek } = this.getDateRanges();
    const medicines = await this.medicineModel.find({
      expiryDate: { $gte: now, $lte: endOfWeek },
    });
    return this.mapWithTimeLeft(medicines);
  }

  async getExpiringThisMonth() {
    const { now, endOfMonth } = this.getDateRanges();
    const medicines = await this.medicineModel.find({
      expiryDate: { $gte: now, $lte: endOfMonth },
    });
    return this.mapWithTimeLeft(medicines);
  }

  async getExpiringThisYear() {
    const { now, endOfYear } = this.getDateRanges();
    const medicines = await this.medicineModel.find({
      expiryDate: { $gte: now, $lte: endOfYear },
    });
    return this.mapWithTimeLeft(medicines);
  }

  async getExpired() {
    const { now } = this.getDateRanges();
    const medicines = await this.medicineModel.find({
      expiryDate: { $lt: now },
    });
    return this.mapWithTimeLeft(medicines);
  }

  async getHealthyStock() {
    const { endOfYear } = this.getDateRanges();
    const medicines = await this.medicineModel.find({
      expiryDate: { $gt: endOfYear },
    });
    return this.mapWithTimeLeft(medicines);
  }

  async getDashboardAnalytics() {
    const { now, endOfWeek, endOfMonth, endOfYear } = this.getDateRanges();

    const [weekly, monthly, yearly, expired, healthy, total] =
      await Promise.all([
        this.medicineModel.countDocuments({ expiryDate: { $gte: now, $lte: endOfWeek } }),
        this.medicineModel.countDocuments({ expiryDate: { $gte: now, $lte: endOfMonth } }),
        this.medicineModel.countDocuments({ expiryDate: { $gte: now, $lte: endOfYear } }),
        this.medicineModel.countDocuments({ expiryDate: { $lt: now } }),
        this.medicineModel.countDocuments({ expiryDate: { $gt: endOfYear } }),
        this.medicineModel.countDocuments(),
      ]);

    const nearestExpiry = await this.medicineModel
      .findOne({ expiryDate: { $gte: now } })
      .sort({ expiryDate: 1 });

    return {
      total,
      weekly,
      monthly,
      yearly,
      expired,
      healthy,
      nearestExpiry: nearestExpiry ? {
        name: nearestExpiry.name,
        brand: nearestExpiry.brand,
        expiryDate: nearestExpiry.expiryDate,
        timeLeft: this.calculateTimeLeft(nearestExpiry.expiryDate),
      } : null,
      percentages: {
        expired: ((expired / total) * 100).toFixed(1),
        healthy: ((healthy / total) * 100).toFixed(1),
        atRisk: ((weekly / total) * 100).toFixed(1),
      },
    };
  }

  async getAllWithStatus() {
    const medicines = await this.medicineModel.find().sort({ expiryDate: 1 });
    return this.mapWithTimeLeft(medicines);
  }
}