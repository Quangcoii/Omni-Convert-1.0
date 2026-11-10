import Link from 'next/link';
import { Tool, toolHref } from '@/lib/tools';
import { IconTile } from './Icons';
export default function ToolCard({ tool }: { tool: Tool }) {
  return (<Link href={toolHref(tool)} className="card tool-card"><IconTile name={tool.icon} size={52} /><div><h3>{tool.name}</h3><p>{tool.description}</p></div></Link>);
}
