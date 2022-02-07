import {
  FormInput,
  ImagesPreview,
  ImageUpload,
  SubmitButton,
  TextValue,
} from '../components';
import {
  FIELD_FORMATS,
  FIELD_TYPES,
  FIELD_VARIANTS,
} from './schemaDefinitions';

export const SUBMIT_BUTTON_COMPONENT = SubmitButton;

export function resolveFormComponent(type, format, variant) {
  if (type === FIELD_TYPES.STRING && format === FIELD_FORMATS.STRING) {
    if (variant === FIELD_VARIANTS.URL) {
      return {
        Component: FormInput,
        props: {
          defaultValue: '',
          variant,
        },
      };
    }

    return {
      Component: FormInput,
      props: {
        defaultValue: '',
        maxLength: variant === FIELD_VARIANTS.MULTI_LINE ? 140 : 40,
        multiline: variant === FIELD_VARIANTS.MULTI_LINE,
        variant: variant || FIELD_VARIANTS.SINGLE_LINE,
      },
    };
  }

  if (type === FIELD_TYPES.IMAGE) {
    return {
      Component: ImageUpload,
      props: {
        defaultValue: format === FIELD_FORMATS.IMAGE_ARRAY ? [] : '',
        variant: variant || FIELD_VARIANTS.RECTANGLE,
        maxItems: format === FIELD_FORMATS.IMAGE_ARRAY ? 5 : 1,
      },
    };
  }

  return null;
}

export function resolvePreviewComponent(type, format, variant) {
  if (type === FIELD_TYPES.STRING && format === FIELD_FORMATS.STRING) {
    if (variant === FIELD_VARIANTS.URL) {
      return {
        Component: TextValue,
        props: {
          defaultValue: '',
          variant,
          isLink: true,
        },
      };
    }

    return {
      Component: TextValue,
      props: {
        defaultValue: '',
        variant: variant || FIELD_VARIANTS.SINGLE_LINE,
      },
    };
  }

  if (type === FIELD_TYPES.IMAGE) {
    return {
      Component: ImagesPreview,
      props: {
        defaultValue: format === FIELD_FORMATS.IMAGE_ARRAY ? [] : '',
        variant: variant || FIELD_VARIANTS.RECTANGLE,
      },
    };
  }

  console.error(
    `No matching components found for given type: "${type}", format: "${format}" & variant: "${variant}"`,
  );

  return {};
}
