Feature: Send a VIEW event to EP

Scenario: Developer sends a view event from server
    Given the '/' page is loaded
    And the 'sendEventFromServer' button is clicked
    Then the event is sent successfully from the server

Scenario: Developer uses pageView to send a VIEW event when it's loaded
    Given the '/viewevent' page is loaded
    Then the event is sent with 'VIEW' type
    And the 'pageVariantId' ext property is undefined

@Smoke-Test-Events
Scenario: Developer uses pageView to send a VIEW event with both query parameters and eventData have the variantId parameter
    Given the '/' page is loaded with query parameters
        | variantid |
        | vid       |
    And the pageView function is called
        | variantid |
        | vid       |
    Then the 'VIEW' event is sent with the following parameters in the ext object
        | pageVariantId |
        | vid           |

Scenario: Developer uses pageView to send a VIEW event and pass the pageVariantId to the eventData
    Given the '/' page is loaded
    When the pageView function is called
        | variantid |
        | vid       |
    Then the 'VIEW' event is sent with the following parameters in the ext object
        | pageVariantId |
        | vid           |

Scenario: Developer uses pageView to send a VIEW event and query parameters have the VariantId parameter
    Given the '/viewevent' page is loaded with query parameters
        | variantid |
        | vid       |
    Then the 'VIEW' event is sent with the following parameters in the ext object
        | pageVariantId |
        | vid           |

Scenario: Developer uses pageView to send a VIEW event with referrer
    Given the '/viewevent' page is loaded with a different document.referrer hostname
    Then the event is sent with the referrer

Scenario: Developer uses pageView to send a VIEW event without referrer
    Given the '/viewevent' page is loaded with the same document.referrer hostname
    Then the event is sent without the referrer

Scenario: Developer uses pageView to send an event to EP and provides page & language parameters through eventData
    Given the '/' page is loaded
    When the pageView function is called
        | page      | language      |
        | test_page | test_language |
    Then the event is sent with 'VIEW' type
        | page      | language      |
        | test_page | test_language |

Scenario: Developer uses pageView to send an event to EP and doesn't provide any parameters
    Given the '/about' page is loaded
    When the pageView function is called
    Then the event is sent with the values inferred from window.location.pathname

Scenario: Developer uses pageView to send an event to EP without page parameter and the URL is /
    Given the '/' page is loaded
     When the pageView function is called
     Then the event is sent with 'VIEW' type
        | page      |
        | Home Page |

Scenario: Developer uses pageView to send an event to EP,doesn't provide language parameter but language is present in the document
    Given the '/' page is loaded
    And the 'lang' attribute 'en-US' exist in the document
    When the pageView function is called
    Then the event is sent with 'VIEW' type
         | language | page      |
         | EN       | Home Page |

Scenario: Developer sends VIEW event from client without language param and EP responds successfully
    Given the '/' page is loaded
    And the 'lang' attribute doesn't exist in the document
    When the pageView function is called
    Then EP API responds with '201' status code

Scenario: Developer sends VIEW event from client with empty string language param and EP responds successfully
    Given the '/' page is loaded
    When the pageView function is called
        | language    |
        | {backspace} |
    Then EP API responds with '201' status code

Scenario: Developer uses pageView to send an event to EP when cookie exists
    Given the '/' page is loaded
    And a cookie exists on the page with the respective 'production' environment contextId
    When the pageView function is called
    Then the bid value set in the cookie for the user is returned

Scenario: Developer uses pageView to send an event to EP when no cookie exists
    Given the '/' page is loaded
    When the cookies are removed from the browser
    And the pageView function is called
    Then the event is sent with empty browserId

Scenario: Developer sends VIEW event with a user-defined object
    Given the '/viewevent' page is loaded with query parameters
        | extAttributesNumber |
        | 2                   |
    Then the event is sent with 'VIEW' type
        | extAttributesNumber |
        | 2                   |

Scenario: Developer sends VIEW event with user-defined object & pageVariantId
    Given the '/viewevent' page is loaded with query parameters
        | extAttributesNumber | variantid |
        | 2                   | vid       |
    Then the event is sent with 'VIEW' type
        | extAttributesNumber | pageVariantId |
        | 2                   | vid           |

Scenario: Developer sends VIEW event with empty user-defined object & pageVariantId set
    Given the '/viewevent' page is loaded with query parameters
        | extAttributesNumber | variantid |
        | 0                   | vid       |
    Then the event is sent with 'VIEW' type
        | pageVariantId |
        | vid           |

Scenario: Developer sends VIEW event with flattened ext properties
    Given the '/viewevent' page is loaded with query parameters
        | extAttributesNumber | nested                   |
        | 1                   | {"a":"a","b":1,"c":true} |
    Then the event is sent with 'VIEW' type
        | extAttributesNumber | nested                   |
        | 1                   | {"a":"a","b":1,"c":true} |

Scenario: Developer sends VIEW event with pageVariantId passed both on basic object and user-defined object
    Given the '/viewevent' page is loaded with query parameters
        | variantid | pageVariantId |
        | vid-1      | vid-2        |
    Then the event is sent with 'VIEW' type
        | pageVariantId |
        | vid-1         |

Scenario: Developer sends VIEW event with pageVariantId only in user-defined object
    Given the '/viewevent' page is loaded with query parameters
        | pageVariantId |
        | vid-2        |
    Then the event is sent with 'VIEW' type
        | pageVariantId |
        | vid-2         |

Scenario: Developer sends VIEW event with an empty user-defined object
    Given the '/viewevent' page is loaded
    Then the event is sent without ext

Scenario: Developer sends VIEW event without ext
    Given the '/viewevent' page is loaded with query parameters
        | no-ext |
        | true   |
   Then the event is sent without ext

Scenario Outline: Developer creates VIEW event with ext attributes that exceed the limit
    Given the '/viewevent' page is loaded with query parameters
        | type    | extAttributesNumber    | nested   |
        | VIEW    | <extAttributesNumber>  | <nested> |
    Then an error is thrown: '[IV-0005] "extensionData" supports maximum 50 attributes. Reduce the number of attributes.'

    Examples:
        | extAttributesNumber  | nested         |
        | 51                   |                |
        | 52                   |                |
        | 48                   | {"a":"a","b":1,"c":true} |

Scenario: Developer sends VIEW event without channel and currency params and EP responds successfully without these params existing in payload
    Given the '/viewevent' page is loaded
    Then EP API responds with '201' status code
    And the event is sent without channel and currency

Scenario: Developer sends VIEW event with channel and currency params and EP responds successfully with these params existing in payload
    Given the '/viewevent' page is loaded
    And the 'sendPageViewEventWithChannelAndCurreny' button is clicked
    Then EP API responds with '201' status code
    And the event is sent with 'WEB' channel and 'EUR' currency

Scenario: Developer sends VIEW event from Middleware without channel and currency params
    Given the '/viewevent' page is loaded
    And the 'sendPageViewEventWithoutChannelAndCurencyFromMiddleware' button is clicked
    Then we display the event's request params to UI not containing 'channel' parameter
    And we display the event's request params to UI not containing 'currency' parameter

Scenario: Developer sends VIEW event without params
    Given the '/viewevent' page is loaded
    And the 'sendPageViewEventWithoutParams' button is clicked
    Then EP API responds with '201' status code
    And the event is sent without channel and currency

Scenario: Developer sends VIEW event from Middleware without params
    Given the '/viewevent' page is loaded
    And the 'sendPageViewEventWithoutParamsFromMiddleware' button is clicked
    Then we display the event's request params to UI not containing 'channel' parameter
    And we display the event's request params to UI not containing 'currency' parameter
