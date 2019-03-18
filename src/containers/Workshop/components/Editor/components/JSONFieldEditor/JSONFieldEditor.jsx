// Absolute Imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Table } from 'reactstrap';
import { withTranslation } from 'react-i18next';

// Components
import JSONFieldEditorModel from './JSONFieldEditorModal';

// Functions
import squashString from '../../../../../../shared/utils/squashString';


class JSONFieldEditor extends Component {
  static propTypes = {
    // Form
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string,
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    value: {
      schema: {
        fields: [],
        validation: [],
      },
      subInstances: [],
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
      id: -1,
      index: -1,
    };
  }

  getSubInstance = (field, id) =>
    field.subInstances.filter(f => parseInt(f.id, 10) === parseInt(id, 10))[0];

  getValue = (field, subField, subInstance) => {
    const fieldValue = subInstance.fields
      .filter(f => f.name === subField.name)[0].value;
    console.log(fieldValue, subField.type);
    if (subField.type === 'select') {
      return field.schema.fields
        .filter(f => f.name === subField.name)[0].options
        .filter(f => f.value === fieldValue)[0];
    }
    return fieldValue;
  };

  sortSubInstances = (subInstances, { dir = 'asc' } = {}) => {
    const coef = dir === 'asc' ? 1 : -1;
    return subInstances.sort((a, b) => coef * (parseInt(b.id, 10) - parseInt(a.id, 10)));
  };

  handleToggleModal = () => {
    this.setState(prevState => ({
      modalOpen: !prevState.modalOpen,
    }));
  };

  handleOnSave = (newSubInstance) => {
    const { id, index } = this.state;
    const { onChange, value } = this.props;
    const field = value;
    const indexInt = parseInt(index, 10);
    const numReadOnlyFields = field.schema.fields.reduce((acc, obj) => (obj.readOnly ? acc + 1 : acc), 0);
    if (id !== -1) {
      onChange({
        ...field,
        subInstances: [
          ...field.subInstances.slice(0, indexInt),
          {
            id: id.toString(),
            fields: newSubInstance.fields,
          },
          ...field.subInstances.slice(indexInt + 1),
        ],
      });
    } else {
      if (newSubInstance.fields.length !== field.schema.fields.length - numReadOnlyFields) return;
      const newId = field.subInstances.length ? parseInt(this.sortSubInstances(field.subInstances)[0].id, 10) + 1 : 1;
      onChange({
        ...field,
        subInstances: [
          ...this.sortSubInstances(field.subInstances, { dir: 'desc' }),
          {
            id: newId.toString(),
            fields: [
              { name: 'id', value: newId.toString() },
              ...newSubInstance.fields,
            ],
          },
        ],
      });
    }
    this.handleToggleModal();
  };

  handleOnAdd = () => {
    this.setState({ id: -1 }, this.handleToggleModal());
  };

  handleOnEdit = (e) => {
    e.preventDefault();
    const { id, index } = e.target.dataset;
    this.setState({ id: parseInt(id, 10), index }, this.handleToggleModal());
  };

  handleOnDelete = (e) => {
    e.preventDefault();
    const id = parseInt(e.target.dataset.id, 10);
    const { onChange, value } = this.props;
    const field = value;
    onChange({
      ...field,
      subInstances: field.subInstances.filter(f => parseInt(f.id, 10) !== id),
    });
  };

  render() {
    // State
    const {
      modalOpen, id,
    } = this.state;

    // Props
    const {
      value, t,
    } = this.props;

    const field = value;

    return (
      <>
        <JSONFieldEditorModel
          toggle={this.handleToggleModal}
          isOpen={modalOpen}
          fields={field.schema.fields}
          subInstance={this.getSubInstance(field, id)}
          onSave={this.handleOnSave}
          newInstance={id === -1}
        />
        {field && (
          <Table>
            <thead>
              <tr>
                {field.schema.fields.map(subField => (
                  <th key={subField.name} className="text-capitalize">
                    {t(subField.name)}
                  </th>
              ))}
                <th>
                  {t('Actions')}
                </th>
              </tr>
            </thead>
            <tbody>
              {field.subInstances.map((subInstance, index) => (
                <tr key={subInstance.id}>
                  {field.schema.fields.map(subField => (
                    <td key={subField.name}>
                      {subField.type !== 'textarea'
                        ? (squashString(this.getValue(field, subField, subInstance), { noNumeral: true })
                    ) : (
                      <p> {t('HTML content')}</p>
                    )}
                    </td>
                ))}
                  <td>
                    <button
                      className="workshop__json-editor__button fa-fw fal fa-edit mr-4"
                      onClick={this.handleOnEdit}
                      data-id={subInstance.id}
                      data-index={index}
                    />
                    <button
                      className="workshop__json-editor__button fa-fw fal fa-times"
                      onClick={this.handleOnDelete}
                      data-id={subInstance.id}
                    />
                  </td>
                </tr>
            ))}
              <tr>
                <Button className="mt-2" size="sm" onClick={this.handleOnAdd}>
                  {t('Add')}
                </Button>
              </tr>
            </tbody>
          </Table>
        )}
      </>
    );
  }
}

export default withTranslation()(JSONFieldEditor);
