import { InMemoryDbService } from 'angular-in-memory-web-api';

import { Contact } from './contacts/shared/models/';
import { CONTACTS } from './contacts/shared/data/mock-contacts';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const contacts: Contact[] = CONTACTS;

    return {contacts};
  }
}
