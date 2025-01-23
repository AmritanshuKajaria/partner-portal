export interface Payments {
  page: number;
  filter_from_invoice_date?: string;
  filter_to_invoice_date?: string;
  filter_from_remittance_date?: string;
  filter_to_remittance_date?: string;
  search_term?: string;
  search_transactions?: string;
  filter_type?: string;
  filter_due_date?: string;
}

export interface SinglePayment {
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
