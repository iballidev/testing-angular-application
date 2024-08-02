import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../material/material.module';
import { FormsModule } from '@angular/forms';
import { Contact } from '../shared/models';
import { ContactService } from '../shared/services';
import { MatDialog } from '@angular/material/dialog';
import {
  InvalidEmailModalComponent,
  InvalidPhoneNumberModalComponent,
} from '../shared';

@Component({
  selector: 'app-new-contact',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule, FormsModule],
  templateUrl: './new-contact.component.html',
  styleUrl: './new-contact.component.scss',
  providers: [ContactService],
})
export class NewContactComponent implements OnInit {
  public contact!: Contact | any;
  public id!: number;
  public savingContact = false;

  constructor(
    private contactService: ContactService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.contactService.getContacts().subscribe((contacts: any) => {
      this.createNewContact(contacts.length);
    });
  }

  createNewContact(numContacts: number) {
    const contactId = numContacts + 1;

    this.contact = {
      id: contactId,
      email: '',
      number: '',
      country: 'us',
      favorite: false,
    };
  }

  public addNewContact(contact: Contact): void {
    if (!this.isFormValid()) {
      return;
    }

    this.savingContact = true;

    this.contactService.put(contact).subscribe({
      next: (response: any) => {
        if (response) {
          this.savingContact = false;
          this.router.navigate(['/']);
        }
      },
      error: (err: any) => {
        console.log('Error: ', err);
      },
    });
  }

  private isEmailValid(): boolean {
    return (
      this.contact.email === '' ||
      (this.contact.email !== '' &&
        this.contact.email.includes('@') &&
        this.contact.email.includes('.'))
    );
  }

  private isPhoneNumberValid(): boolean {
    return (
      this.contact.number === '' ||
      (this.contact.number !== '' &&
        this.contact.number.length === 10 &&
        /^\d+$/.test(this.contact.number))
    );
  }

  private isFormValid(): boolean {
    if (!this.isEmailValid()) {
      this.dialog.open(InvalidEmailModalComponent);
      return false;
    }

    if (!this.isPhoneNumberValid()) {
      this.dialog.open(InvalidPhoneNumberModalComponent);
      return false;
    }

    return true;
  }
}
