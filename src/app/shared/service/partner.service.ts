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
          success: true,
          processed_at: '2024-10-02T08:36:07.000Z',
          payload: {
            accountSetupUpdateNotifications: [
              '123stores@bestmasterfurnitures.com',
            ],
            partnerDetails: {
              partnerId: '2111',
              displayName: 'Best Master Furniture (FRF)',
              partnerCode: 'FRF',
              accountManagerId: '525',
              accountManagerName: 'Kevin S',
              accountManagerEmail: 'csm@123stores.com',
              accountManagerPhone: '646-568-9144',
              accountStatus: '1',
              accountStatusReason: '',
              salesStatus: '1',
              salesStatusReason: '',
            },
            catalogSetupUpdateNotifications: [
              '123stores@bestmasterfurnitures.com',
            ],
            catalogDetails: {
              mapType: '1',
              handlingConfiguration: '1',
              accountHandlingTimeValue: '1',
              totalProductsSoftLimit: '5000',
              coOpDiscountPercentage: '0.00',
              coOpCalculationMethod: '0',
              returnProfileType: '1',
              returnReimbursementMethod: '1',
              returnDaCalculationMethod: '3',
              returnAllowancePercentage: '0.00',
              returnBuyersRemorseRestockingPercentage: '0.00',
              returnUndeliverableRestockingPercentage: '0.00',
              returnProcessingFeePercentage: '0.00',
              orderProcessingFeePercentage: '0.04',
            },
            invoicingNotifications: ['123stores@bestmasterfurnitures.com'],
            remittanceNotifications: ['123stores@bestmasterfurnitures.com'],
            paymentDetails: {
              paymentStatus: '1',
              paymentStatusReason: '',
              netDays: '30',
              discountPercentage: '0.00',
              discountDays: '0',
              creditLimit: '0',
              paymentTermForDisplay: 'Net 30',
              creditLimitForDisplay: 'Open',
            },
            achDetails: {
              accountNumber: '325159774331',
              bankName: 'Bank of America',
              nameOnAccount: 'FIRST RATE FURNITURE',
              routingNumber: '121000358',
            },
            inventoryProcessingNotification: [
              '123stores@bestmasterfurnitures.com',
            ],
            shipoutLocationsInactive: [
              {
                internalCode: 'FRF-LOC-003',
                externalCode: 'CA-91730',
                addressLine1: '4D Concepts,',
                addressLine2: '9120 Center Avenue Rancho Cucamonga',
                city: 'Rancho Cucamonga',
                state: 'CA',
                zipCode: '91730',
                country: 'US',
                timeZone: 'PST',
                cutOffTime: '06:00:00',
                contactName: 'Jeff Riegsecker',
                phoneNumber: '9099441980',
                phoneNumberExtension: '',
                isActive: '0',
              },
             
            ],
            shipoutLocations:
             [
              {
                internalCode: 'FRF-LOC-001',
                externalCode: 'CA 91710',
                addressLine1: '13770 Norton Ave',
                addressLine2: '',
                city: 'Chino',
                state: 'CA',
                zipCode: '91710',
                country: 'US',
                timeZone: 'PST',
                cutOffTime: '21:00:00',
                contactName: 'Daniel Do',
                phoneNumber: '9095240889',
                phoneNumberExtension: '',
                isActive: '1',
              },
              {
                internalCode: 'FRF-LOC-002',
                externalCode: 'CA 915410',
                addressLine1: '13770 Non Ave',
                addressLine2: '',
                city: 'Dno',
                state: 'CA',
                zipCode: '53710',
                country: 'US',
                timeZone: 'PST',
                cutOffTime: '24:00:00',
                contactName: 'Taniel Do',
                phoneNumber: '9078240889',
                phoneNumberExtension: '',
                isActive: '1',
              },
            ],
            inventoryDetails: {
              inventoryFeedType: '1',
              inventoryFeedFrequency: ['2', '5'],
              inventoryFeedMPN: 'SKU',
              inventoryFeedQuantityColumnName: 'Stock',
              inventoryFeedDetailType: '1',
              inventoryBucket: '2',
              inventoryBucketChangeDate: '',
              inventoryBucketManuallyOverridden: '0',
              authorizedFeedSenders: ['123stores@bestmasterfurnitures.com'],
            },
            returnLocation: {
              returnInternalCode: 'FRF-RETURN-LOCATION-001',
              returnExternalCode: 'CA 91710',
              returnAddressLine1: '13770 Norton Ave',
              returnAddressLine2: '',
              returnCity: 'Chino',
              returnState: 'CA',
              returnZipCode: '91710',
              returnCountry: 'US',
              returnTimeZone: 'PST',
              returnContactName: 'Daniel Do',
              returnPhoneNumber: '9095240889',
              returnPhoneNumberExtension: '',
            },
            previousShippingClosures: [
              {
                closureDate: '2024-10-25',
                remark: '23',
                isDeleted: 1,
              },
            ],
            upcomingShippingClosures: [
              {
                closureDate: '2024-10-25',
                remark: 'asdasd',
                isDeleted: 1,
              },
              {
                closureDate: '2024-10-25',
                remark: 'asdasd',
                isDeleted: 1,
              },
            ],
            purchaseOrderNotification: ['123stores@bestmasterfurnitures.com'],
            orderProcessingNotification: ['123stores@bestmasterfurnitures.com'],
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
            returnProcessingNotification: [
              '123stores@bestmasterfurnitures.com',
            ],
            returnDetails: {
              returnProfileType: '1',
              returnReimbursementMethod: '1',
              returnDaCalculationMethod: '3',
              returnAllowancePercentage: '0.00',
              returnBuyersRemorseRestockingPercentage: '0.00',
              returnUndeliverableRestockingPercentage: '0.00',
              returnProcessingFeePercentage: '0.00',
              orderProcessingFeePercentage: '0.04',
            },
            portalLogins: {
              '9': {
                portalLoginId: '9',
                partnerId: '2111',
                emailAddress: '123stores@bestmasterfurnitures.com',
                password:
                  '$2y$10$oOQoL9ADj3xzQyT2SVj41eTHWgdsozZV.KVq3ifztiwGOaTgTvciu',
                uuid: '581ff4b5-6828-11ee-a106-1299dc17f83b',
                accessToken:
                  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiIxMjNTdG9yZXMiLCJhdWQiOiJQYXJ0bmVyUG9ydGFsIiwiaWF0IjoxNzI0MzM4NjY5LCJleHAiOjE3MjQzNjAyNjksImRhdGEiOnsiZW1haWwiOiIxMjNzdG9yZXNAYmVzdG1hc3RlcmZ1cm5pdHVyZXMuY29tIn19.U8QRbL3IgEuba7drLyS3PmBDWpVE3vrjXxgMNagHytU',
                accessTokenExpireOn: '2024-08-22 20:57:49',
                refreshToken:
                  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiIxMjNTdG9yZXMiLCJhdWQiOiJQYXJ0bmVyUG9ydGFsIiwiaWF0IjoxNzI0MTY4NDY5LCJleHAiOjE3MjUzNzgwNjksImRhdGEiOnsiZW1haWwiOiIxMjNzdG9yZXNAYmVzdG1hc3RlcmZ1cm5pdHVyZXMuY29tIn19.SWmFG-nJ16qSYXjmQ_oJHUPivXaKjwt-7YfNCW1kIfU',
                refreshTokenExpireOn: '2024-09-03 15:41:09',
                verificationToken:
                  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJkYXRhIjp7ImVtYWlsIjoiMTIzc3RvcmVzQGJlc3RtYXN0ZXJmdXJuaXR1cmVzLmNvbSJ9LCJpc3MiOiIxMjNTdG9yZXMiLCJhdWQiOiJQYXJ0bmVyUG9ydGFsIiwiaWF0IjoxNjk1ODQ2Njk2LCJleHAiOjE2OTYxMDU4OTZ9.7D-kGxN3HX3gFafbOBPJEQz_KquzCcx84BuAc-ZUHGs',
                verificationTokenExpireOn: '2023-09-30 20:31:36',
                firstLoginOn: '2023-09-27 20:33:45',
                latestLoginOn: '2024-08-20 15:41:09',
                pwdModifiedOn: '2023-09-27 20:33:36',
                createdAt: '2023-09-27 19:32:34',
                isActive: '1',
              },
            },
            portalDetails: {
              portalAccessEnabled: '1',
              currentPlanID: '2',
              eligibleForFreeTrial: '1',
              returnProcessingFeePercentage: '0.00',
              orderTabActive: '0',
              orderProcessingFeePercentage: '0.04',
            },
            contacts: {
              '399': {
                contactId: '399',
                partnerId: '2111',
                firstName: 'CS Desk',
                lastName: '',
                designation: '',
                contactPhoneNumber: '9095240889',
                contactPhoneNumberExtension: '',
                contactTimeZone: 'PST',
                notes: '',
                arrRoles: ['1', '2', '3', '4', '5'],
                isDeleted: 0,
              },
            },
            sftpDetails: {
              sftpHostname: '',
              sftpUsername: '',
              sftpPassword: '',
              sftpPort: '',
            },
            as2Details: {
              as2IdentifierID: '',
              as2ReceiveURL: '',
              as2CertificateFileID: '0',
              signatureAlgo: '0',
              encryptionAlgo: '0',
              mdnReceiptsSecurity: '0',
              mdnReceiptsDelivery: '0',
              testAS2IdentifierID: '',
              testReceiveUrl: '',
              testCertificateFileId: '0',
            },
            ediDetails: {
              qualifierID: '',
              qualifier: '',
              fileTransferMode: '0',
              segmentTerminator: '0',
              elementTerminator: '0',
              subElementTerminator: '0',
              testQualifierId: '',
              testQualifier: '',
              environment: '0',
              connectionStatus: '0',
              connectionType: '0',
              vanName: '',
            },
            rebateProgramConfiguration: {
              rebateProgramEnrolled: '0',
              rebateProgramFileId: '0',
            },
            legalInfo: {
              documentType: '1',
              formRevisionNumber: 'October 2018',
              legalName: 'First Rate Furniture, Inc',
              businessName: 'Best Master Furniture',
              federalTaxClassification: 'C Corporation',
              officialAddressLine1: '13770 Norton Ave.',
              officialAddressLine2: '',
              officialCity: 'Chino',
              officialState: 'CA',
              officialZipCode: '91710',
              officialCountry: 'US',
              tinType: '2',
              tinNumber: '471354617',
              w9SigningDate: '2020-07-06',
              w9FileID: '575702223',
            },
            agreementConfig: {
              agreementSigningDate: '2021-10-05',
              agreementEffectiveDate: '2021-09-29',
              signedAgreementFileID: '575702226',
              addendumSignedFileID: '0',
              addendumList: [''],
            },
            coiConfiguration: {
              insurerName: '',
              insuredName: '',
              policyNumber: '',
              policyStartDate: '0000-00-00',
              policyEndDate: '0000-00-00',
              coiFileID: '0',
            },
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
