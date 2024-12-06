Feature: Return guestRef to the client requesting the getGuestId

    Scenario: Developer requests guest id using getGuestId
        Given the '/get-guest-id' page is loaded
        When the "initCloudSDKWithEnableBrowserCookieTrue" button is clicked
        And the "getGuestId" button is clicked
        Then the getGuestId function returns the guest id

    Scenario: Developer requests guest id using the window.scCloudSDK.core.getGuestId
        Given the '/get-guest-id' page is loaded
        When the "initCloudSDKWithEnableBrowserCookieTrue" button is clicked
        And the "getGuestIdFromCloudSDK" button is clicked
        Then the getGuestId function returns the guest id

    Scenario: Developer tries to get guest id without initializing CloudSDK
        Given the '/get-guest-id' page is loaded
        And the "getGuestId" button is clicked
        Then an error is thrown: '[IE-0012] You must first initialize the Cloud SDK. Import "CloudSDK" from "@sitecore-cloudsdk/core/browser", then run "CloudSDK().initialize()'
