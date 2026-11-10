import Mascot from './Mascot';
import { CATEGORIES } from '@/lib/categories';
/** Hero illustration: the four mascots peeking over a soft pastel cloud. Decorative. */
export default function MascotGroup() {
  return (<div className="mascot-group" aria-hidden="true">
    <div className="cloud" />
    <div className="mascot-row">{CATEGORIES.map((c, i) => (<div key={c.slug} className="mascot-slot" style={{ zIndex: i % 2 ? 3 : 2 }}><Mascot category={c.slug} state="idle" size={190} showProp={false} /></div>))}</div>
  </div>);
}
