@events
Feature: Developer accesses debug logs when events is called

Scenario: Developer loads next app and events lib on browser only so no debug logs are in console 
    Given the '/' page is loaded without init function
    Then the debug server won't include: 'eventsServer'

Scenario: Developer loads next app and events lib is initialized so server and client debug logs are printed 
    Given the '/viewevent' page is loaded 
    Then debug log is printed out in the console with message including 'sitecore-cloudsdk:events'
    Then we display the debug server to UI including: 'eventsServer library initialized'
    Then we display the debug server to UI including: 'Events request'    
    
Scenario: Developer loads next app and events lib and sends a custom event  
    Given the '/customevent' page is loaded
    When the event parameters are: 
    """
        { 
            "type": "ADD_PRODUCTS"
        }
    """
    And the 'sendEvent' button is clicked
    Then the event request is sent with parameters:
    """
        {
            "type": "ADD_PRODUCTS"
        }
    """
    Then debug log is printed out in the console with message including 'Events request'
    And debug log is printed out in the console with message including 'Events response'    
    And debug log response status should be '201'


Scenario: Developer loads next app and events lib and sends a custom event with error 
    Given the '/customevent' page is loaded
    When the event parameters are: 
    """
        { 
            "type": ""
        }
    """
    And the 'sendEvent' button is clicked
    Then the event request is sent with parameters:
    """
        {
            "type": ""
        }
    """
    Then debug log is printed out in the console with message including 'Events request'
    And debug log is printed out in the console with message including 'Events response'    
    And debug log response status should be '400'