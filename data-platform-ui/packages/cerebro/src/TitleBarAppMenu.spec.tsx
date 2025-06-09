import { byRole, byText, fireEvent, render } from './test.utils';
import TitleBarAppMenu from './TitleBarAppMenu';
import { appModuleConfigObj } from '@nlss/brain-trust';

describe('TitleBarAppMenu', () => {
  const selectors = {
    toggle: byRole('button'),
    menu: byRole('menu'),
    catalogMI: byText<HTMLAnchorElement>(appModuleConfigObj.catalog.displayName),
    dashboardMI: byText<HTMLAnchorElement>(appModuleConfigObj.dashboard.displayName),
    toolsMI: byText<HTMLAnchorElement>(appModuleConfigObj.tools.displayName)
  };

  it('should render closed', () => {
    render(<TitleBarAppMenu />);
    expect(selectors.toggle.query()).toBeInTheDocument();
  });

  it('should show apps menus', async () => {
    render(<TitleBarAppMenu />);

    const btn: HTMLElement = selectors.toggle.get();

    fireEvent.click(btn);

    await selectors.menu.find({ hidden: false });

    expect(selectors.catalogMI.get()).toHaveAttribute('href', appModuleConfigObj.catalog.path);
    expect(selectors.dashboardMI.get()).toHaveAttribute('href', appModuleConfigObj.dashboard.path);
    expect(selectors.toolsMI.get()).toHaveAttribute('href', appModuleConfigObj.tools.path);
  });
});
