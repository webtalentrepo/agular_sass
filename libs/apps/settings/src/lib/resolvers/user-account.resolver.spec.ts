import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { FakeEnvService } from 'src/test.helpers';

import { ApiService } from '../services/api.service';
import { EnvService } from '../services/env.service';

import { UserAccountResolver } from './user-account.resolver';



describe('UserAccountResolver', () => {
  let resolver: UserAccountResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserAccountResolver,
        {
          provide: ApiService,
          useValue: {
            getUserAccount: () => of(),
          },
        },
        {
          provide: EnvService,
          useValue: new FakeEnvService(),
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    resolver = TestBed.get(UserAccountResolver);
  });

  it('should create', () => {
    expect(resolver).toBeTruthy();
  });

  it('should resolve', fakeAsync(() => {
    const apiServiceSpy = spyOn(TestBed.get(ApiService), 'getUserAccount');
    apiServiceSpy.and.returnValue(of());

    resolver.resolve({ params: { userId: 'test' } } as any, null);
    tick(100);
    expect(apiServiceSpy).toHaveBeenCalledTimes(1);
    expect(apiServiceSpy).toHaveBeenCalledWith();
  }));
});
