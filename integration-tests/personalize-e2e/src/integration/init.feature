Feature: Edge Proxy sitecoreEdgeContextId , siteName, sitecoreEdgeUrl settings in init function

    Scenario: Developer sets staging sitecoreEdgeUrl and contextID on the browser on personalize page
        Given the '/init' page is loaded without init function
        When the 'initDifferentSitecoreEdgesitecoreEdgeUrl' button is clicked
        Then the request is sent with staging url
        And no error is thrown
        And a cookie exists on the page with the respective 'test' environment contextId

    Scenario Outline: Developer sets invalid siteName parameter for initialization settings on the browser
        Given the '<page>' page is loaded without init function
        When the '<button>' button is clicked
        Then an error is thrown: '<error>'

        Examples:
            | page  | button                | error                             |
            | /init | initInvalidSiteName   | [MV-0002] "siteName" is required. |
            | /init | initUndefinedSiteName | [MV-0002] "siteName" is required. |

    Scenario Outline: Developer sets invalid sitecoreEdgeContextId parameter for initialization settings on the browser
        Given the '<page>' page is loaded without init function
        When the '<button>' button is clicked
        Then an error is thrown: '<error>'

        Examples:
            | page  | button                             | error                                          |
            | /init | initInvalidSitecoreEdgeContextId   | [MV-0001] "sitecoreEdgeContextId" is required. |
            | /init | initUndefinedSitecoreEdgeContextId | [MV-0001] "sitecoreEdgeContextId" is required. |


    Scenario Outline: Developer sets invalid sitecoreEdgeUrl parameter for initialization settings on the browser
        Given the '<page>' page is loaded without init function
        When the '<button>' button is clicked
        Then an error is thrown: '<error>'

        Examples:
            | page  | button                                     | error                                                                                 |
            | /init | initInvalidSitecoreEdgesitecoreEdgeUrl     | [IV-0001] Incorrect value for "sitecoreEdgeUrl". Set the value to a valid URL string. |
            | /init | initEmptyStringSitecoreEdgesitecoreEdgeUrl | [IV-0001] Incorrect value for "sitecoreEdgeUrl". Set the value to a valid URL string. |

    Scenario Outline: Developer sets valid parameters for Initialization settings on the browser
        Given the '/init' page is loaded without init function
        When the 'initHappyPath' button is clicked
        Then no error is thrown

    Scenario: Init CloudSDK without addPersonalize and call the personalize function
        Given the '/init' page is loaded without init function
        And the 'initCloudSDKWithoutAddPersonalize' button is clicked
        Then an error is thrown: '[IE-0016] You must first initialize the Cloud SDK and the "personalize" package. First, import "CloudSDK" from "@sitecore-cloudsdk/core/browser" and import "@sitecore-cloudsdk/personalize/browser". Then, run "CloudSDK().addPersonalize().initialize()".'

    # NOTE: This test is manually tested. Due to complications with writing to error.txt it wasn't straightforward to get the error message in automated way  .
    # Scenario: Developer calls the new CloudSDK from Middleware without addPersonalize and calls the personalize function
    #     Given the '/init' page is loaded with 'testID' name and 'initFromMiddlewareWithoutAddPersonalize' value query parameter
    #     Then an error is thrown: '[IE-0017] You must first initialize the Cloud SDK and the "personalize" package. First, import "CloudSDK" from "@sitecore-cloudsdk/core/server", and import "@sitecore-cloudsdk/personalize/server". Then, run "await CloudSDK().addPersonalize().initialize()"'

    Scenario: Developer calls the init from browser when no window is present (middleware)
        Given the '/init' page is loaded with 'testID' name and 'initFromMiddlewareWithBrowserInit' value query parameter
        Then an error is thrown: '[IE-0001] You are trying to run a browser-side function on the server side. On the server side, run the server-side equivalent of the function, available in "server" modules.'

