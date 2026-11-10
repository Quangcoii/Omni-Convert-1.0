import type { Metadata } from 'next';
import ToolLayout from '@/components/ToolLayout';
import { getTool, toolHref } from '@/lib/tools';
import ImageTool from '@/components/ImageTool';
const tool = getTool('image', 'jpg-to-webp')!;
export const metadata: Metadata = { title: "JPG to WebP Converter \u2014 Smaller Images, In Your Browser", description: "Convert JPG or PNG to WebP online to reduce file size. Runs in your browser; nothing is uploaded.", alternates: { canonical: toolHref(tool) } };
export default function Page() {
  return (<ToolLayout tool={tool} noun="files"
    howTo={["Drop JPG or PNG files.", "Set the WebP quality.", "Download the WebP files."]}
    notes={["Needs a browser that can encode WebP (current Chrome, Edge and Firefox can). Otherwise you will see a message and no file is produced.", "PNG transparency is kept in WebP.", "Files are processed one by one in your browser; up to 20 files of 30 MB and 50 megapixels each.", "Metadata such as EXIF and colour profiles is not copied to the result."]}
    faq={[{"q": "Is WebP smaller than JPG?", "a": "Usually, by roughly a quarter at similar visual quality, but results vary by image."}]}><ImageTool cfg={{ slug: "jpg-to-webp", inputKinds: ["jpeg", "png"], extensions: ["jpg", "jpeg", "png"], mode: "convert", output: "webp", defaultQuality: 0.85 }} /></ToolLayout>);
}
