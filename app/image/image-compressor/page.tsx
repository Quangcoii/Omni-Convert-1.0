import type { Metadata } from 'next';
import ToolLayout from '@/components/ToolLayout';
import { getTool, toolHref } from '@/lib/tools';
import ImageTool from '@/components/ImageTool';
const tool = getTool('image', 'image-compressor')!;
export const metadata: Metadata = { title: "Image Compressor \u2014 Shrink JPG, PNG and WebP Online", description: "Compress images online in your browser. Choose quality, keep the format or switch to JPG/WebP. No upload.", alternates: { canonical: toolHref(tool) } };
export default function Page() {
  return (<ToolLayout tool={tool} noun="files"
    howTo={["Choose an output format and quality.", "Drop your images.", "Compare sizes and download the results."]}
    notes={["PNG is lossless, so keeping PNG may not shrink the file. Choose JPG or WebP for much smaller files.", "The result can occasionally be larger than the original; the change in size is shown for each file.", "Files are processed one by one in your browser; up to 20 files of 30 MB and 50 megapixels each.", "Metadata such as EXIF and colour profiles is not copied to the result."]}
    faq={[{"q": "Which quality should I use?", "a": "70-80% usually looks identical to the eye while being much smaller. Try it and compare."}]}><ImageTool cfg={{ slug: "image-compressor", inputKinds: ["jpeg", "png", "webp"], extensions: ["jpg", "jpeg", "png", "webp"], mode: "compress", output: "choose", defaultQuality: 0.75 }} /></ToolLayout>);
}
