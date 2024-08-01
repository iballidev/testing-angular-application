import { Injectable } from '@angular/core';
// import 'rxjs/add/operator/toPromise';

import { Contact } from '../';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, firstValueFrom, map, Observable, Subject } from 'rxjs';

@Injectable()
export class ContactService {
  private contactsUrl = 'app/contacts';
  private httpOptions: Object = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
    responseType: 'text',
  };
  // private headers: Headers = new Headers({
  //   "Content-Type": "application/json",
  // });

  
  contactDetailsObs = new Subject<any>();

  constructor(private http: HttpClient) {}

  getHeroes() {
    console.log('HELLO!!!');
    this.http.get<any>(this.contactsUrl).subscribe({
      next: (response: any) => {
        console.log('response: ', response);
      },
      error: (err: any) => {
        console.log('Error***: ', err);
      },
    });
  }

  // public async getContacts(): Promise<Observable<any>> {
  //   const observable$ = this.http.get(this.contactsUrl);
  //   console.log('observable$: ', observable$);
  //   return this.http.get(this.contactsUrl).pipe(
  //     map((response: any) => response as Contact),
  //     catchError(this.handleError)
  //   );
  // }

  public getContacts(): Observable<any> {
    const observable$ = this.http.get(this.contactsUrl);
    console.log('observable$: ', observable$);
    return observable$;

    // try {
    //   const data: any = await firstValueFrom(observable$).then((data: any) =>
    //     console.log(data)
    //   );
    //   console.log(data);
    //   return data ;
    // } catch (error) {
    //   console.error('Error: ', error);
    //   catchError(this.handleError);
    // }
    /** */
    // return this.http.get(this.contactsUrl).pipe(
    //   map((response: any) => response as Contact),
    //   catchError(this.handleError)
    // );
    /** */
    // .toPromise()
    // .then((response: any) => response.json().data as Contact)
    // .catch(this.handleError);
  }

  public getContact(id: number) {
    this.getContacts().subscribe((contacts: any) => {
      let contact = contacts.find((contact: any) => contact.id === id);
      this.contactDetailsObs.next(contact);
    });

    this.contactDetailsObs.subscribe((data)=>console.warn("data: ", data))
  }

  public save(contact: Contact): Promise<Contact | void> {
    if (contact.id) {
      return this.put(contact);
    }

    return this.post(contact);
  }

  public new(contact: Contact): Promise<Contact | void> {
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

  public async post(contact: Contact): Promise<Contact | void> {
    const url: string = `${this.contactsUrl}/${contact.id}`;
    const observable$ = this.http.post(
      url,
      JSON.stringify(contact),
      this.httpOptions
    );
    try {
      const data = await firstValueFrom(observable$);
      console.log(data);
    } catch (error) {
      console.error(error);
      catchError(this.handleError);
    }

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

  public async put(contact: Contact): Promise<Contact | void> {
    const url: string = `${this.contactsUrl}/${contact.id}`;
    // const observable$ = this.http.put(
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

    /** */
    return this.http
      .put(url, JSON.stringify(contact), this.httpOptions)
      .toPromise()
      .then(() => contact)
      .catch(this.handleError);

    /** */
    // .pipe(
    //   map((response: any) => response.json().data as Contact),
    //   catchError(this.handleError)
    // )
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
