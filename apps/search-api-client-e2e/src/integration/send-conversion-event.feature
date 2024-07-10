Feature: Send conversion click event

Scenario Outline: Developer sends conversion event from browser with a valid payload
    Given the '/send-conversion-event' page is loaded
    When the event request parameters are:
    """
        {
            "currency": "EUR",
             "entity": {
                "attributes": {
                    "author": "ABC"
                },
                "entity": "category",
                "entityType": "subcat",
                "id": "123",
                "sourceId": "534",
                "uri": "https://www.sitecore.com/products/content-cloud3333333"
            },
            "language": "EN",
            "page": "test",
            "pathname": "https://www.sitecore.com/products/content-cloud"
        }
     """
    And the 'sendConversionEvent' button is clicked
    Then the event request is sent with parameters:
    """
        {
            "type": "VIEW",
            "sc_search": {
                "data": {
                    "action_sub_type": "conversion",
                    "value": {
                        "context": {
                            "page": {
                                "uri": "https://www.sitecore.com/products/content-cloud"
                            }
                        },
                        "entities": [
                            {
                                "attributes": {
                                    "author": "ABC"
                                },
                                "entity_subtype": "subcat",
                                "entity_type": "category",
                                "id": "123",
                                "source_id": "534",
                                "uri": "https://www.sitecore.com/products/content-cloud3333333"
                            }
                        ]
                    }
                },
                "metadata": {
                    "ut_api_version": "1.0"
                }
            },
            "client_key": "",
            "currency": "EUR",
            "language": "EN",
            "page": "test",
            "pos": ""
        }
    """

Scenario: Developer sends conversion event from Middleware with a valid payload
    Given the '/send-conversion-event' page is loaded with 'testID' name and 'sendConversionEventFromMiddleware' value query parameter
    Then the request with id 'sendConversionEventFromMiddleware' will contain:
    """
        "sc_search":{"data":{"action_sub_type":"conversion","value":{"context":{"page":{"uri":"https://www.sitecore.com/products/content-cloud"}},"entities":[{"attributes":{"author":"ABC"},"entity_subtype":"subcat","entity_type":"category","id":"123","source_id":"534","uri":"https://www.sitecore.com/products/content-cloud3333333"}]}},"metadata":{"ut_api_version":"1.0"}
    """
    