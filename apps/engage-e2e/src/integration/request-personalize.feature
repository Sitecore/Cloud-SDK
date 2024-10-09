@personalize
Feature: Developer requests personalize from EP via client, api, middleware and serverSideProps

    Scenario: Developer requests personalize from API route
        Given the '/personalize' page is loaded
        When personalize parameters are:
            """
            {
                "friendlyId": "personalizeintegrationtest",
                "email": "test"
            }
            """
        And the 'requestPersonalizeFromAPI' button is clicked
        Then we display the callflow's content to UI:
            """
            {
                "Key": "value"
            }
            """

    Scenario Outline: Developer requests personalize from middleware
        Given the '/personalize' page is loaded with query parameters
            | personalizeForEnvironment |
            | middleware                |
        When the 'requestPersonalizeFromMiddleware' button is clicked
        Then we display the callflow's content to UI:
            """
            {
                "Key": "value"
            }
            """

    # This test case has been tested manually. It has been commented out because was breaking in the CI
    # Needs further check why this is happening
    # Scenario Outline: Developer requests personalize from middleware with User Agent
    #     Given the '/personalize' page is loaded
    #     When the 'requestPersonalizeFromMiddlewareWithUA' button is clicked
    #     Then we display 'Mozilla/5.0' User Agent to UI

    Scenario Outline: Developer requests personalize from serverSideProps
        Given the '/personalize' page is loaded with query parameters
            | personalizeForEnvironment | enableServerCookie |
            | serverSideProps           | true               |
        And the 'requestPersonalizeFromServerSideProps' button is clicked
        Then we display the callflow's content to UI:
            """
            {
                "Key": "value"
            }
            """

    Scenario: Developer requests personalize from the API route with timeout and EP fails to respond
        Given the '/personalize' page is loaded
        When personalize parameters are:
            """
            {
                "friendlyId": "personalizeintegrationtest",
                "email": "test_personalize_1@tst.com",
                "timeout": "<timeout>"
            }
            """
        And the 'requestPersonalizeFromAPI' button is clicked
        Then the api server personalize request responds with status code '500'

        Examples:
            | timeout |
            | 0       |
            | 20      |

    Scenario: Developer requests personalize from the client with timeout and EP fails to respond
        Given the '/personalize' page is loaded
        When personalize parameters are:
            """
            {
                "friendlyId": "personalizeintegrationtest",
                "email": "test_personalize_1@tst.com",
                "timeout": "<timeout>"
            }
            """
        And the 'requestPersonalizeFromClientWithTimeout' button is clicked
        Then an error is thrown: '[IE-0002] Timeout exceeded. The server did not respond within the allotted time.'

        Examples:
            | timeout |
            | 0       |
            | 20      |

    @Smoke-Test-Personalize
    Scenario: Developer requests personalize with invalid timeout input
        Given the '/personalize' page is loaded
        When personalize parameters are:
            """
            {
                "friendlyId": "personalizeintegrationtest",
                "email": "test_personalize_1@tst.com",
                "timeout": "-10"
            }
            """
        And the 'requestPersonalizeFromClientWithTimeout' button is clicked
        Then an error is thrown: '[IV-0006] Incorrect value for "timeout". Set the value to an integer greater than or equal to 0.'

    @Smoke-Test-Personalize
    Scenario: Developer requests personalize with timeout from the client and EP responds timely
        Given the '/personalize' page is loaded
        When personalize parameters are:
            """
            {
                "friendlyId": "personalizeintegrationtest",
                "email": "test_personalize_1@tst.com",
                "timeout": "2000"
            }
            """
        And the 'requestPersonalizeFromClientWithTimeout' button is clicked
        Then no error is thrown

    Scenario Outline: Developer requests personalize with pageVariantIds
        Given the '/personalize' page is loaded
        When personalize parameters are:
            """
            {
                "friendlyId": "personalizeintegrationtest",
                "pageVariantIds": [
                    "test",
                    "test2"
                ]
            }
            """
        And the 'requestPersonalizeFromClient' button is clicked
        Then a personalize request is sent with parameters:
            """
            {
                "variants": [
                    "test",
                    "test2"
                ]
            }
            """
        Then we display the callflow's content to UI:
            """
            {
                "Key": "value"
            }
            """

    Scenario Outline: Developer requests personalize with empty pageVariantIds
        Given the '/personalize' page is loaded
        When personalize parameters are:
            """
            {
                "friendlyId": "personalizeintegrationtest",
                "pageVariantIds": []
            }
            """
        And the 'requestPersonalizeFromClient' button is clicked
        Then a personalize request is sent with parameters:
            """
            {
                "variants": "undefined"
            }
            """
        Then we display the callflow's content to UI:
            """
            {
                "Key": "value"
            }
            """

    Scenario Outline: Developer requests personalize with valid parameters
        Given the '/personalize' page is loaded
        When personalize parameters are:
            """
            {
                "friendlyId": "<friendlyId>",
                "email": "<email>",
                "identifier": "<identifier>"
            }
            """
        And the 'requestPersonalizeFromClient' button is clicked
        Then a personalize request is sent with parameters:
            """
            {
                "friendlyId": "<friendlyId>",
                "email": "<email>",
                "identifier": "<identifier>"
            }
            """
        Then we display the callflow's content to UI:
            """
            {
                "Key": "value"
            }
            """

        Examples:
            | friendlyId                 | email                | identifier           |
            | personalizeintegrationtest |                      |                      |
            | personalizeintegrationtest | personalize@test.com |                      |
            | personalizeintegrationtest |                      | personalize@test.com |

    Scenario Outline: Developer requests personalize on the client and contains User Agent header
        Given the '/personalize' page is loaded
        When personalize parameters are:
            """
            {
                "friendlyId": "personalizeintegrationtest",
                "email": "personalize@test.com"
            }
            """
        And the 'requestPersonalizeFromClientWithUA' button is clicked
        Then the '@personalizeRequest' request contains headers
            | name       | value       |
            | user-agent | Mozilla/5.0 |

    Scenario: Developer requests personalize with customParams
        Given the '/personalize' page is loaded
        When personalize parameters are:
            """
            {
                "friendlyId": "personalizeintegrationtest",
                "email": "personalize@test.com",
                "params": {
                    "customString": "example",
                    "customValue": {
                        "value": "123"
                    }
                }
            }
            """
        And the 'requestPersonalizeFromClient' button is clicked
        Then a personalize request is sent with parameters:
            """
            {
                "friendlyId": "personalizeintegrationtest",
                "email": "personalize@test.com",
                "params": {
                    "customString": "example",
                    "customValue": {
                        "value": "123"
                    }
                }
            }
            """
        Then we display the callflow's content to UI:
            """
            {
                "Key": "value"
            }
            """

    Scenario Outline: Developer requests personalize with invalid parameters
        Given the '/personalize' page is loaded
        When personalize parameters are:
            """
            {
                "friendlyId": "<friendlyId>",
                "email": "<email>",
                "identifier": "<identifier>"
            }
            """
        And the 'requestPersonalizeFromClient' button is clicked
        Then a personalize request is sent with parameters:
            """
            {
                "friendlyId": "<friendlyId>",
                "email": "<email>",
                "identifier": "<identifier>"
            }
            """
        But Personalize API responds with '400' status code

        Examples:
            | friendlyId                 | email                      | identifier     |
            | personalizeintegrationtest | test_personalize_1@tst.com | testIdentifier |
            | 123414                     | test_personalize_1@tst.com | testIdentifier |

    Scenario: Developer requests personalize without the mandatory friendlyId parameter
        Given the '/personalize' page is loaded
        And the 'requestPersonalizeFromClient' button is clicked
        Then an error is thrown: '[MV-0004] "friendlyId" is required.'

    # Scenario: Developer requests personalize with language undefined
    #     Given the '/personalize' page is loaded
    #     When personalize parameters are:
    #     """
    #         {
    #             "friendlyId": "personalizeintegrationtest",
    #             "email": "personalize@test.com"
    #         }
    #     """
    #     And the 'requestPersonalizeWithUndefinedLanguage' button is clicked
    #     Then we display the callflow's content to UI:
    #     """
    #         {"Key":"value"}
    #     """

    Scenario: Developer requests personalize with empty string language
        Given the '/personalize' page is loaded
        When personalize parameters are:
            """
            {
                "friendlyId": "personalizeintegrationtest",
                "email": "personalize@test.com"
            }
            """
        And the 'requestPersonalizeWithEmptyStringLanguage' button is clicked
        But Personalize API responds with '400' status code

    Scenario Outline: Developer requests personalize with full geolocation data
        Given the '/personalize' page is loaded
        When personalize parameters are:
            """
            {
                "friendlyId": "personalizeintegrationtest",
                "email": "personalize@test.com"
            }
            """
        And the 'requestPersonalizeFromClientWithGeo' button is clicked
        Then a personalize request is sent with parameters:
            """
            {
                "params": {
                    "geo": {
                        "city": "T1",
                        "country": "T2",
                        "region": "T3"
                    }
                }
            }
            """
        Then we display the callflow's content to UI:
            """
            {
                "Key": "value"
            }
            """

    Scenario Outline: Developer requests personalize with partial geolocation data
        Given the '/personalize' page is loaded
        When personalize parameters are:
            """
            {
                "friendlyId": "personalizeintegrationtest",
                "email": "personalize@test.com"
            }
            """
        And the 'requestPersonalizeFromClientWithPartialGeo' button is clicked
        Then a personalize request is sent with parameters:
            """
            {
                "params": {
                    "geo": {
                        "city": "T1"
                    }
                }
            }
            """
        Then we display the callflow's content to UI:
            """
            {
                "Key": "value"
            }
            """

    Scenario Outline: Developer requests personalize with empty geolocation data
        Given the '/personalize' page is loaded
        When personalize parameters are:
            """
            {
                "friendlyId": "personalizeintegrationtest",
                "email": "personalize@test.com"
            }
            """
        And the 'requestPersonalizeFromClientWithEmptyGeo' button is clicked
        Then a personalize request is sent with no geolocation data
        Then we display the callflow's content to UI:
            """
            {
                "Key": "value"
            }
            """

    Scenario Outline: Developer sends callflows request with UTM as query params
        Given the '/personalize' page is loaded with query parameters
            | UTM_medium | UTM_source   | utm_campaign   | utm_content       |
            | email      | active users | feature launch | bottom cta button |
        When personalize parameters are:
            """
            {
                "friendlyId": "personalizeintegrationtest",
                "email": "personalize@test.com"
            }
            """
        And the 'requestPersonalizeFromClient' button is clicked
        Then a personalize request is sent with parameters:
            """
            {
                "friendlyId": "personalizeintegrationtest",
                "email": "personalize@test.com",
                "params": {
                    "utm": {
                        "medium": "email",
                        "source": "active users",
                        "campaign": "feature launch",
                        "content": "bottom cta button"
                    }
                }
            }
            """
        Then we display the callflow's content to UI:
            """
            {
                "Key": "value"
            }
            """

    Scenario Outline: Developer sends callflows request with UTM as custom params
        Given the '/personalize' page is loaded
        When personalize parameters are:
            """
            {
                "friendlyId": "personalizeintegrationtest",
                "email": "personalize@test.com",
                "params": {
                    "utm": {
                        "medium": "email"
                    }
                }
            }
            """
        And the 'requestPersonalizeFromClient' button is clicked
        Then a personalize request is sent with parameters:
            """
            {
                "friendlyId": "personalizeintegrationtest",
                "email": "personalize@test.com",
                "params": {
                    "utm": {
                        "medium": "email"
                    }
                }
            }
            """
        Then we display the callflow's content to UI:
            """
            {
                "Key": "value"
            }
            """

    Scenario Outline: Developer sends callflows request with both UTM as query (url) and custom params
        Given the '/personalize' page is loaded with query parameters
            | UTM_medium | UTM_source   | utm_campaign   | utm_content       |
            | email      | active users | feature launch | bottom cta button |
        When personalize parameters are:
            """
            {
                "friendlyId": "personalizeintegrationtest",
                "email": "personalize@test.com",
                "params": {
                    "utm": {
                        "medium": "email"
                    }
                }
            }
            """
        And the 'requestPersonalizeFromClient' button is clicked
        Then a personalize request is sent with parameters:
            """
            {
                "friendlyId": "personalizeintegrationtest",
                "email": "personalize@test.com",
                "params": {
                    "utm": {
                        "medium": "email"
                    }
                }
            }
            """
        Then we display the callflow's content to UI:
            """
            {
                "Key": "value"
            }
            """

    Scenario: Developer requests personalize from API route with UTM params
        Given the '/personalize' page is loaded
        When personalize parameters are:
            """
            {
                "friendlyId": "personalizeintegrationtest",
                "email": "test"
            }
            """
        And the 'requestPersonalizeFromAPIWithUTMParams' button is clicked
        Then we display the callflow's request params to UI containing the string:
            """
            {
                "utm": {
                    "campaign": "campaign",
                    "source": "test"
                }
            }
            """

    Scenario: Developer requests personalize from API route with UTM url params only
        Given the '/personalize' page is loaded
        When personalize parameters are:
            """
            {
                "friendlyId": "personalizeintegrationtest",
                "email": "test"
            }
            """
        And the 'requestPersonalizeFromAPIWithUTMParamsFromUrl' button is clicked
         Then we display the callflow's request params to UI containing the string:
            """
            {
                "utm": {
                    "campaign": "campaign2",
                    "source": "test2"
                }
            }
            """

    @RestartServer-Middleware
    Scenario: Developer requests personalize from API route with both UTM params (in url and manually)
        Given the '/personalize' page is loaded
        When personalize parameters are:
            """
            {
                "friendlyId": "personalizeintegrationtest",
                "email": "test"
            }
            """
        And the 'requestPersonalizeFromAPIWithBothUTMParams' button is clicked
         Then we display the callflow's request params to UI containing the string:
            """
            {
                "utm": {
                    "campaign": "campaign",
                    "source": "test"
                }
            }
            """

    @RestartServer-Middleware
    Scenario: Developer requests personalize from Middleware with UTM params
        Given the '/personalize' page is loaded
        When personalize parameters are:
            """
            {
                "friendlyId": "personalizeintegrationtest",
                "email": "test"
            }
            """
        And the 'requestPersonalizeFromMiddlewareWithUTMParams' button is clicked
        Then we display the callflow's request params to UI containing:
            """
            {
                "utm": {
                    "campaign": "campaign",
                    "source": "test"
                }
            }
            """

    Scenario: Developer requests personalize from Middleware with UTM url params only
        Given the '/personalize' page is loaded
        When personalize parameters are:
            """
            {
                "friendlyId": "personalizeintegrationtest",
                "email": "test"
            }
            """
        And the 'requestPersonalizeFromMiddlewareWithUTMParamsFromUrl' button is clicked
        Then we display the callflow's request params to UI containing:
            """
            {
                "utm": {
                    "campaign": "campaign4",
                    "source": "test4"
                }
            }
            """

    # Scenario: Developer requests personalize from Middleware with both UTM params (in url and manually)
    #     Given the '/personalize' page is loaded with 'testID' name and 'requestPersonalizeFromMiddlewareBothUTMParams' value query parameter
    #     And the 'requestPersonalizeFromMiddlewareWithBothUTMParams' button is clicked
    #     Then we display the callflow's request params to UI containing:
    #         """
    #         {
    #             "utm": {
    #                 "campaign": "campaign",
    #                 "source": "test"
    #             }
    #         }
    #         """