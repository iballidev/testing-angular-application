import { DebugElement } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { RouterTestingModule } from '@angular/router/testing';
/** */
import { FormsModule } from '@angular/forms';
/** */
import {
  Contact,
  ContactService,
  FavoriteIconDirective,
  InvalidEmailModalComponent,
  InvalidPhoneNumberModalComponent,
} from '../shared';
import { MaterialModule } from '../../material/material.module';
import { ContactEditComponent } from './contact-edit.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
// import '../../../material-app-theme.scss';

describe('ContactEditComponent tests', () => {
  let fixture: ComponentFixture<ContactEditComponent>;
  let component: ContactEditComponent;
  let rootElement: DebugElement;

  const contactServiceStub = {
    contact: {
      id: 1,
      name: 'janet',
    },
    save: async function (contact: Contact) {
      component.contact = contact;
    },
    getContact: async function () {
      component.contact = this.contact;
      return this.contact;
    },
    updateContact: async function (contact: Contact) {
      component.contact = contact;
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        // ContactEditComponent,
        // FavoriteIconDirective,
        InvalidEmailModalComponent,
        InvalidPhoneNumberModalComponent,
      ],
      imports: [
        MaterialModule,
        FormsModule,
        NoopAnimationsModule,
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [{ provide: ContactService, useValue: contactServiceStub }],
    });
    TestBed.overrideModule(BrowserDynamicTestingModule, {
      set: {
        // entryComponents: [
        //   InvalidEmailModalComponent,
        //   InvalidPhoneNumberModalComponent,
        // ],
        declarations: [
          InvalidEmailModalComponent,
          InvalidPhoneNumberModalComponent,
        ],
      },
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    rootElement = fixture.debugElement;
  });

  describe('saveContact() test', () => {
    it('should display contact name after contact set', fakeAsync(() => {
      const contact = {
        id: 1,
        name: 'lorace',
      };
      // component.isLoading = false;
      component.saveContact(contact);
      fixture.detectChanges();
      const nameInput = rootElement.query(By.css('.contact-name'));
      expect(nameInput).toBeTruthy(); // Check that the element is found
      tick();
      console.warn("nameInput?.nativeElement: ", nameInput?.nativeElement)
      console.warn("nameInput?.nativeElement.value: ", nameInput?.nativeElement.value)
      // expect(nameInput?.nativeElement.value).toBe('lorace');
      // expect(true).toBe(true)
    }));
  });

  // describe('loadContact() test', () => {
  //   it('should load contact', fakeAsync(() => {
  //     component.isLoading = false;
  //     component.loadContact();
  //     fixture.detectChanges();
  //     const nameInput = rootElement.query(By.css('.contact-name'));
  //     tick();
  //     expect(nameInput.nativeElement.value).toBe('janet');
  //   }));
  // });

  // describe('updateContact() tests', () => {
  //   it('should update the contact', fakeAsync(() => {
  //     const newContact = {
  //       id: 1,
  //       name: 'delia',
  //       email: 'delia@example.com',
  //       number: '1234567890',
  //     };

  //     component.contact = {
  //       id: 2,
  //       name: 'rhonda',
  //       email: 'rhonda@example.com',
  //       number: '1234567890',
  //     };

  //     component.isLoading = false;
  //     fixture.detectChanges();
  //     const nameInput = rootElement.query(By.css('.contact-name'));
  //     tick();
  //     expect(nameInput.nativeElement.value).toBe('rhonda');

  //     component.updateContact(newContact);
  //     fixture.detectChanges();
  //     tick(100);
  //     expect(nameInput.nativeElement.value).toBe('delia');
  //   }));
  // });
});

/**
 * 
 * 
 * In Angular 17, TestBed.overrideModule is still a valid method for overriding Angular modules in tests. However, the need to override entry components has been largely replaced due to the removal of entryComponents in Angular Ivy, which is used in Angular versions 9 and onwards. You typically no longer need to declare entry components explicitly, as all components are considered entry components with Ivy.

However, if you still need to override a module for testing purposes, you can do it like this:

import { TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { InvalidEmailModalComponent } from './path-to-invalid-email-modal-component';
import { InvalidPhoneNumberModalComponent } from './path-to-invalid-phone-number-modal-component';

TestBed.overrideModule(BrowserDynamicTestingModule, {
  set: {
    declarations: [
      InvalidEmailModalComponent,
      InvalidPhoneNumberModalComponent,
    ],
  },
});

// Further test setup and assertions

Key Points:
Ivy Renderer: Since Angular Ivy, the concept of entry components has been deprecated. Therefore, you don't need to set entry components manually.

Component Declaration: You can declare components directly in the test bed setup as shown, which makes them available for testing purposes.

Testing Setup: Make sure you include the components and any other necessary modules in your test setup. If these modals are used in a specific module, you might want to import that module instead, depending on your testing strategy.

Modules and Components: Ensure that all dependencies required by the components are properly declared in your testing module. This might include importing other modules or providing mock services.

Here's how you might set up a complete test suite using Angular's testing utilities:



*
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { InvalidEmailModalComponent } from './path-to-invalid-email-modal-component';
import { InvalidPhoneNumberModalComponent } from './path-to-invalid-phone-number-modal-component';

describe('Modal Components Test Suite', () => {
  let emailModalFixture: ComponentFixture<InvalidEmailModalComponent>;
  let phoneModalFixture: ComponentFixture<InvalidPhoneNumberModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowserDynamicTestingModule],
      declarations: [
        InvalidEmailModalComponent,
        InvalidPhoneNumberModalComponent,
      ],
    }).compileComponents();

    emailModalFixture = TestBed.createComponent(InvalidEmailModalComponent);
    phoneModalFixture = TestBed.createComponent(InvalidPhoneNumberModalComponent);
  });

  it('should create InvalidEmailModalComponent', () => {
    const emailModalInstance = emailModalFixture.componentInstance;
    expect(emailModalInstance).toBeTruthy();
  });

  it('should create InvalidPhoneNumberModalComponent', () => {
    const phoneModalInstance = phoneModalFixture.componentInstance;
    expect(phoneModalInstance).toBeTruthy();
  });
});



Explanation:
TestBed.configureTestingModule: This sets up the testing module with necessary declarations.
compileComponents: Ensures that all components are compiled before the tests run.
Component Fixtures: You create fixtures for each component, which allows you to access the component instance and test its behavior.
Test Cases: Simple test cases are provided to ensure the components are created successfully. You can extend these tests to cover more specific functionality.
 */
