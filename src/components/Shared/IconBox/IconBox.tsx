import clsx from 'clsx';
import React from 'react';

import styles from './styles.module.css';
import useBaseUrl from "@docusaurus/useBaseUrl";

export const IconBox = ({ icon, color }: { icon: any, color?: "blue" | "yellow" }) => {
  return (
    <div className={clsx(styles.iconContainer, color && styles.yellow)}>
      <img src={useBaseUrl(icon)} alt="icon" />
    </div>
  )
}
