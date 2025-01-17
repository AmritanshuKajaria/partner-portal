export interface Payments {
  page: number;
  payment_type: number | string;
  filter_from_invoice_date?: string;
  filter_to_invoice_date?: string;
  filter_from_remittance_date?: string;
  filter_to_remittance_date?: string;
  search_term?: string;
  invoice_po_number_search?: string;
}

export interface SinglePayment {
  id: number;
  invoice_no?: string;
  po_no?: string;
  type?: string;
  invoice_date?: string;
  due_date?: string;
  invoice_amount?: string;
  adjustment_amount?: string;
  paid_amount?: string;
  due_amount?: string;
  remittance_no?: string;
  remittance_date?: string;
  remarks?: string;
  no_of_items?: number;
  remittance_amount?: string;
}
