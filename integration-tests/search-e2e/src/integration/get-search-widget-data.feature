Feature: Request search widget data from Search REST API

    Scenario: Developer requests search widget data from Middleware with a valid payload
        Given the '/get-search-widget-data' page is loaded with 'testID' name and '<testID>' value query parameter
        Then the request with id '<testID>' will contain:
            """
            "widget":{"items":[{"entity":"content","rfk_id":"rfkid_7","search":{"facet":{"all":true,"coverage":true,"max":50,"sort":{"name":"count","order":"asc"},"types":[{"exclude":["type"],"filter":{"type":"and","values":["facetid_eyJ0eXBlIjoiZXEiLCJuYW1lIjoidHlwZSIsInZhbHVlIjoiR3VpZGVzIn0=","facetid_eyJ0eXBlIjoiZXEiLCJuYW1lIjoidHlwZSIsInZhbHVlIjoiRG9jdW1lbnRhdGlvbiJ9"]},"filtering_options":["hard_filters","other_facet_values","own_values"],"keyphrase":"test","max":1,"min_count":1,"name":"type","after":"facetid_eyJ0eXBlIjoiZXEiLCJuYW1lIjoidHlwZSIsInZhbHVlIjoiUHJvZHVjdCJ9","sort":{"name":"text","order":"asc"}}]}}}]}
            """

        Examples:
            | testID                                                       |
            | getSearchWidgetDataFromMiddlewareWithValidPayload            |
            | getSearchWidgetDataFromMiddlewareWithValidPayloadUsingSetter |

    Scenario: Developer search requests widget data from API with a valid payload
        Given the '/get-search-widget-data' page is loaded with 'testID' name and '<testID>' value query parameter
        And the 'getSearchWidgetDataFromAPIWithValidPayload' button is clicked
        Then the request with id '<testID>' will contain:
            """
            "widget":{"items":[{"entity":"content","rfk_id":"rfkid_7","search":{"facet":{"all":true,"coverage":true,"max":50,"sort":{"name":"count","order":"asc"},"types":[{"exclude":["type"],"filter":{"type":"and","values":["facetid_eyJ0eXBlIjoiZXEiLCJuYW1lIjoidHlwZSIsInZhbHVlIjoiR3VpZGVzIn0=","facetid_eyJ0eXBlIjoiZXEiLCJuYW1lIjoidHlwZSIsInZhbHVlIjoiRG9jdW1lbnRhdGlvbiJ9"]},"filtering_options":["hard_filters","other_facet_values","own_values"],"keyphrase":"test","max":1,"min_count":1,"name":"type","after":"facetid_eyJ0eXBlIjoiZXEiLCJuYW1lIjoidHlwZSIsInZhbHVlIjoiUHJvZHVjdCJ9","sort":{"name":"text","order":"asc"}}]}}}]}
            """

        Examples:
            | testID                                                |
            | getSearchWidgetDataFromAPIWithValidPayload            |
            | getSearchWidgetDataFromAPIWithValidPayloadUsingSetter |

    Scenario Outline: Developer requests search widget data from browser with a valid payload
        Given the '/get-search-widget-data' page is loaded
        When the widget item parameters are:
            """
            {
                "items": <items>
            }
            """
        And the 'getSearchWidgetData' button is clicked
        Then the widget data request is sent with parameters:
            """
            {
                "items": <items_payload>
            }
            """

        Examples:
            | items                                                                                                                                                                                                                                                                                          | items_payload                                                                                                                                                                                                                                                                                  |
            | [{"widgetId":"rfkid_7","entity":"content"}]                                                                                                                                                                                                                                                    | [{"widgetId":"rfkid_7","entity":"content"}]                                                                                                                                                                                                                                                    |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"facet":{}}}]                                                                                                                                                                                                                              | [{"widgetId":"rfkid_7","entity":"content"}]                                                                                                                                                                                                                                                    |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"facet":{"all":true,"max":50}}}]                                                                                                                                                                                                           | [{"widgetId":"rfkid_7","entity":"content","search":{"facet":{"all":true,"max":50}}}]                                                                                                                                                                                                           |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"facet":{"all":false}}}]                                                                                                                                                                                                                   | [{"widgetId":"rfkid_7","entity":"content","search":{"facet":{"all":false}}}]                                                                                                                                                                                                                   |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"facet":{"max":50}}}]                                                                                                                                                                                                                      | [{"widgetId":"rfkid_7","entity":"content","search":{"facet":{"max":50}}}]                                                                                                                                                                                                                      |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"facet":{"coverage":true}}}]                                                                                                                                                                                                               | [{"widgetId":"rfkid_7","entity":"content","search":{"facet":{"coverage":true}}}]                                                                                                                                                                                                               |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"facet":{"coverage":false}}}]                                                                                                                                                                                                              | [{"widgetId":"rfkid_7","entity":"content","search":{"facet":{"coverage":false}}}]                                                                                                                                                                                                              |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"facet":{"sort":{"name":"text","order":"asc"}}}}]                                                                                                                                                                                          | [{"widgetId":"rfkid_7","entity":"content","search":{"facet":{"sort":{"name":"text","order":"asc"}}}}]                                                                                                                                                                                          |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"facet":{"sort":{"name":"count","order":"desc"}}}}]                                                                                                                                                                                        | [{"widgetId":"rfkid_7","entity":"content","search":{"facet":{"sort":{"name":"count","order":"desc"}}}}]                                                                                                                                                                                        |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"facet":{"all":true,"coverage":true,"sort":{"name":"count","order":"desc"}}}}]                                                                                                                                                             | [{"widgetId":"rfkid_7","entity":"content","search":{"facet":{"all":true,"coverage":true,"sort":{"name":"count","order":"desc"}}}}]                                                                                                                                                             |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"facet":{"all":true,"types":[{"name":"type"}]}}}]                                                                                                                                                                                          | [{"widgetId":"rfkid_7","entity":"content","search":{"facet":{"all":true,"types":[{"name":"type"}]}}}]                                                                                                                                                                                          |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"facet":{"all":true,"types":[{"exclude":["type"],"name":"type"}]}}}]                                                                                                                                                                       | [{"widgetId":"rfkid_7","entity":"content","search":{"facet":{"all":true,"types":[{"exclude":["type"],"name":"type"}]}}}]                                                                                                                                                                       |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"facet":{"all":true,"types":[{"exclude":["test1","test2"],"name":"type"}]}}}]                                                                                                                                                              | [{"widgetId":"rfkid_7","entity":"content","search":{"facet":{"all":true,"types":[{"exclude":["test1","test2"],"name":"type"}]}}}]                                                                                                                                                              |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"facet":{"all":true,"types":[{"max":1,"name":"type"}]}}}]                                                                                                                                                                                  | [{"widgetId":"rfkid_7","entity":"content","search":{"facet":{"all":true,"types":[{"max":1,"name":"type"}]}}}]                                                                                                                                                                                  |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"facet":{"all":true,"types":[{"keyphrase": "test","name":"type"}]}}}]                                                                                                                                                                      | [{"widgetId":"rfkid_7","entity":"content","search":{"facet":{"all":true,"types":[{"keyphrase": "test","name":"type"}]}}}]                                                                                                                                                                      |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"facet":{"all":true,"types":[{"minCount": 1,"name":"type"}]}}}]                                                                                                                                                                            | [{"widgetId":"rfkid_7","entity":"content","search":{"facet":{"all":true,"types":[{"min_count": 1,"name":"type"}]}}}]                                                                                                                                                                           |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"facet":{"all":true,"types":[{"name":"type","sort":{"name":"text","order":"asc"}}]}}}]                                                                                                                                                     | [{"widgetId":"rfkid_7","entity":"content","search":{"facet":{"all":true,"types":[{"name":"type","sort":{"name":"text","order":"asc"}}]}}}]                                                                                                                                                     |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"facet":{"all":true,"types":[{"name":"type","sort":{"after":"facetid_eyJ0eXBlIjoiZXEiLCJuYW1lIjoidHlwZSIsInZhbHVlIjoiUHJvZHVjdCJ9","name":"text","order":"asc"}}]}}}]                                                                      | [{"widgetId":"rfkid_7","entity":"content","search":{"facet":{"all":true,"types":[{"name":"type","after":"facetid_eyJ0eXBlIjoiZXEiLCJuYW1lIjoidHlwZSIsInZhbHVlIjoiUHJvZHVjdCJ9","sort":{"name":"text","order":"asc"}}]}}}]                                                                      |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"facet":{"all":true,"types":[{"name":"type","filter":{"type":"and","values":["facetid_eyJ0eXBlIjoiZXEiLCJuYW1lIjoidHlwZSIsInZhbHVlIjoiR3VpZGVzIn0=","facetid_eyJ0eXBlIjoiZXEiLCJuYW1lIjoidHlwZSIsInZhbHVlIjoiRG9jdW1lbnRhdGlvbiJ9"]}}]}}}] | [{"widgetId":"rfkid_7","entity":"content","search":{"facet":{"all":true,"types":[{"name":"type","filter":{"type":"and","values":["facetid_eyJ0eXBlIjoiZXEiLCJuYW1lIjoidHlwZSIsInZhbHVlIjoiR3VpZGVzIn0=","facetid_eyJ0eXBlIjoiZXEiLCJuYW1lIjoidHlwZSIsInZhbHVlIjoiRG9jdW1lbnRhdGlvbiJ9"]}}]}}}] |
            | [{"widgetId":"rfkid_7","entity":"content", "search": {"sort": {}}}]                                                                                                                                                                                                                            | [{"widgetId":"rfkid_7","entity":"content", "search": {"sort": {}}}]                                                                                                                                                                                                                            |
            | [{"widgetId":"rfkid_7","entity":"content", "search": {"facet": {"types":[{"name":"type","filteringOptions":"Dynamic AND"}]}}}]                                                                                                                                                                 | [{"widgetId":"rfkid_7","entity":"content", "search": {"facet": {"types":[{"name":"type","filtering_options":["hard_filters","other_facet_values","own_values"]}]}}}]                                                                                                                           |
            | [{"widgetId":"rfkid_7","entity":"content", "search": {"facet": {"types":[{"name":"type","filteringOptions":"Dynamic OR"}]}}}]                                                                                                                                                                  | [{"widgetId":"rfkid_7","entity":"content", "search": {"facet": {"types":[{"name":"type","filtering_options":["hard_filters","other_facet_values"]}]}}}]                                                                                                                                        |
            | [{"widgetId":"rfkid_7","entity":"content", "search": {"facet": {"types":[{"name":"type","filteringOptions":"Static"}]}}}]                                                                                                                                                                      | [{"widgetId":"rfkid_7","entity":"content", "search": {"facet": {"types":[{"name":"type","filtering_options":["hard_filters"]}]}}}]                                                                                                                                                             |


    Scenario Outline: Developer requests search widget data from browser with invalid attributes
        Given the '/get-search-widget-data' page is loaded
        When the widget item parameters are:
            """
            {
                "items": <items>
            }
            """
        And the 'getSearchWidgetData' button is clicked
        Then an error is thrown: '<error_code>'

        Examples:
            | items                                                                                                                                          | error_code                                                                                                              |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"facet":{"max":150}}}]                                                                     | [IV-0014] Incorrect value for "max"​​. Set the value to an integer between 1 and 100 inclusive.                         |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"facet":{"max":0}}}]                                                                       | [IV-0014] Incorrect value for "max"​​. Set the value to an integer between 1 and 100 inclusive.                         |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"facet":{"types":[{"name":""}]}}}]                                                         | [IV-0016] Incorrect value for "name". Set the value to a non-empty string, and do not include spaces.                   |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"facet":{"types":[{"name":"t t"}]}}}]                                                      | [IV-0016] Incorrect value for "name". Set the value to a non-empty string, and do not include spaces.                   |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"facet":{"types":[{"max":0,"name":"t"}]}}}]                                                | [IV-0017] Incorrect value for "max" in "facet.types". Set the value to an integer between 1 and 100 inclusive.          |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"facet":{"types":[{"max":101,"name":"t"}]}}}]                                              | [IV-0017] Incorrect value for "max" in "facet.types". Set the value to an integer between 1 and 100 inclusive.          |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"facet":{"types":[{"keyphrase":"","name":"t"}]}}}]                                         | [IV-0018] Incorrect value for "keyphrase" in "facet.types". Set the value to a string between 1 and 100 inclusive.      |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"facet":{"types":[{"minCount":0,"name":"t"}]}}}]                                           | [IV-0019] Incorrect value for "minCount" in "facet.types". Set the value to an integer between 1 and 100 inclusive.     |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"facet":{"types":[{"minCount":101,"name":"t"}]}}}]                                         | [IV-0019] Incorrect value for "minCount" in "facet.types". Set the value to an integer between 1 and 100 inclusive.     |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"facet":{"types":[{"name":"t","sort":{"after":"","name":"text","order":"asc"}}]}}}]        | [IV-0020] Incorrect value for "after" in "facet.types". Set the value to a non-empty string, and do not include spaces. |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"facet":{"types":[{"name":"t","sort":{"after":" ","name":"text","order":"asc"}}]}}}]       | [IV-0020] Incorrect value for "after" in "facet.types". Set the value to a non-empty string, and do not include spaces. |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"facet":{"types":[{"name":"t","sort":{"after":"id1234","name":"count","order":"asc"}}]}}}] | [IV-0021] You must set ​"sort.name"​​ to ​"text"​​ if you use "​after"​​.                                               |

    Scenario Outline: Developer requests search widget data from browser with a valid payload using setter method
        Given the '/get-search-widget-data' page is loaded
        When the widget item parameters are:
            """
            {
                "items": <items>
            }
            """
        And the 'getSearchWidgetData' button is clicked
        Then the widget data request is sent with parameters:
            """
            {
                "items": <items_payload>
            }
            """

        Examples:
            | items                                                                                                                                                                                                                                                                                          | items_payload                                                                                                                                                                                                                                                                                  |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"facetSetter":{}}}]                                                                                                                                                                                                                        | [{"widgetId":"rfkid_7","entity":"content"}]                                                                                                                                                                                                                                                    |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"facetSetter":{"all":false,"max":50}}}]                                                                                                                                                                                                    | [{"widgetId":"rfkid_7","entity":"content","search":{"facet":{"all":false,"max":50}}}]                                                                                                                                                                                                          |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"facetSetter":{"all":true,"max":50}}}]                                                                                                                                                                                                     | [{"widgetId":"rfkid_7","entity":"content","search":{"facet":{"all":true,"max":50}}}]                                                                                                                                                                                                           |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"facetSetter":{"all":false}}}]                                                                                                                                                                                                             | [{"widgetId":"rfkid_7","entity":"content","search":{"facet":{"all":false}}}]                                                                                                                                                                                                                   |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"facetSetter":{"max":50}}}]                                                                                                                                                                                                                | [{"widgetId":"rfkid_7","entity":"content","search":{"facet":{"max":50}}}]                                                                                                                                                                                                                      |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"facetSetter":{"coverage":true}}}]                                                                                                                                                                                                         | [{"widgetId":"rfkid_7","entity":"content","search":{"facet":{"coverage":true}}}]                                                                                                                                                                                                               |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"facetSetter":{"coverage":false}}}]                                                                                                                                                                                                        | [{"widgetId":"rfkid_7","entity":"content","search":{"facet":{"coverage":false}}}]                                                                                                                                                                                                              |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"facetSetter":{"sort":{"name":"text","order":"asc"}}}}]                                                                                                                                                                                    | [{"widgetId":"rfkid_7","entity":"content","search":{"facet":{"sort":{"name":"text","order":"asc"}}}}]                                                                                                                                                                                          |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"facetSetter":{"sort":{"name":"count","order":"desc"}}}}]                                                                                                                                                                                  | [{"widgetId":"rfkid_7","entity":"content","search":{"facet":{"sort":{"name":"count","order":"desc"}}}}]                                                                                                                                                                                        |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"facetSetter":{"all":true,"coverage":true,"sort":{"name":"count","order":"desc"}}}}]                                                                                                                                                       | [{"widgetId":"rfkid_7","entity":"content","search":{"facet":{"all":true,"coverage":true,"sort":{"name":"count","order":"desc"}}}}]                                                                                                                                                             |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"facetSetter":{"types":[{"name":"type"}]}}}]                                                                                                                                                                                               | [{"widgetId":"rfkid_7","entity":"content","search":{"facet":{"types":[{"name":"type"}]}}}]                                                                                                                                                                                                     |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"facetSetter":{"all":true,"types":[{"exclude":["type"],"name":"type"}]}}}]                                                                                                                                                                 | [{"widgetId":"rfkid_7","entity":"content","search":{"facet":{"all":true,"types":[{"exclude":["type"],"name":"type"}]}}}]                                                                                                                                                                       |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"facetSetter":{"all":true,"types":[{"exclude":["test1","test2"],"name":"type"}]}}}]                                                                                                                                                        | [{"widgetId":"rfkid_7","entity":"content","search":{"facet":{"all":true,"types":[{"exclude":["test1","test2"],"name":"type"}]}}}]                                                                                                                                                              |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"facetSetter":{"all":true,"types":[{"max":1,"name":"type"}]}}}]                                                                                                                                                                            | [{"widgetId":"rfkid_7","entity":"content","search":{"facet":{"all":true,"types":[{"max":1,"name":"type"}]}}}]                                                                                                                                                                                  |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"facetSetter":{"all":true,"types":[{"keyphrase":"test","name":"type"}]}}}]                                                                                                                                                                 | [{"widgetId":"rfkid_7","entity":"content","search":{"facet":{"all":true,"types":[{"keyphrase":"test","name":"type"}]}}}]                                                                                                                                                                       |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"facetSetter":{"all":true,"types":[{"minCount":1,"name":"type"}]}}}]                                                                                                                                                                       | [{"widgetId":"rfkid_7","entity":"content","search":{"facet":{"all":true,"types":[{"min_count":1,"name":"type"}]}}}]                                                                                                                                                                            |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"facetSetter":{"all":true,"types":[{"name":"type","sort":{"name":"text","order":"asc"}}]}}}]                                                                                                                                               | [{"widgetId":"rfkid_7","entity":"content","search":{"facet":{"all":true,"types":[{"name":"type","sort":{"name":"text","order":"asc"}}]}}}]                                                                                                                                                     |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"facetSetter":{"all":true,"types":[{"name":"type","sort":{"after":"facetid_eyJ0eXBlIjoiZXEiLCJuYW1lIjoidHlwZSIsInZhbHVlIjoiUHJvZHVjdCJ9","name":"text","order":"asc"}}]}}}]                                                                | [{"widgetId":"rfkid_7","entity":"content","search":{"facet":{"all":true,"types":[{"name":"type","after":"facetid_eyJ0eXBlIjoiZXEiLCJuYW1lIjoidHlwZSIsInZhbHVlIjoiUHJvZHVjdCJ9","sort":{"name":"text","order":"asc"}}]}}}]                                                                      |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"facet":{"all":true,"types":[{"name":"type","filter":{"type":"and","values":["facetid_eyJ0eXBlIjoiZXEiLCJuYW1lIjoidHlwZSIsInZhbHVlIjoiR3VpZGVzIn0=","facetid_eyJ0eXBlIjoiZXEiLCJuYW1lIjoidHlwZSIsInZhbHVlIjoiRG9jdW1lbnRhdGlvbiJ9"]}}]}}}] | [{"widgetId":"rfkid_7","entity":"content","search":{"facet":{"all":true,"types":[{"name":"type","filter":{"type":"and","values":["facetid_eyJ0eXBlIjoiZXEiLCJuYW1lIjoidHlwZSIsInZhbHVlIjoiR3VpZGVzIn0=","facetid_eyJ0eXBlIjoiZXEiLCJuYW1lIjoidHlwZSIsInZhbHVlIjoiRG9jdW1lbnRhdGlvbiJ9"]}}]}}}] |

    Scenario Outline: Developer requests search widget data from browser with invalid attributes using setter method
        Given the '/get-search-widget-data' page is loaded
        When the widget item parameters are:
            """
            {
                "items": <items>
            }
            """
        And the 'getSearchWidgetData' button is clicked
        Then an error is thrown: '<error_code>'

        Examples:
            | items                                                                                                                                          | error_code                                                                                                              |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"facetSetter":{"max":150}}}]                                                               | [IV-0014] Incorrect value for "max"​​. Set the value to an integer between 1 and 100 inclusive.                         |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"facetSetter":{"max":0}}}]                                                                 | [IV-0014] Incorrect value for "max"​​. Set the value to an integer between 1 and 100 inclusive.                         |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"facet":{"types":[{"name":""}]}}}]                                                         | [IV-0016] Incorrect value for "name". Set the value to a non-empty string, and do not include spaces.                   |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"facet":{"types":[{"max":0,"name":"t"}]}}}]                                                | [IV-0017] Incorrect value for "max" in "facet.types". Set the value to an integer between 1 and 100 inclusive.          |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"facet":{"types":[{"max":101,"name":"t"}]}}}]                                              | [IV-0017] Incorrect value for "max" in "facet.types". Set the value to an integer between 1 and 100 inclusive.          |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"facet":{"types":[{"keyphrase":"","name":"t"}]}}}]                                         | [IV-0018] Incorrect value for "keyphrase" in "facet.types". Set the value to a string between 1 and 100 inclusive.      |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"facet":{"types":[{"minCount":0,"name":"t"}]}}}]                                           | [IV-0019] Incorrect value for "minCount" in "facet.types". Set the value to an integer between 1 and 100 inclusive.     |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"facet":{"types":[{"minCount":101,"name":"t"}]}}}]                                         | [IV-0019] Incorrect value for "minCount" in "facet.types". Set the value to an integer between 1 and 100 inclusive.     |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"facet":{"types":[{"name":"t","sort":{"after":" ","name":"text","order":"asc"}}]}}}]       | [IV-0020] Incorrect value for "after" in "facet.types". Set the value to a non-empty string, and do not include spaces. |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"facet":{"types":[{"name":"t","sort":{"after":"id1234","name":"count","order":"asc"}}]}}}] | [IV-0021] You must set ​"sort.name"​​ to ​"text"​​ if you use "​after"​​.                                               |

    Scenario Outline: Developer requests search widget data from browser for Sort with a valid payload
        Given the '/get-search-widget-data' page is loaded
        When the widget item parameters are:
            """
            {
                "items": <items>
            }
            """
        And the 'getSearchWidgetData' button is clicked
        Then the widget data request is sent with parameters:
            """
            {
                "items": <items_payload>
            }
            """

        Examples:
            | items                                                                                                                                                      | items_payload                                                                                                                                          |
            | [{"widgetId":"rfkid_7","entity":"content", "search": {"sort": {}}}]                                                                                        | [{"widgetId":"rfkid_7","entity":"content", "search": {"sort": {}}}]                                                                                    |
            | [{"widgetId":"rfkid_7","entity":"content", "search": {"sort": {"choices": true}}}]                                                                         | [{"widgetId":"rfkid_7","entity":"content", "search": {"sort": {"choices": true}}}]                                                                     |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"sort":{"choices":true,"value":[{"name":"color"}]}}}]                                                  | [{"widgetId":"rfkid_7","entity":"content","search":{"sort":{"choices":true,"value":[{"name":"color"}]}}}]                                              |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"sort":{"choices":true,"value":[{"name":"color", "order": "asc"}]}}}]                                  | [{"widgetId":"rfkid_7","entity":"content","search":{"sort":{"choices":true,"value":[{"name":"color","order": "asc"}]}}}]                               |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"sort":{"choices":true,"value":[{"name":"color", "order": "desc"},{"name":"size"}]}}}]                 | [{"widgetId":"rfkid_7","entity":"content","search":{"sort":{"choices":true,"value":[{"name":"color","order": "desc"},{"name":"size"}]}}}]              |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"sort":{"choices":true,"value":[{"name":"color"},{"name":"size"}]}}}]                                  | [{"widgetId":"rfkid_7","entity":"content","search":{"sort":{"choices":true,"value":[{"name":"color"},{"name":"size"}]}}}]                              |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"sort":{"choices":true,"value":[{"name":"color", "order": "desc"},{"name":"size", "order": "asc"}]}}}] | [{"widgetId":"rfkid_7","entity":"content","search":{"sort":{"choices":true,"value":[{"name":"color","order":"desc"},{"name":"size","order":"asc"}]}}}] |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"sort":{"value":[{"name":"color", "order": "desc"},{"name":"size", "order": "asc"}]}}}]                | [{"widgetId":"rfkid_7","entity":"content","search":{"sort":{"value":[{"name":"color","order":"desc"},{"name":"size","order":"asc"}]}}}]                |

    Scenario Outline: Developer requests search widget data from browser for Sort with a valid payload using setter method
        Given the '/get-search-widget-data' page is loaded
        When the widget item parameters are:
            """
            {
                "items": <items>
            }
            """
        And the 'getSearchWidgetData' button is clicked
        Then the widget data request is sent with parameters:
            """
            {
                "items": <items_payload>
            }
            """

        Examples:
            | items                                                                                                                                                            | items_payload                                                                                                                                          |
            | [{"widgetId":"rfkid_7","entity":"content", "search": {"sortSetter": {}}}]                                                                                        | [{"widgetId":"rfkid_7","entity":"content", "search": {"sort": {}}}]                                                                                    |
            | [{"widgetId":"rfkid_7","entity":"content", "search": {"sortSetter": {"choices": true}}}]                                                                         | [{"widgetId":"rfkid_7","entity":"content", "search": {"sort": {"choices": true}}}]                                                                     |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"sortSetter":{"choices":true,"value":[{"name":"color"}]}}}]                                                  | [{"widgetId":"rfkid_7","entity":"content","search":{"sort":{"choices":true,"value":[{"name":"color"}]}}}]                                              |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"sortSetter":{"choices":true,"value":[{"name":"color", "order": "asc"}]}}}]                                  | [{"widgetId":"rfkid_7","entity":"content","search":{"sort":{"choices":true,"value":[{"name":"color","order": "asc"}]}}}]                               |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"sortSetter":{"choices":true,"value":[{"name":"color", "order": "desc"},{"name":"size"}]}}}]                 | [{"widgetId":"rfkid_7","entity":"content","search":{"sort":{"choices":true,"value":[{"name":"color","order": "desc"},{"name":"size"}]}}}]              |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"sortSetter":{"choices":true,"value":[{"name":"color"},{"name":"size"}]}}}]                                  | [{"widgetId":"rfkid_7","entity":"content","search":{"sort":{"choices":true,"value":[{"name":"color"},{"name":"size"}]}}}]                              |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"sortSetter":{"choices":true,"value":[{"name":"color", "order": "desc"},{"name":"size", "order": "asc"}]}}}] | [{"widgetId":"rfkid_7","entity":"content","search":{"sort":{"choices":true,"value":[{"name":"color","order":"desc"},{"name":"size","order":"asc"}]}}}] |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"sortSetter":{"value":[{"name":"color", "order": "desc"},{"name":"size", "order": "asc"}]}}}]                | [{"widgetId":"rfkid_7","entity":"content","search":{"sort":{"value":[{"name":"color","order":"desc"},{"name":"size","order":"asc"}]}}}]                |

    Scenario Outline: Developer requests search widget data from browser for Sort with invalid attributes
        Given the '/get-search-widget-data' page is loaded
        When the widget item parameters are:
            """
            {
                "items": <items>
            }
            """
        And the 'getSearchWidgetData' button is clicked
        Then an error is thrown: '<error_code>'

        Examples:
            | items                                                                                                      | error_code                                                                                |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"sort":{"choices":true,"value":[{"name":""}]}}}]       | [IV-0026] Incorrect value for "name" in "sortValue". Set the value to a non-empty string. |
            | [{"widgetId":"rfkid_7","entity":"content","search":{"sort":{"choices":true,"value":[{"name":"      "}]}}}] | [IV-0026] Incorrect value for "name" in "sortValue". Set the value to a non-empty string. |


    Scenario Outline: Developer requests search widget data from browser for Suggetion with a valid payload
        Given the '/get-search-widget-data' page is loaded
        When the widget item parameters are:
            """
            {
                "items": <items>
            }
            """
        And the 'getSearchWidgetData' button is clicked
        Then the widget data request is sent with parameters:
            """
            {
                "items": <items_payload>
            }
            """

        Examples:
            | items                                                                                                                                                                                                                                                         | items_payload                                                                                                                                                                                                                                                   |
            | [{"widgetId":"rfkid_7","entity":"content", "search": {"suggestion": [{"name":"something"}]}}]                                                                                                                                                                 | [{"widgetId":"rfkid_7","entity":"content", "search": {"suggestion": [{"name": "something"}]}}]                                                                                                                                                                  |
            | [{"widgetId":"rfkid_7","entity":"content", "search": {"suggestion": [{"name":"something", "max": 10}]}}]                                                                                                                                                      | [{"widgetId":"rfkid_7","entity":"content", "search": {"suggestion": [{"name": "something","max": 10}]}}]                                                                                                                                                        |
            | [{"widgetId":"rfkid_7","entity":"content", "search": {"suggestion": [{"name":"something", "max": 10, "keyphraseFallback": false}]}}]                                                                                                                          | [{"widgetId":"rfkid_7","entity":"content", "search": {"suggestion": [{"name": "something","max": 10,"keyphrase_fallback": false}]}}]                                                                                                                            |
            | [{"widgetId":"rfkid_7","entity":"content", "search": {"suggestion": [{"name":"something", "max": 10, "keyphraseFallback": false,"exlude": ["test", "test2"]}]}}]                                                                                              | [{"widgetId":"rfkid_7","entity":"content", "search": {"suggestion": [{"name": "something","max": 10,"keyphrase_fallback": false, "exlude": ["test", "test2"]}]}}]                                                                                               |
            | [{"widgetId":"rfkid_7","entity":"content", "search": {"suggestion": [{"name":"something", "max": 10, "keyphraseFallback": false,"exlude": ["test", "test2"]},{"name":"something_else", "max": 10, "keyphraseFallback": false,"exlude": ["test", "test2"]}]}}] | [{"widgetId":"rfkid_7","entity":"content", "search": {"suggestion": [{"name": "something","max": 10,"keyphrase_fallback": false, "exlude": ["test", "test2"]},{"name":"something_else", "max": 10, "keyphrase_fallback": false,"exlude": ["test", "test2"]}]}}] |


    Scenario Outline: Developer requests search widget data from browser for Suggetion with a valid payload from setter method
        Given the '/get-search-widget-data' page is loaded
        When the widget item parameters are:
            """
            {
                "items": <items>
            }
            """
        And the 'getSearchWidgetData' button is clicked
        Then the widget data request is sent with parameters:
            """
            {
                "items": <items_payload>
            }
            """

        Examples:
            | items                                                                                                                                                                                                                                                               | items_payload                                                                                                                                                                                                                                                   |
            | [{"widgetId":"rfkid_7","entity":"content", "search": {"suggestionSetter": [{"name":"something"}]}}]                                                                                                                                                                 | [{"widgetId":"rfkid_7","entity":"content", "search": {"suggestion": [{"name": "something"}]}}]                                                                                                                                                                  |
            | [{"widgetId":"rfkid_7","entity":"content", "search": {"suggestionSetter": [{"name":"something", "max": 10}]}}]                                                                                                                                                      | [{"widgetId":"rfkid_7","entity":"content", "search": {"suggestion": [{"name": "something","max": 10}]}}]                                                                                                                                                        |
            | [{"widgetId":"rfkid_7","entity":"content", "search": {"suggestionSetter": [{"name":"something", "max": 10, "keyphraseFallback": false}]}}]                                                                                                                          | [{"widgetId":"rfkid_7","entity":"content", "search": {"suggestion": [{"name": "something","max": 10,"keyphrase_fallback": false}]}}]                                                                                                                            |
            | [{"widgetId":"rfkid_7","entity":"content", "search": {"suggestionSetter": [{"name":"something", "max": 10, "keyphraseFallback": false,"exlude": ["test", "test2"]}]}}]                                                                                              | [{"widgetId":"rfkid_7","entity":"content", "search": {"suggestion": [{"name": "something","max": 10,"keyphrase_fallback": false, "exlude": ["test", "test2"]}]}}]                                                                                               |
            | [{"widgetId":"rfkid_7","entity":"content", "search": {"suggestionSetter": [{"name":"something", "max": 10, "keyphraseFallback": false,"exlude": ["test", "test2"]},{"name":"something_else", "max": 10, "keyphraseFallback": false,"exlude": ["test", "test2"]}]}}] | [{"widgetId":"rfkid_7","entity":"content", "search": {"suggestion": [{"name": "something","max": 10,"keyphrase_fallback": false, "exlude": ["test", "test2"]},{"name":"something_else", "max": 10, "keyphrase_fallback": false,"exlude": ["test", "test2"]}]}}] |

    Scenario Outline: Developer requests search widget data from browser for Suggestion with invalid attributes
        Given the '/get-search-widget-data' page is loaded
        When the widget item parameters are:
            """
            {
                "items": <items>
            }
            """
        And the 'getSearchWidgetData' button is clicked
        Then an error is thrown: '<error_code>'

        Examples:
            | items                                                                                                      | error_code                                                                                            |
            | [{"widgetId":"rfkid_7","entity":"content","search": {"suggestion": [{"name":"something "}]}}]              | [IV-0016] Incorrect value for "name". Set the value to a non-empty string, and do not include spaces. |
            | [{"widgetId":"rfkid_7","entity":"content","search": {"suggestion": [{"name":""}]}}]                        | [IV-0016] Incorrect value for "name". Set the value to a non-empty string, and do not include spaces. |
            | [{"widgetId":"rfkid_7","entity":"content","search": {"suggestion": [{"name":" "}]}}]                       | [IV-0016] Incorrect value for "name". Set the value to a non-empty string, and do not include spaces. |
            | [{"widgetId":"rfkid_7","entity":"content","search": {"suggestion": [{"name":" "}, {"name":"something"}]}}] | [IV-0016] Incorrect value for "name". Set the value to a non-empty string, and do not include spaces. |
            | [{"widgetId":"rfkid_7","entity":"content","search": {"suggestion": [{"name":"something","max": 0}]}}]      | [IV-0014] Incorrect value for "max"​​. Set the value to an integer between 1 and 100 inclusive.       |
            | [{"widgetId":"rfkid_7","entity":"content","search": {"suggestion": [{"name":"something","max": 101} ]}}]   | [IV-0014] Incorrect value for "max"​​. Set the value to an integer between 1 and 100 inclusive.       |
            | [{"widgetId":"rfkid_7","entity":"content","search": {"suggestion": [{"name":"something","max": -1}]}}]     | [IV-0014] Incorrect value for "max"​​. Set the value to an integer between 1 and 100 inclusive.       |

    Scenario Outline: Developer requests search widget data from browser for Personalization with a valid payload
        Given the '/get-search-widget-data' page is loaded
        When the widget item parameters are:
            """
            {
                "items": <items>
            }
            """
        And the 'getSearchWidgetData' button is clicked
        Then the widget data request is sent with parameters:
            """
            {
                "items": <items_payload>
            }
            """

        Examples:
            | items                                                                                                                                                                       | items_payload                                                                                                                                                    |
            | [{"widgetId":"rfkid_7","entity":"content", "search": {"personalization": {"algorithm": "affinity", "attributes": ["somefield1"] }}}]                                        | [{"widgetId":"rfkid_7","entity":"content", "search": {"personalization":{"algorithm":"affinity","fields": ["somefield1"]}}}]                                     |
            | [{"widgetId":"rfkid_7","entity":"content", "search": {"personalization": {"algorithm": "mlt", "attributes": ["somefield1"], "ids": ["someid"] }}}]                          | [{"widgetId":"rfkid_7","entity":"content", "search": {"personalization":{"algorithm":"mlt","fields": ["somefield1"],"ids": ["someid"]}}}]                        |
            | [{"widgetId":"rfkid_7","entity":"content", "search": {"personalization": {"algorithm": "mlt", "attributes": ["somefield1", "somefield2"], "ids": ["someid", "someid2"] }}}] | [{"widgetId":"rfkid_7","entity":"content", "search": {"personalization":{"algorithm":"mlt","fields": ["somefield1","somefield2"],"ids": ["someid","someid2"]}}}] |


    Scenario Outline: Developer requests search widget data from browser for Personalization with a valid payload using Setter Method
        Given the '/get-search-widget-data' page is loaded
        When the widget item parameters are:
            """
            {
                "items": <items>
            }
            """
        And the 'getSearchWidgetData' button is clicked
        Then the widget data request is sent with parameters:
            """
            {
                "items": <items_payload>
            }
            """

        Examples:
            | items                                                                                                                                                                             | items_payload                                                                                                                                                    |
            | [{"widgetId":"rfkid_7","entity":"content", "search": {"personalizationSetter": {"algorithm": "affinity", "attributes": ["somefield"] }}}]                                         | [{"widgetId":"rfkid_7","entity":"content", "search": {"personalization":{"algorithm":"affinity", "fields": ["somefield"] }}}]                                    |
            | [{"widgetId":"rfkid_7","entity":"content", "search": {"personalizationSetter": {"algorithm": "mlt", "attributes": ["somefield1"], "ids": ["someid"] }}}]                          | [{"widgetId":"rfkid_7","entity":"content", "search": {"personalization":{"algorithm":"mlt","fields": ["somefield1"],"ids": ["someid"]}}}]                        |
            | [{"widgetId":"rfkid_7","entity":"content", "search": {"personalizationSetter": {"algorithm": "mlt", "attributes": ["somefield1", "somefield2"], "ids": ["someid", "someid2"] }}}] | [{"widgetId":"rfkid_7","entity":"content", "search": {"personalization":{"algorithm":"mlt","fields": ["somefield1","somefield2"],"ids": ["someid","someid2"]}}}] |



    Scenario Outline: Developer requests search widget data from browser for Personalization with an invalid payload
        Given the '/get-search-widget-data' page is loaded
        When the widget item parameters are:
            """
            {
                "items": <items>
            }
            """
        And the 'getSearchWidgetData' button is clicked
        Then an error is thrown: '<error_code>'

        Examples:
            | items                                                                                                                                                         | error_code                                                                                                                 |
            | [{"widgetId":"rfkid_7","entity":"content", "search": {"personalization": {"algorithm": "mlt", "attributes": ["somefield1 "], "ids": ["someid"] }}}]           | [IV-0030] Incorrect value in "personalization.attributes". Set the value to a non-empty string, and do not include spaces. |
            | [{"widgetId":"rfkid_7","entity":"content", "search": {"personalizationSetter": {"algorithm": "mlt", "attributes": ["somefield1 "], "ids": ["someid"] }}}]     | [IV-0030] Incorrect value in "personalization.attributes". Set the value to a non-empty string, and do not include spaces. |
            | [{"widgetId":"rfkid_7","entity":"content", "search": {"personalization": {"algorithm": "mlt", "attributes": ["somefield1", " "], "ids": ["someid"] }}}]       | [IV-0030] Incorrect value in "personalization.attributes". Set the value to a non-empty string, and do not include spaces. |
            | [{"widgetId":"rfkid_7","entity":"content", "search": {"personalizationSetter": {"algorithm": "mlt", "attributes": ["somefield1", " "], "ids": ["someid"] }}}] | [IV-0030] Incorrect value in "personalization.attributes". Set the value to a non-empty string, and do not include spaces. |
            | [{"widgetId":"rfkid_7","entity":"content", "search": {"personalization": {"algorithm": "mlt", "attributes": ["somefield1"], "ids": ["someid", " "] }}}]       | [IV-0031] Incorrect value in "personalization.ids". Set the value to a non-empty string.                                   |
            | [{"widgetId":"rfkid_7","entity":"content", "search": {"personalizationSetter": {"algorithm": "mlt", "attributes": ["somefield1"], "ids": ["someid", " "] }}}] | [IV-0031] Incorrect value in "personalization.ids". Set the value to a non-empty string.                                   |


    Scenario Outline: Developer requests search widget data from browser for Ranking with a valid payload
        Given the '/get-search-widget-data' page is loaded
        When the widget item parameters are:
            """
            {
                "items": <items>
            }
            """
        And the 'getSearchWidgetData' button is clicked
        Then the widget data request is sent with parameters:
            """
            {
                "items": <items_payload>
            }
            """

        Examples:
            | items                                                                                                                                             | items_payload                                                                                                                                 |
            | [{"widgetId":"rfkid_7","entity":"content", "search": {"ranking": [{"name": "somename" }]}}]                                                       | [{"widgetId":"rfkid_7","entity":"content", "search": {"ranking":[{"name":"somename"}]}}]                                                      |
            | [{"widgetId":"rfkid_7","entity":"content", "search": {"ranking": [{"name": "somename", "weight": 100 }]}}]                                        | [{"widgetId":"rfkid_7","entity":"content", "search": {"ranking":[{"name":"somename", "weight":100}]}}]                                        |
            | [{"widgetId":"rfkid_7","entity":"content", "search": {"ranking": [{"name": "somename", "weight": 0.1 }]}}]                                        | [{"widgetId":"rfkid_7","entity":"content", "search": {"ranking":[{"name":"somename", "weight":0.1}]}}]                                        |
            | [{"widgetId":"rfkid_7","entity":"content", "search": {"ranking": [{"name": "somename", "weight": 1 },{"name": "someothername", "weight": 10 }]}}] | [{"widgetId":"rfkid_7","entity":"content", "search": {"ranking":[{"name":"somename", "weight":1},{"name": "someothername", "weight": 10 }]}}] |



    Scenario Outline: Developer requests search widget data from browser for Ranking with a valid payload using the Setter Method
        Given the '/get-search-widget-data' page is loaded
        When the widget item parameters are:
            """
            {
                "items": <items>
            }
            """
        And the 'getSearchWidgetData' button is clicked
        Then the widget data request is sent with parameters:
            """
            {
                "items": <items_payload>
            }
            """

        Examples:
            | items                                                                                                                                                   | items_payload                                                                                                                                 |
            | [{"widgetId":"rfkid_7","entity":"content", "search": {"rankingSetter": [{"name": "somename" }]}}]                                                       | [{"widgetId":"rfkid_7","entity":"content", "search": {"ranking":[{"name":"somename"}]}}]                                                      |
            | [{"widgetId":"rfkid_7","entity":"content", "search": {"rankingSetter": [{"name": "somename", "weight": 100 }]}}]                                        | [{"widgetId":"rfkid_7","entity":"content", "search": {"ranking":[{"name":"somename", "weight":100}]}}]                                        |
            | [{"widgetId":"rfkid_7","entity":"content", "search": {"rankingSetter": [{"name": "somename", "weight": 0.1 }]}}]                                        | [{"widgetId":"rfkid_7","entity":"content", "search": {"ranking":[{"name":"somename", "weight":0.1}]}}]                                        |
            | [{"widgetId":"rfkid_7","entity":"content", "search": {"rankingSetter": [{"name": "somename", "weight": 1 },{"name": "someothername", "weight": 10 }]}}] | [{"widgetId":"rfkid_7","entity":"content", "search": {"ranking":[{"name":"somename", "weight":1},{"name": "someothername", "weight": 10 }]}}] |
            | [{"widgetId":"rfkid_7","entity":"content", "search": {"rankingSetter": [{"name": "somename" },{"name": "someothername", "weight": 10 }]}}]              | [{"widgetId":"rfkid_7","entity":"content", "search": {"ranking":[{"name":"somename"},{"name": "someothername", "weight": 10 }]}}]             |



    Scenario Outline: Developer requests search widget data from browser for Ranking with an invalid payload
        Given the '/get-search-widget-data' page is loaded
        When the widget item parameters are:
            """
            {
                "items": <items>
            }
            """
        And the 'getSearchWidgetData' button is clicked
        Then an error is thrown: '<error_code>'

        Examples:
            | items                                                                                                                                              | error_code                                                                                                          |
            | [{"widgetId":"rfkid_7","entity":"content", "search": {"ranking": [{"name": "" }]}}]                                                                | [IV-0016] Incorrect value for "name". Set the value to a non-empty string, and do not include spaces.               |
            | [{"widgetId":"rfkid_7","entity":"content", "search": {"ranking": [{"name": " " }]}}]                                                               | [IV-0016] Incorrect value for "name". Set the value to a non-empty string, and do not include spaces.               |
            | [{"widgetId":"rfkid_7","entity":"content", "search": {"ranking": [{"name": "somename" }, {"name":""}]}}]                                           | [IV-0016] Incorrect value for "name". Set the value to a non-empty string, and do not include spaces.               |
            | [{"widgetId":"rfkid_7","entity":"content", "search": {"ranking": [{"name": "somename", "weight": 101 }]}}]                                         | [IV-0029] Incorrect value for "ranking.weight". Set the value to an integer or float between 0.1 and 100 inclusive. |
            | [{"widgetId":"rfkid_7","entity":"content", "search": {"ranking": [{"name": "somename", "weight": 0 }]}}]                                           | [IV-0029] Incorrect value for "ranking.weight". Set the value to an integer or float between 0.1 and 100 inclusive. |
            | [{"widgetId":"rfkid_7","entity":"content", "search": {"ranking": [{"name": "somename", "weight": 10 }, {"name": "someothername", "weight": -1}]}}] | [IV-0029] Incorrect value for "ranking.weight". Set the value to an integer or float between 0.1 and 100 inclusive. |

    Scenario Outline: Developer requests search widget data from browser for disableGrouping with a valid payload
        Given the '/get-search-widget-data' page is loaded
        When the widget item parameters are:
            """
            {
                "items": <items>
            }
            """
        And the 'getSearchWidgetData' button is clicked
        Then the widget data request is sent with parameters:
            """
            {
                "items": <items_payload>
            }
            """

        Examples:
            | items                                                                             | items_payload                                                                      |
            | [{"widgetId":"rfkid_7","entity":"content", "search": {"disableGrouping": false}}] | [{"widgetId":"rfkid_7","entity":"content", "search": {"disable_grouping": false}}] |
            | [{"widgetId":"rfkid_7","entity":"content", "search": {"disableGrouping": true}}]  | [{"widgetId":"rfkid_7","entity":"content", "search": {"disable_grouping": true}}]  |

