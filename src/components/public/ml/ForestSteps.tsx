import { ArrowRight, User } from 'lucide-react';
import { MEMBERS, TREES, TreeGlyph, VoteMark, forestSaysQuit, quitVotes, saysQuit } from './forestData';

// ─── The whole idea in three pictures ─────────────────────────────────────
// Before any interaction: grow trees, ask them all, count. The example member
// is Fay, the same one the next widget opens on, so the picture and the
// widget tell the same story.

const FAY = MEMBERS.find(m => m.name === 'Fay')!;
const quit = quitVotes(FAY);
const stay = TREES.length - quit;

export default function ForestSteps() {
  return (
    <div className="bt-rf-steps" role="img" aria-label={`Three steps. One: grow five small trees. Two: ask every tree about ${FAY.name}; ${quit} say quit and ${stay} say stay. Three: the answer with the most votes wins, so the forest says ${forestSaysQuit(FAY) ? 'quit' : 'stay'}.`}>
      <div className="bt-rf-step">
        <span className="bt-rf-step__n">1</span>
        <h4>Grow lots of small trees</h4>
        <div className="bt-rf-step__art">
          {TREES.map(t => (
            <TreeGlyph key={t.n} size={34} />
          ))}
        </div>
        <p>Each tree asks its own question.</p>
      </div>

      <span className="bt-rf-step__arrow" aria-hidden="true"><ArrowRight size={22} /></span>

      <div className="bt-rf-step">
        <span className="bt-rf-step__n">2</span>
        <h4>Ask every tree</h4>
        <div className="bt-rf-step__art bt-rf-step__art--col">
          <span className="bt-rf-person"><User size={14} aria-hidden="true" /> {FAY.name}</span>
          <div className="bt-rf-step__art">
            {TREES.map(t => (
              <span key={t.n} className="bt-rf-step__voter">
                <TreeGlyph size={28} />
                <VoteMark quit={saysQuit(t, FAY)} size={15} />
              </span>
            ))}
          </div>
        </div>
        <p>Each tree says <b>quit</b> or <b>stay</b>.</p>
      </div>

      <span className="bt-rf-step__arrow" aria-hidden="true"><ArrowRight size={22} /></span>

      <div className="bt-rf-step">
        <span className="bt-rf-step__n">3</span>
        <h4>Count the votes</h4>
        <div className="bt-rf-step__art bt-rf-step__art--col">
          <span className="bt-rf-tally">
            {Array.from({ length: quit }, (_, i) => <VoteMark key={i} quit size={18} />)}
            <b>{quit} quit</b>
          </span>
          <span className="bt-rf-tally">
            {Array.from({ length: stay }, (_, i) => <VoteMark key={i} quit={false} size={18} />)}
            <b>{stay} stay</b>
          </span>
        </div>
        <p>Most votes wins: <b>{forestSaysQuit(FAY) ? 'quit' : 'stay'}</b>.</p>
      </div>
    </div>
  );
}
