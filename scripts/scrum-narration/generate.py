"""Voice every sentence the Scrum studio can say.

Reads the JSON written by extract.ts, synthesises each sentence with the
Piper neural text-to-speech engine, and writes a mono MP3 per sentence to
public/audio/scrum-studio/<id>.mp3. Existing clips are kept, so re-running
after editing a few beats only voices the new sentences. Clips whose
sentence no longer exists are deleted.

    python generate.py lines.json path/to/en_GB-cori-high.onnx

Needs: pip install piper-tts soundfile numpy
Voice:  https://huggingface.co/rhasspy/piper-voices (en_GB / cori / high)
"""
import json
import sys
import wave
import io
from pathlib import Path

import numpy as np
import soundfile as sf
from piper import PiperVoice, SynthesisConfig

OUT = Path(__file__).resolve().parents[2] / "public" / "audio" / "scrum-studio"
# Slightly quicker than the voice's natural pace: a lesson narration, not an audiobook.
CONFIG = SynthesisConfig(length_scale=0.94, noise_scale=0.6, noise_w_scale=0.7)


def main() -> None:
    lines = json.loads(Path(sys.argv[1]).read_text())
    voice = PiperVoice.load(sys.argv[2])
    OUT.mkdir(parents=True, exist_ok=True)
    wanted = {line["id"] for line in lines}
    for stale in OUT.glob("*.mp3"):
        if stale.stem not in wanted:
            stale.unlink()
            print("removed", stale.name)
    made = 0
    for line in lines:
        target = OUT / f"{line['id']}.mp3"
        if target.exists():
            continue
        buf = io.BytesIO()
        with wave.open(buf, "wb") as wav:
            voice.synthesize_wav(line["text"], wav, syn_config=CONFIG)
        buf.seek(0)
        audio, rate = sf.read(buf, dtype="float32")
        # A short breath of silence at the end so clips do not butt together.
        audio = np.concatenate([audio, np.zeros(int(rate * 0.25), dtype=np.float32)])
        sf.write(target, audio, rate, format="MP3", subtype="MPEG_LAYER_III",
                 compression_level=0.8, bitrate_mode="VARIABLE")
        made += 1
        print(f"{line['id']}  {len(audio) / rate:5.1f}s  {line['text'][:70]}")
    print(f"{made} new clip(s), {len(lines)} total")


if __name__ == "__main__":
    main()
