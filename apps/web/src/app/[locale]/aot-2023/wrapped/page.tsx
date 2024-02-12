import { prisma } from '@repo/db';
import { Prisma } from '@repo/db/types';
import { setStaticParamsLocale } from 'next-international/server';
import { notFound } from 'next/navigation';
import { getStaticParams } from '~/locales/server';
import { daysAfterDecemberFirst } from '~/utils/aot';
import { getAllFlags } from '~/utils/feature-flags';
import { AOT_CHALLENGES } from '../../challenge/[slug]/aot-slugs';
import { Hero } from './_components/hero';
import { LeastSolved } from './_components/least-solved';
import { MostSolved } from './_components/most-solved';
import { UserSummary } from './_components/user-summary';

export function generateStaticParams() {
  return getStaticParams();
}
export interface AotChallengeData {
  challengeId: string;
  name: string;
  slug: string;
  userCount: number;
}
export default async function Index({ params: { locale } }: { params: { locale: string } }) {
  setStaticParamsLocale(locale);

  const { enableHolidayEvent } = await getAllFlags();
  if (enableHolidayEvent) {
    const daysPassed = daysAfterDecemberFirst();

    if (daysPassed + 1 < 25) {
      return notFound();
    }
  }

  const topThreeSolved = await prisma.$queryRaw<AotChallengeData[]>`
    select name, slug, challengeId, count(T.userId) as userCount
    from(
      select DISTINCT challengeId, userId
      from Submission
      where isSuccessful = true
    ) as T
    LEFT JOIN Challenge ON Challenge.id = T.challengeId
    WHERE slug in (${Prisma.join(AOT_CHALLENGES.slice(0, -1))})
    group by challengeId, slug
    order by userCount desc
    limit 3
    `;

  const bottomThreeSolved = await prisma.$queryRaw<AotChallengeData[]>`
    select name, slug, challengeId, count(T.userId) as userCount
    from(
      select DISTINCT challengeId, userId
      from Submission
      where isSuccessful = true
    ) as T
    LEFT JOIN Challenge ON Challenge.id = T.challengeId
    WHERE slug in (${Prisma.join(AOT_CHALLENGES.slice(0, -1))})
    group by challengeId, slug
    order by userCount asc
    limit 3
    `;

  const top3 = topThreeSolved.map((r) => ({
    ...r,
    userCount: Number(r.userCount),
  }));

  const bottom3 = bottomThreeSolved.map((r) => ({
    ...r,
    userCount: Number(r.userCount),
  }));

  return (
    <div>
      <Hero />
      <UserSummary />
      <MostSolved mostSolved={top3} />
      <LeastSolved leastSolved={bottom3} />
    </div>
  );
}
