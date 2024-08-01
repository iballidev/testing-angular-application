import {
  Component,
  Inject,
  NgZone,
  OnDestroy,
  OnInit,
  Optional,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ContactFeedService } from '../shared/services';
import { Subscription } from 'rxjs';
import { MaterialModule } from '../../material/material.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact-feed',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './contact-feed.component.html',
  styleUrl: './contact-feed.component.scss',
})
export class ContactFeedComponent implements OnInit, OnDestroy {
  sub!: Subscription;
  updates: string[] = [];
  name: string;
  closeDisabled = true;

  constructor(
    public dialogRef: MatDialogRef<ContactFeedComponent>,
    private feed: ContactFeedService,
    private zone: NgZone,
    @Optional() @Inject(MAT_DIALOG_DATA) data: any
  ) {
    this.name = data.name;
  }

  ngOnInit() {
    /*
     This version runs inside the Angular zone, and will block Protractor testing indefinitely.
     this.sub = this.feed.getFeed().subscribe((x) => {
       this.updates.push(x);
       if (this.updates.length > 5) {
         this.updates.shift();
       }
     });
     */
    this.closeDisabled = false;

    this.zone.runOutsideAngular(() => {
      this.sub = this.feed.getFeed().subscribe((x) => {
        this.zone.run(() => {
          this.updates.push(x);
          if (this.updates.length > 4) {
            this.updates.shift();
          }
        });
      });
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
