import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Section } from 'src/app/shared/constants/constants';
import { FormValidationService } from 'src/app/shared/service/form-validation.service';

@Component({
  selector: 'app-notification-email',
  templateUrl: './notification-email.component.html',
  styleUrls: ['./notification-email.component.scss'],
})
export class NotificationEmailComponent implements OnInit {
  section = Section;
  isLoading: boolean = false;
  allDataList = {
    accountSetupUpdateNotifications: [
      'cmacias@4dconceptsusa.com',
      'jriegsecker@4dconceptsusa.com',
      'sarah@4dconceptsusa.com',
      'orderdesk@4dconceptsusa.com',
      'lstephenson@4dconceptsusa.com',
      'sgonzalez@4dconceptsusa.com',
    ],
    partnerDetails: {
      partnerId: '101',
      displayName: '4D Concepts (FDC)',
      partnerCode: 'FDC',
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
      'sgonzalez@4dconceptsusa.com',
      'sarah@4dconceptsusa.com',
      'cmacias@4dconceptsusa.com',
      'orderdesk@4dconceptsusa.com',
      'jriegsecker@4dconceptsusa.com',
    ],
    catalogDetails: {
      mapType: '1',
      handlingConfiguration: '1',
      accountHandlingTimeValue: '1',
      totalProductsSoftLimit: '5000',
      coOpDiscountPercentage: '1.00',
      coOpCalculationMethod: '1',
      returnProfileType: '8',
      returnReimbursementMethod: '0',
      returnDaCalculationMethod: '3',
      returnAllowancePercentage: '3.00',
      returnBuyersRemorseRestockingPercentage: '0.00',
      returnUndeliverableRestockingPercentage: '0.00',
      returnProcessingFeePercentage: '0.00',
      orderProcessingFeePercentage: '0.04',
    },
    invoicingNotifications: [
      'orderdesk@4dconceptsusa.com',
      'cmacias@4dconceptsusa.com',
      'lstephenson@4dconceptsusa.com',
      'sgonzalez@4dconceptsusa.com',
      'jriegsecker@4dconceptsusa.com',
    ],
    remittanceNotifications: [
      'lstephenson@4dconceptsusa.com',
      'sgonzalez@4dconceptsusa.com',
      'jriegsecker@4dconceptsusa.com',
      'orderdesk@4dconceptsusa.com',
      'cmacias@4dconceptsusa.com',
    ],
    paymentDetails: {
      paymentStatus: '1',
      paymentStatusReason: '',
      netDays: '1',
      discountPercentage: '2.00',
      discountDays: '1',
      creditLimit: '25000',
      paymentTermForDisplay: '2.00% 1 Net 1',
      creditLimitForDisplay: '$25,000.00',
    },
    achDetails: {
      accountNumber: '003101771',
      bankName: 'Bank Name Missing',
      nameOnAccount: '4D Concepts Inc',
      routingNumber: '122243062',
    },
    inventoryProcessingNotification: [
      'jriegsecker@4dconceptsusa.com',
      'orderdesk@4dconceptsusa.com',
      'cmacias@4dconceptsusa.com',
      'sgonzalez@4dconceptsusa.com',
    ],
    shipoutLocationsInactive: [
      {
        internalCode: 'FDC-LOC-001',
        externalCode: 'CA-91730',
        addressLine1: '11699 6TH Street',
        addressLine2: '',
        city: 'Rancho Cucamonga',
        state: 'CA',
        zipCode: '91730',
        country: 'US',
        timeZone: 'PST',
        cutOffTime: '18:00:00',
        contactName: 'Jeff Riegsecker',
        phoneNumber: '9099441980',
        phoneNumberExtension: '',
        isActive: '0',
      },
    ],
    shipoutLocations: [
      {
        internalCode: 'FDC-LOC-002',
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
        isActive: '1',
      },
      {
        internalCode: 'FDC-LOC-003',
        externalCode: '4DC Salley',
        addressLine1: '5244 Festival Trail Road',
        addressLine2: '',
        city: 'Salley',
        state: 'SC',
        zipCode: '29137',
        country: 'US',
        timeZone: 'EST',
        cutOffTime: '16:00:00',
        contactName: 'Charles Edgeman',
        phoneNumber: '9099441980',
        phoneNumberExtension: '33',
        isActive: '1',
      },
    ],
    inventoryDetails: {
      inventoryFeedType: '2',
      inventoryFeedFrequency: ['1', '3', '5'],
      inventoryFeedMPN: '',
      inventoryFeedQuantityColumnName: '',
      inventoryFeedDetailType: '1',
      inventoryBucket: '2',
      inventoryBucketChangeDate: '',
      inventoryBucketManuallyOverridden: '0',
      authorizedFeedSenders: [''],
    },
    returnLocation: [],
    previousShippingClosures: [
      {
        closureDate: '2024-08-24',
        remark: 'entity remark 1',
        isDeleted: 0,
      },
    ],
    upcomingShippingClosures: [
      {
        closureDate: '2024-08-30',
        remark: 'entity remark 1',
        isDeleted: 0,
      },
      {
        closureDate: '2024-08-31',
        remark: 'entity remark 1',
        isDeleted: 0,
      },
    ],
    purchaseOrderNotification: [
      'sgonzalez@4dconceptsusa.com',
      'orderdesk@4dconceptsusa.com',
    ],
    orderProcessingNotification: [
      'sgonzalez@4dconceptsusa.com',
      'orderdesk@4dconceptsusa.com',
    ],
    fulfillmentDetails: {
      poSendingMethod: '2',
      enabledCarriers: ['FEDEX', 'UPS', 'USPS'],
      generateLabels: '1',
      labelPageSize: '2',
      copyOfPOSentOverEmail: true,
      notificationEmail: [
        'Orderdesk@4dconceptsusa.com',
        'lstephenson@4dconceptsusa.com',
        'Adiaz@4dconceptsusa.com',
        'rreynolds@4dconceptsusa.com',
        'jriegsecker@4dconceptsusa.com',
        'nhaurissa@4dconceptsusa.com',
        'kdiaz@4dconceptsusa.com',
        'slewis@4dconceptsusa.com',
        'lcardenas@4dconceptsusa.com',
      ],
      isPackingSlipEnabled: false,
    },
    returnProcessingNotification: [
      'orderdesk@4dconceptsusa.com',
      'jriegsecker@4dconceptsusa.com',
      'sgonzalez@4dconceptsusa.com',
    ],
    returnDetails: {
      returnProfileType: '8',
      returnReimbursementMethod: '0',
      returnDaCalculationMethod: '3',
      returnAllowancePercentage: '3.00',
      returnBuyersRemorseRestockingPercentage: '0.00',
      returnUndeliverableRestockingPercentage: '0.00',
      returnProcessingFeePercentage: '0.00',
      orderProcessingFeePercentage: '0.04',
    },
    portalLogins: [],
    portalDetails: {
      portalAccessEnabled: '0',
      currentPlanID: '6',
      eligibleForFreeTrial: '1',
      returnProcessingFeePercentage: '0.00',
      orderTabActive: '0',
      orderProcessingFeePercentage: '0.04',
    },
    contacts: {
      '264': {
        contactId: '264',
        partnerId: '101',
        firstName: 'Customer Service Desk',
        lastName: 'wer43',
        designation: 'Customer Service',
        contactPhoneNumber: '9099441980',
        contactPhoneNumberExtension: '',
        contactTimeZone: 'PST',
        notes: '',
        arrRoles: ['1', '3', '5'],
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
      as2IdentifierID: 'TrueCommerceNG.Net',
      as2ReceiveURL:
        'http://network.truecommerce.net:5755/invoke/wm.EDIINT/receive',
      as2CertificateFileID: '1097712573',
      signatureAlgo: '2',
      encryptionAlgo: '2',
      mdnReceiptsSecurity: '2',
      mdnReceiptsDelivery: '2',
      testAS2IdentifierID: 'TrueCommerceNG.Net',
      testReceiveUrl:
        'http://network.truecommerce.net:5755/invoke/wm.EDIINT/receive',
      testCertificateFileId: '1097712575',
    },
    ediDetails: {
      qualifierID: '12',
      qualifier: '9099441980',
      fileTransferMode: '1',
      segmentTerminator: '2',
      elementTerminator: '1',
      subElementTerminator: '2',
      testQualifierId: '12',
      testQualifier: '9099441980',
      environment: '1',
      connectionStatus: '2',
      connectionType: '1',
      vanName: 'TrueCommerce EDI Solutions',
    },
    rebateProgramConfiguration: {
      rebateProgramEnrolled: '0',
      rebateProgramFileId: '',
    },
    legalInfo: {
      documentType: '1',
      formRevisionNumber: 'November 2017',
      legalName: '4D Concepts Inc',
      businessName: '',
      federalTaxClassification: 'S Corporation',
      officialAddressLine1: '11699 6th Street',
      officialAddressLine2: '',
      officialCity: 'Rancho Cucamonga',
      officialState: 'CA',
      officialZipCode: '91730',
      officialCountry: 'US',
      tinType: '2',
      tinNumber: '203358613',
      w9SigningDate: '2018-07-23',
      w9FileID: '188265783',
    },
    agreementConfig: {
      agreementSigningDate: '2020-03-23',
      agreementEffectiveDate: '2018-07-01',
      signedAgreementFileID: '208556831',
      addendumSignedFileID: '',
      addendumList: [''],
    },
    coiConfiguration: {
      insurerName: 'test4',
      insuredName: 'test13',
      policyNumber: '343434',
      policyStartDate: '2024-08-24',
      policyEndDate: '2024-08-26',
      coiFileID: '1229460564',
    },
  };
  notificationEmailList: any = [];
  formTypes = new FormControl('notifications');
  showSection: string = this.section.TABLE;
  groupByNotificationTypeIdLabels: any = {
    accountSetupUpdateNotifications: 'Account Setup Update Notifications',
    catalogSetupUpdateNotifications: 'Catalog Setup Update Notifications',
    inventoryProcessingNotification: 'Inventory Processing Notification',
    invoicingNotifications: 'Invoicing Notifications',
    orderProcessingNotification: 'Order Processing Notification',
    purchaseOrderNotification: 'Purchase Order Notification',
    remittanceNotifications: 'Remittance Notifications',
    returnProcessingNotification: 'Return Processing Notification',
  };

  notificationsOptions: any = [
    {
      name: 'Account Setup Update Notifications',
      value: 'accountSetupUpdateNotifications',
    },
    {
      name: 'Catalog Setup Update Notifications',
      value: 'catalogSetupUpdateNotifications',
    },
    {
      name: 'Inventory Processing Notification',
      value: 'inventoryProcessingNotification',
    },
    {
      name: 'Invoicing Notifications',
      value: 'invoicingNotifications',
    },
    {
      name: 'Order Processing Notification',
      value: 'orderProcessingNotification',
    },
    {
      name: 'Purchase Order Notification',
      value: 'purchaseOrderNotification',
    },
    {
      name: 'Remittance Notifications',
      value: 'remittanceNotifications',
    },
    {
      name: 'Return Processing Notification',
      value: 'returnProcessingNotification',
    },
  ];

  groupByNotificationForm!: FormGroup;
  groupByEmailForm!: FormGroup;
  addEmailNotificationsForm!: FormGroup;
  notificationsInputLimit = 10;
  emailInputLimit = 8;
  dropDownList: any = null;

  oldGroupByNotificationsData: any;
  oldGroupByEmailsData: any;

  constructor(private formBuilder: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.groupByNotificationForm = this.formBuilder.group({
      notificationGroups: this.formBuilder.array([]),
    });
    this.groupByEmailForm = this.formBuilder.group({
      emailGroups: this.formBuilder.array([]),
    });

    this.addEmailNotificationsForm = this.formBuilder.group({
      email: ['', [Validators?.required]],
      notifications: this.formBuilder.array([]),
    });
    this.initializeForm(this.allDataList);
  }

  changeFormType(event: string) {
    this.initializeForm(this.allDataList);
  }

  clearFormArray = (formArray: FormArray) => {
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
  };

  // Method to get the form array for notification groups
  get notificationGroups(): FormArray {
    return this.groupByNotificationForm.get('notificationGroups') as FormArray;
  }

  // Method to get the form array for notification groups
  get emailGroups(): FormArray {
    return this.groupByEmailForm.get('emailGroups') as FormArray;
  }

  get addFormNotificationGroups(): FormArray {
    return this.addEmailNotificationsForm.get('notifications') as FormArray;
  }

  trackByFn(index: number, item: AbstractControl): number {
    return index;
  }

  clearFormGroups = (formGroup: FormGroup) => {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);

      if (control instanceof FormGroup) {
        this.clearFormGroups(control);
      } else if (control instanceof FormArray) {
        this.clearFormArray(control);
      }
    });
  };

  initializeForm(values: any) {
    if (values) {
      if (this.formTypes.value === 'notifications') {
        this.clearFormGroups(this.groupByNotificationForm);

        const array: any = this.groupByNotificationForm.get(
          'notificationGroups'
        ) as FormArray;

        this.groupByNotificationForm.get('notificationGroups')?.setValue([]);

        // Re-create the section
        Object.keys(this.groupByNotificationTypeIdLabels).forEach(
          (key, index) => {
            if (values[key] && values[key].length > 0) {
              // Create an array of FormControl elements for emails
              const emailControls = values[key].map((element: string) =>
                this.newNotificationEmail(element)
              );

              // Create the form group with the typeId, typeName, and emails
              const group = this.formBuilder.group({
                typeId: key,
                typeName: this.groupByNotificationTypeIdLabels[key],
                emails: this.formBuilder.array(emailControls),
              });
              // Push the group into the FormArray
              array.push(group);
            }
          }
        );
        this.oldGroupByNotificationsData = this.groupByNotificationForm.value;
        console.log(this.groupByNotificationForm.value);
      } else {
        this.clearFormGroups(this.groupByEmailForm);
        let groupByEmailValues: any = {};
        // Create the data object
        Object.keys(this.groupByNotificationTypeIdLabels).forEach((key) => {
          if (values[key] && values[key].length > 0) {
            const emails = values[key];
            emails.forEach((email: string) => {
              if (!groupByEmailValues[email]) {
                groupByEmailValues[email] = [key];
              } else if (!groupByEmailValues[email].includes(key)) {
                groupByEmailValues[email].push(key);
              }
            });
          }
        });

        this.oldGroupByEmailsData = groupByEmailValues;

        const array: any = this.groupByEmailForm.get(
          'emailGroups'
        ) as FormArray;

        // Re-create the section
        Object.keys(groupByEmailValues).forEach((key, index) => {
          if (groupByEmailValues[key] && groupByEmailValues[key].length > 0) {
            const emailGroup = this.formBuilder.group({
              email: [
                { value: key, disabled: true },
                [
                  Validators.required,
                  Validators.email,
                  Validators.maxLength(255),
                ],
              ],
              oldEmail: [key],
            });

            const notificationGroups: any = [];
            groupByEmailValues[key].forEach((notification: string) => {
              notificationGroups.push(
                this.formBuilder.group({
                  notification: [notification, [Validators.required]],
                })
              );
            });
            const group = this.formBuilder.group({
              email: emailGroup,
              notifications: this.formBuilder.array(notificationGroups),
            });

            array.push(group);
          }
        });
      }
    }
  }

  enableEmailInput(control: any) {
    control.enable();
  }

  resetEmailInput(group: any) {
    const control = group?.get('email');
    const oldEmailValue = group?.get('oldEmail')?.value;

    control.setValue(oldEmailValue);
    control.disable();
  }
  // Method to create a new notification email form group
  newNotificationEmail(emailValue = ''): FormGroup {
    return this.formBuilder.group({
      email: [
        emailValue,
        [Validators.required, Validators.email, Validators.maxLength(255)],
      ],
    });
  }

  // Method to add a new email to a specific notification group
  addNotificationEmail(index: number) {
    const emailsArray = this.notificationGroups
      .at(index)
      .get('emails') as FormArray;
    emailsArray.push(this.newNotificationEmail());
  }

  // Method to remove an email from a specific notification group
  removeNotificationEmail(groupIndex: number, emailIndex: number) {
    const emailsArray = this.notificationGroups
      .at(groupIndex)
      .get('emails') as FormArray;
    emailsArray.removeAt(emailIndex);
  }

  // Method to create a new notification email form group
  newNotification(notificationValue = ''): FormGroup {
    return this.formBuilder.group({
      notification: [notificationValue, [Validators.required]],
    });
  }

  // Method to add a new email to a specific notification group
  addNotification(index: number) {
    const notificationsArray = this.emailGroups
      .at(index)
      .get('notifications') as FormArray;
    notificationsArray.push(this.newNotification());
  }

  // Method to remove an email from a specific notification group
  removeNotification(groupIndex: number, emailIndex: number) {
    const notificationsArray = this.emailGroups
      .at(groupIndex)
      .get('notifications') as FormArray;
    notificationsArray.removeAt(emailIndex);
  }

  removeGroupByEmailRow(groupIndex: number) {
    this.emailGroups.removeAt(groupIndex);
  }

  deleteAction(data: any) {}

  reset() {
    // this.initializeForm(this.allDataList);
    // this.notificationEmailForm?.reset();
  }

  submitNotificationForm() {
    const notificationList = this.groupByNotificationForm.value;
    const payload: any = {
      accountSetupUpdateNotifications: [],
      catalogSetupUpdateNotifications: [],
      inventoryProcessingNotification: [],
      invoicingNotifications: [],
      orderProcessingNotification: [],
      purchaseOrderNotification: [],
      remittanceNotifications: [],
      returnProcessingNotification: [],
    };
    notificationList?.notificationGroups?.forEach((notification: any) => {
      notification?.emails.forEach((emails: any) => {
        const array: any[] = payload[notification?.typeId];
        array.push(emails?.email);
      });
    });

    console.log(payload);
  }

  submitForm() {
    // const valid = this.formValidationService.checkFormValidity(
    //   this.notificationEmailForm,
    //   this.formFieldOnUI
    // );
    // if (valid) {
    //   this.isLoading = true;
    //   const payload = {
    //     newShippingClosures: 'addPayload',
    //     partnerCode: 'TDA',
    //   };
    //   setTimeout(() => {
    //     console.log(payload);
    //     this.isLoading = false;
    //     this.notificationEmailForm?.reset();
    //     this.showSection = this.section.TABLE;
    //   }, 500);
    // } else {
    //   Object.values(this.notificationEmailForm.controls).forEach((control) => {
    //     if (control.invalid) {
    //       if (control instanceof FormControl) {
    //         control.markAsDirty();
    //         control.updateValueAndValidity({ onlySelf: true });
    //       }
    //     }
    //   });
    // }
  }

  onAddNotificationForm() {
    this.showSection = this.section?.FORM;
    this.clearFormGroups(this.addEmailNotificationsForm);

    // set up the form
    this.addFormNotificationGroups.push(
      this.formBuilder.control('', [Validators.required])
    );
  }

  addNotificationFromAddForm() {
    this.addFormNotificationGroups.push(
      this.formBuilder.control('', [Validators.required])
    );
  }

  removeNotificationFromAddForm(index: any) {
    this.addFormNotificationGroups.removeAt(index);
  }

  goBack() {
    if (this.showSection !== this.section.TABLE) {
      this.showSection = this.section.TABLE;
      // this.notificationEmailForm?.reset();
    } else {
      this.router.navigate(['/main/setting']);
    }
  }
}
