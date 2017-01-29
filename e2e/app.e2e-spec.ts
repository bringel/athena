import { AthenaPage } from './app.po';

describe('athena App', function() {
  let page: AthenaPage;

  beforeEach(() => {
    page = new AthenaPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
