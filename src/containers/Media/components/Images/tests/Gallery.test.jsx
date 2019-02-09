// Test for the Gallery
import React from 'react';
import { StaticRouter } from 'react-router-dom';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import Gallery from '../components/Gallery';

describe('<Gallery />', () => {
  it('renders correctly without crashing', () => {
    // Memory router needed for DOM nesting behavior
    const context = {};
    const component = shallow(<StaticRouter location="/" context={context}> <Gallery /> </StaticRouter>);
    expect(toJson(component, { noKey: true })).toMatchSnapshot();
  });
});
