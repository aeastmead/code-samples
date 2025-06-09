import React from 'react';
import isNil from 'lodash/isNil';
import cn from 'classnames';
import { EditPencil } from '../SharedLayout';

export default class FormDisplayToggle extends React.PureComponent<Props, State> {
  static displayName = 'NLSSFormDisplayToggle';

  state: State = { showForm: false };

  constructor(props: Props) {
    super(props);

    this._handleShowForm = this._handleShowForm.bind(this);
  }

  public render(): React.ReactNode | null {
    const {
      editable: _editable,
      formRender: _render,
      children,
      editButtonClassName,
      className,
      editableClassName,
      formClassName,
      ...props
    } = this.props;

    let editable = false;

    let formRender: FormDisplayToggleFormRender = () => null;

    if (_editable === true && !isNil(_render)) {
      editable = true;
      formRender = _render;
    }
    const showForm = editable && this.state.showForm;

    return (
      <div
        {...props}
        className={cn('nlss-form-display-toggle', className, {
          [`nlss-form-display-toggle--editable ${editableClassName ?? ''}`]: editable && !showForm,
          [`nlss-form-display-toggle--form ${formClassName ?? ''}`]: showForm
        })}>
        {showForm ? (
          formRender({ onClose: this._handleShowForm.bind(this, false) })
        ) : (
          <>
            {editable && <EditPencil className={editButtonClassName} onClick={this._handleShowForm.bind(this, true)} />}
            {children}
          </>
        )}
      </div>
    );
  }

  private _handleShowForm(showForm: boolean): void {
    this.setState({ showForm });
  }
}

type Props = IFormDisplayToggleProps;

type State = {
  showForm: boolean;
};

export type FormDisplayToggleRenderProps = {
  onClose: () => void;
};

export type FormDisplayToggleFormRender = (props: FormDisplayToggleRenderProps) => React.ReactNode;
export interface IFormDisplayToggleProps extends React.HTMLAttributes<HTMLDivElement> {
  editable?: boolean;
  formRender?: FormDisplayToggleFormRender;
  editButtonClassName?: string;
  /**
   * Class name when edit button and children content is displayed
   */
  editableClassName?: string;

  /**
   * Class name when form is displayed
   */
  formClassName?: string;
  children?: React.ReactNode;
}
export type FormDisplayToggleType = React.ComponentType<IFormDisplayToggleProps>;
