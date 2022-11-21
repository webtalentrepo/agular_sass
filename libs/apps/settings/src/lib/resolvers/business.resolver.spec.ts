import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { ApiService } from '../services';

import { BusinessResolver } from './business.resolver';

describe('BusinessResolver', () => {
  let resolver: BusinessResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BusinessResolver,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    resolver = TestBed.get(BusinessResolver);
  });

  it('should create', () => {
    expect(resolver).toBeTruthy();
  });

  it('should resolve', fakeAsync(() => {
    const apiServiceSpy = spyOn(TestBed.get(ApiService), 'getBusiness');
    // apiServiceSpy.and.returnValue(of(mockBusiness));

    resolver.resolve({ params: { businessId: 'test' } } as any, null);
    tick(100);
    expect(apiServiceSpy).toHaveBeenCalledTimes(1);
    expect(apiServiceSpy).toHaveBeenCalledWith('test');
  }));
});
