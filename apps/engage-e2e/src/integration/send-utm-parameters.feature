Feature: Send UTM parameters for every event with configuration setting

@Smoke-Test-Events
Scenario: Enabled Utm Parameters with parameters in the URL sent from the server
    Given the '/' page is loaded with query parameters
        | includeUTMParameters | UTM_medium | UTM_source   | utm_campaign   | utm_content       | 
        | true                 | email      | active users | feature launch | bottom cta button |
    And the 'sendEventFromServer' button is clicked
    Then the event is sent successfully from the server

Scenario: Disabled Utm Parameters flag but utm parameters sent
    Given the '/viewevent' page is loaded with query parameters
        | includeUTMParameters  | UTM_medium | UTM_source   | utm_campaign   | utm_content       |
        | false                 | email      | active users | feature launch | bottom cta button |    
    Then a VIEW event is sent but no extra UTM parameters are sent with the event

Scenario: Enabled Utm Parameters with no parameters in the URL
    Given the '/viewevent' page is loaded with query parameters
        | includeUTMParameters  |
        | true                  |
    Then a VIEW event is sent with no UTM key-value pairs

Scenario: Enabled Utm Parameters with URL encoded parameters and are sent decoded to CDP
    Given the '/viewevent' page is loaded with query parameters
        | includeUTMParameters | UTM_medium | UTM_source   | utm_campaign   | utm_content           |
        | true                 | email      | active users | feature launch | bottom%20cta%20button |
    Then the event is sent with 'VIEW' type
        | utm_medium | utm_source   | utm_campaign   | utm_content       |
        | email      | active users | feature launch | bottom cta button |


    