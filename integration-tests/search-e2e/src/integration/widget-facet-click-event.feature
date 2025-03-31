Feature: Send widget facet click event

    Scenario Outline: Developer sends search widget facet click event from browser with a valid payload
        Given the '/widget-facet-click-event' page is loaded
        When the event request parameters are:
            """
            {
                "channel": "WEB",
                "country": "US",
                "currency": "EUR",
                "filters": [
                    {
                        "displayName": "test",
                        "facetPosition": 1,
                        "name": "test",
                        "title": "test",
                        "value": "test",
                        "valuePosition": 1
                    },
                    {
                        "displayName": "test",
                        "endValue": "1",
                        "name": "test",
                        "startValue": "1",
                        "title": "test",
                        "value": "test",
                        "valuePosition": 1
                    }
                ],
                "itemPosition": 1,
                "language": "EN",
                "page": "test",
                "pathname": "https://www.sitecore.com/products/content-cloud",
                "referrer": "https://www.sitecore.com/products/content-cloud",
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
                "widgetId": "12345"
            }
            """
        And the 'widgetFacetClickEvent' button is clicked
        Then the event request is sent with parameters:
            """
            {
                "type": "SC_SEARCH_WIDGET_CLICK",
                "sc_search": {
                    "data": {
                        "action_cause": "filter",
                        "value": {
                            "context": {
                                "page": {
                                    "locale_country": "us",
                                    "locale_language": "en",
                                    "locale_currency": "eur",
                                    "referrer": "https://www.sitecore.com/products/content-cloud",
                                    "uri": "https://www.sitecore.com/products/content-cloud"
                                }
                            },
                            "filters": [
                                {
                                    "display_name": [
                                        "test"
                                    ],
                                    "facet_position": 1,
                                    "name": "test",
                                    "title": "test",
                                    "value": [
                                        "test"
                                    ],
                                    "value_position": [
                                        1
                                    ]
                                },
                                {
                                    "display_name": [
                                        "test"
                                    ],
                                    "end_value": "1",
                                    "facet_position": 0,
                                    "name": "test",
                                    "start_value": "1",
                                    "title": "test",
                                    "value": [
                                        "test"
                                    ],
                                    "value_position": [
                                        1
                                    ]
                                }
                            ],
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

    Scenario: Developer sends search widget facet click event from Middleware with a valid payload
        Given the '/widget-facet-click-event' page is loaded with 'testID' name and 'widgetFacetClickFromMiddleware' value query parameter
        Then the request with id 'widgetFacetClickFromMiddleware' will contain:
            """
            "sc_search":{"data":{"action_cause":"filter","value":{"context":{"page":{"locale_country":"us","locale_currency":"eur","locale_language":"en","referrer":"https://www.sitecore.com/products/content-cloud","uri":"https://www.sitecore.com/products/content-cloud"}},"filters":[{"display_name":["test"],"facet_position":1,"name":"test","title":"test","value":["test"],"value_position":[1]},{"display_name":["test"],"end_value":"1","facet_position":0,"name":"test","start_value":"1","title":"test","value":["test"],"value_position":[1]}],"request":{"advanced_query_text":"test1","keyword":"test_keyword","modified_keyword":"test2","num_requested":20,"num_results":10,"page_number":2,"page_size":1,"redirect_url":"test3","total_results":10},"rfk_id":"12345"}},"metadata":{"ut_api_version":"1.0"}
            """
