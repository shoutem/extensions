import React from 'react';
import { Alert, Linking } from 'react-native';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Button, Screen, ScrollView, Text } from '@shoutem/ui';
import { CmsListScreen } from 'shoutem.cms';
import { I18n } from 'shoutem.i18n';
import { getRouteParams, navigateTo } from 'shoutem.navigation';
import { Checklist, ChecklistNavBarButton } from '../components';
import { ext } from '../const';
import {
  getChecklists,
  getChecklistStatuses,
  getSubmittedChecklists,
  setChecklistStatuses,
  submitChecklist,
} from '../redux';

export class ChecklistScreen extends CmsListScreen {
  static propTypes = {
    ...CmsListScreen.propTypes,
    // An object showing the boolean statuses of individual checklist items
    // for each checklist. Defaults to {}.
    checklistStatuses: PropTypes.object,
    setChecklistStatuses: PropTypes.func,
    submitChecklist: PropTypes.func,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);

    this.state = {
      hasChanges: false,
      schema: ext('checklists'),
      statuses: props.checklistStatuses,
    };
  }

  getNavBarProps() {
    const { contactEmail, isSubmitted } = this.props;

    return {
      headerRight: () => (
        <ChecklistNavBarButton
          contactEmail={contactEmail}
          isSubmitted={isSubmitted}
          onContactPress={this.handleHelpPress}
          onSubmitPress={this.handleSubmit}
        />
      ),
    };
  }

  handleHelpPress() {
    const { contactEmail } = this.props;

    Linking.openURL(`mailto:${contactEmail}`);
  }

  handleItemChange(checklistId, itemIndex, itemStatus) {
    const { statuses } = this.state;

    const updatedStatuses = {
      ...statuses,
      [checklistId]: {
        ...statuses[checklistId],
        [itemIndex]: itemStatus,
      },
    };

    this.setState({ hasChanges: true, statuses: updatedStatuses });
  }

  handleSubmit() {
    this.saveProgress();

    Alert.alert(
      I18n.t(ext('submitAlertTitle')),
      I18n.t(ext('submitAlertMessage')),
      [
        {
          text: I18n.t(ext('submitAlertCancel')),
        },
        {
          onPress: this.submitProgress,
          text: I18n.t(ext('submitAlertAccept')),
        },
      ],
      { cancelable: false },
    );
  }

  saveProgress() {
    const { setChecklistStatuses, shortcutId } = this.props;
    const { statuses } = this.state;

    setChecklistStatuses(statuses, shortcutId);
    this.setState({ hasChanges: false });
  }

  submitProgress() {
    const { hasSubmitMessageScreen, submitChecklist } = this.props;
    const {
      shortcut: { id },
    } = getRouteParams(this.props);

    submitChecklist(id);

    if (hasSubmitMessageScreen) {
      navigateTo(ext('SubmitMessageScreen'), { shortcutId: id });
    }
  }

  render() {
    const { data, isSubmitted, style } = this.props;
    const { hasChanges, statuses } = this.state;

    const contentContainerStyle = isSubmitted ? {} : style.scrollViewContainer;
    const saveButtonTextStyle =
      hasChanges && !isSubmitted
        ? style.saveButtonText
        : style.disabledSaveButtonText;

    return (
      <Screen>
        <ScrollView
          contentContainerStyle={contentContainerStyle}
          endFillColor={style.endFillColor}
        >
          {data &&
            data.map(checklist => (
              <Checklist
                checklist={checklist}
                checklistStatus={statuses[checklist.id] || {}}
                disabled={isSubmitted}
                key={checklist.id}
                onItemToggle={this.handleItemChange}
              />
            ))}
        </ScrollView>
        {!isSubmitted && (
          <Button
            disabled={!hasChanges || isSubmitted}
            onPress={this.saveProgress}
            style={style.saveButton}
          >
            <Text style={saveButtonTextStyle}>
              {I18n.t(ext('saveProgressButton'))}
            </Text>
          </Button>
        )}
      </Screen>
    );
  }
}

export const mapStateToProps = (state, ownProps) => {
  const submittedChecklists = getSubmittedChecklists(state);
  const { shortcut } = getRouteParams(ownProps);
  const isSubmitted = submittedChecklists.includes(shortcut.id);
  const settings = shortcut?.settings || {};
  const { contactEmail = '', hasSubmitMessageScreen = false } = settings;

  return {
    ...CmsListScreen.createMapStateToProps(getChecklists)(state, ownProps),
    contactEmail,
    checklistStatuses: getChecklistStatuses(state),
    hasSubmitMessageScreen,
    isSubmitted,
    shortcutId: shortcut.id,
  };
};

export const mapDispatchToProps = CmsListScreen.createMapDispatchToProps({
  setChecklistStatuses,
  submitChecklist,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectStyle(ext('ChecklistScreen'))(ChecklistScreen));
