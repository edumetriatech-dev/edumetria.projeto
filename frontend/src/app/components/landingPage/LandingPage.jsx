"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import Header from "@/app/components/landingPage/Header";
import Footer from "@/app/components/landingPage/Footer";
/* import Image from "next/image"; */

import {
  Upload,
  Cog,
  BarChart3,
  Shield,
  Zap,
  PieChart,
  Users,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

const LandingPage = () => {
  const router = useRouter();
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  const howItWorks = [
    {
      icon: Upload,
      title: "1. Envie os Dados",
      description:
        "Faça upload de um arquivo CSV com histórico de notas e faltas dos alunos",
    },
    {
      icon: Cog,
      title: "2. IA Processa",
      description:
        "Algoritmo Random Forest analisa padrões e identifica riscos de evasão",
    },
    {
      icon: BarChart3,
      title: "3. Receba Insights",
      description:
        "Visualize resultados, priorize intervenções e exporte relatórios",
    },
  ];

  const features = [
    {
      icon: Shield,
      title: "Precisão Confiável",
      description: "Modelo treinado com dados educacionais reais",
    },
    {
      icon: Zap,
      title: "Resultados Rápidos",
      description: "Análise completa em menos de 30 segundos",
    },
    {
      icon: PieChart,
      title: "Visualização Clara",
      description: "Dashboards intuitivos e relatórios exportáveis",
    },
    {
      icon: Users,
      title: "Foco em Prevenção",
      description: "Identifique alunos que precisam de atenção prioritária",
    },
  ];

  useEffect(() => {
    setMounted(true);

    const scrollTo = localStorage.getItem("scrollTo");

    if (scrollTo) {
      setTimeout(() => {
        const element = document.getElementById(scrollTo);
        element?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }

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

      {/* Hero Section */}
      <section id="hero" className="pt-24 md:pt-32 pb-16 md:pb-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent mb-6">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Powered by AI</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
                Previna a Evasão Escolar com{" "}
                <span className="text-support">Inteligência Artificial</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl">
                Identifique alunos em risco e tome ações preventivas baseadas em
                dados. Sistema inteligente para gestores educacionais.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="xl" variant="accent">
                  <Link href="/login">
                    Começar Agora
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="xl" variant="outline">
                  <Link href="/demonstracao">Ver Demonstração</Link>
                </Button>
              </div>
            </div>

            <div className="relative animate-fade-in hidden lg:block">
              <div className="gradient-hero rounded-2xl p-8 shadow-2xl">
                <div className="bg-card rounded-xl p-6 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-3 w-3 rounded-full bg-risk-high"></div>
                    <div className="h-3 w-3 rounded-full bg-risk-medium"></div>
                    <div className="h-3 w-3 rounded-full bg-risk-low"></div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Users className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Total de Alunos
                        </p>
                        <p className="text-2xl font-bold text-foreground">
                          247
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 rounded-lg bg-risk-high/10">
                        <p className="text-2xl font-bold text-risk-high">23</p>
                        <p className="text-xs text-muted-foreground">
                          Alto Risco
                        </p>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-risk-medium/10">
                        <p className="text-2xl font-bold text-risk-medium">
                          58
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Médio Risco
                        </p>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-risk-low/10">
                        <p className="text-2xl font-bold text-risk-low">166</p>
                        <p className="text-xs text-muted-foreground">
                          Baixo Risco
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 h-24 w-24 bg-accent/20 rounded-full blur-2xl"></div>
              <div className="absolute -top-4 -left-4 h-32 w-32 bg-support/20 rounded-full blur-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 md:py-24 bg-muted/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Como Funciona
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Em três passos simples, transforme dados brutos em insights
              acionáveis
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((item, index) => (
              <div
                key={index}
                className="bg-card rounded-xl p-8 shadow-sm border border-border hover:shadow-lg transition-shadow duration-300 text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                  <item.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {item.title}
                </h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Recursos do Sistema
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tecnologia avançada para apoiar decisões educacionais
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-start gap-4 bg-card rounded-xl p-6 border border-border hover:border-support/50 transition-colors duration-300"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-support/10 flex items-center justify-center">
                  <feature.icon className="h-6 w-6 text-support" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="gradient-hero rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Pronto para Prevenir a Evasão?
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Comece agora mesmo a identificar alunos em risco e tome decisões
              baseadas em dados
            </p>
            <Button asChild size="xl" variant="hero">
              <Link href="/login">
                Começar Análise
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
