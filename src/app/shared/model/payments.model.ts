// common for get pagination
export interface Pagination {
  page: number;
  search_term?: string;
}

// For common table use
export interface TableData extends Transaction, OpenBalance, PastRemittance {}

// DownloadRemittance
export interface GetDownloadRemittance {
  success?: boolean;
  processed_at?: string;
  remittance_url?: string;
}

export interface DownloadRemittance {
  remittance_no: string;
  file_type: string;
}

// Invoice
export interface InvoiceDetails {
  success?: boolean;
  processed_at?: string;
  requested_invoice_no?: string;
  invoice?: Invoice;
  error_message?: string;
}

export interface Invoice {
  invoice_summary?: {
    invoice_no?: string;
    po_no?: string;
    invoice_date?: string;
    payment_terms?: string;
  };
  invoice_status?: {
    status?: string;
    due_date?: string;
  };
  sold_to?: {
    address_line1?: string;
    address_line2?: string;
    city?: string;
    state_code?: string;
    postal_code?: string;
    country_code?: string;
    location_code?: string;
  };
  ship_to?: {
    name?: string;
    company_name?: string;
    address_line1?: string;
    address_line2?: string;
    city?: string;
    state_code?: string;
    postal_code?: string;
    country_code?: string;
    phone?: string;
  };
  invoice_detail?: {
    mpn?: string;
    description?: string;
    product_name?: string;
    qty?: string;
    unit_price?: string;
    total?: string;
    net_product_cost?: string;
    shipping_cost?: string;
  };
  po_detail?: PoDetail;
}

export interface PoDetail {
  mpn?: string;
  net_product_cost?: string;
  shipping_cost?: string;
  total?: string;
  qty?: string;
}

// Transaction
export interface GetAllTransactions {
  success?: boolean;
  processed_at?: string;
  pagination?: {
    total_rows?: number;
    current_page?: number;
    total_pages?: number;
  };
  filtered?: boolean;
  applied_filters?: TransactionFilters;
  searched?: boolean;
  applied_search_term?: string;
  transactions?: Transaction[];
  error_message?: string;
}

export interface TransactionFilters {
  search_transactions?: string;
}

export interface Transaction {
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
}

export interface GetAllTransactionsPayload
  extends Pagination,
    TransactionFilters {}

// OpenBalances
export interface GetAllOpenBalances {
  success?: boolean;
  processed_at?: string;
  pagination?: {
    total_rows?: number;
    current_page?: number;
    total_pages?: number;
  };
  filtered?: boolean;
  applied_filters?: OpenBalancesFilters;
  searched?: boolean;
  applied_search_term?: string;
  total_outstanding_balance?: string;
  open_balances?: OpenBalance[];
  error_message?: string;
}

export interface OpenBalancesFilters {
  filter_from_invoice_date?: string;
  filter_to_invoice_date?: string;
  filter_type?: string;
  filter_due_date?: string;
}

export interface OpenBalance {
  invoice_no?: string;
  po_no?: string;
  type?: string;
  invoice_date?: string;
  due_date?: string;
  invoice_amount?: string;
  adjustment_amount?: string;
  due_amount?: string;
  remarks?: string;
}

export interface GetAllOpenBalancesPayload
  extends Pagination,
    OpenBalancesFilters {}

// PastRemittances
export interface GetAllPastRemittances {
  success?: boolean;
  processed_at?: string;
  pagination?: {
    total_rows?: number;
    current_page?: number;
    total_pages?: number;
  };
  filtered?: boolean;
  applied_filters?: PastRemittancesFilters;
  searched?: boolean;
  applied_search_term?: string;
  past_remittances?: PastRemittance[];
  error_message?: string;
}

export interface PastRemittancesFilters {
  filter_start_date?: string;
  filter_end_date?: string;
}

export interface PastRemittance {
  remittance_no?: string;
  remittance_date?: string;
  no_of_items?: number;
  remittance_amount?: string;
}

export interface GetAllPastRemittancesPayload
  extends Pagination,
    PastRemittancesFilters {}
