/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { QuestionAnswerServiceService } from './question-answer-service.service';

describe('Service: QuestionAnswerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QuestionAnswerServiceService]
    });
  });

  it('should ...', inject([QuestionAnswerServiceService], (service: QuestionAnswerServiceService) => {
    expect(service).toBeTruthy();
  }));
});
