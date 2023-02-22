# TotalTranslator
Management and translation tool of language resource files for Total.js. 

<img width="400" alt="Captura de pantalla 2023-02-09 a las 22 17 04" src="https://user-images.githubusercontent.com/57091288/217941162-ff0c4abe-8a18-433e-93c8-28706d44ec1c.png">

__Features__. 
- Require Total.js and PostgreSQL. 
- Translations saved on Database
- 183 languages already predefined ready to use
- 4 Online translators tools predefined
- Total.js resource files can be imported to defined app and language
- Translations can be combined between different applications
- TotalTranslator app language can be independent of OpenPlatform to improve linguistic work
- Translations are independent of the source application until they are published  


TotalTranslator can synchronize all the localization tags from code of your Total.js App, import your language resource files and merge translations from other already translated applications. 

Once the translations are complete TotalTranslator can directly update your application by inserting the resource file or you can save the file for manual use.

# 183 Languages
You can manage your translations throw 183 languages:

Good to know for languages:
  - Active: can be used to translations
  - Ready: can be used in app (production)

<img width="400" alt="Captura de pantalla 2023-02-09 a las 22 27 05" src="https://user-images.githubusercontent.com/57091288/217942938-0bda3e68-ee12-4225-8d42-a927ed3d582d.png">

__Good to know for translations__. 

You can configure external translators tools as Google, DeepL, Yandex and Libre. 
Google translator can be used without key, all others require a user key.

__Google translator know problems:__. 

- Translate only until dots
- Texts with format: # items, # item, # items cannot be translated

<img width="400" alt="Captura de pantalla 2023-02-09 a las 22 24 38" src="https://user-images.githubusercontent.com/57091288/217942568-08ae04de-0c84-4bd2-97b1-af8723493c0c.png">

__Instructions__:
- Require Total.js Framework (Better with Total.js OpenPlatform v5)
- Download source code
- Install NPM dependencies with `$ npm install`
- Run the app `$ node index.js`
- Register your local app in the OpenPlatform instance
- Visit the app in the OpenPlatform and set tokens in the `Configuration` section
- Copy module /totaltranslator.js (you can found in root path of this repository) in your modules folder into your app
- Add your app url in app section in TotalTranslator
- Copy url generated in Apps form to TotalTranslator module in your app
- Now you can sync/import your own resource and start to translate your app __faster and easier__ than ever
- When finish you can export as resource file or publish your resource direct to your app resources folder

<img width="400" alt="Captura de pantalla 2023-02-09 a las 22 46 15" src="https://user-images.githubusercontent.com/57091288/217946483-719d799b-1d52-4173-9f20-2609373f7606.png">

[license-image]: https://img.shields.io/badge/license-MIT-blue.svg?style=flat
[license-url]: license.txt
