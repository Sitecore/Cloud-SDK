Feature: Get Browser Id
    # Adding a sequence of 2 buttons
    # 1) Calls CloudSDK init
    # 2) Sets the browser init
    # this is becuase initializating and setting the browser id inmediatelly does not give the cookie to
    # be set.
    Scenario: Developer retrieves browser id using the corresponding method from the window and a cookie exists on the browser
        Given the '/get-browser-id' page is loaded
        When the "initCloudSDKWithEnableBrowserCookieTrue" button is clicked
        And the "getBrowserIdFromWindow" button is clicked
        Then the getBrowserId function returns the browser id

    Scenario: Developer retrieves browser id using the corresponding method from the window.scCloudSDK and a cookie exists on the browser
        Given the '/get-browser-id' page is loaded
        When the "initCloudSDKWithEnableBrowserCookieTrue" button is clicked
        And the "getBrowserIdFromCloudSDK" button is clicked
        Then the getBrowserId function returns the browser id

    Scenario: Developer retrieves browser id using the corresponding method from the window without initializing CloudSDK
        Given the '/get-browser-id' page is loaded
        And the "getBrowserIdFromWindow" button is clicked
        Then an error is thrown: '[IE-0008] You must first initialize the "core" package. Run the "init" function.'
