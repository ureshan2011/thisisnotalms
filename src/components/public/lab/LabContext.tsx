import { createContext, useContext, type ReactNode } from 'react';

// ─── What a hands-on lab page tells its shared pieces ─────────────────────
// The MBI806B labs (linear regression, decision tree) are built from the
// same parts: screenshot tours, Colab cells, a checklist, walkthroughs. Each
// lab wraps its body in a LabProvider saying three things:
//
//   storageKey — where this lab's checklist ticks live in localStorage. Never
//                change a published lab's key, or students lose their ticks.
//   stages     — the checklist's steps, in order. Each step of the page ends
//                with a DoneButton naming one of these ids.
//   assetDir   — the folder under public/mbi806b/ holding this lab's
//                screenshots and charts.

export interface LabStage {
  id: string;
  label: string;
}

export interface LabConfig {
  storageKey: string;
  stages: LabStage[];
  assetDir: string;
}

const LabContext = createContext<LabConfig>({ storageKey: 'mbi806b-lab-progress', stages: [], assetDir: '' });

export function LabProvider({ value, children }: { value: LabConfig; children: ReactNode }) {
  return <LabContext.Provider value={value}>{children}</LabContext.Provider>;
}

export function useLab() {
  return useContext(LabContext);
}

const BASE = import.meta.env.BASE_URL;

/** The public URL of a file in this lab's folder, or in another lab's
 *  folder when `dir` is given (the labs share their Colab screenshots). */
export function useAsset(file: string, dir?: string) {
  const { assetDir } = useLab();
  return `${BASE}mbi806b/${dir ?? assetDir}/${file}`;
}
