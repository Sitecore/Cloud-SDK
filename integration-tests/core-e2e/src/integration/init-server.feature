Feature: Developer is setting for the creation of a server-set cookie
    @RestartServer-Middleware
    Scenario: create a server site cookie when no cookie exists on a page from middleware
        Given no cookie is created on the '/init' page
        And the '/init' page is loaded with 'testID' name and 'createCookieFromMiddleware' value query parameter
        When server browser id cookie is created on the '/init-server' page
        Then the server cookies contain the browserID cookie returned from the API call

    # We need to take a decision on cookies on API to enable this test
    # Scenario: create a server site cookie when no cookie exists on a page from server
    #     Given no cookie is created on the '/init-server' page
    #     And the '/init-server' page is loaded
    #     And the 'initCloudSDKFromAPI' button is clicked
    #     When server browser id cookie is created on the '/init-server' page
    #     Then the server cookies contain the browserID cookie returned from the API call

    @RestartServer-Middleware
    Scenario: A cookie already exists on the page, enableServerCookie doesn't create a new cookie but updates TTL from middleware
        Given the '/init' page is loaded with 'testID' name and 'createCookieFromMiddlewareWithUpdatedTTL' value query parameter
        And server browser id cookie is created on the '/init' page
        When the '/init' page is reloaded with 'testID' name and 'createCookieFromMiddlewareWithUpdatedTTL' value query parameter
        Then the server updates the TTL of the browser id cookie according to the settings

    @RestartServer-Middleware
    Scenario: requests cookie from middleware with invalid timeout input
        Given the '/init' page is loaded with 'testID' name and 'createCookieFromMiddlewareWithWrongTimeout' value query parameter
        Then an error is thrown: '[IV-0006] Incorrect value for "timeout". Set the value to an integer greater than or equal to 0.'

    Scenario: requests cookie from api with invalid timeout input
        Given request to api '/init-server' with testID 'initCloudSDKFromAPIWithInvalidTimeout' will respond with the error '[IV-0006] Incorrect value for "timeout". Set the value to an integer greater than or equal to 0.'

    @RestartServer-Middleware
    Scenario: requests cookie from server using a small timeOut and EP fails to respond
        Given the '/init' page is loaded with 'testID' name and 'createCookieFromMiddlewareWithSmallTimeout' value query parameter
        Then an error is thrown: '[IE-0002] Timeout exceeded. The server did not respond within the allotted time.'

    Scenario: requests cookie from api with small timeout
        Given request to api '/init-server' with testID 'initCloudSDKFromAPIWithSmallTimeout' will respond with the error '[IE-0002] Timeout exceeded. The server did not respond within the allotted time.'
