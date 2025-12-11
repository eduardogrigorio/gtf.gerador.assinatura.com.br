import { SignatureData, SignatureForm } from "@/components/SignatureForm";
import { SignaturePreview } from "@/components/SignaturePreview";
import { useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const [formData, setFormData] = useState<SignatureData>({
    name: "",
    role: "",
    location: "",
    email: "",
    phone: "",
    showPhone: true,
  });

  const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    if (!canvasRef) {
      toast.error("Erro ao gerar assinatura. Tente novamente.");
      return;
    }

    if (!formData.name) {
      toast.warning("Por favor, preencha pelo menos o seu nome.");
      return;
    }

    setIsGenerating(true);

    try {
      // Create a high quality blob
      canvasRef.toBlob((blob) => {
        if (!blob) {
          throw new Error("Falha ao criar arquivo de imagem");
        }

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        
        // Sanitize filename
        const safeName = formData.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        link.download = `assinatura_${safeName || 'terrafirme'}.jpg`;
        
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        toast.success("Assinatura baixada com sucesso!");
      }, "image/jpeg", 0.95); // 95% quality JPG
    } catch (error) {
      console.error(error);
      toast.error("Ocorreu um erro ao baixar a assinatura.");
    } finally {
      // Small delay to show loading state
      setTimeout(() => setIsGenerating(false), 500);
    }
  };

  const handleReset = () => {
    setFormData({
      name: "",
      role: "",
      location: "",
      email: "",
      phone: "",
      showPhone: true,
    });
    toast.info("Formulário limpo.");
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      {/* Background Decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="absolute -top-[20%] -right-[10%] w-[50vw] h-[50vw] rounded-full bg-secondary/5 blur-3xl" />
        <div className="absolute top-[40%] -left-[10%] w-[40vw] h-[40vw] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="container py-8 md:py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Form (4 cols) */}
          <div className="lg:col-span-4 lg:sticky lg:top-8 z-10 order-2 lg:order-1">
            <SignatureForm 
              data={formData} 
              onChange={setFormData} 
              onDownload={handleDownload}
              onReset={handleReset}
              isGenerating={isGenerating}
            />
          </div>

          {/* Right Column: Preview & Info (8 cols) */}
          <div className="lg:col-span-8 space-y-8 order-1 lg:order-2">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-primary tracking-tight">
                Gerador de Assinaturas
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                Crie sua assinatura de e-mail oficial do <strong className="text-primary">Grupo Terra Firme</strong> em segundos. 
                Preencha seus dados e baixe a imagem pronta para uso.
              </p>
            </div>

            <SignaturePreview 
              data={formData} 
              onCanvasReady={setCanvasRef} 
            />

            {/* Instructions Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
              <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl border border-white/50 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary font-bold text-lg">1</div>
                <h3 className="font-bold text-primary mb-2">Preencha</h3>
                <p className="text-sm text-muted-foreground">Insira seus dados profissionais no formulário lateral. A visualização atualiza automaticamente.</p>
              </div>
              
              <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl border border-white/50 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary font-bold text-lg">2</div>
                <h3 className="font-bold text-primary mb-2">Baixe</h3>
                <p className="text-sm text-muted-foreground">Clique em "Baixar Assinatura" para salvar a imagem em alta resolução no seu dispositivo.</p>
              </div>

              <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl border border-white/50 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary font-bold text-lg">3</div>
                <h3 className="font-bold text-primary mb-2">Configure</h3>
                <p className="text-sm text-muted-foreground">No seu programa de e-mail (Outlook, Gmail), vá em Configurações &gt; Assinatura e insira a imagem.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
