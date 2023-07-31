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
  shipping_cost: number;
  boxes: number;
  amazon_fees_percentage: number;
  name: string;
  order_processing_fees_percentage: number;
  retail_price: number;
  return_cost_percentage: number;
  size_tier: '2 - Medium';
  unit_price: number;
}
