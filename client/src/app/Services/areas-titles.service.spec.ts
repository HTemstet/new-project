import { TestBed } from '@angular/core/testing';

import { AreasTitlesService } from './areas-titles.service';

describe('AreasTitlesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AreasTitlesService = TestBed.get(AreasTitlesService);
    expect(service).toBeTruthy();
  });
});
