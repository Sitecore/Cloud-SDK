Feature: Send entity view event

Scenario Outline: Developer sends entity view event from browser with a valid payload
    Given the '/entity-view-event' page is loaded
    Given the '/entity-view-event' page is loaded
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
    And the 'entityView' button is clicked
    Then the event request is sent with parameters:
    """
        {
            "type": "VIEW",
            "sc_search": {
                "data": {
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

Scenario: Developer sends entity view event from Middleware with a valid payload
    Given the '/entity-view-event' page is loaded with 'testID' name and 'entityViewFromMiddleware' value query parameter
    Then the request with id 'entityViewFromMiddleware' will contain:
    """
        "sc_search":{"data":{"value":{"context":{"page":{"uri":"https://www.sitecore.com/products/content-cloud"}},"entities":[{"attributes":{"author":"ABC"},"entity_subtype":"subcat","entity_type":"category","id":"123","source_id":"534","uri":"https://www.sitecore.com/products/content-cloud3333333"}]}},"metadata":{"ut_api_version":"1.0"}
    """
