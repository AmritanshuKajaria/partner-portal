export interface Returns {
  page: number;
  search_term?: string;
  return_type: number | string;
}

interface Tracking {
  name: string;
  number: string;
}

interface RANumber {
  name: string;
  number: string;
}

export interface GetAllReturn {
  success?: boolean;
  processed_at?: string;
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
  error_message?: string;
}

type AppliedFilters =
  | ReturnInitiatedFilters
  | ReturnInTransitFilters
  | ReturnReceivedFilters
  | InCarrierClaimsFilters
  | AllFilters;

export interface ReturnInitiatedFilters {}
export interface ReturnInTransitFilters {}
export interface ReturnReceivedFilters {}
export interface InCarrierClaimsFilters {}
export interface AllFilters {}

export interface SingleReturn {
  po_no: string;
  invoice_no: string;
  customer_name: string;
  porduct_mpn: string;
  porduct_qty: number;
  return_delivery_date: string;
  credit_amount_due: number;
  return_qty: number;
  return_classification: string;
  refund_status?: string;
  tracking?: Tracking;
  ra_number?: RANumber[];
}

export interface AddRaPayload {
  po_no: string;
  ra_number: RANumber;
}
export interface markAsReceivedPayload {
  po_no: string;
}
export interface ApproveReturnPayload {
  po_no: string;
  cn: string;
  credit_value: number;
  uploaded_file: File;
}

export interface ReportStatusPayload {
  po_no: string;
  refund_status: string;
}
