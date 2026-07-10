import { useEffect, useState } from 'react';
import { collection, doc, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { VOTE_COLLECTIONS, firestoreToTeam, firestoreToVote, type Team, type VoteRecord } from '../lib/voteTypes';

export function useTeams() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, VOTE_COLLECTIONS.teams), orderBy('order', 'asc'));
    const unsub = onSnapshot(q, (snap) => {
      setTeams(snap.docs.map((d) => firestoreToTeam(d.id, d.data())));
      setLoading(false);
    });
    return unsub;
  }, []);

  return { teams, loading };
}

export function useVotes() {
  const [votes, setVotes] = useState<VoteRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, VOTE_COLLECTIONS.votes), (snap) => {
      setVotes(snap.docs.map((d) => firestoreToVote(d.id, d.data())));
      setLoading(false);
    });
    return unsub;
  }, []);

  return { votes, loading };
}

export function useLiveState() {
  const [currentTeamId, setCurrentTeamId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, VOTE_COLLECTIONS.liveState, 'current'), (snap) => {
      setCurrentTeamId((snap.data()?.currentTeamId as string | undefined) ?? null);
      setLoading(false);
    });
    return unsub;
  }, []);

  return { currentTeamId, loading };
}
