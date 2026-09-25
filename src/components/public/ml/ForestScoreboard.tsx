import { Check, X } from 'lucide-react';
import { MEMBERS, TREES, TreeGlyph, forestSaysQuit, forestScore, saysQuit, treeScore } from './forestData';

// ─── Every member, every tree, one grid ───────────────────────────────────
// A tick where a tree got the member right, a cross where it did not. Read a
// column: every tree has crosses. Read a row: the crosses are rarely more
// than two, so the ticks win the vote. That is the whole reason a forest
// beats a tree, and it needs no word longer than "cross".

function Mark({ right }: { right: boolean }) {
  return (
    <span className={`bt-rf-cell ${right ? 'is-right' : 'is-wrong'}`}>
      {right ? <Check size={13} strokeWidth={3} aria-label="right" /> : <X size={13} strokeWidth={3} aria-label="wrong" />}
    </span>
  );
}

export default function ForestScoreboard() {
  const scores = TREES.map(treeScore);
  const missed = MEMBERS.filter(m => forestSaysQuit(m) !== m.quit);

  return (
    <div className="bt-sim">
      <p className="bt-sim__label">All 20 members · ✓ = the tree got them right · ✗ = wrong</p>
      <div className="bt-rf-board">
        <table>
          <thead>
            <tr>
              <th scope="col">Member</th>
              {TREES.map(t => (
                <th key={t.n} scope="col">
                  <TreeGlyph size={20} color="var(--ink-400)" />
                  <span>Tree {t.n}</span>
                </th>
              ))}
              <th scope="col" className="bt-rf-board__forest">
                <span className="bt-rf-board__many" aria-hidden="true">
                  <TreeGlyph size={14} />
                  <TreeGlyph size={14} />
                  <TreeGlyph size={14} />
                </span>
                <span>Forest vote</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {MEMBERS.map(m => (
              <tr key={m.name}>
                <th scope="row">{m.name}</th>
                {TREES.map(t => (
                  <td key={t.n}><Mark right={saysQuit(t, m) === m.quit} /></td>
                ))}
                <td className="bt-rf-board__forest"><Mark right={forestSaysQuit(m) === m.quit} /></td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th scope="row">Got right</th>
              {scores.map((s, i) => (
                <td key={i} className="bt-tnum">{s}<small>/20</small></td>
              ))}
              <td className="bt-rf-board__forest bt-tnum">{forestScore}<small>/20</small></td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="bt-pairgrid">
        <div className="bt-card">
          <h4>Look down a column</h4>
          <p>
            Every tree has crosses. The best single tree gets {Math.max(...scores)} out of 20. The worst gets{' '}
            {Math.min(...scores)}.
          </p>
        </div>
        <div className="bt-card">
          <h4>Now look across a row</h4>
          <p>
            The crosses land on different people. Most rows have more ticks than crosses, so the ticks win the vote.
            The forest gets {forestScore} out of 20.
          </p>
        </div>
      </div>
      {missed.map(m => (
        <p key={m.name} className="bt-note">
          Find {m.name}&rsquo;s row. {TREES.filter(t => saysQuit(t, m) !== m.quit).length} of the 5 trees got{' '}
          {m.name} wrong, so the vote went wrong too. When most trees are fooled, the forest is fooled.
        </p>
      ))}
    </div>
  );
}
