import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import React from 'react';
import { Button } from '../Shared/Button/Button';
import {H3, H2, P_XLarge, H1} from '../Shared/Typography/Typography';
import Translate, {translate} from "@docusaurus/Translate";

import styles from './styles.module.css';


export const SignUp = () => {
  const { siteConfig } = useDocusaurusContext();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <H1 className={styles.title}><Translate>Developer Alerts! 🚨</Translate></H1>
        <P_XLarge className={styles.subtitle}><Translate>Don't be caught with your pants down. Breaking changes will happen. If you want to stay on top of things when they do make sure to sign up for developer alerts emails.</Translate></P_XLarge>
        <form action="https://eosnetwork.us8.list-manage.com/subscribe/post" method="POST" className={styles.form}>
          <input type="hidden" name="u" value="d65a053d24b3cc087dfb925bb" />
          <input type="hidden" name="id" value="be3f545626" />
          <input type="hidden" name="orig-lang" value="1" />
          <input className={styles.inputMobile} name="MERGE0" id="MERGE0" type="email" placeholder={translate({message:"Enter your email"})} pattern='' />
          <input className={styles.inputDesktop} name="MERGE0" id="MERGE1" type="email" placeholder={translate({message:"Enter your email"})} />
          <Button type="submit"><Translate>ALERT ME</Translate></Button>
        </form>
      </div>
    </div>
  )
}
