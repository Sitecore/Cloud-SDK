Feature: Edge Proxy sitecoreEdgeContextId and siteName settings in init function

Scenario Outline: Developer sets invalid siteName parameter for initialization settings on the browser
    Given the '<page>' page is loaded without init function
    When the '<button>' button is clicked
    Then an error is thrown: '<error>' 

    Examples:
        | page                             | button                 | error                              |
        | /edge-proxy-settings-events      | initInvalidSiteName      | [MV-0002] "siteName" is required.    |
        | /edge-proxy-settings-events      | initUndefinedSiteName    | [MV-0002] "siteName" is required.    |
        | /edge-proxy-settings-personalize | initInvalidSiteName      | [MV-0002] "siteName" is required.    |
        | /edge-proxy-settings-personalize | initUndefinedSiteName    | [MV-0002] "siteName" is required.    |

Scenario Outline: Developer sets invalid sitecoreEdgeContextId parameter for initialization settings on the browser
    Given the '<page>' page is loaded without init function
    When the '<button>' button is clicked
    Then an error is thrown: '<error>' 

    Examples:
        | page                             | button                              | error                                          |
        | /edge-proxy-settings-events      | initInvalidSitecoreEdgeContextId    | [MV-0001] "sitecoreEdgeContextId" is required. |
        | /edge-proxy-settings-events      | initUndefinedSitecoreEdgeContextId  | [MV-0001] "sitecoreEdgeContextId" is required. |
        | /edge-proxy-settings-personalize | initInvalidSitecoreEdgeContextId    | [MV-0001] "sitecoreEdgeContextId" is required. |
        | /edge-proxy-settings-personalize | initUndefinedSitecoreEdgeContextId  | [MV-0001] "sitecoreEdgeContextId" is required. |


Scenario Outline: Developer sets invalid sitecoreEdgeContextId parameter for Initialization settings on the server
    Given the '<page>' page is loaded without init function
    Then the '<error>' string is printed in 'serverResponse' element

    Examples:
        | page                                                                                                     |  error                                          |
        | /edge-proxy-settings-events?serverSideTest=true&attribute=sitecoreEdgeContextId&variation=invalid        |  [MV-0001] "sitecoreEdgeContextId" is required. |
        | /edge-proxy-settings-events?serverSideTest=true&attribute=sitecoreEdgeContextId&variation=undefined      |  [MV-0001] "sitecoreEdgeContextId" is required. |
        | /edge-proxy-settings-personalize?serverSideTest=true&attribute=sitecoreEdgeContextId&variation=invalid   |  [MV-0001] "sitecoreEdgeContextId" is required. |
        | /edge-proxy-settings-personalize?serverSideTest=true&attribute=sitecoreEdgeContextId&variation=undefined |  [MV-0001] "sitecoreEdgeContextId" is required. |

Scenario Outline: Developer sets invalid siteName parameter for Initialization settings on the server
    Given the '<page>' page is loaded without init function
    Then the '<error>' string is printed in 'serverResponse' element

    Examples:
        | page                                                                                         |  error                              |
        | /edge-proxy-settings-events?serverSideTest=true&attribute=siteName&variation=invalid           |  [MV-0002] "siteName" is required.    |
        | /edge-proxy-settings-events?serverSideTest=true&attribute=siteName&variation=undefined         |  [MV-0002] "siteName" is required.    |
        | /edge-proxy-settings-personalize?serverSideTest=true&attribute=siteName&variation=invalid      |  [MV-0002] "siteName" is required.    |
        | /edge-proxy-settings-personalize?serverSideTest=true&attribute=siteName&variation=undefined    |  [MV-0002] "siteName" is required.    |

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