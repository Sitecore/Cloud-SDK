Feature: Auto-populate geolocation data in NextJS middleware

    Scenario: Geolocation data is available in the request.geo object
        Given the '/geolocation' page is loaded with 'testID' name and 'requestGeoFromMiddleware' value query parameter
        Then the request with id '<testID>' will contain:
            """
            "geo":{"city":"Athens","country":"GR","region":"I"
            """
        Examples:
            | testID                   |
            | requestGeoFromMiddleware |

    Scenario: Partial geolocation data is available in the request.geo object
        Given the '/geolocation' page is loaded with 'testID' name and 'requestPartialGeoFromMiddleware' value query parameter
        Then the request with id '<testID>' will contain:
            """
            "geo":{"city":"Athens","region":"I"
            """
        Examples:
            | testID                          |
            | requestPartialGeoFromMiddleware |

    Scenario: No geolocation data is available in the request.geo object
        Given the '/geolocation' page is loaded with 'testID' name and 'requestNoGeoFromMiddleware' value query parameter
        Then the request with id '<testID>' will not contain the 'geo' in the body
        Examples:
            | testID                     |
            | requestNoGeoFromMiddleware |

    Scenario: Geolocation data is available in the request.geo object and in personalizeInput
        Given the '/geolocation' page is loaded with 'testID' name and 'requestOmitGeoFromMiddleware' value query parameter
        Then the request with id '<testID>' will contain:
            """
            "geo":{"city":"Tarnów","country":"PL","region":"12"
            """
        Examples:
            | testID                       |
            | requestOmitGeoFromMiddleware |