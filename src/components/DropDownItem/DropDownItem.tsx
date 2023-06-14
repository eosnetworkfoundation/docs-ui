import Link from '@docusaurus/Link';
import React from 'react';
import { H5_Bold, P_XS } from '../Shared/Typography/Typography';

import styles from './styles.module.css';
import useBaseUrl from "@docusaurus/useBaseUrl";

interface DropDownItemProps {
  children?: React.ReactNode;
  icon: string;
  href: string;
}

export const DropDownItem = ({ children, icon, href }: DropDownItemProps) => {
  return (
      <Link href={href} className={styles.wrapper}>
        <div className={styles.icon}>
          <img src={useBaseUrl(icon)} />
        </div>
        <div className={styles.content}>
            {children}
        </div>
      </Link>
  )
}
