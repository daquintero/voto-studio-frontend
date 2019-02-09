// Test for the RelatedContentTable
import React from 'react';
import { StaticRouter } from 'react-router-dom';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import RelatedContentTable from '../RelatedContentTable';

describe('<RelatedContentTable />', () => {
    it('renders correctly without crashing', () => {
        // Memory router needed for DOM nesting behavior
        const context = {};
        const component = shallow(<StaticRouter location="/" context={context}> <RelatedContentTable /> </StaticRouter>);
        expect(toJson(component, { noKey: true })).toMatchSnapshot();
    });
});
