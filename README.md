# Introduction
This repository shows how a narrative produced in [Arria NLG Studio](https://app.studio.arria.com) can be presented in different mediums. Specifically, this code shows how the same narrative is able to generate text for both Amazon Alexa and a web UI. 

The narrative itself is a simple report that describes how a currency is doing against other major currencies today. The data for this is extracted from the [Fixer.io](https://fixer.io/) api, which requires an API key. These are free if you use fewer than 1000 API calls a month.   

This project was used as part of the [Index 2018](https://developer.ibm.com/indexconf/) conference.

# Usage

## Deploying Narratives with NLG Studio

The basis of this project is an [NLG Studio](https://app.studio.arria.com) project that takes in currency data and returns a short narrative. You will need to deploy this project so that it can be accessed as a RESTful service.

To begin, log in to NLG Studio at <https://app.studio.arria.com>. If you haven't signed up yet, click **Don't Have an Account** and follow the instructions. The validation email can take a few minutes to come through.

Rather than creating the whole project from scratch, you'll import a pre-built Studio project. The file to load is in the git repository at `studio/ExchangeRates.json`. Click the **Import a Project** icon, which is next to the **New project** button. 

<p align="center">
  <img width="800"  src="readme_images/import_project.png">
</p>

Once you have imported the project, click it to open it. 

The purpose of NLG Studio is to build an NLG application using scripts. This application can then be hosted on the Arria cloud, allowing you to post data to it and retrieve a corresponding narrative. 

To deploy your Studio application on the cloud, click **Publish** at the top right. When you see the Congratulations dialog, copy down the application's URL.

<p align="center">
  <img width="800"  src="readme_images/publish.png">
</p>

Your project is now hosted at the URL in the dialog. If you forget the URL (or make changes to the project) you can republish at any time. Republishing updates your existing URL.

To access that URL, you will also need an API key for authentication. You generate this key in the Settings view Selecting the **API** submenu, then click **GENERATE API KEY**. 

<p align="center">
  <img width="800"  src="readme_images/api_key.png">
</p>

You can now call your Studio project using that URL and API key. You will need them both when you set up the back end server.  

## Configuring the Back End

To connect the NLG Studio endpoint to the data, we are going to use a simple node.js back end. This server has endpoints that allow both Alexa and a Web App to generate output.

The server is controlled through a file called `server/config.js`, which you need to create. This file contains the URLs and API keys that are specific to your personal deployment. We have created an example file called `server/EXAMPLEconfig.js`.

From the server folder, copy the example file to config.js, e.g.
`cp EXAMPLEconfig.js config.js`

Next open this file and fill in the API key and URL for your NLG Studio project from [above](#deploying-narratives-with-nlg-studio).

To load the data you will need an API key from [Fixer.io](https://fixer.io/). Visit the site and sign up for an account (you can choose either a paid account or a free account). When you have signed up you can access your API key on the [dashboard](https://fixer.io/dashboard). Add that API key to your config.js file.

Once these values are added in, your server is able to generate text.
 
## Running the Web App

The quickest way to test your setup is to launch the server as a [node.js](https://nodejs.org/en/download/) webapp.

If you have node installed on your machine, run `npm install` from the server directory. This will download the dependencies for the web app. Next, launch the app using:
`node app.js`

The app.js script will run the webapp on port 3000, so you should be able to visit <http://localhost:3000/> to see how it behaves. Try pressing submit to get a narrative that looks something like this:
<p align="center">
  <img width="800"  src="readme_images/report.png">
</p>

If you don't have a config.js file, it will declare that it "Cannot find module './config'". If you have the file but haven't added your credentials, the app will show an error message describing which service as an issue.

The app also has separate pages showing how applications can be built up using different presentation techniques:
- [DataView](http://localhost:3000/dataView.html) just displays the raw data in a table
- [AnalysisView](http://localhost:3000/analysisView.html) shows the analysed in a table
- [VisualisationView](http://localhost:3000/visualizationView.html) adds a chart representing the data
- [TextView](http://localhost:3000/textView.html) uses our NLG Studio to explain exactly what is going on

## Launching the Alexa Skill

# How It Works

# Support
For any help on how to build projects using NLG Studio please contact us at support@arrianlg.studio

This project has been built for demonstrative purposes only, it is not designed as a complete application. 
