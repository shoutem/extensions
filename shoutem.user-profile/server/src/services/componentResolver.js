import { FormImagesPreview, FormTextInput } from '../components';
import {
  FIELD_FORMATS,
  FIELD_TYPES,
  FIELD_VARIANTS,
} from './schemaDefinitions';

export function resolveFormComponent(type, format, variant) {
  if (type === FIELD_TYPES.STRING && format === FIELD_FORMATS.STRING) {
    if (
      variant === FIELD_VARIANTS.SINGLE_LINE ||
      variant === FIELD_VARIANTS.MULTI_LINE
    ) {
      return {
        Component: FormTextInput,
        props: {
          defaultValue: '',
          variant,
          isMultiLine: variant === FIELD_VARIANTS.MULTI_LINE,
        },
      };
    }
  }

  if (type === FIELD_TYPES.IMAGE) {
    return {
      Component: FormImagesPreview,
      props: {
        defaultValue: [],
        variant: variant || FIELD_VARIANTS.RECTANGLE,
      },
    };
  }

  console.error(
    `No matching components found for given type: "${type}", format: "${format}" & variant: "${variant}"`,
  );

  return null;
}
