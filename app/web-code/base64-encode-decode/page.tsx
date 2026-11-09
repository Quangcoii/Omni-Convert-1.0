import type { Metadata } from 'next';
import ToolLayout from '@/components/ToolLayout';
import { getTool, toolHref } from '@/lib/tools';
import Base64Tool from './Base64Tool';
const tool = getTool('web-code', 'base64-encode-decode')!;
export const metadata: Metadata = {
  title: 'Base64 Encoder/Decoder — Encode and Decode Text Online',
  description: 'Free Base64 encoder and decoder with full UTF-8 support and a URL-safe option. Runs in your browser; nothing is uploaded.',
  alternates: { canonical: toolHref(tool) },
};
export default function Page() {
  return (<ToolLayout tool={tool}
    howTo={['Choose Encode or Decode.', 'Paste your text or Base64 string.', 'Copy the result.']}
    notes={['Text is handled as UTF-8, so emoji and non-English characters work.', 'This tool converts text only. Decoding data that is not valid UTF-8 text (such as an image) is reported as an error instead of showing garbage.', 'Whitespace in Base64 input is ignored; URL-safe input (- and _) is accepted when decoding.']}
    faq={[{ q: 'Is Base64 encryption?', a: 'No. Base64 is an encoding, not encryption. Anyone can decode it, so never use it to protect secrets.' }]}><Base64Tool /></ToolLayout>);
}
