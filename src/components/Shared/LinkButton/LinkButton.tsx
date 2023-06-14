import React from 'react';

import styles from './styles.module.css';

interface LinkButtonProps {
  children?: React.ReactNode;
  href: string;
  onClick?: () => void;
}

export const LinkButton = ({ children, href, onClick }: LinkButtonProps) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <a className={styles.linkButton} href={href} onClick={handleClick}>
      {children}
    </a>
  );
}
