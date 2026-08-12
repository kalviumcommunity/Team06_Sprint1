export interface Medicine {
  id: string;
  name: string;
  category: string;
  manufacturer: string;
  image: string;

  price: number;
  stock: number;

  expiryDate: string;
  manufacturingDate: string;

  composition: string;
  dosage: string;

  sideEffects: string;
  storage: string;

  prescriptionRequired: boolean;
}