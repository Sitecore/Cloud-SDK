import styles from './page.module.css';
import { hello } from '@sitecore-cloudsdk/hello';

export default async function Index() {
  return <div className={styles.page}>{hello()}</div>;
}
