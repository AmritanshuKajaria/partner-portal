export interface GetAllOrders {
  success?: boolean;
  processed_at?: string;
  pagination?: {
    total_rows: number;
    current_page: number;
    total_pages: number;
  };
  filtered?: boolean;
  applied_filters?: AppliedFilters;
  searched?: boolean;
  applied_search_term?: string;
  orders?: SingleOrder[];
}

export interface AppliedFilters {
  filter_po_list_type?: string;
  filter_sku?: string;
  filter_ship_out_location?: string;
  filter_carrier?: string;
  filter_committed_ship_date?: string;
  filter_from_po_date?: string;
  filter_to_po_date?: string;
}

export interface SingleOrder {
  po_no: string;
  po_date: string | Date;
  po_method: string;
  customer_name: string;
  customer_city: string;
  customer_state: string;
  mpn: string;
  quantity: number;
  po_total: number;
  committed_ship_date: string | Date;
  cancel_after_date: string | Date;
}

export interface OrderAction {
  page: number;
  po_list_type?: string;
  type?: string;
  sku?: string;
  ship_out_location?: string;
  carrier?: string;
  committed_ship_date?: string;
  from_po_date?: string;
  to_po_date?: string;
  search_term?: string;
}

export interface MarkOrderShipped {
  po_number: string;
  reason: string;
}

export interface ClarificationOrders {
  po_number: string;
  clarification_message: string;
  contact_via: string;
  user_email: string;
}

export interface CancelOrders {
  po_number: string;
  reason: string;
  reason_others_message: string;
}
