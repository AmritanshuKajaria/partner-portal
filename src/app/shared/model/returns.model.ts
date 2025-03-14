export interface Pagination {
  page: number;
  search_term?: string;
  return_type: number | string;
}

interface Tracking {
  name: string;
  number: string;
}

interface RANumber {
  amazon_ra_number: string;
  your_ra_number: string;
}

export interface GetAllReturn {
  pagination?: {
    total_rows?: number;
    current_page?: number;
    total_pages?: number;
  };
  filtered?: boolean;
  applied_filters?: AppliedFilters;
  searched?: boolean;
  applied_search_term?: string;
  returns?: SingleReturn[];
}

export interface AppliedFilters {
  filter_start_date?: string;
  filter_end_date?: string;
  filter_status?: string;
  filter_return_classification?: string;
  filter_return_type?: string;
}

// in export common component it's conflict with AppliedFilters of other tab
export interface ExportAppliedFilters extends AppliedFilters {}

export interface Cost {
  cost_of_product: string;
  original_shipping_cost: string;
  cost_of_return_shipping: string;
  total: string;
}

export interface GetAllReturnsPayload extends Pagination, AppliedFilters {}

export interface SingleReturn {
  po_no: string;
  invoice_no: string;
  customer_name: string;
  product_mpn: string;
  product_sku: string;
  product_qty: number;
  return_delivery_date: string;
  credit_amount_due: string;
  cost: Cost;
  shipped_date: string;
  return_qty: number;
  return_classification: string;
  return_status?: string;
  tracking?: Tracking;
  ra_number?: RANumber;
}

export interface AddRaPayload {
  po_no: string;
  ra: string;
}
export interface markAsReceivedPayload {
  po_no: string;
}
export interface ApproveReturnPayload {
  po_no: string;
  cn: string;
  uploaded_file?: File;
  type: string;
}

export interface ReclssifyReturnPayload extends ApproveReturnPayload {}

export interface ReportCarrierDamagePayload {
  po_no: string;
  image1: File;
  image2: File;
  image3: File;
  type: string;
}

export interface AdditionalDetailsPayload {
  remarks: string;
  image1: File;
  image2: File;
  image3: File;
}

export interface markAsLostPayload {
  po_no: string;
  type: string;
}
export interface markAsReceivedPayload {
  po_no: string;
}
