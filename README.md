[To Japanese Version README](README.ja.md)

# Url Capture

[![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/komiyamma.url-capture?color=4094ff)](https://marketplace.visualstudio.com/items?itemName=komiyamma.url-capture)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat)](LICENSE)
![Windows 10|11](https://img.shields.io/badge/Windows-_10_|_11-6479ff.svg?logo=windows&logoColor=white)

## Overview

This extension treats the selected text in the editor as a URL and saves a screenshot of that page as a .png file.
The screenshot is saved in the same folder as the file where the text was selected.

If the URL does not respond within 2.5 seconds, the save process will be aborted.

## Before Use

```
npm install -g puppeteer
```

Please run the above command before using this extension.

## Marketplace
Available at [url-cature](https://marketplace.visualstudio.com/items?itemName=komiyamma.url-capture).

## Change Log

### 0.9.4

Fixed an issue where the version badge was not reflected.

### 0.9.3

Updated the version of puppeteer, which fixed the issue where a "white screen" would appear during capture.

### 0.9.2

Changed the logo.

### 0.9.1

Added a note that
```
npm install -g puppeteer
```
is required.

### 0.9.0

Initial release.
