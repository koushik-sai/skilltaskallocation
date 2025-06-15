import { TestBed } from '@angular/core/testing';

import { TaskupdateService } from './taskupdate.service';

describe('TaskupdateService', () => {
  let service: TaskupdateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskupdateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
