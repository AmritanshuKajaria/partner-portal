import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PartnerService {
  url = environment.apiUrl;
  constructor(private http: HttpClient) {}
  getPartner() {
    // return this.http.get(this.url + '/partner');
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({
          processed_at: '2024-09-30T10:25:15.000Z',
          success: true,
          payload: {
            catalogDetails: {
              mapType: '1',
              handlingConfiguration: '1',
              accountHandlingTimeValue: '3',
            },
            inventoryDetails: {
              inventoryFeedType: '2',
              inventoryFeedDetailType: '1',
              inventoryBucket: '1',
              inventoryFeedFrequency: ['1', '2', '3', '4', '5'],
              inventoryFeedMPN: 'Item Code',
              inventoryFeedQuantityColumnName: 'Total Quantity On Hand',
              authorizedFeedSenders: ['abc@gmail.com', 'abcd@gmail.com'],
            },
            fulfillmentDetails: {
              poSendingMethod: '2',
              generateLabels: '1',
              isPackingSlipEnabled: false,
              enabledCarriers: ['FEDEX', 'UPS', 'USPS'],
              labelPageSize: '1',
              copyOfPOSentOverEmail: true,
              authorizedFeedSenders: ['abc@gmail.com', 'abcd@gmail.com'],
              returnProfile: 'test', // This is the newly added field

              returnDetails: { // This is the newly added field
                returnProfileType: "1",
                returnReimbursementMethod: "2",
                returnDaCalculationMethod: "3",
                returnAllowancePercentage: "0.00",
                returnBuyersRemorseRestockingPercentage: "0.00",
                returnUndeliverableRestockingPercentage: "0.00",
                returnProcessingFeePercentage: "0.00",
                orderProcessingFeePercentage: "0.04"
            },
            },
            previousShippingClosures: [
              {
                closureDate: '2024-10-25',
                remark: '23',
                isDeleted: 0,
              },
            ],
            upcomingShippingClosures: [
              {
                closureDate: '2024-10-25',
                remark: 'asdasd',
                isDeleted: 0,
              },
              {
                closureDate: '2024-10-25',
                remark: 'asdasd',
                isDeleted: 0,
              },
            ],
            shipoutLocationsInactive: [
              {
                internalCode: 'BSI-LOC-001',
                externalCode: 'Maple Logistics Solutions',
                addressLine1: '704 Legionaire Drive',
                addressLine2: '',
                city: 'Fredericksburg',
                state: 'PA',
                zipCode: '17026',
                country: 'US',
                timeZone: 'EDT',
                cutOffTime: '17:00:00',
                contactName: 'Steve Conlin',
                phoneNumber: '7178657600',
                phoneNumberExtension: '',
                isActive: '0',
              },
            ],
            shipoutLocations: [
              {
                internalCode: 'SPT-LOC-001',
                externalCode: 'CA-91745',
                addressLine1: '14625 Clark Street',
                addressLine2: '',
                city: 'City of Industry',
                state: 'CA',
                zipCode: '91745',
                timeZone: 'PST',
                cutOffTime: '19:01:00',
                contactName: 'Sales Team',
                country: 'US',
                phoneNumber: '6263362299',
                phoneNumberExtension: '',
                isActive: '1',
              },
              {
                internalCode: 'SPT-LOC-001',
                externalCode: 'CA-91745',
                addressLine1: '14625 Clark Street',
                addressLine2: '',
                city: 'City of Industry',
                state: 'CA',
                zipCode: '91745',
                timeZone: 'PST',
                cutOffTime: '19:01:00',
                contactName: 'Sales Team',
                country: 'US',
                phoneNumber: '6263362299',
                phoneNumberExtension: '',
                isActive: '1',
              },
            ],
            returnLocation: {
              returnInternalCode: 'SPT-RETURN-LOCATION-001',
              returnExternalCode: 'CA-91745',
              returnAddressLine1: '14625 Clark Ave.',
              returnAddressLine2: '',
              returnCity: 'City of Industry',
              returnState: 'CA',
              returnZipCode: '91745',
              returnCountry: 'US',
              returnTimeZone: 'PST',
              returnContactName: 'Sales Team',
              returnPhoneNumber: '6263362299',
              returnPhoneNumberExtension: '',
            },
            partnerDetails: {
              displayName: 'Sunpentown International Inc (SPT)',
              accountManagerName: 'Shiv',
              accountStatus: '1',
              accountStatusReason: '',
              salesStatus: '1',
              salesStatusReason: '',
            },
            legalInfo: {
              documentType: '1',
              formRevisionNumber: 'January 2011',
              legalName: 'SPT APPLIANCE INC.',
              businessName: '',
              federalTaxClassification: 'S Corporation',
              officialAddressLine1: '14701 Clark Ave.,',
              officialAddressLine2: '',
              officialCity: 'City of Industries',
              officialState: 'CA',
              officialZipCode: '91745',
              officialCountry: 'US',
              tinType: '2',
              tinNumber: '263061238',
              w9SigningDate: '2011-06-15',
              w9FileID: '271033367',
            },
            achDetails: {
              accountNumber: '8007023685',
              bankName: 'East West Bank',
              nameOnAccount: 'SPT Appliance Inc.',
              routingNumber: '322070381',
            },
            paymentDetails: {
              netDays: '1',
              discountDays: '1',
              discountPercentage: '1.00',
              paymentStatus: '1',
              paymentStatusReason: '',
            },
            coiConfiguration: {
              insurerName: '',
              insuredName: '',
              policyNumber: '',
              policyStartDate: '0000-00-00',
              policyEndDate: '0000-00-00',
              coiFileID: '0',
            },
            contacts: {
              '630': {
                contactId: '630',
                partnerId: '61',
                firstName: 'Test',
                lastName: 'Test',
                designation: '123',
                contactPhoneNumber: '1231231232',
                contactPhoneNumberExtension: '23',
                contactTimeZone: 'PST',
                notes: '',
                arrRoles: ['1', '2', '3', '4', '5', '6', '7', '8'],
                isDeleted: 0,
              },
              '631': {
                contactId: '631',
                partnerId: '61',
                firstName: '123',
                lastName: '123',
                designation: '123',
                contactPhoneNumber: '1231231232',
                contactPhoneNumberExtension: '',
                contactTimeZone: 'PST',
                notes: '',
                arrRoles: ['1', '2', '3', '4', '5', '6', '7', '8'],
                isDeleted: 0,
              },
            },
            accountSetupUpdateNotifications: [
              'sales.team@spt-usa.com',
              'acc-1@sunpentown.com',
              'judy.ho@sunpentown.com',
            ],
            catalogSetupUpdateNotifications: ['sales.team@spt-usa.com'],
            inventoryProcessingNotification: ['sales.team@spt-usa.com'],
            invoicingNotifications: ['judy.ho@sunpentown.com'],
            orderProcessingNotification: ['sales.team@spt-usa.com'],
            purchaseOrderNotification: ['sales.team@spt-usa.com'],
            remittanceNotifications: ['sales.team@spt-usa.com'],
            returnProcessingNotification: ['sales.team@spt-usa.com'],
          },
        });
      }, 1000);
    });
    return from(promise);
  }

  updatePartner(data: any) {
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(
          {
            success: true,
          });
      }, 1000);
    });
    return from(promise);
  }
}
