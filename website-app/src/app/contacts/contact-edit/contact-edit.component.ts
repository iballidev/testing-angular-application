import { Component, OnDestroy, OnInit } from '@angular/core';
import { constants } from './contact-edit.constants';
import {
  Contact,
  ContactService,
  countryDialingCodes,
  FavoriteIconDirective,
  InvalidEmailModalComponent,
  InvalidPhoneNumberModalComponent,
} from '../shared';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MaterialModule } from '../../material/material.module';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact-edit',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    FormsModule,
    FavoriteIconDirective,
  ],
  templateUrl: './contact-edit.component.html',
  styleUrl: './contact-edit.component.scss',
  providers: [ContactService],
})
export class ContactEditComponent implements OnInit, OnDestroy {
  public loadingContactMessage: string = constants.LOADING_CONTACT_MESSAGE;
  public noContactFoundMessage: string = constants.NO_CONTACT_FOUND_MESSAGE;
  public isLoading = true;
  public contact!: Contact;
  public countryDialingCodes: string[] = this.getKeys(countryDialingCodes);

  private modalRef!: MatDialogRef<any>;

  constructor(
    private contactService: ContactService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadContact();
  }

  ngOnDestroy() {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }

  public saveContact(contact: Contact) {
    contact.favorite = !contact.favorite;
    this.contactService.save(contact);
  }

  public loadContact(): void {
    this.route.params.subscribe((params) => {
      const id = +params['id'];
      this.contactService.getContact(id);
      // this.contactService.getContact(id).subscribe((contact: any) => {
      //   this.isLoading = false;
      //   this.contact = contact;
      // });
      this.contactService.contactDetailsObs.subscribe((contact: any) => {
        console.log('contact: ', contact);
        this.isLoading = false;
        this.contact = contact;
      });
    });
  }

  public updateContact(contact: Contact): void {
    if (!this.isContactValid(contact)) {
      return;
    }

    this.displayEditSnackBar();
    this.contactService.save(contact);
    // .subscribe(() => {
    //   this.router.navigate(['/']);
    // });
    this.router.navigate(['/']);
  }

  private getKeys(object: Object): string[] {
    return Object.keys(object).map((key, value) => key);
  }

  private displayEditSnackBar(): void {
    const message = 'Contact updated';
    const snackConfig: MatSnackBarConfig = { duration: 2000 };
    const actionLabel = '';

    this.snackBar.open(message, actionLabel, snackConfig);
  }

  private isEmailValid(email: string): boolean {
    return (
      email === '' ||
      (email !== '' && email.includes('@') && email.includes('.'))
    );
  }

  private isPhoneNumberValid(phoneNumber: string): boolean {
    return (
      phoneNumber === '' ||
      (phoneNumber !== '' &&
        phoneNumber.length === 10 &&
        /^\d+$/.test(phoneNumber))
    );
  }

  private isContactValid(contact: any): boolean {
    if (!this.isEmailValid(contact.email)) {
      this.modalRef = this.dialog.open(InvalidEmailModalComponent);
      return false;
    }

    if (!this.isPhoneNumberValid(contact.number)) {
      this.modalRef = this.dialog.open(InvalidPhoneNumberModalComponent);
      return false;
    }

    return true;
  }
}
