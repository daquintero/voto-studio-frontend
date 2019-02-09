// Test for the Map
import React from 'react';
import { StaticRouter } from 'react-router-dom';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import Map from '../index';

describe('<Map />', () => {
  it('renders correctly without crashing', () => {
    // Memory router needed for DOM nesting behavior
    const context = {};
    const component = shallow(<StaticRouter location="/" context={context}> <Map /> </StaticRouter>);
    expect(toJson(component, { noKey: true })).toMatchSnapshot();
  });
});
