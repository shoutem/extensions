# Shoutem extensions
This repository contains all official Shoutem extensions. All of these extensions have to remain compatible with the new versions of the Shoutem core platform.

All directories in the root of this repository must represents extensions.

## Development process
The development process in this repository is based on the git flow branching model. To contribute to this repository, developers must open a feature branch. After a feature is developed, a pull request must be sent to at least one other developer. The reviewer is responsible for merging pull requests.

This repository contains multiple extensions, so each feature branch name should start with the name of the extension to make it easier to identify the extension that the pull request is affecting. Also, the pull request title should start with the name of the extension in the following format `[<extension-name>]`, e.g.: `[news] Add a details screen`. **Direct commits to develop or master branches are not allowed.**

## Testing & publishing extensions on Shoutem dev environment

All applications on Shoutem env are cloned from **Base app (2470)**. Base app can contains only published version of extension. Develop versions are not allowed.

1. After changes are merged to develop of this repository, the developer that merged those changes must push the latest version of the extension to the Shoutem development server using the Shoutem CLI (`shoutem push`).
2. When testing, developer should update extension to develop on his application.
3. Application should be successfully **previewed**
4. Application should be successfully **launched locally on iOS & Android**
5. When he is done with testing, he **should publish his extension and upgrade it on Base app**. 
6. Double check that Base app runs in preview & locally

# Technical overview

Shoutem extensions represent a complete self-contained functionality that can be easily integrated with the Shoutem builder, cloud, and mobile app. Each extension consists of two main segments: app, and server. The app segment contains the code that will be hosted in the Shoutem mobile app, and the server segment contains the code that will be hosted on the server-side. The both segments of the extension have a similar structure that is described below. The server segment may additionally define several concepts that are used to create Shoutem cloud resources (data schemeas, theme variables, etc.).

Besides those two segments, an extension also has an extension.json file that exports the features from an extension to the Shoutem platform. More information about the extension.json format can be found [here](http://shoutem.github.io/docs/extensions/reference/extension).

## App segment
The main interface between the app code from an extension and the rest of the app is through an index.js file contained in the root of the app directory. The app directory is an npm module, and this index.js file is its entry file. The index.js has several [predefined exports](http://shoutem.github.io/docs/extensions/reference/extension-exports), but you can also export anything else besides those exports. The additional exports are considered the public interface of an extension. Although you can import components/classes/etc. by directly targeting files within an extension, this is not recommended, and it should be avoided if possible. Instead, extensions should export everything that they wish to expose to other extensions from their index.js. For example, shared components, services, base screens, etc. are good examples of things that an extension may want to expose to other extensions.

### File structure
- assets - contains the assets that should be bundled in the application build
- components - contains custom React components
- redux - contains all redux concepts: reducers, selectors, action creators, middleware, etc.
  - `redux` may be a file in smaller extensions, or a directory with an index.js so that we can always import from 'redux'.
  - If the `redux` is a directory, then the files within it should be organized by feature, for example `drawer`, `tabBar` instead of `selectors`, `actionCreators`, etc.
  - The main extension reducer should be a default export by convention, everything else should be exported as named exports.
  - Name your `actionCreators` for network requests like this:
    - When you are doing GET request name it like `fetchResource` e.g. `fetchUsers`
    - When you are creating an item with a POST request, name it like `createResource` e.g. `createUser`
    - When you are patching some resource with PATCH request name it like `updateResource` e.g. `updateUser`
  - Your `selectors` should be named with `get` prefix and should have this signature `getResource(state)` e.g. `getUsers(state)`. 
- screens - contains the screens of the extension
- services - contains service classes or files with any custom business logic that the extension needs
- app.js - contains the lifecycle methods of the extension
- const.js - contains the `ext` function that returns the extension namespace, and any other constants
- index.js - main extension file, exposes everything to the rest of the app
- package.json - declares the extensions dependencies

### Sharing code between extensions
Often, multiple extensions solve a similar problem, for example news from Shoutem CMS, news from Wordpress, RSS news. The code can be shared between extensions in various ways. The preferred way is to have a primary extension that contains all the shared logic, and implement additional extensions that only contain the differences between the primary extension. In case of news, the `shoutem.news` contains the generic news layouts, while the `shoutem.news-rss`, `shoutem.news-wordpress`, etc. contain only the screens with different logic for fetching the data. Those screens reuse the components from the `shoutem.news` extension. In order for this to work, the shared components have to built in a way so that they don't depend on the format of the responses from the server. For example, instead of:
```
<ArticleListView article={article} />
```
we need to have something like this:
```
<ArticleListView
  title={article.title}
  subtitle={article.description}
  date={article.date}
/>
```

### Formatting Imports
Group imports in next fashion:

* Global imports
* Shoutem public libraries
* Imports from other extensions
* Local imports

Add whitespace between every group, but not between imports in the group.

### Architecture design

As is described in File structure your extension has **shortcuts** which point to some **screens** and at the and screens are made of **components**. Components should never connect to a redux state and should just depend on their own props. Also, try not to send bigger object that not represents view-model of a component as props. Saying that, if your extension in its settings contain some flag, and how view should be rendered depends on that flag, do not send the whole extension settings as a prop.
On the other hand **screens** should be designed that they could be navigated to from any other extension. So if your screen needs extension settings try to get them in **mapStateToProps** and extract that setting to the new prop.

## Server segment
The server segment contains settings pages that are organized similarly to the app segment of the extension.

// TODO: add more info here when it becomes available

Besides that, the server segment contains the data schemas that define the Shoutem cloud data types by using the JSON Schema format. When the extension is pushed to the Shoutem, those data types will automatically be created and become available to application owners.

When an extension contains a theme, the server part may also define the theme variables schema. This is a JSON Schema file that exposes certain customizable theme variables to the application owners. This file will be used to generate a form in the Shoutem builder that will allow application owners to customize the theme of the application, like fonts, colors, margins, etc.

## System extensions

Following extensions are considered system:

- Analytics
- Application
- CMS
- Code Push
- Favorites (remove when dependencies will be implemented, for Books)
- Firebase
- Layouts
- Google Analytics (remove when dependencies will be implemented, for Platform Analytics)
- Navigation
- Persist
- Platform Analytics
- Preview
- Push Notifications
- RSS (remove when dependencies will be implemented, for RSS videos and RSS news)
- Rubicon Theme
- Theme

# Open sourced extensions

When open sourcing new versions of extensions, just delete the following files and make a PR to [shoutem/extensions](github.com/shoutem/extensions):

```
- shoutem-arno-theme
- shoutem-platform-analytics
- shoutem-ui-examples
- README.md
```
