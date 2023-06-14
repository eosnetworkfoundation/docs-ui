import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import { WideCard } from '../components/WideCard/WideCard';
import { Card } from '../components/Card/Card';
import { CardWrapper } from '../components/CardWrapper/CardWrapper';

import { SignUp } from '../components/SignUp/SignUp';
import { IntakeForm } from '../components/IntakeForm/IntakeForm';
import {H4, P_Small} from "@site/src/components/Shared/Typography/Typography";
import Translate from "@docusaurus/Translate";
import useBaseUrl from "@docusaurus/useBaseUrl";

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();

  // @ts-ignore
  const { firstCards, secondCards } = siteConfig.customFields.main;
  
  return (
    <Layout>

      {/*<HomepageHeader />*/}
      <section>
        <WideCard />

        <section className="limiter">
          <CardWrapper>
            <Card icon="icons/docs-icon.svg" link={useBaseUrl("/docs/latest/blockchain-basics/")}>
              <H4><Translate>Learn The Basics</Translate></H4>
              <P_Small><Translate>Everything you need to know about blockchain to get you started</Translate></P_Small>
            </Card>
            <Card icon="icons/ethereum-logo.svg" link={useBaseUrl("/docs/latest/eos-evm/")}>
              <H4><Translate>EOS EVM</Translate></H4>
              <P_Small><Translate>Take advantage of the world's fastest EVM</Translate></P_Small>
            </Card>
          </CardWrapper>
          <IntakeForm />
          <CardWrapper>
            <Card icon="icons/molecules-icon.svg" link={useBaseUrl("/docs/latest/smart-contracts/tutorials/create-a-token")} color="yellow">
              <H4><Translate>Create a Token</Translate></H4>
              <P_Small><Translate>Learn how to develop fungible tokens</Translate></P_Small>
            </Card>
            <Card icon="icons/chat-icon.svg" link={useBaseUrl("/docs/latest/smart-contracts/tutorials/create-an-nft")}>
              <H4><Translate>Create an NFT</Translate></H4>
              <P_Small><Translate>Learn how to develop non-fungible tokens</Translate></P_Small>
            </Card>
            <Card icon="icons/ref-icon.svg" link={useBaseUrl("/docs/latest/api-listing/")}>
              <H4><Translate>Reference</Translate></H4>
              <P_Small><Translate>Consult the API references explore the EOS RPC</Translate></P_Small>
            </Card>
            <Card icon="icons/docs-icon.svg" link={useBaseUrl("/docs/latest/glossary")} color="yellow">
              <H4><Translate>Glossary</Translate></H4>
              <P_Small><Translate>Confused with some terms? Read them all here</Translate></P_Small>
            </Card>
          </CardWrapper>
          <SignUp />
        </section>
      </section>
    </Layout>
  );
}
