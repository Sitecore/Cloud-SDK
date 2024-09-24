Feature: Init CloudSDK with all possible settings

    Scenario Outline: Developer sets invalid sitecoreEdgeContextId parameter for Initialization settings on the server
        Given the '<page>' page is loaded without init function
        Then the '<error>' string is printed in 'serverResponse' element

        Examples:
            | page                                                                                 | error                                          |
            | /init-events?serverSideTest=true&attribute=sitecoreEdgeContextId&variation=invalid   | [MV-0001] "sitecoreEdgeContextId" is required. |
            | /init-events?serverSideTest=true&attribute=sitecoreEdgeContextId&variation=undefined | [MV-0001] "sitecoreEdgeContextId" is required. |

    Scenario Outline: Developer sets invalid siteName parameter for Initialization settings on the server
        Given the '<page>' page is loaded without init function
        Then the '<error>' string is printed in 'serverResponse' element

        Examples:
            | page                                                                    | error                             |
            | /init-events?serverSideTest=true&attribute=siteName&variation=invalid   | [MV-0002] "siteName" is required. |
            | /init-events?serverSideTest=true&attribute=siteName&variation=undefined | [MV-0002] "siteName" is required. |

    Scenario Outline: Developer sets invalid sitecoreEdgeUrl parameter for Initialization settings on the server
        Given the '<page>' page is loaded without init function
        Then the '<error>' string is printed in 'serverResponse' element

        Examples:
            | page                                                                           | error                                                                                 |
            | /init-events?serverSideTest=true&attribute=sitecoreEdgeUrl&variation=invalid   | [IV-0001] Incorrect value for "sitecoreEdgeUrl". Set the value to a valid URL string. |
            | /init-events?serverSideTest=true&attribute=sitecoreEdgeUrl&variation=undefined | [IV-0001] Incorrect value for "sitecoreEdgeUrl". Set the value to a valid URL string. |

    Scenario: Developer sets an alternative sitecoreEdgeUrl and contextID for Events on the server
        Given the '/init-events?serverSideTest=true&attribute=sitecoreEdgeUrl&variation=valid' page is loaded without init function
        Then the 'no error' string is printed in 'serverResponse' element
        And a cookie exists on the page with the respective 'test' environment contextId

    Scenario: Developer sets an alternative sitecoreEdgeUrl and contextID on the browser event page
        Given the '/init-events' page is loaded without init function
        When the 'initDifferentSitecoreEdgesitecoreEdgeUrl' button is clicked
        Then the request is sent with staging url
        And no error is thrown
        And a cookie exists on the page with the respective 'test' environment contextId

    Scenario Outline: Developer sets invalid siteName parameter for initialization settings on the browser
        Given the '<page>' page is loaded without init function
        When the '<button>' button is clicked
        Then an error is thrown: '<error>'

        Examples:
            | page         | button                | error                             |
            | /init-events | initInvalidSiteName   | [MV-0002] "siteName" is required. |
            | /init-events | initUndefinedSiteName | [MV-0002] "siteName" is required. |

    Scenario Outline: Developer sets invalid sitecoreEdgeContextId parameter for initialization settings on the browser
        Given the '<page>' page is loaded without init function
        When the '<button>' button is clicked
        Then an error is thrown: '<error>'

        Examples:
            | page         | button                             | error                                          |
            | /init-events | initInvalidSitecoreEdgeContextId   | [MV-0001] "sitecoreEdgeContextId" is required. |
            | /init-events | initUndefinedSitecoreEdgeContextId | [MV-0001] "sitecoreEdgeContextId" is required. |

    Scenario Outline: Developer sets invalid sitecoreEdgeUrl parameter for initialization settings on the browser
        Given the '<page>' page is loaded without init function
        When the '<button>' button is clicked
        Then an error is thrown: '<error>'

        Examples:
            | page         | button                                     | error                                                                                 |
            | /init-events | initInvalidSitecoreEdgesitecoreEdgeUrl     | [IV-0001] Incorrect value for "sitecoreEdgeUrl". Set the value to a valid URL string. |
            | /init-events | initEmptyStringSitecoreEdgesitecoreEdgeUrl | [IV-0001] Incorrect value for "sitecoreEdgeUrl". Set the value to a valid URL string. |

    Scenario Outline: Developer sets valid parameters for Initialization settings on the browser
        Given the '/init-events' page is loaded without init function
        When the 'initHappyPath' button is clicked
        Then no error is thrown

    Scenario Outline: Developer sets valid parameters for Initialization settings on the server
        Given the '/init-events?serverSideTest=true' page is loaded without init function
        Then the 'no error' string is printed in 'serverResponse' element

    Scenario: Init CloudSDK without addEvents and send a pageView event
        Given the '/init-events' page is loaded without init function
        And the 'initCloudSDKWithoutAddEvents' button is clicked
        Then an error is thrown: '[IE-0014] You must first initialize the Cloud SDK and the "events" package. First, import "CloudSDK" from "@sitecore-cloudsdk/core/browser" and import "@sitecore-cloudsdk/events/browser". Then, run "CloudSDK().addEvents().initialize()".'
        Then debug log is printed out in the console with message including 'CloudSDK was initialized with no packages'

    @RestartServer-Middleware
    Scenario: Developer calls the new CloudSDK from Middleware without addEvents and sends pageView event
        Given the '/init-events' page is loaded with 'testID' name and 'initFromMiddlewareWithoutAddEvents' value query parameter
        Then an error is thrown: '[IE-0015] You must first initialize the Cloud SDK and the "events" package. First, import "CloudSDK" from "@sitecore-cloudsdk/core/server" and import "@sitecore-cloudsdk/events/server". Then, run "await CloudSDK().addEvents().initialize()".'
        And the request with id 'initFromMiddlewareWithoutAddEvents' will contain 'CloudSDK was initialized with no packages' log

    Scenario: Developer calls the init from browser when no window is present (middleware)
        Given the '/init-events' page is loaded with 'testID' name and 'initFromMiddlewareWithBrowserInit' value query parameter
        Then an error is thrown: '[IE-0001] You are trying to run a browser-side function on the server side. On the server side, run the server-side equivalent of the function, available in "server" modules.'


