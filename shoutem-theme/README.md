Provides [themes](http://shoutem.github.io/docs/extensions/tutorials/writing-a-theme) support in Shoutem applications. Shoutem themes are regular Shoutem extensions that export one or more themes through their extension.json.

The application segment of a theme extension usually contains a theme file with RN styles. This file uses the styling syntax and rules defined by the [`@shoutem/theme`](https://github.com/shoutem/theme) library. Besides the style, the application segment may also contain custom layouts that will become available after the theme is installed.

The server segment may define theme variables schema that describes which theme variables exist and can be customized in the app builder. A settings page for customizing theme variables will be automatically generated from the theme variables schema.

## Base theme

The base theme is the default theme from the [`@shoutem/ui`](https://github.com/shoutem/ui). This theme defines the default styling and layout rules for all components from the Shoutem UI library. It is recommended to extend this theme when developing new themes. The base theme also defines many theme variables that serve as extension points for customizing it without the need to change any rules. Custom themes may expose any of those variables to end users, hide them (by providing defaults), or introduce new variables.

The base theme defines the rules for common UI components, custom themes should make sure that all those components continue to look and behave as expected when modifying style rules. Besides changing the look and feel of common components, custom themes may specify additional rules that target any custom or non-standard component combinations.

## Developing new themes

A theme style is created by defining a style generator function and exporting it from an extension. This function receives a set of theme variables, and it should return an object with the theme style. The returned style will become the only styling that is applied in the application, it will not be merged automatically with the base theme. This is intentional, to make sure that the developers have the greatest flexibility when creating new themes. It allows the developer to disregard the base theme, and implement something completely different.

With that said, the most common use case is to only override a subset of the rules from a theme. In those situations, it is recommended to import the base theme from the UI toolkit, and implement custom styling by overriding rules from that theme:
```
import { getTheme } from '@shoutem/ui';
import _ from 'lodash';

export default function getCustomTheme(variables) {
  return _.merge({}, getTheme(variables), {
    // Any custom rules
  });
}
```

We have also created an `Examples` component in the Shoutem UI toolkit. This component defines all the UI components from the Shoutem UI style guide. It is recommended to develop new themes by using the `Examples` component in order to make sure that all component variations from the style guide look good when the new theme is applied.

To summarize:
1. Create a new theme extensions
2. Import the theme from the UI toolkit
3. Merge any custom styles on top of the base theme
4. Make sure that all of the  style guide components look good with the new theme
