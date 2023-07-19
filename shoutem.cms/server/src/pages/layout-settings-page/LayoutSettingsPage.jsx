import React, { useCallback, useMemo } from 'react';
import {
  Checkbox,
  Col,
  ControlLabel,
  Dropdown,
  FormGroup,
  MenuItem,
  Row,
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getShortcut } from 'environment';
import i18next from 'i18next';
import _ from 'lodash';
import { updateShortcut } from '../../actions';
import LOCALIZATION from './localization';
import './style.scss';

export default function LayoutSettingsPage() {
  const dispatch = useDispatch();

  const shortcut = useSelector(getShortcut);

  const pickerTypeLabel = useMemo(
    () => ({
      // Make sure to use keys exactly as they're defined in extension.json for translation to work
      dropdown: i18next.t(LOCALIZATION.INLINE_CATEGORY_PICKER_LABEL),
      navBarDropdown: i18next.t(LOCALIZATION.NAV_HEADER_CATEGORY_PICKER),
      horizontalList: i18next.t(
        LOCALIZATION.INLINE_HORIZONTAL_CATEGORY_PICKER_LABEL,
      ),
    }),
    [],
  );

  const selectedLayoutSettings = _.find(shortcut.screens, {
    canonicalType: shortcut.screen,
  })?.settings;

  const canHideModificationTimestamp =
    selectedLayoutSettings?.canHideModificationTimestamp;
  const hideModificationTimestamp =
    selectedLayoutSettings?.hideModificationTimestamp;

  const categoryPickerTypeOptions =
    selectedLayoutSettings?.categoryPickerTypeOptions || [];
  const selectedCategoryPickerType = selectedLayoutSettings?.categoryPickerType;

  const resolveLabel = useCallback(
    categoryPickerType => {
      return pickerTypeLabel[categoryPickerType] || '';
    },
    [pickerTypeLabel],
  );

  const handleOptionSelected = useCallback(
    selectedCategoryPickerType => {
      const newScreens = [...shortcut.screens];

      const selectedLayoutIndex = _.findIndex(newScreens, {
        canonicalType: shortcut.screen,
      });

      if (selectedLayoutIndex === 0) {
        newScreens[selectedLayoutIndex] = {
          ...newScreens[selectedLayoutIndex],
          settings: {
            ...newScreens[selectedLayoutIndex].settings,
            categoryPickerType: selectedCategoryPickerType,
          },
        };

        dispatch(
          updateShortcut({
            id: shortcut.id,
            attributes: {
              screens: newScreens,
            },
          }),
        );
      }
    },
    [dispatch, shortcut.id, shortcut.screen, shortcut.screens],
  );

  const handleHideTimestampToggle = useCallback(
    hideTimestamp => {
      const newScreens = [...shortcut.screens];

      const selectedLayoutIndex = _.findIndex(newScreens, {
        canonicalType: shortcut.screen,
      });

      if (selectedLayoutIndex === 0) {
        newScreens[selectedLayoutIndex] = {
          ...newScreens[selectedLayoutIndex],
          settings: {
            ...newScreens[selectedLayoutIndex].settings,
            hideModificationTimestamp: !hideModificationTimestamp,
          },
        };

        dispatch(
          updateShortcut({
            id: shortcut.id,
            attributes: {
              screens: newScreens,
            },
          }),
        );
      }
    },
    [
      dispatch,
      hideModificationTimestamp,
      shortcut.id,
      shortcut.screen,
      shortcut.screens,
    ],
  );

  return (
    <div className="general-settings">
      <h3>{i18next.t(LOCALIZATION.LAYOUT_SETTINGS_TITLE)}</h3>
      <form>
        <FormGroup>
          <Row>
            <Col md={12}>
              <ControlLabel>
                {i18next.t(LOCALIZATION.CATEGORY_PICKER_TYPE_LABEL)}
              </ControlLabel>
              <Dropdown onSelect={handleOptionSelected} className="block">
                <Dropdown.Toggle>
                  {resolveLabel(selectedCategoryPickerType)}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {categoryPickerTypeOptions.map(categoryPickerType => (
                    <MenuItem
                      key={categoryPickerType}
                      eventKey={categoryPickerType}
                    >
                      {resolveLabel(categoryPickerType)}
                    </MenuItem>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </Col>
          </Row>
          {!!canHideModificationTimestamp && (
            <Row>
              <Col md={12}>
                <Checkbox
                  className="layout__hide_timestamp"
                  checked={hideModificationTimestamp}
                  name="hideTimestamp"
                  onChange={handleHideTimestampToggle}
                >
                  {i18next.t(LOCALIZATION.HIDE_TIMESTAMP_LABEL)}
                </Checkbox>
              </Col>
            </Row>
          )}
        </FormGroup>
      </form>
    </div>
  );
}
