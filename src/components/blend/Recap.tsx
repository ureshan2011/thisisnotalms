// The end of the teaching, before the course admin starts. On the dark
// surface because it is a boundary: everything above it was the lesson,
// everything below it is what the course does next.
//
// One line per point, each opening with the claim in bold, so a student
// scanning it the night before an assessment gets the argument without
// re-reading the lesson.

export default function Recap({ title, points, footnote }: {
  title: string;
  /** The lesson's claims, in the order they were made. Four to six. */
  points: [string, string][];
  footnote?: string;
}) {
  return (
    <section className="bt-recap" aria-labelledby="recap-title">
      <p className="bt-eyebrow">What this lesson said</p>
      <h2 id="recap-title">{title}</h2>
      <ul>
        {points.map(([claim, body], i) => (
          <li key={claim}>
            <span className="bt-recap__n bt-tnum">{String(i + 1).padStart(2, '0')}</span>
            <span><b>{claim}</b> {body}</span>
          </li>
        ))}
      </ul>
      {footnote && <p className="bt-outfoot">{footnote}</p>}
    </section>
  );
}
