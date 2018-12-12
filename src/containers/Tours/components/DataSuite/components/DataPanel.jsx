import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'reactstrap';

const DataPanel = ({ dataSuite, highlightFeature, editFeature }) => (
  <div className="data-suite__data-panel__wrapper">
    <Table responsive hover>
      <thead>
        <tr>
          <th>ID</th>
          <th>Type</th>
          <th># properties</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {dataSuite.openDataSet.data.features.map(feature => (
          <tr key={feature.id} onMouseEnter={() => highlightFeature(feature.id)}>
            <td>{feature.id}</td>
            <td>{feature.geometry.type}</td>
            <td>{feature.properties.length}</td>
            <td>
              <i
                className="fal fa-pen tours-panel__edit"
                role="presentation"
                onClick={() => editFeature(feature.id)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  </div>
);

DataPanel.propTypes = {
  dataSuite: PropTypes.instanceOf(Object).isRequired,
  highlightFeature: PropTypes.func.isRequired,
  editFeature: PropTypes.func.isRequired,
};

export default DataPanel;
