// Test for the ProfileActivities
import React from 'react';
import { StaticRouter } from 'react-router-dom';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import ProfileActivities from '../components/ProfileActivities';

describe('<ProfileActivities />', () => {
    it('renders correctly without crashing', () => {
        // Memory router needed for DOM nesting behavior
        const context = {};
        const component = shallow(<StaticRouter location="/" context={context}> <ProfileActivities /> </StaticRouter>);
        expect(toJson(component, { noKey: true })).toMatchSnapshot();
    });
});
