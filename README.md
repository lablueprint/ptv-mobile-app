# PTV Mobile App

Mobile app for PTV to display resource listings, message forum, and a calendar of events.

## Get started

### Set up your environment

Follow the offical React Native guide: https://facebook.github.io/react-native/docs/getting-started
- Choose React Native CLI instead of Expo CLI

Download Visual Studio Code, the editor most of us use.

Install git if you don't have it.

### Clone the repo

Download the code locally so that you can start working on it:

```git clone https://github.com/lablueprint/ptv-mobile-app.git```

Install all the dependencies in `package.json` with one command:

```npm install```

Open an Android emulator and run the code:

```npm run android```

If you'd like to build/run the app for iOS, run this code first to install iOS Podfile dependencies:

```cd ios/ && pod install --repo-update```

To run the app on an iOS emulator, run the code:

```cd .. && npx react-native run-ios```


At this point, if the code does not run on your emulator, come find your Project Lead!


### Work on a separate branch (IMPORTANT!)

Git lets you work on separate "branches" so that you don't end up stepping on each others toes. Here's how it works:
- The main code is on branch `master`. Do not modify this code!
- You make your changes on a separate branch:

  ```git checkout -b <name of your branch>```

  You can name it something like "forum post" if you're working on the forum post feature.

- You can verify what branch you are on:

  ```git branch```

  If you're on the wrong branch, just checkout the right one: 

  ```git checkout <name of your branch>```

- Make your changes! After you have made and tested your changes, commit them to your branch like so:

  See what files you've changed:

  ```git status```
  
  Choose all your modified files to add to the next commit:

  ```git add .```

  Finally, actually make the commit:

  ```git commit -m "<your message here>"```
  
  A good commit message should be short and make sense. See Twitterer's commit history for an example of commit messages: https://github.com/vfcheung/twitterer/commits/master

  Also because your Project Lead will be reviewing your code, **please make sure you commit small changes and commit often!!** Check out twitterer's commits for an example of a good commit size.

- Upload your commit to github and make a *pull request*. Ask your Project Lead how to do this. This will allow you to request your Project Lead to review your code before it gets *merged* into the `master` branch.


### Automatically lint your code with ESLint on VS Code

To more productively comply with our ESLint rules, we can underline the problem areas and enable autoformatting on save.

Install the ESLint plugin: https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint

Then add the following to your `.vscode/settings.json` (create it if it doesn't exist):

```json
{
  "javascript.format.enable": false,
  "eslint.run": "onType",
  "files.eol": "\n",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
}

```

If this file already exists and there's something in it, just add these settings to the end:

```json
{
  ...other settings

  "javascript.format.enable": false,
  "eslint.run": "onType",
  "files.eol": "\n",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
}
```

Then restart VS Code and now all your style issues will be automatically highlighted as you type and fixed when you save!

### Block commiting changes that do not comply with our ESLint rules

Add a git pre-commit hook to your `.git/hooks` folder. Ask a Project Lead how to do this.
