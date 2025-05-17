// Customer interface
export interface Customer {
  id: string;
  name: string;
  phone: string;
  address?: string;
}

// Vegetable sale item interface
export interface VegetableSaleItem {
  id: string;
  vegetableName: string;
  weight: number; // in kg
  pricePerUnit: number; // in INR
  totalPrice: number; // calculated field
}

// Sale record interface
export interface SaleRecord {
  id: string;
  date: string;
  customerId: string;
  customer: Customer; // reference to customer
  items: VegetableSaleItem[];
  totalAmount: number;
}