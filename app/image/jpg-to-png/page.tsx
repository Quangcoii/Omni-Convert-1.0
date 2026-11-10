import type { Metadata } from 'next';
import ToolLayout from '@/components/ToolLayout';
import { getTool, toolHref } from '@/lib/tools';
import ImageTool from '@/components/ImageTool';
const tool = getTool('image', 'jpg-to-png')!;
export const metadata: Metadata = { title: "JPG to PNG Converter \u2014 Free, in Your Browser", description: "Convert JPG to PNG online. Lossless PNG output created in your browser; nothing is uploaded.", alternates: { canonical: toolHref(tool) } };
export default function Page() {
  return (<ToolLayout tool={tool} noun="files"
    howTo={["Drop one or more JPG files.", "Wait for the conversion to finish.", "Download each PNG."]}
    notes={["PNG is lossless but usually larger than JPG; converting does not restore detail already lost in the JPG.", "Files are processed one by one in your browser; up to 20 files of 30 MB and 50 megapixels each.", "Metadata such as EXIF and colour profiles is not copied to the result."]}
    faq={[{"q": "Will quality improve?", "a": "No. PNG stores the pixels exactly as they are in the JPG, including any compression artefacts."}]}><ImageTool cfg={{ slug: "jpg-to-png", inputKinds: ["jpeg"], extensions: ["jpg", "jpeg"], mode: "convert", output: "png", defaultQuality: 0.92 }} /></ToolLayout>);
}
