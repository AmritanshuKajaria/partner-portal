import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {
  EditEndDatePromotions,
  ExportPromo,
  PromoTemplate,
  Promotions,
  StopPromotions,
} from '../model/promotion.model';

@Injectable({
  providedIn: 'root',
})
export class PromotionsService {
  url = environment.baseUrl;
  constructor(private http: HttpClient) {}

  getAllPromotions(action: Promotions) {
    let params = new HttpParams()
      .set('page', action.page)
      .set('open', action.open);
    if (action.filter_start_date) {
      params = params.append('filter_start_date', action?.filter_start_date);
    }
    if (action.filter_end_date) {
      params = params.append('filter_end_date', action?.filter_end_date);
    }
    if (action.filter_status) {
      params = params.append('filter_status', action?.filter_status);
    }
    if (action.search_term) {
      params = params.append('search_term', action?.search_term);
    }

    return this.http.get(this.url + '/promos', {
      params: params,
    });
  }

  stopPromotions(payload: StopPromotions) {
    return this.http.post(this.url + '/stop-promo', payload);
  }

  cancelPromotions(payload: StopPromotions) {
    return this.http.post(this.url + '/cancel-promo', payload);
  }

  editEndDatePromo(payload: EditEndDatePromotions) {
    return this.http.post(this.url + '/edit-promo', payload);
  }

  getPromotion(action: StopPromotions) {
    let params = new HttpParams().set('promo_code', action.promo_code);

    return this.http.get(this.url + '/promo', {
      params: params,
    });
  }

  createPromotion(payload: any) {
    return this.http.post(this.url + '/add-promo', payload);
  }

  downloadPromotionDetails(action: StopPromotions) {
    let params = new HttpParams().set('promo_code', action.promo_code);

    return this.http.get(this.url + '/download-promotion-details', {
      params: params,
    });
  }

  promoTemplate(action: PromoTemplate) {
    let params = new HttpParams().set('include_data', action.include_data);

    return this.http.get(this.url + '/promo-template', {
      params: params,
    });
  }

  exportPromo(payload: ExportPromo) {
    return this.http.post(this.url + '/export-promo', payload);
  }
}
