"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Brain,
  Shield,
  BarChart3,
  Target,
  BookOpen,
  Lock,
  Send,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { toast } from "@/app/hooks/use-toast";

const page = () => {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    institution: "",
    message: "",
  });

  const features = [
    { icon: BarChart3, text: "Média de notas por período" },
    { icon: Target, text: "Taxa de faltas acumulada" },
    { icon: BookOpen, text: "Tendência de desempenho" },
    { icon: Brain, text: "Variabilidade acadêmica" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    toast({
      title: "Mensagem enviada!",
      description: "Entraremos em contato em breve.",
    });
    setFormData({ name: "", email: "", institution: "", message: "" });
  };

  useEffect(() => {
    setMounted(true);

    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      setDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const onThemeToggle = () => {
    const newTheme = !dark;
    setDark(newTheme);

    if (newTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const isDark = () => dark;

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header onThemeToggle={onThemeToggle} isDark={isDark} />

      <main className="pt-24 md:pt-32 pb-16 md:pb-24">
        <div className="container mx-auto px-4 md:px-6">
          {/* Breadcrumb */}
          <nav className="mb-8 text-sm text-muted-foreground">
            <span
              className="hover:text-primary cursor-pointer"
              onClick={() => router.push("/")}
            >
              Início
            </span>
            <span className="mx-2">/</span>
            <span className="text-foreground">Sobre o Sistema</span>
          </nav>

          {/* Hero */}
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="flex justify-center gap-6 mb-8">
              <img
                src="/logos/logo-elos.png"
                alt="ELOS"
                className="h-20 w-auto"
              />
              <img
                src="/logos/logo-edumetria.png"
                alt="Edumetria"
                className="h-20 w-auto"
              />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Sobre o ELOS
            </h1>
            <p className="text-lg text-muted-foreground">
              Sistema inteligente de predição de evasão escolar desenvolvido
              para ajudar gestores educacionais a identificar e apoiar alunos em
              risco de abandono escolar.
            </p>
          </div>

          {/* What is it */}
          <section className="mb-16">
            <div className="bg-card rounded-xl border border-border shadow-sm p-8">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Brain className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-4">
                    O que é o ELOS?
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    O ELOS é uma plataforma de inteligência artificial
                    desenvolvida pela Edumetria que utiliza algoritmos de
                    machine learning para analisar dados educacionais e
                    identificar alunos com maior probabilidade de evasão
                    escolar.
                  </p>
                  <p className="text-muted-foreground">
                    A partir do histórico acadêmico de notas, faltas e
                    desempenho dos estudantes, o sistema gera predições precisas
                    que permitem que gestores e educadores tomem ações
                    preventivas antes que a evasão ocorra.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Methodology */}
          <section className="mb-16">
            <div className="bg-card rounded-xl border border-border shadow-sm p-8">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-14 h-14 rounded-lg bg-support/10 flex items-center justify-center">
                  <BarChart3 className="h-7 w-7 text-support" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-foreground mb-4">
                    Metodologia
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Utilizamos o algoritmo <strong>Random Forest</strong>, um
                    dos métodos mais robustos de machine learning, treinado com
                    dados educacionais reais para garantir alta precisão nas
                    predições.
                  </p>

                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Variáveis Analisadas:
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
                      >
                        <feature.icon className="h-5 w-5 text-support" />
                        <span className="text-foreground">{feature.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Privacy */}
          <section className="mb-16">
            <div className="bg-card rounded-xl border border-border shadow-sm p-8">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-14 h-14 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Lock className="h-7 w-7 text-accent" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-4">
                    Privacidade e Segurança
                  </h2>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <Shield className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-foreground">
                          Conformidade com LGPD:
                        </strong>{" "}
                        Todos os dados são tratados em conformidade com a Lei
                        Geral de Proteção de Dados.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Shield className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-foreground">
                          Dados Anonimizados:
                        </strong>{" "}
                        Os dados são processados de forma anonimizada,
                        utilizando apenas IDs de alunos.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Shield className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-foreground">
                          Sem Armazenamento:
                        </strong>{" "}
                        Os arquivos enviados não são armazenados permanentemente
                        em nossos servidores.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Form */}
          <section>
            <div className="bg-card rounded-xl border border-border shadow-sm p-8 max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
                Entre em Contato
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Nome
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, name: e.target.value }))
                      }
                      placeholder="Seu nome completo"
                      required
                      className="bg-background"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, email: e.target.value }))
                      }
                      placeholder="seu@email.com"
                      required
                      className="bg-background"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Instituição
                  </label>
                  <Input
                    value={formData.institution}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        institution: e.target.value,
                      }))
                    }
                    placeholder="Nome da sua instituição"
                    className="bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Mensagem
                  </label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, message: e.target.value }))
                    }
                    placeholder="Como podemos ajudar?"
                    rows={4}
                    required
                    className="bg-background"
                  />
                </div>
                <Button type="submit" className="w-full" size="lg">
                  <Send className="h-4 w-4 mr-2" />
                  Enviar Mensagem
                </Button>
              </form>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default page;
