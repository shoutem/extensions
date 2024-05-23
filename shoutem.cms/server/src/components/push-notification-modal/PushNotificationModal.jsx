import React, { Component } from 'react';
import {
  Button,
  ControlLabel,
  FormControl,
  FormGroup,
  HelpBlock,
  Modal,
} from 'react-bootstrap';
import autoBindReact from 'auto-bind/react';
import i18next from 'i18next';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { getSchemaPropertyTitle } from '@shoutem/cms-dashboard';
import { LoaderContainer, MultiselectDropdown } from '@shoutem/react-web-ui';
import LOCALIZATION from './localization';

const TITLE_LIMIT = 255;
const MESSAGE_LIMIT = 2000;

function createLanguageOptions(languages) {
  if (_.isEmpty(languages)) {
    return [];
  }

  return _.reduce(
    languages,
    (result, item) => {
      const value = _.toString(_.get(item, 'id'));
      const label = _.get(item, 'name');

      if (value && label) {
        result.push({ value, label });
      }

      return result;
    },
    [],
  );
}

function resolveIsMultilanguage(languages) {
  const enabledLanguages = _.filter(languages, { disabled: false });
  if (enabledLanguages.length > 1) {
    return true;
  }

  return false;
}

export default class PushNotificationModal extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);

    this.state = {
      title: null,
      message: null,
      isMultilanguage: false,
      channelIds: [],
      languageOptions: [],
      show: false,
      inProgress: false,
      error: null,
    };
  }

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  show(options) {
    const { schema, languages } = this.props;
    const { show } = this.state;

    if (show) {
      return;
    }

    // merge options and props
    const finalOptions = {
      ...this.props,
      ...options,
    };

    const titleProperty = getSchemaPropertyTitle(schema);
    const title = _.get(finalOptions.resource, titleProperty);

    const isMultilanguage = resolveIsMultilanguage(languages);
    const languageOptions = createLanguageOptions(languages);

    const channels = _.get(finalOptions.resource, 'channels');
    const channelIds = _.map(channels, 'id');

    this.setState({
      error: null,
      show: true,
      title,
      message: title,
      isMultilanguage,
      languageOptions,
      channelIds,
      ...finalOptions,
    });
  }

  hide() {
    if (this.mounted) {
      this.setState({
        inProgress: false,
        show: false,
        title: null,
        message: null,
        channelIds: [],
        languageOptions: [],
      });
    }
  }

  resolveNotification() {
    const { shortcut } = this.props;
    const { title, message, resource } = this.state;

    const resolvedTitle = _.truncate(title, {
      length: TITLE_LIMIT,
    });
    const resolvedMessage = _.truncate(message, {
      length: MESSAGE_LIMIT,
    });

    const action = {
      action: {
        type: 'shoutem.application.EXECUTE_SHORTCUT',
        navigationAction: 'shoutem.navigation.OPEN_MODAL',
        shortcutId: shortcut.key,
        itemId: _.get(resource, 'id'),
        itemSchema: _.get(resource, 'type'),
      },
    };

    const notification = {
      type: 'Cms',
      delivery: 'now',
      content: {
        title: resolvedTitle,
        summary: resolvedMessage,
        body: JSON.stringify(action),
      },
    };

    return notification;
  }

  async handleCreateNotification(notification) {
    const { languages, createPushNotification } = this.props;
    const { resource, isMultilanguage } = this.state;

    // send broadcast
    if (!isMultilanguage) {
      const broadcastNotification = _.cloneDeep(notification);
      _.set(broadcastNotification, 'audience.type', 'broadcast');

      await createPushNotification(broadcastNotification);
      return;
    }

    // send for specific language
    if (isMultilanguage) {
      const promises = [];
      const channels = _.get(resource, 'channels');

      _.forEach(languages, language => {
        const channel = _.find(channels, item => {
          // needs to be == as channels are numbers and json api is returing as string
          // eslint-disable-next-line eqeqeq
          return item.id == language.id;
        });

        if (!language.disabled && !!channel) {
          const topicName = `languages.${language.id}`;
          const topicNotification = _.cloneDeep(notification);

          _.set(topicNotification, 'audience.type', 'topic');
          _.set(topicNotification, 'audience.topicName', topicName);

          promises.push(createPushNotification(topicNotification));
        }
      });

      await Promise.all(promises);
    }
  }

  handleAbort() {
    const { onAbort } = this.state;

    if (!onAbort) {
      this.hide();
      return;
    }

    onAbort();
    this.hide();
  }

  handleTitleChange(event) {
    const title = _.get(event, 'target.value');
    this.setState({ title });
  }

  handleMessageChange(event) {
    const message = _.get(event, 'target.value');
    this.setState({ message });
  }

  async handleSendPush() {
    const notification = this.resolveNotification();

    this.setState({ inProgress: true });

    try {
      await this.handleCreateNotification(notification);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);

      this.setState({
        inProgress: false,
        error: i18next.t(LOCALIZATION.GENERIC_ERROR),
      });

      return;
    }

    this.hide();
  }

  render() {
    const {
      show,
      error,
      inProgress,
      title,
      message,
      isMultilanguage,
      languageOptions,
      channelIds,
    } = this.state;

    return (
      <Modal
        dialogClassName="confirm-modal"
        onHide={this.handleAbort}
        show={show}
      >
        <Modal.Header>
          <Modal.Title>{i18next.t(LOCALIZATION.MODAL_TITLE)}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isMultilanguage && (
            <FormGroup controlId="languages">
              <ControlLabel>
                {i18next.t(LOCALIZATION.FORM_LANGUAGES)}
              </ControlLabel>
              <MultiselectDropdown
                disabled
                displayLabelMaxSelectedOptions={5}
                options={languageOptions}
                selectedValues={channelIds}
              />
            </FormGroup>
          )}
          <FormGroup controlId="title">
            <ControlLabel>{i18next.t(LOCALIZATION.FORM_TITLE)}</ControlLabel>
            <FormControl
              maxLength={TITLE_LIMIT}
              value={title}
              onChange={this.handleTitleChange}
            />
          </FormGroup>
          <FormGroup controlId="message">
            <ControlLabel>{i18next.t(LOCALIZATION.FORM_MESSAGE)}</ControlLabel>
            <FormControl
              componentClass="textarea"
              maxLength={MESSAGE_LIMIT}
              value={message}
              onChange={this.handleMessageChange}
            />
          </FormGroup>
          {error && (
            <div className="has-error">
              <HelpBlock>{error}</HelpBlock>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.handleAbort}>
            {i18next.t(LOCALIZATION.BUTTON_CANCEL)}
          </Button>
          <Button bsStyle="primary" onClick={this.handleSendPush}>
            <LoaderContainer isLoading={inProgress}>
              {i18next.t(LOCALIZATION.BUTTON_SEND)}
            </LoaderContainer>
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

PushNotificationModal.propTypes = {
  createPushNotification: PropTypes.func.isRequired,
  languages: PropTypes.array.isRequired,
  schema: PropTypes.object.isRequired,
  shortcut: PropTypes.object.isRequired,
};
