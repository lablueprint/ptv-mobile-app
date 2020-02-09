# PTV Mobile App

Mobile app for PTV to display resource listings, message forum, and a calendar of events.

## Get started

### Set up your environment

Follow the offical React Native guide: https://facebook.github.io/react-native/docs/getting-started
- Choose React Native CLI instead of Expo CLI

Download Visual Studio Code, the editor most of us use.

Install git if you don't have it.


### Automatically lint your code with ESLint on VS Code

To more productively comply with our ESLint rules, we can underline the problem areas and enable autoformatting on save.

Install the ESLint plugin: https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint

Then add the following to your ```.vscode/settings.json``` (create it if it doesn't exist):

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

Add a git pre-commit hook to your ```.git/hooks``` folder. Ask a Project Lead how to do this.

### (Windows) Prevent git from converting LF to CRLF

Add the following line to the end of your ```.gitattributes``` (create it if it doesn't exist):

```
* text eol=lf
```
