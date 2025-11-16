import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCustomAuth } from "@/hooks/useCustomAuth";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, LogOut, Settings, DollarSign } from "lucide-react";

interface PatrocinadorLayoutProps {
  children: React.ReactNode;
}

export const PatrocinadorLayout = ({ children }: PatrocinadorLayoutProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useCustomAuth();
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const menuItems = [
    { label: "Dashboard", icon: DollarSign, path: "/dashboard/patrocinador" },
    { label: "Configurações", icon: Settings, path: "/dashboard/configuracoes" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/20">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            {isMobile && (
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64">
                  <nav className="flex flex-col gap-2 mt-8">
                    {menuItems.map((item) => (
                      <Button
                        key={item.path}
                        variant="ghost"
                        className="justify-start"
                        onClick={() => {
                          navigate(item.path);
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <item.icon className="h-5 w-5 mr-2" />
                        {item.label}
                      </Button>
                    ))}
                    <Button
                      variant="ghost"
                      className="justify-start text-destructive"
                      onClick={logout}
                    >
                      <LogOut className="h-5 w-5 mr-2" />
                      Sair
                    </Button>
                  </nav>
                </SheetContent>
              </Sheet>
            )}
            <h1 className="text-xl font-bold text-foreground">ScribIA - Patrocinador</h1>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground hidden md:inline">
              {user?.profile.nome_completo}
            </span>
            {!isMobile && (
              <Button variant="ghost" size="icon" onClick={logout}>
                <LogOut className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-6">
        {children}
      </main>
    </div>
  );
};
