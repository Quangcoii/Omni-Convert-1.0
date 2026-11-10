import type { Metadata } from 'next';
import ToolLayout from '@/components/ToolLayout';
import { getTool, toolHref } from '@/lib/tools';
import ImageTool from '@/components/ImageTool';
const tool = getTool('image', 'png-to-jpg')!;
export const metadata: Metadata = { title: "PNG to JPG Converter \u2014 Free, in Your Browser", description: "Convert PNG to JPG online with adjustable quality. Files are converted in your browser and never uploaded.", alternates: { canonical: toolHref(tool) } };
export default function Page() {
  return (<ToolLayout tool={tool} noun="files"
    howTo={["Drop one or more PNG files.", "Set the JPG quality (90% is a good default).", "Download each converted file."]}
    notes={["JPG has no transparency: transparent areas are filled with white.", "Files are processed one by one in your browser; up to 20 files of 30 MB and 50 megapixels each.", "Metadata such as EXIF and colour profiles is not copied to the result."]}
    faq={[{"q": "Are my images uploaded?", "a": "No. Conversion uses your browser and nothing leaves your device."}, {"q": "Why is the JPG smaller?", "a": "JPG uses lossy compression, which is usually much smaller than PNG for photos. Lower quality means a smaller file."}]}><ImageTool cfg={{ slug: "png-to-jpg", inputKinds: ["png"], extensions: ["png"], mode: "convert", output: "jpeg", defaultQuality: 0.9 }} /></ToolLayout>);
}
