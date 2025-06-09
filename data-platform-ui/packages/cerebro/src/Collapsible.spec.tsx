/* eslint-disable @typescript-eslint/no-empty-function */
import { byRole, byText, fireEvent, render, SelectorResult } from './test.utils';
import Collapsible from './Collapsible';

describe('Collapsible', () => {
  const childText = 'Main Content';

  const headerText = 'Header Panel';

  const bodySelector: SelectorResult = byText(childText);

  const headerSelector: SelectorResult = byRole('tab');

  describe('Uncontrolled', () => {
    const mockOnOpen: jest.Mock = jest.fn(() => {});

    const mockOnClose: jest.Mock = jest.fn(() => {});
    beforeEach(() => {
      jest.resetAllMocks();

      render(
        <Collapsible header={headerText} onClose={mockOnClose} onOpen={mockOnOpen}>
          {childText}
        </Collapsible>
      );
    });

    it('should render default', () => {
      expect(bodySelector.get()).toBeInTheDocument();
    });

    it('should close panel', async () => {
      const header: HTMLElement = headerSelector.get();
      fireEvent.click(header);
      expect(mockOnClose).toBeCalled();
    });
  });
});
