'use client';

import { useEffect, useState } from 'react';
import { pageView } from '@sitecore-cloudsdk/events/browser';
import {
  Context,
  getWidgetData,
  RecommendationWidgetItem,
  WidgetRequestData,
  widgetView
} from '@sitecore-cloudsdk/search-api-client/browser';
import { withAuthGuard } from '../components/AuthGuard';
import { Newsletter } from '../components/Newsletter';
import { PersonalizeBanner } from '../components/PersonalizeBanner';
import { Products, RecommendedProduct } from '../components/Products';
import type { ApiResponseWithContent } from '../types';

function Index() {
  const [recommendedProducts, setRecommendedProducts] = useState<RecommendedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const doEvent = async () => {
      await pageView();
    };
    doEvent();

    const fetchRecommendedProducts = async () => {
      const recWidget = new RecommendationWidgetItem('product', 'rfkid_2');
      recWidget.content = { fields: ['name', 'image_url', 'price', 'id'] };
      recWidget.recipe = {
        id: '95811',
        version: 3
      };

      recWidget.limit = 10;

      const context = new Context({});
      context.locale = {
        language: 'en',
        country: 'us'
      };

      try {
        const apiData = await getWidgetData(new WidgetRequestData([recWidget]), context);
        const recWidgetData = apiData?.widgets[0] as ApiResponseWithContent | undefined;
        if (!recWidgetData) return console.warn('No recommended products found');
        setRecommendedProducts(recWidgetData.content);
        await widgetView({
          pathname: '/',
          widgetId: 'rfkid_2',
          entities: recWidgetData.content.map((product) => ({ entity: 'product', id: product.id })),
          request: {}
        });
      } catch (error) {
        console.error('Error fetching recommended products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedProducts();
  }, []);

  return (
    <div className='bg-[image:var(--sc-bg)] p-4 flex items-center justify-center flex-col'>
      <div className='container mx-auto'>
        <PersonalizeBanner />
        {!loading && recommendedProducts.length > 0 && (
          <>
            <h2 className='text-3xl font-bold mb-4 mt-12'>Recommended For You</h2>
            <Products products={recommendedProducts} />
          </>
        )}

        <Newsletter />
      </div>
    </div>
  );
}

export default withAuthGuard(Index);
