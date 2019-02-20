// Absolute Imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Table } from 'reactstrap';

// Components
import JSONFieldEditorModel from './JSONFieldEditorModal';

// Functions
import squashString from '../../../../../../shared/utils/squashString';


class JSONFieldEditor extends Component {
  static propTypes = {
    // Form
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string,
  };

  static defaultProps = {
    value: {
      schema: {
        fields: [],
      },
      subInstances: [],
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
    };
  }

  handleToggleModal = () => {
    this.setState(prevState => ({
      modalOpen: !prevState.modalOpen,
    }));
  };

  handleOnSave = (newSubInstanceValues) => {
    const { value, onChange } = this.props;
    const field = value;
    const { fields } = field.schema;
    const numReadOnlyFields = fields.reduce((acc, obj) => (obj.readOnly ? acc + 1 : acc), 0);
    if (newSubInstanceValues.length !== fields.length - numReadOnlyFields) {
      return;
    }
    const id = field.subInstances.length ? field.subInstances.sort((a, b) => b.id - a.id)[0].id + 1 : 1;
    this.setState((prevState) => {
      onChange({
        ...field,
        subInstances: [
          ...field.subInstances,
          {
            fields: [
              { name: 'id', value: id },
              ...newSubInstanceValues,
            ],
          },
        ],
      });
      return prevState;
    });
    this.handleToggleModal();
  };

  render() {
    // State
    const {
      modalOpen,
    } = this.state;

    // Props
    const {
      value, onChange,
    } = this.props;

    const field = value;

    return (
      <>
        <JSONFieldEditorModel
          toggle={this.handleToggleModal}
          isOpen={modalOpen}
          field={field}
          onChange={onChange}
          onSave={this.handleOnSave}
        />
        {field && (
          <Table>
            <thead>
              {field.schema.fields.map(subField => (
                <th className="text-capitalize">
                  {subField.name}
                </th>
              ))}
              <th>
                Actions
              </th>
            </thead>
            <tbody>
              {field.subInstances.map(subInstance => (
                <tr>
                  {subInstance.fields.map(subField => (
                    <td>
                      {squashString(subField.value, { noNumeral: true })}
                    </td>
                  ))}
                  <td>
                    <button style={{ backgroundColor: 'transparent', border: 'none' }} className="fal fa-edit" />
                  </td>
                  <td>
                    <button style={{ backgroundColor: 'transparent', border: 'none' }} className="fal fa-times" />
                  </td>
                </tr>
              ))}
              <tr>
                <Button size="sm" onClick={this.handleToggleModal}>Add</Button>
              </tr>
            </tbody>
          </Table>
        )}
      </>
    );
  }
}

export default props => (
  <JSONFieldEditor {...props.input} />
);
