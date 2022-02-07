import React from 'react';
import PropTypes from 'prop-types';
import { ScrollView } from '@shoutem/ui';
import { useFormPreview } from '../hooks';

export default function DataPreview({ schema, values, hideEmptyFields }) {
  const formPreview = useFormPreview({ schema, values, hideEmptyFields });

  return <ScrollView>{formPreview.renderPreview()}</ScrollView>;
}

DataPreview.propTypes = {
  schema: PropTypes.object.isRequired,
  values: PropTypes.object.isRequired,
  hideEmptyFields: PropTypes.bool,
};

DataPreview.defaultProps = {
  hideEmptyFields: false,
};
