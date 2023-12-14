import React, { useCallback, useState } from 'react';
import { Col, ControlLabel } from 'react-bootstrap';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { DEFAULT_LOCALE } from 'src/const';
import { FontIcon } from '@shoutem/react-web-ui';
import TranslationRow from '../translation-row';
import './style.scss';

function getCategoryTranslation(categoryId, language, translations) {
  return _.get(translations, `${categoryId}.${language}`, '');
}

export default function TranslationTable({
  translation,
  translations,
  translateTo,
  onChange,
}) {
  const [expanded, setExpanded] = useState(false);

  const handleExpand = useCallback(() => {
    setExpanded(!expanded);
  }, [expanded]);

  const expandIcon = expanded ? 'sortarrowup' : 'sortarrowdown';

  return (
    <div key={translation.id}>
      <div className="screen-row" onClick={handleExpand}>
        <div>
          <div>{translation.title}</div>
          <div className="subtitle-container">
            (<span className="subtitle">{translation.subtitle}</span>)
          </div>
        </div>
        <div className="expand-button">
          <FontIcon name={expandIcon} size="14px" />
        </div>
      </div>
      {expanded && (
        <>
          <div className="translation-row">
            <Col xs={7}>
              <ControlLabel>{DEFAULT_LOCALE.label}</ControlLabel>
            </Col>
            <Col xs={5} className="no-padding">
              <ControlLabel>{translateTo.title}</ControlLabel>
            </Col>
          </div>
          {_.map(translation.categories, category => (
            <TranslationRow
              key={category.id}
              category={category}
              translation={getCategoryTranslation(
                category.id,
                translateTo.value,
                translations,
              )}
              languageCode={translateTo.value}
              onChange={onChange}
            />
          ))}
        </>
      )}
    </div>
  );
}

TranslationTable.propTypes = {
  translateTo: PropTypes.object.isRequired,
  translation: PropTypes.object.isRequired,
  translations: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
};
