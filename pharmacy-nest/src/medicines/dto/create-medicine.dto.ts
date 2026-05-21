export class CreateMedicineDto {
  name: string;
  brand: string;
  category: string;
  quantity: number;
  price: number;
  expiryDate: Date;
  description?: string;
}