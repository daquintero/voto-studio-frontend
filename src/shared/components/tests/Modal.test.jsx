// Test for the Model
import React from 'react';
import { StaticRouter } from 'react-router-dom';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import Model from '../Model';

describe('<Model />', () => {
    it('renders correctly without crashing', () => {
        // Memory router needed for DOM nesting behavior
        const context = {};
        const component = shallow(<StaticRouter location="/" context={context}> <Model /> </StaticRouter>);
        expect(toJson(component, { noKey: true })).toMatchSnapshot();
    });
});
