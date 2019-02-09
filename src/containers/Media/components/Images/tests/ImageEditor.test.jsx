// Test for the ImageEditor
import React from 'react';
import { StaticRouter } from 'react-router-dom';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import ImageEditor from '../components/ImageEditor';

describe('<ImageEditor />', () => {
  it('renders correctly without crashing', () => {
    // Memory router needed for DOM nesting behavior
    const context = {};
    const component = shallow(<StaticRouter location="/" context={context}> <ImageEditor /> </StaticRouter>);
    expect(toJson(component, { noKey: true })).toMatchSnapshot();
  });
});
