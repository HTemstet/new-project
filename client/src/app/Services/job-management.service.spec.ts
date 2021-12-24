import { TestBed } from '@angular/core/testing';

import { JobManagementService } from './job-management.service';

describe('JobManagementService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: JobManagementService = TestBed.get(JobManagementService);
    expect(service).toBeTruthy();
  });
});
