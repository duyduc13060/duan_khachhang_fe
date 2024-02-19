/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DocumentPortalService } from './document-portal.service';

describe('Service: DocumentPortal', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DocumentPortalService]
    });
  });

  it('should ...', inject([DocumentPortalService], (service: DocumentPortalService) => {
    expect(service).toBeTruthy();
  }));
});
