export interface GetAllInventory {
  inventory_feeds: SingleInventory[];
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
}

export interface AppliedFilters {
  filter_end_date?: string;
  filter_feed_result?: string;
  filter_inventory_method?: string;
  filter_start_date?: string;
}

export interface SingleInventory {
  feed_code: string;
  feed_result: string;
  feed_status: string;
  feed_time: string | any;
  method: string;
  total_in_stock: string;
  total_mpn: string;
  total_out_of_stock: string;
}

export interface ProcessedInventory {
  active_in_stock?: number;
  active_in_stock_to_in_stock?: number;
  active_in_stock_to_out_of_stock?: number;
  active_out_of_stock?: number;
  active_out_of_stock_to_in_stock?: number;
  active_out_of_stock_to_out_of_stock?: number;
  discontinued_in_stock?: number;
  discontinued_out_of_stock?: number;
  feed_method?: string;
  feed_process_time?: string;
  feed_status?: string;
  ltl_in_stock?: number;
  ltl_out_of_stock?: number;
  partner_restricted_in_stock?: number;
  partner_restricted_out_of_stock?: number;
  processed_at?: string;
  processed_file_url?: string;
  raw_file_url?: string;
  requested_partner_id?: string;
  requested_user_id?: string;
  requsted_feed_code?: string;
  stranded_in_catalog_out_of_stock?: number;
  stranded_in_feed_in_stock?: number;
  stranded_in_feed_out_of_stock?: number;
  success?: boolean;
  suppressed_in_stock?: number;
  suppressed_out_of_stock?: number;
}

export interface RejectInventory {
  feed_method?: string;
  feed_process_time?: string;
  feed_status?: string;
  processed_at?: string;
  raw_file_url?: string;
  requested_partner_id?: string;
  requested_user_id?: string;
  requsted_feed_code?: string;
  success?: boolean;
  rejected_file_url?: string;
}
