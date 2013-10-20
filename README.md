stealth-whale
=============

German Whale of Mystery, for Baltimore Indie Game Jam 2013

## Dev setup

1. Clone the repo.

2. Install NodeJS.

###OSX/Linux

```bash
sudo npm install -g grunt-cli bower
npm install
bower install
```

###Windows

In an administrator command prompt:

`npm install -g grunt-cli bower`

Then, in a non-admin cmd:

```
npm install
bower install
```

## Building

Compilation tasks are triggered by Grunt. To test and build, just type `grunt` from the project root.

Unit tests get dropped in `test/specs`; the test harness will pick them all up.
