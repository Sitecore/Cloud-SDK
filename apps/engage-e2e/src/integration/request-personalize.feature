@personalize
Feature: Developer requests personalize from CDP via client, api, middleware and serverSideProps

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
        {"Key":"value"}
    """
Scenario Outline: Developer requests personalize from middleware
    Given the '/personalize' page is loaded
    When the 'requestPersonalizeFromMiddleware' button is clicked
    Then we display the callflow's content to UI: 
    """
        {"Key":"value"}
    """

Scenario Outline: Developer requests personalize from serverSideProps
    Given the '/personalize' page is loaded
    And the 'requestPersonalizeFromServerSideProps' button is clicked
    Then we display the callflow's content to UI: 
    """
        {"Key":"value"}
    """

Scenario: Developer requests personalize from the API route with timeout and CDP fails to respond
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

Scenario: Developer requests personalize from the client with timeout and CDP fails to respond
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
    Then an error is thrown: '[IE-0003] Timeout exceeded. The server did not respond within the allotted time.'
 
    Examples:
        | timeout | 
        | 0       |                                              
        | 20      |

@Smoke-Test
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
    Then an error is thrown: '[IV-0006] Incorrect value for the timeout parameter. Set the value to an integer greater than or equal to 0.'

@Smoke-Test
Scenario: Developer requests personalize with timeout from the client and CDP responds timely
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
        {"Key":"value"}
    """
    
    Examples:
        | friendlyId                 | email                | identifier           | 
        # | personalizeintegrationtest |                      |                      |
        | personalizeintegrationtest | personalize@test.com |                      |
        | personalizeintegrationtest |                      | personalize@test.com | 

    # @Next-US
    # Examples:
    #     | friendlyId                   | email                               | identifier                          |
    #     | personalizeintegrationtest_2 | test_personalize_callflows@test.com |                                     |
    #     | personalizeintegrationtest_2 |                                     | test_personalize_callflows@test.com |

# Scenario: Developer requests personalize with customParams
#     Given the '/personalize' page is loaded
#     When personalize parameters are: 
#     """
#         {
#             "friendlyId": "personalizeintegrationtest", 
#             "params": {"customString": "example"}
#         }
#     """
#     And the 'requestPersonalizeFromClient' button is clicked
#     Then a personalize request is sent with parameters:
#     """
#         {
#             "friendlyId": "personalizeintegrationtest", 
#             "params": {"customString": "example"}
#         }
#     """
#     Then we display the callflow's content to UI: 
#     """
#         {"Key":"value"}
#     """

# Scenario Outline: Developer requests personalize with invalid parameters
#     Given the '/personalize' page is loaded
#     When personalize parameters are: 
#     """
#         {
#             "friendlyId": "<friendlyId>", 
#             "email": "<email>", 
#             "identifier": "<identifier>" 
#         }
#     """
#     And the 'requestPersonalizeFromClient' button is clicked
#     Then a personalize request is sent with parameters:
#     """
#         {
#             "friendlyId": "<friendlyId>", 
#             "email": "<email>", 
#             "identifier": "<identifier>"
#         }
#     """
#     But Personalize API responds with '400' status code   

#     Examples:
#         | FriendlyId                 | Email                      | Identifier     |
#         | personalizeintegrationtest |                            | testIdentifier |
#         | personalizeintegrationtest | test_personalize_1@tst.com | testIdentifier |
#         | 123414                     | test_personalize_1@tst.com | testIdentifier |

Scenario: Developer requests personalize without the mandatory friendlyId parameter
    Given the '/personalize' page is loaded
    And the 'requestPersonalizeFromClient' button is clicked
    Then an error is thrown: '[MV-0008] "friendlyId" is required.'

# Scenario: Developer requests personalize with language undefined
#     Given the '/personalize' page is loaded
#     When personalize parameters are: 
#     """
#         {
#             "friendlyId": "personalizeintegrationtest" 
#         }
#     """
#     And the 'requestPersonalizeWithUndefinedLanguage' button is clicked
#     Then we display the callflow's content to UI: 
#     """
#         {"Key":"value"}
#     """

# Scenario: Developer requests personalize with empty string language
#     Given the '/personalize' page is loaded
#     When personalize parameters are: 
#     """
#         {
#             "friendlyId": "personalizeintegrationtest"
#         }
#     """
#     And the 'requestPersonalizeWithEmptyStringLanguage' button is clicked
#     But Personalize API responds with '400' status code   