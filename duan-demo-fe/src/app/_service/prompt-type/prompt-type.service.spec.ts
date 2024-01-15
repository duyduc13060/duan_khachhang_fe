/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PromptTypeService } from './prompt-type.service';

describe('Service: PromptType', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PromptTypeService]
    });
  });

  it('should ...', inject([PromptTypeService], (service: PromptTypeService) => {
    expect(service).toBeTruthy();
  }));
});
