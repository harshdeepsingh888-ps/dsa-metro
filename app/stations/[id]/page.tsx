import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ProblemList } from '@/components/Problems';
import { CodeBox, FinishBar, LineStrip, Quiz } from '@/components/StationParts';
import { Viz } from '@/components/viz';
import { lc } from '@/lib/guide';
import { highlight } from '@/lib/highlight';
import { LINES, STATIONS, stationById, stationCode } from '@/lib/stations';

type Props = { params: Promise<{ id: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return STATIONS.map(s => ({ id: s.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const st = stationById((await params).id);
  return st ? { title: st.name, description: st.story } : {};
}

export default async function StationPage({ params }: Props) {
  const st = stationById((await params).id);
  if (!st) notFound();
  const idx = STATIONS.indexOf(st), L = LINES[st.line];
  const html = { cpp: highlight(st.code.cpp, 'cpp'), py: highlight(st.code.py, 'py') };
  return (
    <div className={`station wrap l-${st.line}`}>
      <nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Route map</Link><span>/</span><span>{L.name}</span></nav>
      <div className="sign">
        <div className="roundel">{stationCode(st)}</div>
        <div>
          <h1>{st.name}</h1>
          <div className="meta">{L.name} · station {idx + 1} of {STATIONS.length} · about {st.mins} min</div>
        </div>
        <div className="towards">{st.id === 'dp-recipe' ? <b>Terminal station</b> : <>Towards<b>DP Terminus</b></>}</div>
      </div>
      <LineStrip stationId={st.id} line={st.line} />

      <section className="sec"><p className="eyebrow">The situation</p><p className="story">{st.story}</p></section>
      <section className="sec">
        <p className="eyebrow">The idea</p><h2>How it works</h2>
        <div className="prose" dangerouslySetInnerHTML={{ __html: st.idea }} />
      </section>
      <section className="sec">
        <p className="eyebrow">Try it</p><h2>{st.vizTitle}</h2>
        <Viz kind={st.viz} stationId={st.id} />
      </section>
      <section className="sec">
        <p className="eyebrow">The code</p><h2>Write it yourself</h2>
        <p className="viz-note" style={{ marginBottom: 12 }}>Read it, close it, then type it from memory in your own editor. That is where it sticks.</p>
        <CodeBox html={html} raw={st.code} />
      </section>
      <section className="sec">
        <p className="eyebrow">Check yourself</p><h2>Quick quiz</h2>
        <p className="viz-note" style={{ marginBottom: 12 }}>+5 XP for each answer you get right on the first try.</p>
        <Quiz stationId={st.id} quiz={st.quiz} />
      </section>
      <section className="sec">
        <p className="eyebrow">Ride further</p><h2>Practice problems</h2>
        <p className="viz-note" style={{ marginBottom: 12 }}>Solve at least one before you punch your ticket. Tick it when LeetCode says Accepted.</p>
        <ProblemList problems={st.practice.map(x => lc(x.t, x.s, x.d))} />
      </section>
      <FinishBar stationId={st.id} />
    </div>
  );
}
