/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PromptService } from './prompt.service';

describe('Service: Prompt', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PromptService]
    });
  });

  it('should ...', inject([PromptService], (service: PromptService) => {
    expect(service).toBeTruthy();
  }));
});
