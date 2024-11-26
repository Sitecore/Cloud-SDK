Feature: Init Cloudk SDK

    Scenario: Developer initializes CloudSDK core with enable browser cookie
        Given the '/init' page is loaded
        And the 'initCloudSDKWithEnableBrowserCookieTrue' button is clicked
        Then the core settings are injected to the window object
            """
            {
                "scCloudSDK": {
                    "core": {
                        "settings": {
                            "sitecoreEdgeContextId": "83d8199c-2837-4c29-a8ab-1bf234fea2d1",
                            "sitecoreEdgeUrl": "https://edge-platform.sitecorecloud.io"
                        }
                    }
                }
            }
            """
        And the cookie is automatically set with the correct bid value for the user

    Scenario: Init Cloud SDK package without Enable browser cookie
        Given the '/init' page is loaded
        And the 'initCloudSDKWithEnableBrowserCookieFalse' button is clicked
        Then the '<domain>' domain cookie is not created

    Scenario: Error is thrown if wrong context id is passed
        Given the '/init' page is loaded
        When the 'initCloudSDKWithInvalidContextId' button is clicked
        Then an error is thrown: '[IE-0003] Unable to set the "sc_{SitecoreEdgeContextId}" cookie because the browser ID could not be retrieved from the server. Make sure to set the correct values for "sitecoreEdgeContextId" and "siteName". If the issue persists, try again later or use try-catch blocks to handle this error.'

    Scenario: Cookie is created when an valid cookieDomain is given
        Given the '/init' page is loaded
        When the domain is: '<domain>'
        And the 'initCloudSDKWithEnableBrowserCookieTrue' button is clicked
        Then the '<domain>' domain cookie is created
        Examples:
            | domain    |
            | localhost |

    Scenario Outline: Cookies are not created when an invalid cookieDomain is given
        Given the '/init' page is loaded
        When the domain is: '<domain>'
        And the 'initCloudSDKWithEnableBrowserCookieTrue' button is clicked
        Then the '<domain>' domain cookie is not created

        Examples:
            | domain         |
            | 52214y4ry45    |
            | localhost/     |
            | test.localhost |
            | foo            |
            | /              |
