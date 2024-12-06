Feature: Init CloudSDK server-side

    @RestartServer-Middleware
    Scenario: Developer calls new init from Middleware without addSearch and tries to send an event
        Given the '/init' page is loaded with 'testID' name and 'initFromMiddlewareWithoutAddSearch' value query parameter
        Then an error is thrown: '[IE-0019] You must first initialize the Cloud SDK and the "search-api-client" package. First, import "CloudSDK" from "@sitecore-cloudsdk/core/server", and import "@sitecore-cloudsdk/search-api-client/server". Then, run "await CloudSDK().addEvents().addSearch().initialize()".'

    @RestartServer-Middleware
    Scenario: Developer calls new init from Middleware without Events package enabled
        Given the '/init' page is loaded with 'testID' name and 'initFromMiddlewareWithoutEvents' value query parameter
        Then an error is thrown: '[IE-0021] - This functionality also requires the "events" package. Import "@sitecore-cloudsdk/events/server", then run ".addEvents()" on "CloudSDK", before ".initialize()"'
