import { useState } from 'react';
import { ModelShape, type ShapeKind } from './ModelShapes';

// ─── Swap one word, get a different model ─────────────────────────────────
// The same four lines three times, with only the words that change lit up.
// The last two lines are dimmed and labelled as never changing, because the
// thing to take away is the recipe, not the three class names.

interface Model {
  id: ShapeKind;
  tab: string;
  drawer: string;
  name: string;
  setting: string;
  useWhen: string;
  settingMeans: string;
}

const MODELS: Model[] = [
  {
    id: 'line',
    tab: 'Linear regression',
    drawer: 'linear_model',
    name: 'LinearRegression',
    setting: '',
    useWhen: 'The answer is a number — like the rent of a flat.',
    settingMeans: 'No setting needed. Empty brackets still have to be there.',
  },
  {
    id: 'cuts',
    tab: 'Decision tree',
    drawer: 'tree',
    name: 'DecisionTreeClassifier',
    setting: 'max_depth=3',
    useWhen: 'The answer is a choice, and you have to explain why — you can print the tree.',
    settingMeans: 'Ask at most 3 questions in a row. This stops it memorising.',
  },
  {
    id: 'forest',
    tab: 'Random forest',
    drawer: 'ensemble',
    name: 'RandomForestClassifier',
    setting: 'n_estimators=300',
    useWhen: 'The answer is a choice, and being right matters more than explaining.',
    settingMeans: 'Grow 300 trees. More trees, steadier votes.',
  },
];

export default function ModelSwap() {
  const [id, setId] = useState<ShapeKind>('forest');
  const m = MODELS.find(x => x.id === id)!;

  return (
    <div className="bt-sim">
      <div className="bt-chiprow" role="tablist" aria-label="Pick a model" style={{ marginTop: 0 }}>
        {MODELS.map(x => (
          <button
            key={x.id}
            type="button"
            role="tab"
            className="bt-ctxchip"
            aria-selected={x.id === id}
            aria-pressed={x.id === id}
            onClick={() => setId(x.id)}
          >
            {x.tab}
          </button>
        ))}
      </div>

      <div className="bt-ms">
        <div className="bt-ms__code" role="tabpanel" aria-label={`${m.tab} code`}>
          <div className="bt-ms__line">
            <code>
              <span className="py-kw">from</span> sklearn.<mark>{m.drawer}</mark> <span className="py-kw">import</span>{' '}
              <mark>{m.name}</mark>
            </code>
            <span className="bt-ms__tag bt-ms__tag--hot">changes</span>
          </div>
          <div className="bt-ms__line">
            <code>
              model = <mark>{m.name}</mark>(
              {m.setting && <mark className="bt-ms__set">{m.setting}</mark>})
            </code>
            <span className="bt-ms__tag bt-ms__tag--hot">changes</span>
          </div>
          <div className="bt-ms__line bt-ms__line--same">
            <code>model.fit(X, y)</code>
            <span className="bt-ms__tag">never changes</span>
          </div>
          <div className="bt-ms__line bt-ms__line--same">
            <code>model.predict(new)</code>
            <span className="bt-ms__tag">never changes</span>
          </div>
        </div>

        <div className="bt-ms__side">
          <div className="bt-ms__pic">
            <ModelShape kind={m.id} />
          </div>
          <div>
            <p className="bt-sim__label">Use it when</p>
            <p className="bt-ms__text">{m.useWhen}</p>
            <p className="bt-sim__label" style={{ marginTop: 12 }}>
              The setting {m.setting && <code>{m.setting}</code>}
            </p>
            <p className="bt-ms__text">{m.settingMeans}</p>
          </div>
        </div>
      </div>

      <ol className="bt-ms__recipe">
        <li><b>1</b> import the model</li>
        <li><b>2</b> make it</li>
        <li><b>3</b> <code>fit</code> — learn from examples</li>
        <li><b>4</b> <code>predict</code> — ask about someone new</li>
      </ol>
    </div>
  );
}
