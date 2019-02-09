// Test for the PublishModal
import React from 'react';
import { StaticRouter } from 'react-router-dom';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import PublishModal from '../PublishModal';

describe('<PublishModal />', () => {
  it('renders correctly without crashing', () => {
    // Memory router needed for DOM nesting behavior
    const context = {};
    const component = shallow(<StaticRouter location="/" context={context}> <PublishModal /> </StaticRouter>);
    expect(toJson(component, { noKey: true })).toMatchSnapshot();
  });
});
