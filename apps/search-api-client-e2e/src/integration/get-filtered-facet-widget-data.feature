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
    | items_payload                                                                                  | expected_payload |
    | {"types":[{"name":"type", "filter": {"type":"or","values":[{"type":"gt","value":"test1"}]}}]}  | {"types":[{"name":"type", "filter": {"type":"or","values":[{"type":"gt","value":"test1"}]}}]} |
    | {"types":[{"name":"type", "filter": {"type":"or","values":[{"type":"lt","value":"test1"}]}}]}  | {"types":[{"name":"type", "filter": {"type":"or","values":[{"type":"lt","value":"test1"}]}}]} |
    | {"types":[{"name":"type", "filter": {"type":"or","values":[{"type":"eq","value":"test1"}]}}]}  | {"types":[{"name":"type", "filter": {"type":"or","values":[{"type":"eq","value":"test1"}]}}]} |
    | {"types":[{"name":"type", "filter": {"type":"or","values":[{"type":"gte","value":"test1"}]}}]} | {"types":[{"name":"type", "filter": {"type":"or","values":[{"type":"gte","value":"test1"}]}}]} |
    | {"types":[{"name":"type", "filter": {"type":"or","values":[{"type":"lte","value":"test1"}]}}]} | {"types":[{"name":"type", "filter": {"type":"or","values":[{"type":"lte","value":"test1"}]}}]} |
    | {"types":[{"name":"type", "filter": {"type":"or","values":[{"type":"or","value":[{"type":"eq","value":"test1"}]}]}}]} | {"types":[{"name":"type", "filter": {"type":"or","values":[{"type":"or","filters":[{"type":"eq","value":"test1"}]}]}}]} |
