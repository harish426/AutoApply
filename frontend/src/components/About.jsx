import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import './About.css';

const founders = [
    {
        name: 'Harish Jamallamudi',
        email: 'harishjamallamudi426@gmail.com',
        info: 'Visionary leader and driving force behind our company.',
        photoUrl: 'https://via.placeholder.com/150'
    },
    {
        name: 'Dushyanth Kumar Reddy',
        email: '',
        info: 'The technical architect and mastermind of our innovative solutions.',
        photoUrl: 'https://via.placeholder.com/150'
    },
    {
        name: 'Balasubramanyam Bokka',
        email: '',
        info: 'The strategic thinker who ensures our business goals are met.',
        photoUrl: 'https://via.placeholder.com/150'
    }
];

const About = () => {
    return (
        <div className="about-container">
            <div className="about-header">
                <h2>Meet Our Founders</h2>
                <p>The innovative minds behind our success.</p>
            </div>
            <Tabs>
                <TabList>
                    {founders.map((founder, index) => (
                        <Tab key={index}>{founder.name}</Tab>
                    ))}
                </TabList>

                {founders.map((founder, index) => (
                    <TabPanel key={index}>
                        <div className="founder-info">
                            <img src={founder.photoUrl} alt={founder.name} className="founder-photo" />
                            <h3>{founder.name}</h3>
                            {founder.email && <p className="founder-email">{founder.email}</p>}
                            <p className="founder-bio">{founder.info}</p>
                        </div>
                    </TabPanel>
                ))}
            </Tabs>
        </div>
    );
};

export default About;
