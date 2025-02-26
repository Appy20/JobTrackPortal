import { useEffect, useRef, useState } from 'react';
import * as pdfjs from 'pdfjs-dist';
import { Skeleton } from '@/components/ui/skeleton';

// Initialize PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PdfViewerProps {
  pdfPath: string;
}

export default function PdfViewer({ pdfPath }: PdfViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPDF = async () => {
      try {
        const pdf = await pdfjs.getDocument(pdfPath).promise;
        const page = await pdf.getPage(1);

        if (canvasRef.current) {
          const canvas = canvasRef.current;
          const context = canvas.getContext('2d');

          const viewport = page.getViewport({ scale: 1.5 });
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          await page.render({
            canvasContext: context!,
            viewport: viewport
          }).promise;

          setLoading(false);
        }
      } catch (error) {
        console.error('Error loading PDF:', error);
        setLoading(false);
      }
    };

    loadPDF();
  }, [pdfPath]);

  if (loading) {
    return <Skeleton className="w-full h-full" />;
  }

  return (
    <div className="w-full h-full overflow-auto">
      <canvas ref={canvasRef} />
    </div>
  );
}