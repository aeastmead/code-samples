import React from 'react';
import { render, fireEvent, screen } from '../../../testUtils';
import ToggledInput, { ToggledInputProps, ToggledInputValue } from './ToggledInput';
import userEvent from '@testing-library/user-event';

function createSelectors(role: string): ElementSelector {
  return {
    get: (): HTMLElement => screen.getByRole(role),
    query: (): HTMLElement | null => screen.queryByRole(role)
  };
}

// @TODO: Create evemt expected

describe('ToggledInput', () => {
  const mockChangeHandler: jest.Mock = jest.fn(() => {});

  const mockToggleChangeHandler: jest.Mock = jest.fn(() => {});

  const toggleSelector: ElementSelector = createSelectors('checkbox');

  const textboxSelector: ElementSelector = createSelectors('textbox');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it.each<boolean>([false, true])(
    'when value = %s (Boolean) then toggle is off and input is hidden',
    (value: boolean) => {
      render(<ToggledInput value={value as any} onChange={mockChangeHandler} onToggleChange={mockChangeHandler} />);

      expect(toggleSelector.get()).not.toBeChecked();
      expect(textboxSelector.query()).not.toBeInTheDocument();
    }
  );

  it.each<string>(['blue', ''])('when value = %s (string) then toggle is on and show input', (value: string) => {
    render(<ToggledInput value={value} onChange={mockChangeHandler} onToggleChange={mockChangeHandler} />);
    expect(toggleSelector.get()).toBeChecked();
    const textbox: HTMLElement | null = textboxSelector.get();

    expect(textbox).toBeInTheDocument();
    expect(textbox).toHaveValue(value);
  });

  it('Focus on text input after toggle change', () => {
    const { rerender } = render(
      <ToggledInput value={false} onChange={mockChangeHandler} onToggleChange={mockToggleChangeHandler} />
    );

    const toggle: HTMLElement = toggleSelector.get();
    expect(toggle).not.toBeChecked();

    rerender(<ToggledInput value={''} onChange={mockChangeHandler} onToggleChange={mockToggleChangeHandler} />);
    expect(toggle).toBeChecked();
    expect(textboxSelector.query()).toHaveFocus();
  });

  it.each<{ expected: boolean; value: ToggledInputValue }>([
    { value: false, expected: true },
    { value: 'meta', expected: false }
  ])(
    'when click toggle then emit toggle event checked = $expected',
    ({ value, expected }: { expected: boolean; value: ToggledInputValue }) => {
      let checked: boolean | null = null;
      render(
        <ToggledInput
          value={value}
          onChange={mockChangeHandler}
          onToggleChange={(ev: React.ChangeEvent<HTMLInputElement>) => {
            checked = ev.currentTarget.checked;
          }}
        />
      );

      const toggle: HTMLElement = toggleSelector.get();

      fireEvent.click(toggle);
      expect(checked).toEqual(expected);
    }
  );

  it('given focus is on input when toggle turn off then blur event', () => {
    const mockBlurHandler: jest.Mock = jest.fn(() => {});

    const mockFocusHandler: jest.Mock = jest.fn(() => {});
    render(
      <FieldRig
        initialValue={''}
        onChange={mockChangeHandler}
        onToggleChange={mockToggleChangeHandler}
        onBlur={mockBlurHandler}
        onFocus={mockFocusHandler}
      />
    );
    const textbox: HTMLElement = textboxSelector.get();
    mockFocusHandler.mockClear();
    userEvent.click(textbox);

    expect(mockFocusHandler).toBeCalled();

    userEvent.type(textbox, 'hi');
    mockBlurHandler.mockClear();
    userEvent.click(toggleSelector.get());

    expect(mockBlurHandler).toBeCalled();
  });

  function FieldRig({ initialValue, onChange: _onChange, ...props }: FieldRigProps): React.ReactElement {
    const [value, setValue] = React.useState(initialValue);

    return (
      <ToggledInput
        {...props}
        value={value}
        onChange={(ev: React.ChangeEvent<HTMLInputElement>) => {
          ev.persist();
          setValue(ev.target.value);
          _onChange(ev);
        }}
      />
    );
  }

  interface FieldRigProps extends Omit<ToggledInputProps, 'value'> {
    initialValue: ToggledInputProps['value'];
  }
});

type ElementSelector = {
  get(): HTMLElement;
  query(): HTMLElement | null;
};
