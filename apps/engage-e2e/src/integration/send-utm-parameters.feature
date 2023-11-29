Feature: Send UTM parameters for every event with includeUTMParameters property included/excluded in the event object

Scenario:  Developer calls an event from server with includeUTMParameters true and UTM parameters
    Given the '/' page is loaded with query parameters
        | includeUTMParameters | UTM_medium | UTM_source   | utm_campaign   | utm_content       | 
        | true                 | email      | active users | feature launch | bottom cta button |
    And the 'sendEventFromServer' button is clicked
    Then the event is sent successfully from the server

Scenario: Developer calls an event without includeUTMParameters but with UTM parameters
    Given the '/viewevent' page is loaded with query parameters
        | UTM_medium | UTM_source   | utm_campaign   | utm_content       |
        | email      | active users | feature launch | bottom cta button |    
    Then the event is sent with 'VIEW' type
        | utm_medium | utm_source   | utm_campaign   | utm_content       |
        | email      | active users | feature launch | bottom cta button |

Scenario: Developer calls an event with includeUTMParameters false but with UTM parameters
    Given the '/viewevent' page is loaded with query parameters
        | includeUTMParameters  | UTM_medium | UTM_source   | utm_campaign   | utm_content       |
        | false                 | email      | active users | feature launch | bottom cta button |    
    Then a VIEW event is sent with no UTM key-value pairs

Scenario: Developer calls an event with includeUTMParameters true
    Given the '/viewevent' page is loaded with query parameters
        | includeUTMParameters  | UTM_medium | UTM_source   | utm_campaign   | utm_content       |
        | true                  | email      | active users | feature launch | bottom cta button |    
    Then the event is sent with 'VIEW' type
        | utm_medium | utm_source   | utm_campaign   | utm_content       |
        | email      | active users | feature launch | bottom cta button |

Scenario: Developer calls an event with includeUTMParameters true and the includeUTMParameters should not be present in event
    Given the '/viewevent' page is loaded with query parameters
        | includeUTMParameters  | UTM_medium | UTM_source   | utm_campaign   | utm_content       |
        | true                  | email      | active users | feature launch | bottom cta button |    
    Then the event does not contain includeUTMParameters as property

Scenario: Developer calls an eventwith includeUTMParameters true and has no UTM parameters
    Given the '/viewevent' page is loaded with query parameters
        | includeUTMParameters  |
        | true                  |
    Then a VIEW event is sent with no UTM key-value pairs