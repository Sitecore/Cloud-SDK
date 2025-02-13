@EnableClientDebug
Feature: Init CloudSDK client-side

    Scenario: Init search package without Events package enabled
        Given the '/init' page is loaded
        And the 'initSearchWithoutEvents' button is clicked
        Then an error is thrown: '[IE-0020] - This functionality also requires the "events" package. Import "@sitecore-cloudsdk/events/browser", then run ".addEvents()" on "CloudSDK", before ".initialize()"'

    Scenario: Init CloudSDK without addSearch and send a search event
        Given the '/init' page is loaded
        And the 'initCloudSDKWithoutAddSearch' button is clicked
        Then an error is thrown: '[IE-0018] You must first initialize the Cloud SDK and the "search" package. First, import "CloudSDK" from "@sitecore-cloudsdk/core/browser", and import "@sitecore-cloudsdk/search/browser". Then, run "CloudSDK().addEvents().addSearch().initialize()".'
        Then client: debug log is printed out in the console with message including 'CloudSDK was initialized with no packages'


    Scenario: Init search package and check if search object exists on the window
        Given the '/init' page is loaded
        And the 'initSearchWithEnableBrowserCookieTrue' button is clicked
        Then the scCloudSDK.search object is injected to the window object


    Scenario: Init without search package and check if search object does not exists on the window
        Given the '/init' page is loaded
        And the 'initWithoutSearch' button is clicked
        Then the scCloudSDK.search does not exist in the window object
