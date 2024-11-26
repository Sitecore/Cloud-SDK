Feature: Developer initialize perosnalize package with or without enable personalize cookie

    Scenario Outline: Developer calls personalize from middleware with enablePersonalizeCookie set to true
        Given the 'sc_[sitecoreContextId]_personalize' domain cookie is not created
        When the '/create-cookie' page is loaded with 'testID' name and 'initWithEnablePersonalizeCookieFromMiddleware' value query parameter
        Then the cookie is automatically set with the correct guestId value for the user

    Scenario Outline: Developer calls personalize from middleware with enablePersonalizeCookie set to false
        When the '/create-cookie' page is loaded with 'testID' name and 'initWithoutEnablePersonalizeCookieFromMiddleware' value query parameter
        Then the personalization cookie should not exist

    Scenario: A guestId cookie already exists on the page, enablePersonalizeCookie set to true doesn't create a new cookie but updates TTL
        Given the '/create-cookie' page is loaded with 'testID' name and 'initWithEnablePersonalizeCookieFromMiddlewareTTL' value query parameter
        And server guest id cookie is created on the '/create-personalize-cookie' page
        When the '/create-cookie' page is loaded with 'testID' name and 'initWithEnablePersonalizeCookieFromMiddlewareTTL' value query parameter
        Then the server updates the TTL of the guest id cookie according to the settings

    Scenario Outline: Developer calls personalize from browser with enablePersonalizeCookie set to true
        Given the '/create-cookie' page is loaded without init function
        When the 'initPersonalizeWithCookieEnabled' button is clicked
        Then the cookie is automatically set with the correct guestId value for the user

    Scenario Outline: Developer calls personalize from browser with enablePersonalizeCookie set to false
        Given the '/create-cookie' page is loaded without init function
        When the 'initPersonalizeWithoutCookieEnabled' button is clicked
        Then the personalization cookie should not exist