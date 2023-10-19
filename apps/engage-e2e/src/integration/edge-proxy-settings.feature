Feature: Edge Proxy contextId and siteId settings in init function

Scenario Outline: Developer sets invalid siteId parameter for initialization settings on the browser
    Given the '<page>' page is loaded without init function
    When the '<button>' button is clicked
    Then an error is thrown: '<error>' 

    Examples:
        | page                             | button                 | error                              |
        | /edge-proxy-settings-events      | initInvalidSiteId      | [MV-0002] "siteId" is required.    |
        | /edge-proxy-settings-events      | initUndefinedSiteId    | [MV-0002] "siteId" is required.    |
        | /edge-proxy-settings-personalize | initInvalidSiteId      | [MV-0002] "siteId" is required.    |
        | /edge-proxy-settings-personalize | initUndefinedSiteId    | [MV-0002] "siteId" is required.    |

Scenario Outline: Developer sets invalid contextId parameter for initialization settings on the browser
    Given the '<page>' page is loaded without init function
    When the '<button>' button is clicked
    Then an error is thrown: '<error>' 

    Examples:
        | page                             | button                 | error                              |
        | /edge-proxy-settings-events      | initInvalidContextId   | [MV-0001] "contextId" is required. |
        | /edge-proxy-settings-events      | initUndefinedContextId | [MV-0001] "contextId" is required. |
        | /edge-proxy-settings-personalize | initInvalidContextId   | [MV-0001] "contextId" is required. |
        | /edge-proxy-settings-personalize | initUndefinedContextId | [MV-0001] "contextId" is required. |


Scenario Outline: Developer sets invalid contextId parameter for Initialization settings on the server
    Given the '<page>' page is loaded without init function
    Then the '<error>' string is printed in 'serverResponse' element

    Examples:
        | page                                                                                         |  error                              |
        | /edge-proxy-settings-events?serverSideTest=true&attribute=contextid&variation=invalid        |  [MV-0001] "contextId" is required. |
        | /edge-proxy-settings-events?serverSideTest=true&attribute=contextid&variation=undefined      |  [MV-0001] "contextId" is required. |
        | /edge-proxy-settings-personalize?serverSideTest=true&attribute=contextid&variation=invalid   |  [MV-0001] "contextId" is required. |
        | /edge-proxy-settings-personalize?serverSideTest=true&attribute=contextid&variation=undefined |  [MV-0001] "contextId" is required. |

Scenario Outline: Developer sets invalid siteId parameter for Initialization settings on the server
    Given the '<page>' page is loaded without init function
    Then the '<error>' string is printed in 'serverResponse' element

    Examples:
        | page                                                                                         |  error                              |
        | /edge-proxy-settings-events?serverSideTest=true&attribute=siteid&variation=invalid           |  [MV-0002] "siteId" is required.    |
        | /edge-proxy-settings-events?serverSideTest=true&attribute=siteid&variation=undefined         |  [MV-0002] "siteId" is required.    |
        | /edge-proxy-settings-personalize?serverSideTest=true&attribute=siteid&variation=invalid      |  [MV-0002] "siteId" is required.    |
        | /edge-proxy-settings-personalize?serverSideTest=true&attribute=siteid&variation=undefined    |  [MV-0002] "siteId" is required.    |

Scenario Outline: Developer sets valid parameters for Initialization settings on the browser
    Given the '/edge-proxy-settings-events' page is loaded without init function
    When the 'initHappyPath' button is clicked
    Then no error is thrown

Scenario Outline: Developer sets valid parameters for Initialization settings on the browser
    Given the '/edge-proxy-settings-personalize' page is loaded without init function
    When the 'initHappyPath' button is clicked
    Then no error is thrown

Scenario Outline: Developer sets valid parameters for Initialization settings on the server
    Given the '/edge-proxy-settings-events?serverSideTest=true' page is loaded without init function
    Then the 'no error' string is printed in 'serverResponse' element

Scenario Outline: Developer sets valid parameters for Initialization settings on the server
    Given the '/edge-proxy-settings-personalize?serverSideTest=true' page is loaded without init function
    Then the 'no error' string is printed in 'serverResponse' element