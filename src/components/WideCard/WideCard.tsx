import React from 'react';
import { LinkButton } from '../Shared/LinkButton/LinkButton';
import { IconBox } from '../Shared/IconBox/IconBox';

import styles from './styles.module.css';
import {H1_Bold, H2_Bold, P_Medium} from '../Shared/Typography/Typography';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

import Translate from "@docusaurus/Translate";
import useBaseUrl from "@docusaurus/useBaseUrl";

export const WideCard = () => {
    const { siteConfig } = useDocusaurusContext();

    return (
        <div className={styles.wideCard}>

            <section className={"content-container"}>
                <section className="hero-title"><Translate>EOS EVM</Translate></section>
                <section className={"hero-subtitle"}><Translate>A brand new home for EVM developers</Translate></section>
                <P_Medium><Translate>Migrate your apps to the world's fastest and cheapest EVM using tools and frameworks you're already familiar with.</Translate></P_Medium>
                <br />
                <br />
                <LinkButton href={useBaseUrl("/docs/latest/eos-evm/smart-contracts/migrate-your-smart-contract/")}>
                    <Translate>MIGRATE NOW</Translate>
                </LinkButton>
            </section>
        </div>
    );
}
