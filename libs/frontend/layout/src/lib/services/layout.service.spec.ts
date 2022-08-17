import { reset } from '@global/frontend/test';
import { MockBuilder, MockRender } from 'ng-mocks';
import { FrontendLayoutModule } from '../frontend-layout.module';
import { LayoutService } from './layout.service';

describe('LayoutService', () => {

  let service: LayoutService;

  beforeEach(() => MockBuilder(LayoutService, FrontendLayoutModule.forRoot()));
  beforeEach(() => {
    service = MockRender(LayoutService).point.componentInstance;
  });

  afterEach(reset);

  it('인스턴스 생성', () => {
    expect(service).toBeTruthy();
  });

  describe('레이아웃 가시성', () => {
    it('초기값', () => {
      expect(service.visibilities).toBeDefined();
      expect(service.visibilities.header).toEqual(true);
      expect(service.visibilities.navigation).toEqual(true);
      expect(service.visibilities.footer).toEqual(true);
    });

    it('hideAll()', () => {
      service.hideAll();
      expect(service.visibilities.header).toEqual(false);
      expect(service.visibilities.navigation).toEqual(false);
      expect(service.visibilities.footer).toEqual(false);
    });

    it('showAll()', () => {
      service.visibilities.header = false;
      service.visibilities.navigation = false;
      service.visibilities.footer = false;
      service.showAll();
      expect(service.visibilities.header).toEqual(true);
      expect(service.visibilities.navigation).toEqual(true);
      expect(service.visibilities.footer).toEqual(true);
    });
  });
});
