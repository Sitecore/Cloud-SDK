@personalize
Feature: Developer accesses debug logs when personalize is called

Scenario: Developer loads next app and personalize lib on browser only so no debug logs are in console 
    Given the '/' page is loaded without init function
    Then the debug server won't include: 'personalizeServer'

Scenario: Developer loads next app and personalize lib is initialized so sevrver and client debug logs are printed 
    Given the '/personalize' page is loaded 
    Then debug log is printed out in the console with message including 'sitecore-cloudsdk:personalize'
    Then we display the debug server to UI including: 'personalizeServer library initialized'
    Then we display the debug server to UI including: 'Personalize request'
    
    
Scenario: Developer loads next app and personalize lib and sends personalize event 
    Given the '/personalize' page is loaded
    When personalize parameters are: 
    """
        {
            "friendlyId": "personalizeintegrationtest", 
            "email": "personalize@test.com",
            "params": {"customString": "example", "customValue": { "value": "123" }}
        }
    """
    And the 'requestPersonalizeFromClient' button is clicked
    Then a personalize request is sent with parameters:
    """
        {
            "friendlyId": "personalizeintegrationtest", 
            "email": "personalize@test.com",
            "params": {"customString": "example", "customValue": { "value": "123" }}
        }
    """    
    Then debug log is printed out in the console with message including 'Personalize request'
    And debug log is printed out in the console with message including 'Personalize response'    
    And debug log response status should be '200'
    Then we display the debug server to UI including: 'Personalize response'
    
Scenario: Developer loads next app and personalize lib and sends personalize event with error response
    Given the '/personalize' page is loaded
    When personalize parameters are: 
    """
        {
            "friendlyId": "personalizeintegrationtest", 
            "email": "test_personalize_1@tst.com", 
            "timeout": "0" 
        }
    """
    And the 'requestPersonalizeFromClientWithTimeout' button is clicked
    Then debug log is printed out in the console with message including 'Error personalize response'
    Then we display the debug server to UI including: 'Personalize response'
        
Scenario Outline: Developer loads next app and personalize lib with invalid parameters
    Given the '/personalize' page is loaded
    When personalize parameters are: 
    """
        {
            "friendlyId": "personalizeintegrationtest",             
            "identifier": "testIdentifier" 
        }
    """
    And the 'requestPersonalizeFromClient' button is clicked
    Then a personalize request is sent with parameters:
    """
        {
            "friendlyId": "personalizeintegrationtest",             
            "identifier": "testIdentifier"
        }
    """
    But Personalize API responds with '400' status code
    And debug log is printed out in the console with message including 'Personalize response'
    And debug log response status should be '400'
    
   