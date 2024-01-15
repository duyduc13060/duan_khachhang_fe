/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ClickLikeService } from './click-like.service';

describe('Service: ClickLike', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ClickLikeService]
    });
  });

  it('should ...', inject([ClickLikeService], (service: ClickLikeService) => {
    expect(service).toBeTruthy();
  }));
});
