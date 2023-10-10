export class Utils {
  // static getPage(page: string) {
  //   // eslint-disable-next-line max-len
  //   if (Cypress.config('baseUrl')?.includes('localhost:3030') && !page.includes('.html') && !page.includes('/?')) {
  //     page = page === '/' ? '/' : `${page}.html`;
  //   }
  //   return page;
  // }

  static createExpectedEventReq(eventType: string, testData: any) {
    let eventAttr: any;
    if (!testData) {
      eventAttr = {};
    } else {
      eventAttr = testData.hashes()[0];
    }

    if (!eventAttr.type) {
      eventAttr.type = eventType.toUpperCase();
    }

    //Default attributes if not specified from test level (feature files)
    if (!eventAttr.currency) {
      eventAttr.currency = 'EUR';
    }
    if (!eventAttr.channel) {
      eventAttr.channel = 'WEB';
    }
    if (!Object.getOwnPropertyDescriptor(eventAttr, 'language') && eventType != 'VIEW') {
      eventAttr.language = 'EN';
    }

    // End of default attributes

    if (eventAttr.dob == '') {
      delete eventAttr.dob;
    }

    if (Object.getOwnPropertyDescriptor(eventAttr, 'street')) {
      eventAttr.street = eventAttr.street === '' ? [] : [eventAttr.street];
    }

    if (eventAttr.extAttributesNumber) {
      eventAttr.ext = {};
      for (let i = 0; i < eventAttr.extAttributesNumber; i++) {
        eventAttr.ext[`attr${i}`] = `value${i}`;
      }
      delete eventAttr.extAttributesNumber;
    }

    if (eventAttr.nested !== '' && eventAttr.nested !== undefined) {
      if (!eventAttr.ext) eventAttr.ext = {};

      const nested = JSON.parse(eventAttr.nested);

      Object.entries(nested).forEach(([key, value]) => {
        eventAttr.ext[`nested_${key}`] = value;
      });

      delete eventAttr.nested;
    }
    if (eventAttr.topLevelAttributes !== '' && eventAttr.topLevelAttributes !== undefined) {
      const topLevelAttributes = JSON.parse(eventAttr.topLevelAttributes);

      Object.entries(topLevelAttributes).forEach(([key, value]) => {
        eventAttr[key] = value;
      });

      delete eventAttr.topLevelAttributes;
    }

    if (eventAttr.pageVariantId) {
      if (!eventAttr.ext) eventAttr.ext = {};
      eventAttr.ext.pageVariantId = eventAttr.pageVariantId;
      delete eventAttr.pageVariantId;
    }

    if (eventAttr.productItemIds) {
      const idsArray = eventAttr.productItemIds.split(',');
      const product = [{}];
      idsArray.forEach((id: string, index: number) => {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        product[index] = { item_id: id };
      });
      eventAttr.product = product;
      delete eventAttr.productItemIds;
    }

    return eventAttr;
  }

  static createExpectedQueueEvent(eventType: string, testData: any) {
    let expectedEventData: any;
    // eslint-disable-next-line prefer-const
    expectedEventData = {};
    if (testData) {
      testData = testData.hashes()[0];
    } else {
      testData = {};
    }

    // eslint-disable-next-line prefer-const
    let baseEventData: any = {};
    // eslint-disable-next-line prefer-const
    let ext: any = {};

    expectedEventData.type = eventType.toUpperCase();

    //Default attributes if not specified from test level (feature files)
    if (!testData.channel) {
      baseEventData.channel = 'WEB';
    }
    if (!testData.currency) {
      baseEventData.currency = 'EUR';
    }
    if (!testData.language) {
      baseEventData.language = 'EN';
    }
    if (!testData.pointOfSale || !testData.pos) {
      baseEventData.pointOfSale = 'spinair.com';
    }

    if (testData.baseDataEventAttr) {
      Object.entries(testData.baseDataEventAttr).forEach(([key, value]) => {
        baseEventData[key] = value;
      });
    }

    if (testData.page) {
      baseEventData.page = testData.page;
    }

    if (testData.extAttributesNumber) {
      expectedEventData.ext = {};

      for (let i = 0; i < testData.extAttributesNumber; i++) {
        ext[`attr${i}`] = `value${i}`;
      }
    }

    if (testData.nested) {
      const nested = JSON.parse(testData.nested);
      ext.nested = nested;
    }

    expectedEventData.baseEventData = baseEventData;

    expectedEventData.ext = ext;
    return expectedEventData;
  }
}
