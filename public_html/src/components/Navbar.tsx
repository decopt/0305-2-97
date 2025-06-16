
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Settings, Crown, Menu, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from '@/hooks/use-mobile';

interface NavigationLink {
  href: string;
  label: string;
}

interface NavbarProps {
  navigationLinks?: NavigationLink[];
}

const Navbar = ({ navigationLinks = [] }: NavbarProps) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [planType, setPlanType] = useState<string>('free');
  const isMobile = useIsMobile();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      
      if (session?.user) {
        // Get user's plan
        const { data } = await supabase
          .from('company_config')
          .select('plan_type')
          .eq('user_id', session.user.id)
          .single();
          
        if (data) {
          setPlanType(data.plan_type);
        }
      }
      
      setLoading(false);
    };
    
    checkSession();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });
    
    return () => subscription.unsubscribe();
  }, []);
  
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };
  
  const NavLinks = () => (
    <div className={isMobile ? "flex flex-col space-y-4" : "hidden md:flex space-x-6 mr-4"}>
      {navigationLinks.map((link, index) => (
        <a 
          key={index} 
          href={link.href}
          className="text-gray-600 hover:text-primary transition-colors font-medium"
        >
          {link.label}
        </a>
      ))}
    </div>
  );
  
  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-center h-16">
        <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-9 h-9 bg-black rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="text-xl font-bold text-primary hidden sm:inline">AgendaFácil</span>
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          {navigationLinks.length > 0 && <NavLinks />}
          
          {isMobile && navigationLinks.length > 0 && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[80%] sm:w-[350px]">
                <div className="py-4">
                  <div className="flex items-center mb-8">
                    <div className="w-8 h-8 bg-black rounded-md flex items-center justify-center mr-2">
                      <span className="text-white font-bold text-sm">A</span>
                    </div>
                    <span className="text-xl font-bold text-primary">AgendaFácil</span>
                  </div>
                  <NavLinks />
                </div>
              </SheetContent>
            </Sheet>
          )}
          
          {loading ? (
            <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-2 hover:bg-gray-100">
                  <Avatar className="h-7 w-7 ring-2 ring-primary/20">
                    <AvatarFallback className="bg-primary/10 text-primary text-sm">
                      {user.email ? user.email.charAt(0).toUpperCase() : "U"}
                    </AvatarFallback>
                    {user.user_metadata?.avatar_url && (
                      <AvatarImage src={user.user_metadata.avatar_url} />
                    )}
                  </Avatar>
                  <span className="hidden md:inline font-medium">
                    {user.email ? user.email.split('@')[0] : "Usuário"}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
                <DropdownMenuItem className="flex items-center gap-2">
                  {planType === 'pro' ? (
                    <>
                      <Crown className="h-4 w-4 text-yellow-500" />
                      <span>Plano PRO</span>
                    </>
                  ) : planType === 'trial' ? (
                    <>
                      <Crown className="h-4 w-4 text-blue-500" />
                      <span>Período de Teste</span>
                    </>
                  ) : (
                    <>
                      <Crown className="h-4 w-4 text-gray-400" />
                      <span>Plano Gratuito</span>
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard" className="flex items-center gap-2 cursor-pointer">
                    <User className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/dashboard?tab=configuracoes" className="flex items-center gap-2 cursor-pointer">
                    <Settings className="h-4 w-4" />
                    <span>Configurações</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="flex items-center gap-2 cursor-pointer text-red-600">
                  <LogOut className="h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="outline" size="sm">
              <Link to="/auth">Entrar</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
