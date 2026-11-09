/** Reserved advertising slot. Renders nothing until ads are approved and enabled (Master Directive §12). */
export default function AdSlot({ id }: { id: string }) {
  if (process.env.NEXT_PUBLIC_ADS_ENABLED !== 'true') return null;
  return <div className="ad-slot" data-slot={id} aria-hidden="true" />;
}
