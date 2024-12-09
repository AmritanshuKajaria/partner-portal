import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserPermissionService {
  url = environment.apiUrl;

  userPermission = new BehaviorSubject('');
  constructor(private httpClient: HttpClient) {}

  getPartnerPermission() {
    // return this.httpClient.get(this.url + '/partner-details');
    // return this.httpClient.get('https://api.123stores.com/partner-details');
    return of({
      success: true,
      pricing_tab: 1,
      processed_at: '2023-06-09T13:24:59.000Z',
      partner_display_name: 'National Public Seating Corp',
      partner_code: 'NPS',
      partner_map: true,
      partner_sku_level_handling: true,
      inventory_method_email: true,
      brands_total: 2,
      current_plan: 'plus',
      free_trial_eligible: false,
      recommended_plan: 'plus',
      brands: ['Oklahoma Sound', 'National Public Seating'],
      collections_total: 4,
      collections: [
        'National Public Seating',
        'Oklahoma Sound',
        'Aristocrat Series',
        '6400 Series',
      ],
      product_category_total: 47,
      product_categories: [
        'Folding Chairs',
        'Power Plus Series',
        '100 Series',
        '20 Series',
        'Contemporary Series',
        'Dollies',
        'Aristocrat Series',
        'Lectern',
        'Vision Series',
        'Stool Accessories',
        'Stools',
        'Stool',
        'Portable Presentation Series',
        'Prestige Series',
        'Orator Series',
        'Stack Chairs',
        'Music Chair',
        'Music Room',
        'Music Stand',
        'Bar Stools',
        'Banquet Stack Chairs',
        'Veneer Series',
        'Blow Molded Tables',
        'Accessories',
        'CafÃ© Table',
        'CafÃ© Time',
        'CVS',
        'Sit Stand Series',
        'Lectern Accessory',
        'Floor Glides',
        'Chair Accessories',
        'Riser Accessories',
        'Stage Accessories',
        'Science Lab Tables',
        'Technology Series',
        'MMC Series',
        'Science Lab',
        'PA Systems',
        'PRC Series',
        'Phenolic Science Lab Tables',
        'Straight Risers',
        'Tapered Risers',
        'Stages',
        'Smart Cart Series',
        'Adjustable Height Science Lab Tables',
        'Stage Pies',
        'TransPort Riser',
      ],
    });
  }

  updatePlanDetails(data: any) {
    return this.httpClient.post(this.url + '/update-plan', data);
  }
}
