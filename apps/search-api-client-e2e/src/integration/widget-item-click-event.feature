Feature: Send widget item click event

Scenario Outline: Developer sends search widget item click event from browser with a valid payload
    Given the '/widget-item-click-event' page is loaded
    When the event request parameters are:
    """
        {
        	"channel": "WEB",
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
            "itemPosition": 1,
            "language": "EN",
            "page": "test",
            "pathname": "https://www.sitecore.com/products/content-cloud",
            "request": {
                "advancedQueryText": "test1",
                "keyword": "test_keyword",
                "modifiedKeyword": "test2",
                "numRequested": 20,
                "numResults": 10,
                "pageNumber": 2,
                "pageSize": 1,
                "redirectUrl": "test3",
                "totalResults": 10
            },
            "widgetIdentifier": "12345"
        }
     """
    And the 'widgetItemClickEvent' button is clicked
    Then the event request is sent with parameters:
    """
        {
            "type": "SC_SEARCH_WIDGET_CLICK",
            "sc_search": {
                "data": {
                    "action_cause": "entity",
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
                        ],
                        "index": 1,
                        "request": {
                            "advanced_query_text": "test1",
                            "keyword": "test_keyword",
                            "modified_keyword": "test2",
                            "num_requested": 20,
                            "num_results": 10,
                            "page_number": 2,
                            "page_size": 1,
                            "redirect_url": "test3",
                            "total_results": 10
                        },
                        "rfk_id": "12345"
                    }
                },
                "metadata": {
                    "ut_api_version": "1.0"
                }
            },
            "channel": "WEB",
            "client_key": "",
            "currency": "EUR",
            "language": "EN",
            "page": "test",
            "pos": ""
        }
    """

Scenario: Developer sends search widget item click event from Middleware with a valid payload
    Given the '/widget-item-click-event' page is loaded with 'testID' name and 'widgetItemClickFromMiddleware' value query parameter
    Then the request with id 'widgetItemClickFromMiddleware' will contain:
    """
        "sc_search":{"data":{"action_cause":"entity","value":{"context":{"page":{"uri":"https://www.sitecore.com/products/content-cloud"}},"entities":[{"attributes":{"author":"ABC"},"entity_subtype":"subcat","entity_type":"category","id":"123","source_id":"534","uri":"https://www.sitecore.com/products/content-cloud3333333"}],"index":1,"request":{"advanced_query_text":"test1","keyword":"test_keyword","modified_keyword":"test2","num_requested":20,"num_results":10,"page_number":2,"page_size":1,"redirect_url":"test3","total_results":10},"rfk_id":"12345"}},"metadata":{"ut_api_version":"1.0"}
    """
