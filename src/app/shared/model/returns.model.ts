export interface Returns {
  page: number;
  search_term?: string;
  return_type: number | string;
}

export interface SingleReturn {
  po_no: string;
  invoice_no: string;
  customer_name: string;
  product_mpn: string;
  product_qty: number;
  return_qty: number;
  return_classification: string;
  refund_status?: string;
  tracking?: {
    name: string;
    number: string;
  };
  ra_number?: Array<{
    name: string;
    number: string;
  }>;
}
