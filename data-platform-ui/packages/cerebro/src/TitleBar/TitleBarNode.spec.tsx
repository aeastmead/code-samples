import { render } from '../test.utils';
import TitleBarNode from './TitleBarNode';

describe('TitleBarNode', () => {
  it('should render as a link with a label', () => {
    const label = 'Just a label';
    const { queryByText, queryByRole } = render(<TitleBarNode iconName="apps" href="/catalog" label={label} />);

    expect(queryByRole('link')).toBeInTheDocument();

    expect(queryByText(label)).toBeInTheDocument();
  });

  it('should render as a div with out label', () => {
    const testId = 'parentNode';

    const { queryByRole, getByTestId } = render(<TitleBarNode data-testid={testId} iconName="apps" />);

    expect(queryByRole('link')).not.toBeInTheDocument();

    const rootElem: HTMLElement = getByTestId(testId);

    expect(rootElem).toBeInstanceOf(HTMLDivElement);
    expect(rootElem.childNodes).toHaveLength(1);
  });
});
