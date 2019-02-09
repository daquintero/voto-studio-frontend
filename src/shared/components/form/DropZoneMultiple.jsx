/* eslint-disable react/no-array-index-key */
import React, { PureComponent } from 'react';
import Dropzone from 'react-dropzone';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
  Row,
  Col,
} from 'reactstrap';


class DropZoneMultipleField extends PureComponent {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func,
    name: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string,
      })),
    ]).isRequired,
  };

  static defaultProps = {
    onSubmit: () => {},
  };

  constructor() {
    super();
    this.state = {};
  }

  onDrop = (acceptedFiles) => {
    const { onChange, value } = this.props;
    onChange(value ? value.concat(acceptedFiles) : acceptedFiles);
  };

  removeFile= (index, e) => {
    e.preventDefault();
    this.props.onChange(this.props.value.filter((val, i) => i !== index));
  };

  render() {
    const files = this.props.value;
    const { name } = this.props;

    return (
      <div className="dropzone dropzone--multiple">
        <Dropzone
          className="dropzone__input"
          accept="image/jpeg, image/png"
          name={name}
          onDrop={this.onDrop}
        >
          {({ getRootProps, getInputProps, isDragActive }) => (
            <div
              {...getRootProps()}
              className={classNames('dropzone', { 'dropzone-active': isDragActive })}
            >
              <input {...getInputProps()} />
              <div className="dropzone__drop-here"><span className="lnr lnr-upload" />
                Drop files here to upload
              </div>
            </div>
          )}
        </Dropzone>
        {files && Array.isArray(files) && (
          <Row className="dropzone__imgs-wrapper p-3 mb-3">
            {files.map((file, i) => (
              <Col xl={2} key={i}>
                <img src={URL.createObjectURL(file)} alt={file.name} />
              </Col>
            ))}
          </Row>
        )}
      </div>
    );
  }
}

const renderDropZoneMultipleField = props => (
  <DropZoneMultipleField
    {...props.input}
  />
);

renderDropZoneMultipleField.propTypes = {
  input: PropTypes.shape({
    onChange: PropTypes.func,
    name: PropTypes.string,
  }).isRequired,
};

export default renderDropZoneMultipleField;
