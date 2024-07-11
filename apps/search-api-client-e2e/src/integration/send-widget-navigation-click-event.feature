Feature: Send widget click event

Scenario Outline: Developer sends search widget navigation click event from browser with a valid payload
    Given the '/send-widget-navigation-click-event' page is loaded
    When the event request parameters are:
    """
        {
        	"channel": "WEB",
            "currency": "EUR",
            "itemPosition": 1,
            "language": "EN",
            "page": "test",
            "pathname": "https://www.sitecore.com/products/content-cloud",
            "widgetIdentifier": "12345"
        }
     """
    And the 'sendWidgetNavigationClickEvent' button is clicked
    Then the event request is sent with parameters:
    """
        {
            "type": "SC_SEARCH_WIDGET_NAVIGATION_CLICK",
            "sc_search": {
                "data": {
                    "action_cause": "navigation",
                    "value": {
                        "context": {
                            "page": {
                                "uri": "https://www.sitecore.com/products/content-cloud"
                            }
                        },
                        "index": 1,
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

Scenario:  Developer sends search widget navigation click event from Middleware
    Given the '/send-widget-navigation-click-event' page is loaded with 'testID' name and 'sendWidgetNavigationClickEventFromMiddleware' value query parameter
    Then the request with id 'sendWidgetNavigationClickEventFromMiddleware' will contain:
    """
    "sc_search":{"data":{"action_cause":"navigation","value":{"context":{"page":{"uri":"https://www.sitecore.com/products/content-cloud"}},"index":1,"rfk_id":"12345"}},"metadata":{"ut_api_version":"1.0"}}
    """