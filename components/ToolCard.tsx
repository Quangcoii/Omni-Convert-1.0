import Link from 'next/link';
import { Tool, toolHref } from '@/lib/tools';
export default function ToolCard({ tool }: { tool: Tool }) {
  return (<Link href={toolHref(tool)} className="card"><h3>{tool.name}</h3><p>{tool.description}</p></Link>);
}
