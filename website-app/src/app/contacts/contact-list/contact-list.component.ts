import { Component, Input } from '@angular/core';
import { Contact, ContactService, ShowContactsDirective } from '../shared';
import { constants } from './contact-list.constants';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MaterialModule } from '../../material/material.module';
import { CONTACTS } from '../shared/data/mock-contacts';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-contact-list',
  standalone: true,
  imports: [CommonModule, MaterialModule, ShowContactsDirective],
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.scss',
  providers:[ContactService]
})
export class ContactListComponent {
  // @Input('contacts') contacts!: Contact[];
  public noContactsFoundMessage: string = constants.NO_CONTACTS_FOUND_MESSAGE;
  public loadingContactsMessage: string = constants.LOADING_CONTACTS_MESSAGE;
  public deletingContactsMessage: string = constants.DELETING_CONTACTS_MESSAGE;
  public deletingContactMessage: string = constants.DELETING_CONTACT_MESSAGE;
  public isLoading = true;
  public deletingContacts = false;
  public deletingContact = false;
  public readonly backupContacts: Array<Contact> = CONTACTS.slice();
  public selectedContact!: Contact | any;
  contacts: any;

  constructor(
    private contactService: ContactService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.getContacts();
    this.contactService.getHeroes();
  }

  public onClick(contact: Contact): void {
    this.router.navigate(['/contact', contact.id]);
  }

  public editContact(contact: Contact): void {
    this.router.navigate(['/edit', contact.id]);
  }

  public displayDeleteSnackBar(contact: Contact): void {
    const message = `${contact.name} deleted.`;
    const snackConfig: MatSnackBarConfig = { duration: 2000 };
    const actionLabel = '';

    this.snackBar.open(message, actionLabel, snackConfig);
  }

  public deleteContact(contact: Contact): void {
    this.deletingContact = true;
    this.displayDeleteSnackBar(contact);

    this.contactService.delete(contact).then(() => {
      this.contacts = this.contacts.filter((c:any) => c !== contact);

      if (this.selectedContact === contact) {
        this.selectedContact = null;
      }

      this.deletingContact = false;
    });
  }

  public deleteContacts(): void {
    this.deletingContacts = true;

    this.contacts.forEach((contact:any, index:number) => {
      this.contactService.delete(contact);

      if (index === this.contacts.length - 1) {
        this.getContacts();
      }
    });
  }

  public getContacts(): void {
    this.isLoading = true;

    this.contactService.getContacts().subscribe((contacts: any) => {
      console.warn("contacts: ", contacts)
      this.isLoading = false;
      this.deletingContacts = false;
      this.contacts = contacts;
    });
  }

  public refreshContacts() {
    this.backupContacts.forEach((contact, index) => {
      this.contactService.post(contact);

      if (index === this.backupContacts.length - 1) {
        this.getContacts();
      }
    });
  }

  public saveContact(contact: Contact) {
    contact.favorite = !contact.favorite;
    this.contactService.save(contact);
  }

  public onSelect(contact: Contact): void {
    this.selectedContact = contact;
  }
}
