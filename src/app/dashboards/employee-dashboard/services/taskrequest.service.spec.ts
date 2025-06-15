import { TestBed } from '@angular/core/testing';

import { TaskrequestService } from './taskrequest.service';

describe('TaskrequestService', () => {
  let service: TaskrequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskrequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
