import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExpiryController } from './expiry.controller';
import { ExpiryService } from './expiry.service';
import { Medicine, MedicineSchema } from '../medicines/schemas/medicine.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Medicine.name, schema: MedicineSchema },
    ]),
  ],
  controllers: [ExpiryController],
  providers: [ExpiryService],
})
export class ExpiryModule {}