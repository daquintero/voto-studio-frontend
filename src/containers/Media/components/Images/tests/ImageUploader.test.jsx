// Test for the ImageUploader
import React from 'react';
import { StaticRouter } from 'react-router-dom';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import ImageUploader from '../components/ImageUploader';

describe('<ImageUploader />', () => {
  it('renders correctly without crashing', () => {
    // Memory router needed for DOM nesting behavior
    const context = {};
    const component = shallow(<StaticRouter location="/" context={context}> <ImageUploader /> </StaticRouter>);
    expect(toJson(component, { noKey: true })).toMatchSnapshot();
  });
});
