import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageHeader from '@site/src/components/Header/Header';
import { WideCard } from '../components/WideCard/WideCard';
import { RecentDocs } from '../components/RecentDocs/RecentDocs';
import { Card } from '../components/Card/Card';
import { CardWrapper } from '../components/CardWrapper/CardWrapper';

import { SignUp } from '../components/SignUp/SignUp';
import { IntakeForm } from '../components/IntakeForm/IntakeForm';

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();

  const { firstCards, secondCards } = siteConfig.customFields.main;
  
  return (
    <Layout>

      {/*<HomepageHeader />*/}
      <section>
        <WideCard />

        <section className="limiter">

          <CardWrapper>
            {firstCards.map((item, index) => (
                <Card key={index} icon={item.icon} title={item.title} subtitle={item.subtitle} link={item.link} />
            ))}
          </CardWrapper>

          {/*<RecentDocs />*/}

          <SignUp />

          <CardWrapper>
            {secondCards.map((item, index) => (
                <Card key={index} icon={item.icon} title={item.title} subtitle={item.subtitle} link={item.link} color={item.color} />
            ))}
          </CardWrapper>
          <IntakeForm />
        </section>
      </section>
    </Layout>
  );
}
