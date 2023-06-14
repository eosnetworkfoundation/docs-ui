import React from 'react';
import { IconBox } from '../Shared/IconBox/IconBox';
import { H4, P_Small } from '../Shared/Typography/Typography';

import styles from './styles.module.css';

interface CardProps {
  children?: React.ReactNode;
  icon: any;
  link: string;
  color?: 'blue' | 'yellow';
}

export const Card = ({ children, icon, link, color }: CardProps) => {
  return (
    <a className={styles.card} href={link}>
      <IconBox icon={icon} color={color} />
      <div className={styles.infoContainer}>
          {children}
      </div>
    </a>
  )
}
