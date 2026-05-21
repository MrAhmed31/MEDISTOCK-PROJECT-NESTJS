import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MedicinesModule } from './medicines/medicines.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { ExpiryModule } from './expiry/expiry.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.MONGO_URI,
      }),
    }),
    MedicinesModule,
    SuppliersModule,
    ExpiryModule,
  ],
})
export class AppModule {}