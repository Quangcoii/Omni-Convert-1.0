import type { Metadata } from 'next';
import ToolLayout from '@/components/ToolLayout';
import { getTool, toolHref } from '@/lib/tools';
import ImageTool from '@/components/ImageTool';
const tool = getTool('image', 'webp-to-jpg')!;
export const metadata: Metadata = { title: "WebP to JPG Converter \u2014 Free, in Your Browser", description: "Convert WebP to JPG online. Works in your browser, no upload, adjustable quality.", alternates: { canonical: toolHref(tool) } };
export default function Page() {
  return (<ToolLayout tool={tool} noun="files"
    howTo={["Drop one or more WebP files.", "Set the quality.", "Download the JPG files."]}
    notes={["Transparent areas become white because JPG has no transparency.", "Animated WebP files are converted using their first frame.", "Files are processed one by one in your browser; up to 20 files of 30 MB and 50 megapixels each.", "Metadata such as EXIF and colour profiles is not copied to the result."]}
    faq={[{"q": "Why convert WebP to JPG?", "a": "JPG opens in virtually every app and device, while some older software cannot open WebP."}]}><ImageTool cfg={{ slug: "webp-to-jpg", inputKinds: ["webp"], extensions: ["webp"], mode: "convert", output: "jpeg", defaultQuality: 0.9 }} /></ToolLayout>);
}
