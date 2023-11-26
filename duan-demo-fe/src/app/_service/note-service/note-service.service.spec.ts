/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { NoteServiceService } from './note-service.service';

describe('Service: NoteService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NoteServiceService]
    });
  });

  it('should ...', inject([NoteServiceService], (service: NoteServiceService) => {
    expect(service).toBeTruthy();
  }));
});
