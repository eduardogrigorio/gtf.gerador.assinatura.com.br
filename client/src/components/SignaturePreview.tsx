import { Card } from "@/components/ui/card";
import { useEffect, useRef, useState } from "react";
import { SignatureData } from "./SignatureForm";

interface SignaturePreviewProps {
  data: SignatureData;
  onCanvasReady: (canvas: HTMLCanvasElement) => void;
}

export function SignaturePreview({ data, onCanvasReady }: SignaturePreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const templateImageRef = useRef<HTMLImageElement | null>(null);

  // Load template image once
  useEffect(() => {
    const img = new Image();
    img.src = "/images/template_clean.jpg";
    img.crossOrigin = "anonymous";
    
    img.onload = () => {
      templateImageRef.current = img;
      setImageLoaded(true);
    };
    
    img.onerror = () => {
      console.error("Failed to load template image");
    };
  }, []);

  // Draw canvas whenever data changes or image loads
  useEffect(() => {
    if (!imageLoaded || !canvasRef.current || !templateImageRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = templateImageRef.current;

    // Set canvas dimensions to match image
    canvas.width = img.width;
    canvas.height = img.height;

    // Draw background template
    ctx.drawImage(img, 0, 0);

    // Configure text styles
    // Based on the example image analysis
    // Name: Large, White, Sans-serif
    // Role/Location: Smaller, White, Sans-serif
    // Email: White, next to email icon
    // Phone: White, next to phone icon

    // 1. Draw Name
    ctx.font = "500 58px 'Montserrat', sans-serif"; // Adjusted size based on visual estimation
    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    // Position estimated from the example image (left side, vertically centered-ish)
    const startX = 130; // Left padding
    const startY = 190; // Top padding for name
    
    if (data.name) {
      ctx.fillText(data.name, startX, startY);
    } else {
      // Placeholder
      ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
      ctx.fillText("Nome do Colaborador", startX, startY);
    }

    // 2. Draw Role - Location
    ctx.font = "400 32px 'Open Sans', sans-serif";
    ctx.fillStyle = "#FFFFFF";
    const roleY = startY + 75; // Spacing below name
    
    let roleText = "";
    if (data.role && data.location) {
      roleText = `${data.role} - ${data.location}`;
    } else if (data.role) {
      roleText = data.role;
    } else if (data.location) {
      roleText = data.location;
    } else {
      roleText = "Cargo - Localidade";
      ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    }
    ctx.fillText(roleText, startX, roleY);

    // 3. Draw Email
    // The email icon is part of the template image at approx (130, 310)
    // We need to place text next to it
    ctx.font = "400 30px 'Open Sans', sans-serif";
    ctx.fillStyle = "#FFFFFF";
    const contactY = roleY + 85; // Spacing below role
    const emailX = startX + 55; // Spacing for icon
    
    if (data.email) {
      ctx.fillText(data.email, emailX, contactY);
    } else {
      ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
      ctx.fillText("email@grupoterrafirme.com.br", emailX, contactY);
    }

    // 4. Draw Phone
    // The phone icon is part of the template image at approx (center-right area)
    // Let's estimate position based on the example
    if (data.showPhone) {
      const phoneX = 820; // Estimated X position for phone text
      
      ctx.fillStyle = "#FFFFFF";
      if (data.phone) {
        ctx.fillText(data.phone, phoneX, contactY);
      } else {
        ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
        ctx.fillText("XX XXXXX-XXXX", phoneX, contactY);
      }
    }

    // Notify parent that canvas is updated
    onCanvasReady(canvas);

  }, [data, imageLoaded, onCanvasReady]);

  return (
    <div className="w-full flex flex-col gap-4">
      <Card className="overflow-hidden border-none shadow-2xl bg-white/5 p-1 backdrop-blur-sm ring-1 ring-white/20">
        <div className="relative w-full aspect-[3/1] bg-gray-100 rounded-lg overflow-hidden">
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
              Carregando template...
            </div>
          )}
          <canvas 
            ref={canvasRef} 
            className="w-full h-full object-contain"
          />
        </div>
      </Card>
      
      <div className="flex justify-between text-xs text-muted-foreground px-2">
        <span>Preview em tempo real</span>
        <span>Dimensões originais: 1600 x 534px</span>
      </div>
    </div>
  );
}
