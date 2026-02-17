import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img
              src="/logos/logo-edumetria.png"
              alt="Edumetria"
              className="h-12 w-auto brightness-0 invert"
            />
          </div>
          
          <p className="text-sm text-primary-foreground/80 text-center">
            © 2026 ELOS - Sistema de Predição de Evasão Escolar | Desenvolvido por Edumetria
          </p>
          
          <div className="flex items-center gap-6">
            <Link href="/sobre" className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
              Privacidade
            </Link>
            <Link href="/sobre" className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
              Termos de Uso
            </Link>
            <Link href="/sobre" className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
              Contato
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;