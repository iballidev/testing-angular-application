import { Component, OnInit } from '@angular/core';
import { Contact, ContactService, PhoneNumberPipe } from '../shared';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { constants } from './contact-detail.constants';
import { ContactFeedComponent } from '../contact-feed/contact-feed.component';
import { MaterialModule } from '../../material/material.module';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-contact-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule, PhoneNumberPipe],
  templateUrl: './contact-detail.component.html',
  styleUrl: './contact-detail.component.scss',
  providers: [ContactService],
})
export class ContactDetailComponent implements OnInit {
  public loadingContactMessage: string = constants.LOADING_CONTACT_MESSAGE;
  public noContactFoundMessage: string = constants.NO_CONTACT_FOUND_MESSAGE;
  public isLoading = true;
  public contact!: Contact;

  constructor(
    private contactService: ContactService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadContact();
  }

  private loadContact(): void {
    this.route.params.subscribe((params) => {
      const id = +params['id'];
      this.contactService.getContact(id);
      this.contactService.contactDetailsObs.subscribe((contact: any) => {
        // console.log('contact: ', contact);
        this.isLoading = false;
        this.contact = contact;
      });
      // this.contactService.getContact(id).then((contact:any) => {
      //   console.log('contact: ', contact);
      //   this.isLoading = false;
      //   this.contact$ = contact;
      // });
    });
  }

  openDialog(data: any): void {
    // For instructional purposes, insert a slight delay before opening the dialog
    setTimeout(() => {
      const dialogRef = this.dialog.open(ContactFeedComponent, {
        disableClose: true,
        data: { name: data?.name },
      });
      dialogRef.afterClosed().subscribe((result) => {
        // TODO do something here if Follow is clicked
      });
    }, 500);
  }
}
