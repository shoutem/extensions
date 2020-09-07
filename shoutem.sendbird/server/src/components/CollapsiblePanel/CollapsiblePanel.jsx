import React, { Component } from 'react';
import { Panel } from 'react-bootstrap';
import autoBindReact from 'auto-bind/react';
import './style.scss';

export default class CollapsiblePanel extends Component {
  constructor(props) {
    super(props);

    autoBindReact(this);

    this.state = {
      collapsed: false,
    };
  }

  handleCollapse() {
    const { collapsed } = this.state;

    this.setState({ collapsed: !collapsed });
  }

  render() {
    const { collapsed } = this.state;
    const toggleClass = !collapsed ? 'panel-toggle' : 'panel-toggle-collapsed';

    return (
      <Panel className="panel-container" id="collapsible-panel-chat">
        <Panel.Heading className="panel-heading">
          <Panel.Title className="panel-title" toggle>
            SendBird/Shoutem Collaboration
          </Panel.Title>
          <Panel.Toggle className={toggleClass} componentClass="span" />
        </Panel.Heading>
        <Panel.Collapse onEntering={this.handleCollapse} onExiting={this.handleCollapse}>
          <Panel.Body className="panel-body">
            To make the chat in the Shoutem possible we are using a third party service - Sendbird.
            As of now, you can use the Sendbird based chat with your own Sendbirds subscription.
            Find the instructions below on how to activate the Sendbird chat for your Shoutem app.
            <br />
            <br />
            In order to make the chat feature cost effective, we will make possible for you to use
            the chat with no additional costs aside to Shoutem Professional plan subscription.
            <ul>
              <li>All Shoutem app owners will be able to use a shared Sendbird account.</li>
              <li>
                Each app will have a separate app space within that account
                and users will not be shared.
              </li>
              <li>
                That will enable us to introduce a “fair use” policy for those that do not have need
                for full blown chat service available with your own Sendbird subscription.
              </li>
            </ul>
            <br />
            Within the “fair use” policy, the use of the chat will be limited to 100 users per app.
            After that you will need to either buy more user space or upgrade to Sendbird.
            Please contact us if you have more questions about this.
          </Panel.Body>
        </Panel.Collapse>
      </Panel>
    );
  }
}
