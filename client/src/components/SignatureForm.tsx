import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Download, Leaf, RefreshCw, RotateCcw } from "lucide-react";
import { ChangeEvent, useState } from "react";

export interface SignatureData {
  name: string;
  role: string;
  location: string;
  email: string;
  phone: string;
  showPhone: boolean;
}

interface SignatureFormProps {
  data: SignatureData;
  onChange: (data: SignatureData) => void;
  onDownload: () => void;
  onReset: () => void;
  isGenerating: boolean;
}

export function SignatureForm({ data, onChange, onDownload, onReset, isGenerating }: SignatureFormProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({ ...data, [name]: value });
  };

  const handleSwitchChange = (checked: boolean) => {
    onChange({ ...data, showPhone: checked });
  };

  return (
    <Card className="w-full h-full border-none shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 bg-primary/10 rounded-full">
          <img src="\images\gtf_logo.png" alt="" width={60} />
            {/* <Leaf className="w-5 h-5 text-primary" /> */}
          </div>
          <span className="text-1xl font-bold text-primary tracking-wider uppercase">Grupo Terra Firme</span>
        </div>
        <CardTitle className="text-2xl font-heading font-extrabold text-primary">Seus Dados</CardTitle>
        <CardDescription className="text-muted-foreground">
          Preencha as informações abaixo para personalizar sua assinatura corporativa.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-primary font-semibold">Nome Completo</Label>
            <Input
              id="name"
              name="name"
              placeholder="Ex: João Silva"
              value={data.name}
              onChange={handleChange}
              className="border-primary/20 focus:border-primary focus:ring-primary/20 bg-white/50 transition-all duration-300"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role" className="text-primary font-semibold">Cargo</Label>
              <Input
                id="role"
                name="role"
                placeholder="Ex: Analista Comercial"
                value={data.role}
                onChange={handleChange}
                className="border-primary/20 focus:border-primary focus:ring-primary/20 bg-white/50 transition-all duration-300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location" className="text-primary font-semibold">Localidade</Label>
              <Input
                id="location"
                name="location"
                placeholder="Ex: São Paulo - SP"
                value={data.location}
                onChange={handleChange}
                className="border-primary/20 focus:border-primary focus:ring-primary/20 bg-white/50 transition-all duration-300"
              />
            </div>
          </div>

          <Separator className="bg-primary/10" />

          <div className="space-y-2">
            <Label htmlFor="email" className="text-primary font-semibold">E-mail Corporativo</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="nome@grupoterrafirme.com.br"
              value={data.email}
              onChange={handleChange}
              className="border-primary/20 focus:border-primary focus:ring-primary/20 bg-white/50 transition-all duration-300"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="phone" className="text-primary font-semibold">Telefone / Celular</Label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Incluir na assinatura</span>
                <Switch 
                  checked={data.showPhone} 
                  onCheckedChange={handleSwitchChange}
                  className="data-[state=checked]:bg-primary"
                />
              </div>
            </div>
            <Input
              id="phone"
              name="phone"
              placeholder="Ex: (11) 99999-8888"
              value={data.phone}
              onChange={handleChange}
              disabled={!data.showPhone}
              className={`border-primary/20 focus:border-primary focus:ring-primary/20 bg-white/50 transition-all duration-300 ${!data.showPhone ? 'opacity-50' : ''}`}
            />
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={onDownload} 
            className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold py-6 shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <Download className="mr-2 h-5 w-5" />
                Baixar Assinatura
              </>
            )}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={onReset}
            className="border-primary/20 text-primary hover:bg-primary/5 hover:text-primary font-semibold py-6"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Limpar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
