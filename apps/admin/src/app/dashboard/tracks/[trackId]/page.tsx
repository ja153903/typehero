import { auth } from '@repo/auth/server';
import { prisma } from '@repo/db';
import { assertAdmin } from '~/utils/auth-guards';
import { UpdateTrackForm } from './_components/update-track-form';

export interface Props {
  params: {
    trackId: string;
  };
}

export default async function (props: Props) {
  const session = await auth();
  assertAdmin(session);

  const track = await getTrackById(Number(props.params.trackId));
  const challenges = await getChallenges();

  return <UpdateTrackForm track={track} challenges={challenges} />;
}

export type TrackToManage = NonNullable<Awaited<ReturnType<typeof getTrackById>>>;
const getTrackById = (id: number) => {
  return prisma.track.findFirstOrThrow({
    where: {
      id,
    },
    include: {
      trackChallenges: true,
    },
  });
};

export type ChallengesForTrack = NonNullable<Awaited<ReturnType<typeof getChallenges>>>;
function getChallenges() {
  return prisma.challenge.findMany({
    where: {
      status: 'ACTIVE',
    },
  });
}
