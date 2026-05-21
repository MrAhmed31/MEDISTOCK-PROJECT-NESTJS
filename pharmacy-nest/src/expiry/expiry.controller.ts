import { Controller, Get } from '@nestjs/common';
import { ExpiryService } from './expiry.service';

@Controller('expiry')
export class ExpiryController {
  constructor(private readonly expiryService: ExpiryService) {}

  @Get('analytics')
  async getDashboardAnalytics() {
    const data = await this.expiryService.getDashboardAnalytics();
    return { success: true, data };
  }

  @Get('week')
  async getExpiringThisWeek() {
    const data = await this.expiryService.getExpiringThisWeek();
    return { success: true, count: data.length, data };
  }

  @Get('month')
  async getExpiringThisMonth() {
    const data = await this.expiryService.getExpiringThisMonth();
    return { success: true, count: data.length, data };
  }

  @Get('year')
  async getExpiringThisYear() {
    const data = await this.expiryService.getExpiringThisYear();
    return { success: true, count: data.length, data };
  }

  @Get('expired')
  async getExpired() {
    const data = await this.expiryService.getExpired();
    return { success: true, count: data.length, data };
  }

  @Get('healthy')
  async getHealthyStock() {
    const data = await this.expiryService.getHealthyStock();
    return { success: true, count: data.length, data };
  }

  @Get('all')
  async getAllWithStatus() {
    const data = await this.expiryService.getAllWithStatus();
    return { success: true, count: data.length, data };
  }
}