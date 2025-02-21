import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
import { NzMessageService } from 'ng-zorro-antd/message';
import { PartnerService } from 'src/app/shared/service/partner.service';
import { ApiResponse } from 'src/app/shared/model/common.model';

@Component({
  selector: 'app-notification-email',
  templateUrl: './notification-email.component.html',
  styleUrls: ['./notification-email.component.scss'],
})
export class NotificationEmailComponent implements OnInit {
  section = Section;
  isLoading: boolean = false;
  formFieldOnUI = {
    email: true,
    notifications: true,
  };
  allDataList: any = {
    accountSetupUpdateNotifications: [],
    catalogSetupUpdateNotifications: [],
    invoicingNotifications: [],
    remittanceNotifications: [],
    inventoryProcessingNotification: [],
    purchaseOrderNotification: [],
    orderProcessingNotification: [],
    returnProcessingNotification: [],
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
  isSaving: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private partnerService: PartnerService,
    private message: NzMessageService,
    private formValidationService: FormValidationService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.groupByNotificationForm = this.formBuilder.group({
      notificationGroups: this.formBuilder.array([]),
    });
    this.groupByEmailForm = this.formBuilder.group({
      emailGroups: this.formBuilder.array([]),
    });

    this.addEmailNotificationsForm = this.formBuilder.group({
      email: ['', [Validators?.required, Validators?.email]],
      notifications: this.formBuilder.array([], [Validators?.required]),
    });

    // API calls
    this.getPartnersAndPatchForm();
  }

  getPartnersAndPatchForm() {
    this.isLoading = true;
    this.partnerService.getPartner().subscribe({
      next: (result: ApiResponse) => {
        if (result.success) {
          const res: any = result?.response ?? {};
          this.allDataList.accountSetupUpdateNotifications =
            res?.payload?.accountSetupUpdateNotifications;
          this.allDataList.catalogSetupUpdateNotifications =
            res?.payload?.catalogSetupUpdateNotifications;
          this.allDataList.inventoryProcessingNotification =
            res?.payload?.inventoryProcessingNotification;
          this.allDataList.invoicingNotifications =
            res?.payload?.invoicingNotifications;
          this.allDataList.orderProcessingNotification =
            res?.payload?.orderProcessingNotification;
          this.allDataList.purchaseOrderNotification =
            res?.payload?.purchaseOrderNotification;
          this.allDataList.remittanceNotifications =
            res?.payload?.remittanceNotifications;
          this.allDataList.returnProcessingNotification =
            res?.payload?.returnProcessingNotification;
          this.initializeForm(this.allDataList);

          // this.contactList = res.payload.contacts;
        } else {
          this.message.error(result?.msg ? result?.msg : 'Get partner failed!');
        }

        this.isLoading = false;
      },
      error: (err) => {
        if (!err?.error_shown) {
          this.message.error('Get partner failed!');
        }
        this.isLoading = false;
      },
    });
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

  trackByFn(index: number, item: any): number {
    return item.uniqueId;
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
      } else {
        this.clearFormGroups(this.groupByEmailForm);
        this.changeDetectorRef.detectChanges();
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
              uniqueId: [
                Math.random().toString(36).substring(2) +
                  Date.now().toString(36),
              ],
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
                  uniqueId: [
                    Math.random().toString(36).substring(2) +
                      Date.now().toString(36),
                  ],
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
      uniqueId: [
        Math.random().toString(36).substring(2) + Date.now().toString(36),
      ],
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
      uniqueId: [
        Math.random().toString(36).substring(2) + Date.now().toString(36),
      ],
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
    this.initializeForm(this.allDataList);
    this.addEmailNotificationsForm?.reset();
  }

  submitNotificationForm() {
    var isValid = true;
    if (this.formTypes.value === 'notifications') {
      this.notificationGroups.controls.forEach((x: any) => {
        const isFormValid = this.formValidationService.checkFormValidity(x, {
          emails: true,
        });
        if (!isFormValid) {
          isValid = false;
        }
      });
    } else {
      this.emailGroups.controls.forEach((x: any) => {
        const isFormValid = this.formValidationService.checkFormValidity(x, {
          email: true,
          notifications: true,
        });
        if (!isFormValid) {
          isValid = false;
        }
      });
    }

    if (isValid) {
      // Saving Code
      this.isSaving = true;

      const notificationList = this.groupByNotificationForm.value;
      const emailGroups = this.emailGroups.value;
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

      if (this.formTypes.value === 'notifications') {
        notificationList?.notificationGroups?.forEach((notification: any) => {
          notification?.emails.forEach((emails: any) => {
            const array: any[] = payload[notification?.typeId];
            array.push(emails?.email);
          });
        });
      } else {
        emailGroups?.forEach((group: any) => {
          const email = group.email.email ?? group.email.oldEmail;
          group.notifications.forEach((notification: any) => {
            const array: any[] = payload[notification.notification];
            array.push(email);
          });
        });
      }

      this.partnerService.updatePartner(payload).subscribe({
        next: (result: ApiResponse) => {
          if (result.success) {
            this.message.create('success', 'Data Updated Successfully!');
            // Fetch the updated partner data after a successful update
            this.getPartnersAndPatchForm();
          } else {
            this.message.error(
              result?.msg ? result?.msg : 'Date Update Failed!'
            );
          }

          this.isSaving = false;
        },
        error: (err: any) => {
          if (!err?.error_shown) {
            this.message.error('Date Update Failed!');
          }
          this.isSaving = false; // Ensure saving state is updated on error
        },
      });
      console.log(payload);
    }
  }

  submitForm() {
    const valid = this.formValidationService.checkFormValidity(
      this.addEmailNotificationsForm,
      this.formFieldOnUI
    );

    if (valid) {
      this.isSaving = true;
      const addFormValue = this.addEmailNotificationsForm.value;
      addFormValue?.notifications?.forEach((grp: any) => {
        this.allDataList[grp.notification].push(addFormValue.email);
      });

      const payload: any = {
        accountSetupUpdateNotifications:
          this.allDataList['accountSetupUpdateNotifications'],
        catalogSetupUpdateNotifications:
          this.allDataList['catalogSetupUpdateNotifications'],
        inventoryProcessingNotification:
          this.allDataList['inventoryProcessingNotification'],
        invoicingNotifications: this.allDataList['invoicingNotifications'],
        orderProcessingNotification:
          this.allDataList['orderProcessingNotification'],
        purchaseOrderNotification:
          this.allDataList['purchaseOrderNotification'],
        remittanceNotifications: this.allDataList['remittanceNotifications'],
        returnProcessingNotification:
          this.allDataList['returnProcessingNotification'],
      };

      this.partnerService.updatePartner(payload).subscribe({
        next: (result: ApiResponse) => {
          if (result.success) {
            this.message.create('success', 'Data Updated Successfully!');
            this.showSection = this.section.TABLE;
            // Fetch the updated partner data after a successful update
            this.getPartnersAndPatchForm();
          } else {
            this.message.error(
              result?.msg ? result?.msg : 'Date Update Failed!'
            );
          }
          this.isSaving = false;
        },
        error: (err: any) => {
          if (!err?.error_shown) {
            this.message.error('Date Update Failed!');
          }
          this.isSaving = false; // Ensure saving state is updated on error
        },
      });
    }
  }

  newNotificationType() {
    return this.formBuilder.group({
      notification: ['', [Validators.required]],
    });
  }

  onAddNotificationForm() {
    this.showSection = this.section?.FORM;
    this.clearFormGroups(this.addEmailNotificationsForm);

    // set up the form
    this.addFormNotificationGroups.push(this.newNotificationType());
  }

  addNotificationFromAddForm() {
    this.addFormNotificationGroups.push(this.newNotificationType());
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
