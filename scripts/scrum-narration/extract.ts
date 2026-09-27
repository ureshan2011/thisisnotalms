// Lists every distinct sentence the Scrum studio can say, as JSON on stdout:
// [{ "id": "1a2b3c4d", "text": "…" }, …]. Bundled and run by
// generate.sh with the esbuild that ships with Vite, so it needs no extra
// dependency and always reads the same beats the page does.
import { PHASES, beatsFor } from '../../src/components/public/scrum/timeline';
import { spokenFor, speechId } from '../../src/components/public/scrum/narration';

const seen = new Map<string, string>();
for (const ph of PHASES) {
  for (const b of beatsFor(ph)) {
    const text = spokenFor(b);
    seen.set(speechId(text), text);
  }
}
process.stdout.write(JSON.stringify([...seen].map(([id, text]) => ({ id, text })), null, 1));
