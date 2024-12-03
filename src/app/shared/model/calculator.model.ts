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
  sku: string;
  mpn: string;
  name: string;
  asin: string;
  upc: string;
  unit_price: number;
  allowance: number;
  slab_amt: number;
  pre_slab_percentage: number;
  post_slab_percentage: number;
  order_processing_fees_percentage: number;
  return_cost_percentage: number;
  shipping_cost: number;
  market_place_fees: number;
  has_map: number;
  map_price: number;
  retail_price: number;
  boxes: number;
  size_tier: string;
}
