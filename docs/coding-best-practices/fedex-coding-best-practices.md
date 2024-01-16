# FEDEx team coding best practices

**"Perfection is achieved, not when there is nothing more to add, but when there is nothing left to take away"**
_Antoine de Saint-Exupery_

This file contains what our team calls **best coding practises**. The team agreed to follow these rules to make the codebase more maintainable and readable. The rules are always open for extension and change.

# Table of contents

1. [Readability](#readability)

2. [Comments](#comments)

3. [Variables](#variables)

4. [Functions](#functions)

5. [As you plan](#as-you-plan)

6. [As you code](#as-you-code)

# Readability

## Avoid nested functions calls

```ts
// AVOID
const sum = calculateSum(filterOddNumbers(filterIntegerNumbers(numbersArray)));

// DO
const integerNumbers = filterIntegerNumbers(numbersArray);
const oddNumbers = filterOddNumbers(integerNumbers);
const sum = calculateSum(oddNumbers);
```

## Try to group variable declarations and leave breathing room for functions and expressions

```ts
const text = 'Hello world';
const separator = ',';

if (text.length > 50) {
  const separatedText = text.replace(' ', separator);

  return separatedText;
}

const separatedText = text.replace(' ', `${separator}_`);
const textWithoutWs = separatedText.replace('w', '');

return textWithoutWs;
```

# Comments

## Prefer good naming over comments

```ts
// AVOID
// Checks if the number is greater that 10
function check(n) {
  return n > 10;
}

// DO
function isNumberGreaterThan10(n) {
  return n > 10;
}
```

## Add comments when something needs explanation or there are some edge cases

```ts
function calculateCost(itemsAmount, cost, discountAmount) {
  // Applies a discount for every 3 items
  if (items % 3 === 0) return itemsAmount * cost - discountAmount * (itemsAmount / 3);
  return itemsAmount * cost;
}
```

## In case an if block has only 1 line of code don't use `{ }`

```ts
// AVOID
if (number > 10) {
  return number - 10;
}

// DO
if (number > 10) return number - 10;
```

## Add comments to point to other tasks

```ts
// THIS SHOULD BE REMOVED WHEN THE CDK-9999 IS DONE
function temp(n) {
  return n + n;
}
```

## If you have something that will be used in the near future or has to be used as temporary solution

```ts
// THIS SHOULD BE REPLACED WITH THE COMMENTED CODE WHEN THE CDK-9999 IS DONE

function temp(n) {
  return n * n;
}

// function squareNumber(n) {
//   return n * n;
// }
```

# Variables

## Use meaningful variable names

```ts
//AVOID
const d = Date.now();

// DO
const currentDate = Date.now();
```

## Whenever possible avoid the usage of magic strings/numbers

```ts
// AVOID
const text = 'Hello world';
const textWithPrefix = `prefix_${text}`;

// DO
const prefix = 'prefix_'; // this could be in a different file and used in multiple places
const text = 'Hello world';
const textWithPrefix = `${prefix}${text}`;
```

## Use names relevant to what you do

```ts
// AVOID
function calculateSum(items, cost) {
  items.forEach((i) => {
    // Long function
    // ...
    // ...
    // ...
    // ...
    // lost track of what "i" is
    doSomething(i);
  });
}

// DO
function calculateSum(items, cost) {
  items.forEach((item) => {
    // Long function
    // ...
    // ...
    // ...
    // ...
    // we know what is the "item"
    doSomething(item);
  });
}
```

## Avoid adding unneeded prefixes/suffixes

```ts
// AVOID
const user = {
  userAge = 34,
  userEmail = 'nick@nick.com',
};
user.userAge;

// DO
const user = {
  age = 34,
  email = 'nick@nick.com',
};
user.age;
```

## Use plural when needed

```ts
// AVOID
const item = [12, 24, 36];

// DO
const items = [12, 24, 36];
```

## Use camelCase or PascalCase for acronyms with more than 2 character-long names and UPPERCASE for 2 characters

```ts
// More that 2 letters
function getBrowserIdFromCdp() {}

interface PersonalizeCdp {}

const cdpEventAttributes = {};

// 2 letters
const validIODevices = [];
```

## Use proper casing

```ts
// PascalCase for type names
type PageEvent {}

// Use PascalCase for enum values
enum EventTypes {
  Add: 'ADD'
}

// Use camelCase for function names
function getBrowserId(){}

// Use camelCase for property names and local variables
const cookieName = 'test'

// Use CONSTANT_CASE for global constant values or other globally accessible immutable values
const API_VERSION = 'v1.2';
```

## Do not use “\_” as a prefix for private properties

```ts
class Event {
  // AVOID
  private _eventType = 'VIEW';

  // DO
  private eventType = 'VIEW';
}
```

## Use nouns for class names and verbs for methods names

```ts
// AVOID
class Personalize {
  data() {}
}
// DO
class Personalization {
  getData() {}
}
```

# Functions

## Limit the amount of parameters to 2 by converting the parameters to a single object

```ts
// AVOID
function createSettings(url, name, target) {}

// DO
const settings = { url, name, target };

function createSettings(settings) {}
```

## Follow the single responsibility principle for functions

```ts
// AVOID
function isViewEvent() {
  const cookieName = 'event_type';
  const eventType = document.cookie.split('; ').find((cookie) => {
    return (
      cookie.indexOf('=') > 0 && cookie.split('=')[0] === cookieName
    );
  });

  return eventType === 'VIEW';
}

// DO
function isViewEvent() {
  const cookieName = 'event_type';
  const eventType = extractEventType(cookieName);

  return eventType === 'VIEW';
}

function extractEventType(cookieName) {
  const eventType = document.cookie.split('; ').find((cookie) =>
     cookie.split('=')[0] === cookieName;
  );

  return eventType;
}
```

## Don't repeat yourself (DRY)

```ts
// AVOID
function sendEvent(url, fetchOptions){
  const cart = document.cookie.split('; ').find((cookie) =>
    cookie.split('=')[0] === 'cart';
  );
  const userEmail = document.cookie.split('; ').find((cookie) =>
    cookie.split('=')[0] === 'user_email';
  );

  fetch(url,fetchOptions); // do something with the data
}

// DO
function sendEvent(url, fetchOptions){
  const cart = getCookieValue('cart');
  const userEmail = getCookieValue('user_email');

  fetch(url,fetchOptions); // do something with the data
}

function getCookieValue(cookieName) {
  const cookieValue = document.cookie.split('; ').find((cookie) =>
     cookie.split('=')[0] === cookieName;
  );

  return cookieValue;
}

```

## Avoid using flags as function parameters (indication of a function that does more than one thing)

```ts
//AVOID
function sendEmail(text, isUserAuthenticated) {
  const newText = text;
  if (isUserAuthenticated) {
    newText += 'Thank you for being part of our team.';
  }

  newText += 'Check out our latest products!';

  otherFunction(newText);
}

// DO
function sendEmail(text) {
  const newText += `${text}Check out our latest products!`;

  otherFunction(newText);
}

function sendAuthenticatedEmail(text) {
  const newText = `${text}Thank you for being part of our team.`;

  sendEmail(newText);
}
```

# As you plan

- Follow the [YAGNI](https://thevaluable.dev/kiss-principle-explained/#the-yagni-principle) principle (You Aren’t Gonna Need It).

- Follow the [DRY](https://medium.com/@Ialimijoro/the-dry-principle-and-why-you-should-use-it-f02435ae9449) principle (Don't repeat yourself)

- Follow the [KISS](https://thevaluable.dev/kiss-principle-explained/) principle (Keep It Simple Stupid)

- Follow the [SOLID](https://www.freecodecamp.org/news/solid-principles-explained-in-plain-english/) design principles

# As you code

- Avoid using third party libraries that will be bundled for our clients (dev dependencies are ok if the team agrees on using them)

- If there is a native javascript function/class use that instead of reinventing the wheel

- If you find unused/unnecessary/wrong code or comments as long as it has no effect on the functionality of the project do change them in the current task (Keep in mind that if the task touches on multiple files and is hard to review, report the changes you did in the PR description)
