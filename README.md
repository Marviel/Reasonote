# Reasonote
_A monorepo for the Reasonote project_
## Usage
### 🏗 Initial Setup
1. Install [lerna](https://github.com/lerna/lerna): `yarn global add lerna`
1. Run `yarn bootstrap` to install all dependencies and setup monorepo symlinks using [lerna](https://github.com/lerna/lerna).

> ⚠ Savvy users may want to become familiar with the [`lerna bootstrap` command](https://github.com/lerna/lerna/tree/main/commands/bootstrap#readme), as it is what `yarn bootstrap` uses under the hood. `yarn bootstrap` will be used anytime you need to update inter-package dependencies, and as a "fixer" command for cases where imports aren't working. ⚠️

### 🏃‍♀️ Running Apps
Now you should be set to start running your apps.
1. Run `yarn start-[APP_FOLDER_NAME]` (i.e. `yarn start-app-frontend`) to start the development server for the app you would like to run. Available commands of this form are:

    - `yarn start-app-all`: _Runs all apps_
    - `yarn start-app-frontend`: _Runs app-frontend_
    - `yarn start-app-backend`: _Runs app-backend_
