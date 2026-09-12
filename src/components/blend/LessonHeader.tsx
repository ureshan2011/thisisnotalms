// The top of a Blend page that is also a real lesson rather than a course
// shop window: which lesson this is, what it covers, how long it runs, and
// the objectives it will be judged against.
//
// The objectives carry a hollow ring rather than a tick. Nothing has been
// achieved yet at the top of a lesson, and a column of green ticks would
// quietly claim otherwise.

export default function LessonHeader({ lesson, of, title, lead, meta, objectives }: {
  /** Which lesson this is, e.g. 1. */
  lesson: number;
  /** How many lessons the course runs to. */
  of: number;
  /** The lesson's own title, sentence case. */
  title: string;
  /** Two or three sentences on what this hour is for. */
  lead: string;
  /** Short label/value pairs — reading time, what it assumes, what it needs. */
  meta: [string, string][];
  /** What a student should be able to do by the end. Four to six. */
  objectives: string[];
}) {
  return (
    <section className="bt-lessonhead" aria-labelledby="lessonhead-title">
      <div>
        <p className="bt-eyebrow">Lesson {lesson} of {of}</p>
        <h2 id="lessonhead-title">{title}</h2>
        <p className="bt-lessonhead__lead">{lead}</p>
        <p className="bt-lessonmeta">
          {meta.map(([label, value]) => (
            <span key={label}>{label} <b>{value}</b></span>
          ))}
        </p>
      </div>
      <div>
        <p className="bt-eyebrow bt-eyebrow--quiet">By the end of this lesson you can</p>
        <ul className="bt-objectives">
          {objectives.map(o => (
            <li key={o}>
              <span className="bt-objectives__ring" aria-hidden="true" />
              <span>{o}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
