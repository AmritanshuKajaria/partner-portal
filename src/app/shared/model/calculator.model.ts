export interface CalculatorMultiData {
  mpn: string;
  upc: string;
  asin: string;
  productName: string;
  unitPrice: number;
  amazonSalesCommission: number;
  shippingCost: number;
  orderProcessingFee: number;
  returnProcessingFee: number;
  retailPrice: number;
}

export interface NewCalculatorMultiData {
  mpn: string;
  sku: string;
  upc: string;
  asin: string;
  productName: string;
  unitPrice: number;
  amazonSalesCommission: number;
  shippingCost: number;
  orderProcessingFee: number;
  returnProcessingFee: number;
  retailPrice: number;
  boxes: number;
  sizeTier: string;
}
