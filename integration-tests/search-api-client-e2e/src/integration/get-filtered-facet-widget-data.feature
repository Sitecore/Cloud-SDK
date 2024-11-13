Feature: Request search facet widget data from Search REST API

    Scenario Outline: Developer requests search filtered widget data from browser with a valid payload
        Given the '/get-filtered-facet-widget-data' page is loaded
        When the widget item parameters are:
            """
            {
                "items": <items_payload>
            }
            """
        And the 'getFilteredWidgetData' button is clicked
        Then the widget data request is sent with filters:
            """
            {
                "items": <expected_payload>
            }
            """

        Examples:
            | items_payload                                                                                                                                                 | expected_payload                                                                                                                                               |
            | {"types":[{"name":"type", "filter": {"type":"or","values":[{"type":"gt","value":"test1"}]}}]}                                                                 | {"types":[{"name":"type", "filter": {"type":"or","values":[{"type":"gt","value":"test1"}]}}]}                                                                  |
            | {"types":[{"name":"type", "filter": {"type":"or","values":[{"type":"lt","value":"test1"}]}}]}                                                                 | {"types":[{"name":"type", "filter": {"type":"or","values":[{"type":"lt","value":"test1"}]}}]}                                                                  |
            | {"types":[{"name":"type", "filter": {"type":"or","values":[{"type":"eq","value":"test1"}]}}]}                                                                 | {"types":[{"name":"type", "filter": {"type":"or","values":[{"type":"eq","value":"test1"}]}}]}                                                                  |
            | {"types":[{"name":"type", "filter": {"type":"or","values":[{"type":"gte","value":"test1"}]}}]}                                                                | {"types":[{"name":"type", "filter": {"type":"or","values":[{"type":"gte","value":"test1"}]}}]}                                                                 |
            | {"types":[{"name":"type", "filter": {"type":"or","values":[{"type":"lte","value":"test1"}]}}]}                                                                | {"types":[{"name":"type", "filter": {"type":"or","values":[{"type":"lte","value":"test1"}]}}]}                                                                 |
            | {"types":[{"name":"type", "filter": {"type":"or","values":[{"type":"or","value":[{"type":"eq","value":"test1"}]}]}}]}                                         | {"types":[{"name":"type", "filter": {"type":"or","values":[{"type":"or","filters":[{"type":"eq","value":"test1"}]}]}}]}                                        |
            | {"types":[{"name":"type", "filter": {"type":"or","values":[{"type":"not","value":{"type":"eq","value":"cdp"}}]}}]}                                            | {"types":[{"name":"type", "filter": {"type":"or","values":[{"type":"not","filter":{"type":"eq","value":"cdp"}}]}}]}                                            |
            | {"types":[{"name":"type", "filter": {"type":"or","values":[{"type":"not","value":"facetid_eyJ0eXBlIjoiZXEiLCJuYW1lIjoidHlwZSIsInZhbHVlIjoiR3VpZGVzIn0="}]}}]} | {"types":[{"name":"type", "filter": {"type":"or","values":[{"type":"not","filter":"facetid_eyJ0eXBlIjoiZXEiLCJuYW1lIjoidHlwZSIsInZhbHVlIjoiR3VpZGVzIn0="}]}}]} |
            | {"types":[{"name":"type", "filter": {"type":"or","values":[{"type":"allOf","value":["test1","test2"]}]}}]}                                                    | {"types":[{"name":"type", "filter": {"type":"or","values":[{"type":"allOf","values":["test1", "test2"]}]}}]}                                                   |
            | {"types":[{"name":"type", "filter": {"type":"or","values":[{"type":"anyOf","value":["test1","test2"]}]}}]}                                                    | {"types":[{"name":"type", "filter": {"type":"or","values":[{"type":"anyOf","values":["test1", "test2"]}]}}]}                                                   |
