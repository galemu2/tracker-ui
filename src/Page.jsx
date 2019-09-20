/* eslint-disable no-console */
import React from 'react';
import {
    Navbar, Nav, NavItem, NavDropdown,
    MenuItem, Glyphicon, Grid, Col,
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import Contents from './Contents.jsx';
import IssueAddNavItem from './IssueAddNavItem.jsx';
import Search from './Search.jsx';
import SignInNavItem from './SignInNavItem.jsx';
import UserContext from './UserContext.js';
import graphQLFetch from './graphQLFetch.js';
import store from './store.js';

function NavBar({ user, onUserChange }) {
    return (
        <Navbar fluid>
            <Navbar.Header>
                <Navbar.Brand>Issue Tracker</Navbar.Brand>
            </Navbar.Header>
            <Nav>
                <LinkContainer exact to="/">
                    <NavItem>Home</NavItem>
                </LinkContainer>
                <LinkContainer to="/issues">
                    <NavItem>Issue List</NavItem>
                </LinkContainer>
                <LinkContainer to="/report">
                    <NavItem>Report</NavItem>
                </LinkContainer>
            </Nav>
            <Col sm={5}>
                <Navbar.Form>
                    <Search />
                </Navbar.Form>
            </Col>
            <Nav pullRight>
                <IssueAddNavItem user={user} />
                <SignInNavItem user={user} onUserChange={onUserChange} />
                <NavDropdown
                    id="user-dropdown"
                    title={<Glyphicon glyph="option-vertical" />}
                    noCaret
                >
                    <LinkContainer to="/about">
                        <MenuItem>About</MenuItem>
                    </LinkContainer>
                </NavDropdown>
            </Nav>
        </Navbar>
    );
}

// TODO replace the linke to github repo
function Footer() {
    return (
        <small>
            <hr />
            <p className="text-center">
                Full source code avaiable at this
                {' '}
                <a target="_blank" rel="noopener noreferrer" href="http://google.com">&quot;place holder&quot;</a>
            </p>
        </small>
    );
}

export default class Page extends React.Component {
    static async fetchData(cookie) {
        const query = `query {user { 
            signedIn givenName
        }}`;
        const data = await graphQLFetch(query, null, null, cookie);
        console.log('fetchData(): ', JSON.stringify(data));
        return data;
    }

    constructor(props) {
        super(props);
        const user = store.userData ? store.userData.user : null;
        delete store.userData;
        this.state = { user };

        this.onUserChange = this.onUserChange.bind(this);
    }

    async componentDidMount() {
        const { user } = this.state;
        if (user == null) {
            const data = await Page.fetchData();
            this.setState({ user: data.user });
        }
    }

    onUserChange(user) {
        this.setState({ user });
        console.log('onUserChange(): ', JSON.stringify(user));
    }

    render() {
        const { user } = this.state;
        if (user == null) return null;
        return (
            <div>
                <NavBar user={user} onUserChange={this.onUserChange} />
                <Grid fluid>
                    <UserContext.Provider value={user}>
                        <Contents />
                    </UserContext.Provider>
                </Grid>
                <Footer />
            </div>
        );
    }
}
