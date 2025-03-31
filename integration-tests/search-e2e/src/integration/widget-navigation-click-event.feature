Feature: Send widget navigation event

    Scenario Outline: Developer sends search widget navigation click event from browser with a valid payload
        Given the '/widget-navigation-click-event' page is loaded
        When the event request parameters are:
            """
            {
                "channel": "WEB",
                "country": "US",
                "currency": "EUR",
                "itemPosition": 1,
                "language": "EN",
                "page": "test",
                "pathname": "https://www.sitecore.com/products/content-cloud",
                "referrer": "https://www.sitecore.com/products/content-cloud",
                "widgetId": "12345"
            }
            """
        And the 'widgetNavigationClickEvent' button is clicked
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
                                    "locale_country": "us",
                                    "locale_currency": "eur",
                                    "locale_language": "en",
                                    "referrer": "https://www.sitecore.com/products/content-cloud",
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
        Given the '/widget-navigation-click-event' page is loaded with 'testID' name and 'widgetNavigationClickFromMiddleware' value query parameter
        Then the request with id 'widgetNavigationClickFromMiddleware' will contain:
            """
            "sc_search":{"data":{"action_cause":"navigation","value":{"context":{"page":{"locale_country":"us","locale_currency":"eur","locale_language":"en","referrer":"https://www.sitecore.com/products/content-cloud","uri":"https://www.sitecore.com/products/content-cloud"}},"index":1,"rfk_id":"12345"}},"metadata":{"ut_api_version":"1.0"}}
            """
