import { useCallback, useEffect, useMemo, useState } from 'react';
import _ from 'lodash';
import { PreviewBuilder } from '../services';

export function useFormPreview({ schema, values, hideEmptyFields }) {
  const [data, setData] = useState({});

  const memoizedSchema = useMemo(() => schema, [schema]);
  const memoizedValues = useMemo(() => values, [values]);

  const setPreviewData = useCallback(() => {
    const initialData = _.reduce(
      memoizedSchema,
      (result, field, key) => ({
        ...result,
        [key]: {
          ...field,
          controlName: key,
          value: memoizedValues[key],
        },
      }),
      [],
    );

    return setData(initialData);
  }, [memoizedValues, memoizedSchema]);

  useEffect(() => {
    setPreviewData();
  }, [setPreviewData]);

  const hiddenFields = useMemo(() => {
    const schemaKeys = _.keys(memoizedSchema);

    return _.filter(schemaKeys, schemaKey => {
      return _.isEmpty(memoizedValues?.[schemaKey]);
    });
  }, [memoizedSchema, memoizedValues]);

  function renderPreview() {
    const sortedData = _.sortBy(data, 'displayPriority');

    // Remove empty fields if that field was passed inside hiddenFields array
    const resolvedSortedData = hideEmptyFields
      ? _.filter(
          sortedData,
          field => !_.includes(hiddenFields, field.controlName),
        )
      : sortedData;

    return _.map(resolvedSortedData, data =>
      PreviewBuilder.mapDataToPreview(data),
    );
  }

  return {
    renderPreview,
  };
}
