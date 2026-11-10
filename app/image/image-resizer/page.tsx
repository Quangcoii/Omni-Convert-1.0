import type { Metadata } from 'next';
import ToolLayout from '@/components/ToolLayout';
import { getTool, toolHref } from '@/lib/tools';
import ImageTool from '@/components/ImageTool';
const tool = getTool('image', 'image-resizer')!;
export const metadata: Metadata = { title: "Image Resizer \u2014 Resize JPG, PNG and WebP by Pixels or %", description: "Resize images online by percentage or width and height in pixels. Runs in your browser; nothing is uploaded.", alternates: { canonical: toolHref(tool) } };
export default function Page() {
  return (<ToolLayout tool={tool} noun="files"
    howTo={["Choose percentage or pixel size.", "Drop your images.", "Download the resized files."]}
    notes={["The original format is kept (JPG and WebP are re-encoded at the chosen quality).", "Enlarging an image makes it bigger but not sharper.", "Files are processed one by one in your browser; up to 20 files of 30 MB and 50 megapixels each.", "Metadata such as EXIF and colour profiles is not copied to the result."]}
    faq={[{"q": "Can I set only the width?", "a": "Yes. Leave the height empty and keep the aspect ratio ticked; the height is calculated for you."}]}><ImageTool cfg={{ slug: "image-resizer", inputKinds: ["jpeg", "png", "webp"], extensions: ["jpg", "jpeg", "png", "webp"], mode: "resize", output: "same", defaultQuality: 0.92 }} /></ToolLayout>);
}
