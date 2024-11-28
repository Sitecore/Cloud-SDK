
Feature: Init the events package

    @EnableClientDebug
    Scenario: Developer inits the events package from Browser
        Given the '/init' page is loaded
        And the 'sc_[sitecoreContextId]' domain cookie is not created
        When the 'initCloudSDKWithAddEvents' button is clicked
        Then the cookie is automatically set with the correct bid value for the user
        Then client: debug log is printed out in the console with message including 'eventsClient library initialized'
        Then the scCloudSDK.events object is injected to the window object

    @RestartServer-Middleware
    Scenario: Developer inits the events package from Middleware
        Given the 'sc_[sitecoreContextId]' domain cookie is not created
        When the '/init' page is loaded with 'testID' name and 'initCloudSDKFromMiddlewareWithAddEvents' value query parameter
        Then the cookie is automatically set with the correct bid value for the user
        And server: debug log is printed out in the console with message including 'eventsServer library initialized' from testID 'initFromMiddlewareWithEnableServerCookieTrue'

    @EnableClientDebug
    Scenario: Developer sends an event from Browser without initializing the events package first
        Given the '/init' page is loaded
        And the 'initCloudSDKWithoutAddEvents' button is clicked
        Then an error is thrown: '[IE-0014] You must first initialize the Cloud SDK and the "events" package. First, import "CloudSDK" from "@sitecore-cloudsdk/core/browser" and import "@sitecore-cloudsdk/events/browser". Then, run "CloudSDK().addEvents().initialize()".'
        Then client: debug log is printed out in the console with message including 'CloudSDK was initialized with no packages'
        Then the scCloudSDK.events does not exist in the window object

    @RestartServer-Middleware
    Scenario: Developer sends an event from Middleware without initializing the events package first
        Given the '/init' page is loaded with 'testID' name and 'initCloudSDKFromMiddlewareWithoutAddEvents' value query parameter
        Then an error is thrown: '[IE-0015] You must first initialize the Cloud SDK and the "events" package. First, import "CloudSDK" from "@sitecore-cloudsdk/core/server" and import "@sitecore-cloudsdk/events/server". Then, run "await CloudSDK().addEvents().initialize()".'

