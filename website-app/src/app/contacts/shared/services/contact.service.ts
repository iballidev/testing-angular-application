import { Injectable } from '@angular/core';
// import 'rxjs/add/operator/toPromise';

import { Contact } from '../';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  catchError,
  firstValueFrom,
  map,
  Observable,
  Subject,
  tap,
} from 'rxjs';

@Injectable()
export class ContactService {
  private contactsUrl = 'app/contacts';
  private httpOptions: Object = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
    // responseType: 'text',
  };
  // private headers: Headers = new Headers({
  //   "Content-Type": "application/json",
  // });

  contactDetailsObs = new Subject<any>();

  constructor(private http: HttpClient) {}

  getHeroes() {
    this.http
      .get<any>(this.contactsUrl)
      .pipe(catchError(this.handleError))
      .subscribe({
        next: (response: any) => {
          // console.log('response: ', response);
        },
      });
  }

  public getContacts(): Observable<any> {
    const observable$ = this.http.get(this.contactsUrl);
    // console.log('observable$: ', observable$);
    return observable$;
  }

  public getContact(id: number) {
    this.getContacts().subscribe((contacts: any) => {
      let contact = contacts.find((contact: any) => contact.id === id);
      this.contactDetailsObs.next(contact);
    });

    this.contactDetailsObs.subscribe((data) => console.warn('data: ', data));
  }

  public save(contact: Contact) {
    console.log('contact: ', contact);
    if (contact.id) {
      return this.put(contact).subscribe({
        next: (response: any) => {
          if (response) {
            console.log('response: ', response);
          }
        },
      });
    }
    return this.post(contact);
  }

  public new(contact: Contact): Observable<any> {
    return this.post(contact);
  }

  public async delete(contact: Contact): Promise<Contact | void> {
    const url = `${this.contactsUrl}/${contact.id}`;
    const observable$ = this.http.delete(url, this.httpOptions);
    try {
      const data = await firstValueFrom(observable$);
      console.log(data);
    } catch (error) {
      console.error(error);
      catchError(this.handleError);
    }

    // return this.http.delete(url, this.httpOptions).pipe(
    //   map((response: any) => response.json().data as Contact),
    //   catchError(this.handleError)
    // );
    // /** */
    // // .toPromise()
    // // .then(() => null)
    // // .catch(this.handleError);
  }

  public post(contact: Contact): Observable<any> {
    const url: string = `${this.contactsUrl}/${contact.id}`;

    return this.http
      .post(url, contact, this.httpOptions)
      .pipe(catchError(this.handleError));

    // const observable$ = this.http.post(
    //   url,
    //   JSON.stringify(contact),
    //   this.httpOptions
    // );
    // try {
    //   const data = await firstValueFrom(observable$);
    //   console.log(data);
    // } catch (error) {
    //   console.error(error);
    //   catchError(this.handleError);
    // }

    // return (
    //   this.http
    //     .post(this.contactsUrl, JSON.stringify(contact), this.httpOptions)
    //     // .toPromise()
    //     // .then((res: any) => res.json())
    //     // .catch(this.handleError);
    //     .pipe(
    //       map((response: any) => response.json().data as Contact),
    //       catchError(this.handleError)
    //     )
    // );
  }

  put(contact: Contact): Observable<any> {
    console.log('contact##: ', contact);
    const url: string = `${this.contactsUrl}/${contact.id}`;
    return this.http
      .put(url, contact, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
