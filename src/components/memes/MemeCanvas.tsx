import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { MemeTemplate, TextPosition } from '../../data/memeTemplates';

export interface MemeCanvasHandle {
  exportImage: () => string | null;
}

interface MemeCanvasProps {
  template: MemeTemplate;
  texts: Record<string, string>;
  backgroundImage?: string;
  width?: number;
  height?: number;
}

export const MemeCanvas = forwardRef<MemeCanvasHandle, MemeCanvasProps>(
  ({ template, texts, backgroundImage, width = 400, height = 400 }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useImperativeHandle(ref, () => ({
      exportImage: () => {
        if (!canvasRef.current) return null;
        return canvasRef.current.toDataURL('image/png');
      },
    }));

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Draw background
      if (backgroundImage) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          ctx.drawImage(img, 0, 0, width, height);
          drawTexts(ctx);
        };
        img.onerror = () => {
          // Fallback to solid color
          ctx.fillStyle = template.backgroundColor;
          ctx.fillRect(0, 0, width, height);
          drawTexts(ctx);
        };
        img.src = backgroundImage;
      } else {
        // Solid background
        ctx.fillStyle = template.backgroundColor;
        ctx.fillRect(0, 0, width, height);
        drawTexts(ctx);
      }
    }, [template, texts, backgroundImage, width, height]);

    const drawTexts = (ctx: CanvasRenderingContext2D) => {
      template.textPositions.forEach((pos) => {
        const text = texts[pos.id] || '';
        if (!text) return;

        drawText(ctx, text, pos);
      });
    };

    const drawText = (ctx: CanvasRenderingContext2D, text: string, pos: TextPosition) => {
      const x = (pos.x / 100) * width;
      const y = (pos.y / 100) * height;
      const maxWidth = (pos.width / 100) * width;

      // Scale font size based on canvas size
      const scaledFontSize = (pos.fontSize / 400) * width;

      ctx.font = `bold ${scaledFontSize}px Impact, Arial Black, sans-serif`;
      ctx.textAlign = pos.align;
      ctx.textBaseline = 'middle';

      // Word wrap
      const words = text.split(' ');
      const lines: string[] = [];
      let currentLine = '';

      words.forEach((word) => {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      });
      if (currentLine) lines.push(currentLine);

      const lineHeight = scaledFontSize * 1.2;
      const startY = y - ((lines.length - 1) * lineHeight) / 2;

      lines.forEach((line, index) => {
        const lineY = startY + index * lineHeight;

        // Draw stroke (outline)
        ctx.strokeStyle = pos.strokeColor;
        ctx.lineWidth = scaledFontSize / 8;
        ctx.lineJoin = 'round';
        ctx.strokeText(line, x, lineY);

        // Draw fill
        ctx.fillStyle = pos.color;
        ctx.fillText(line, x, lineY);
      });
    };

    return (
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{
          width: '100%',
          height: 'auto',
          maxWidth: `${width}px`,
          borderRadius: '12px',
        }}
      />
    );
  }
);

MemeCanvas.displayName = 'MemeCanvas';

export default MemeCanvas;
