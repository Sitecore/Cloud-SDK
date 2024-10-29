@personalize
Feature: Developer uses web personalization

    Scenario: Developer initializes CloudSDK without web personalization
            Given the web personalization page is loaded
            When the 'initializeWithoutWebPersonalization' button is clicked
            Then web personalization settings are not injected to the window object
            And webExperiences are not loaded to DOM

    Scenario: Developer initializes CloudSDK with web personalization without events
        Given the web personalization page is loaded
        When the 'initializeWebPersonalizationWithoutEvents' button is clicked
        Then an error is thrown: '[IE-0020] - This functionality also requires the "events" package. Import "@sitecore-cloudsdk/events/browser", then run ".addEvents()" on "CloudSDK", before ".initialize()'

    Scenario: Developer initializes CloudSDK with providing settings to web personalization
        Given the web personalization page is loaded
        When the 'initializeWithProvidedWebPersonalization' button is clicked
        Then the provided settings are injected to the window object
            """
            {
                "scCloudSDK": {
                    "personalize": {
                        "settings": {
                            "async": false,
                            "defer": true
                        }
                    }
                }
            }
            """
        And user has access to events under personalize package via the window object
        And webExperiences are loaded to DOM

    Scenario: Developer initializes CloudSDK web personalization with the option set to true
        Given the web personalization page is loaded
        When the 'initializeWithWebPersonalization' button is clicked
        Then the provided settings are injected to the window object
            """
            {
                "scCloudSDK": {
                    "personalize": {
                        "settings": {
                            "async": true,
                            "defer": false
                        }
                    }
                }
            }
            """
        And webExperiences are loaded to DOM
        And user has access to events under personalize package via the window object

    Scenario: Developer initializes CloudSDK web personalization with the option set to empty object
        Given the web personalization page is loaded
        When the 'initializeWithDefaultWebPersonalization' button is clicked
        Then the provided settings are injected to the window object
            """
            {
                "scCloudSDK": {
                    "personalize": {
                        "settings": {
                            "async": true,
                            "defer": false
                        }
                    }
                }
            }
            """
        And user has access to events under personalize package via the window object