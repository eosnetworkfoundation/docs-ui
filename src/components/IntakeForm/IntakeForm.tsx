import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import React from 'react';
import { Button } from '../Shared/Button/Button';
import {H3, H2, P_XLarge, H1} from '../Shared/Typography/Typography';
import Translate from "@docusaurus/Translate";

import styles from './styles.module.css';


export const IntakeForm = () => {
  const { siteConfig } = useDocusaurusContext();

  return (
      <div className="mb-40 flex flex-col justify-center items-center">
          <H1><Translate>Boost Your App! 🚀</Translate></H1>
          <P_XLarge className="max-w-[600px] mb-10"><Translate>Submit your app to our ecosystem page and reach a wider audience, gain exposure, and attract new users to your already built application.</Translate></P_XLarge>
          <a href="https://eosnetwork.com/#ecosystem-intake" target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">
            <Button type="button">
                <Translate>INTAKE FORM</Translate>
            </Button>
          </a>
      </div>
  )
}
