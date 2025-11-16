import React, { useState, useEffect } from 'react';
import { User, Palette, Bell, Globe, Shield, Save } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useCustomAuth } from '@/hooks/useCustomAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useThemeContext } from '@/components/ThemeProvider';
import { useTranslation } from '@/hooks/useTranslation';

const Configuracoes = () => {
  const { user } = useCustomAuth();
  const { theme, setTheme } = useThemeContext();
  const { language, setLanguage, t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [isSavingPrefs, setIsSavingPrefs] = useState(false);
  const [isSavingNotifs, setIsSavingNotifs] = useState(false);
  
  // Perfil
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [email, setEmail] = useState('');
  
  // Notificações
  const [notificacoes, setNotificacoes] = useState({
    email_resumos: true,
    email_eventos: true,
    email_palestras: true,
    push_resumos: false,
    push_eventos: false,
  });

  useEffect(() => {
    if (user?.profile) {
      setNomeCompleto(user.profile.nome_completo || '');
      setEmail(user.profile.email || '');
      loadUserPreferences();
    }
  }, [user]);

  const loadUserPreferences = async () => {
    if (!user?.profile?.id) return;

    try {
      const savedNotifs = localStorage.getItem('app_notifications');
      
      if (savedNotifs) {
        try {
          setNotificacoes(JSON.parse(savedNotifs));
        } catch (e) {
          console.error('Erro ao parsear notificações:', e);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar preferências:', error);
    }
  };

  const handleSaveProfile = async () => {
    if (!user?.profile?.id || !nomeCompleto.trim()) {
      toast.error('Por favor, preencha o nome completo.');
      return;
    }
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('scribia_usuarios')
        .update({ nome_completo: nomeCompleto.trim() })
        .eq('id', user.profile.id);

      if (error) throw error;
      
      toast.success(t('settings.profile.success'));
      
      // Recarregar a sessão para atualizar o nome no header
      window.location.reload();
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      toast.error(t('settings.profile.error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePreferences = async () => {
    if (!user?.profile?.id) return;
    
    setIsSavingPrefs(true);
    try {
      toast.success(t('settings.appearance.success'));
    } catch (error) {
      console.error('Erro ao salvar idioma:', error);
      toast.error(t('settings.appearance.error'));
    } finally {
      setIsSavingPrefs(false);
    }
  };

  const handleSaveNotifications = async () => {
    if (!user?.profile?.id) return;
    
    setIsSavingNotifs(true);
    try {
      localStorage.setItem('app_notifications', JSON.stringify(notificacoes));
      
      toast.success(t('settings.notifications.success'));
    } catch (error) {
      console.error('Erro ao salvar notificações:', error);
      toast.error(t('settings.notifications.error'));
    } finally {
      setIsSavingNotifs(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 py-6 space-y-6 md:space-y-8">
        {/* Header */}
        <div className="space-y-1 md:space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{t('settings.title')}</h1>
          <p className="text-muted-foreground text-sm md:text-base lg:text-lg">
            Gerencie suas preferências e informações pessoais
          </p>
        </div>

        {/* Perfil */}
        <Card>
          <CardHeader className="p-4 md:p-6">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 md:w-5 md:h-5 text-primary" />
              </div>
              <div className="min-w-0">
                <CardTitle className="text-base md:text-lg">{t('settings.profile.title')}</CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  Atualize suas informações pessoais
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 p-4 md:p-6">
            <div className="space-y-2">
              <Label htmlFor="nome">{t('settings.profile.name')}</Label>
              <Input
                id="nome"
                value={nomeCompleto}
                onChange={(e) => setNomeCompleto(e.target.value)}
                placeholder="Seu nome completo"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">{t('settings.profile.email')}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                O email não pode ser alterado
              </p>
            </div>

            <Separator className="my-4" />

            <div className="flex justify-end">
              <Button 
                onClick={handleSaveProfile}
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? t('settings.profile.saving') : t('settings.profile.save')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Aparência e Idioma */}
        <Card>
          <CardHeader className="p-4 md:p-6">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Palette className="w-4 h-4 md:w-5 md:h-5 text-primary" />
              </div>
              <div className="min-w-0">
                <CardTitle className="text-base md:text-lg">{t('settings.appearance.title')}</CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  Personalize a aparência e o idioma da plataforma
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 p-4 md:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tema">{t('settings.appearance.theme')}</Label>
                <Select value={theme} onValueChange={(value: any) => setTheme(value)}>
                  <SelectTrigger id="tema">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">{t('settings.appearance.theme.light')}</SelectItem>
                    <SelectItem value="dark">{t('settings.appearance.theme.dark')}</SelectItem>
                    <SelectItem value="system">{t('settings.appearance.theme.system')}</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Escolha o tema da interface (aplicado automaticamente)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="idioma">{t('settings.appearance.language')}</Label>
                <Select value={language} onValueChange={(value: any) => setLanguage(value)}>
                  <SelectTrigger id="idioma">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pt-BR">{t('settings.appearance.language.pt')}</SelectItem>
                    <SelectItem value="en-US">{t('settings.appearance.language.en')}</SelectItem>
                    <SelectItem value="es-ES">{t('settings.appearance.language.es')}</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Idioma da interface
                </p>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex justify-end">
              <Button 
                onClick={handleSavePreferences} 
                className="w-full sm:w-auto"
                disabled={isSavingPrefs}
              >
                <Save className="w-4 h-4 mr-2" />
                {isSavingPrefs ? t('settings.appearance.saving') : t('settings.appearance.save')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notificações */}
        <Card>
          <CardHeader className="p-4 md:p-6">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Bell className="w-4 h-4 md:w-5 md:h-5 text-primary" />
              </div>
              <div className="min-w-0">
                <CardTitle className="text-base md:text-lg">{t('settings.notifications.title')}</CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  Gerencie como você recebe notificações
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 p-4 md:p-6">
            {/* Notificações por Email */}
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-1">Notificações por Email</h3>
                <p className="text-sm text-muted-foreground">
                  Receba atualizações por email
                </p>
              </div>

              <div className="space-y-4 pl-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email_resumos">Novos Livebooks</Label>
                    <p className="text-sm text-muted-foreground">
                      Quando um novo livebook for gerado
                    </p>
                  </div>
                  <Switch
                    id="email_resumos"
                    checked={notificacoes.email_resumos}
                    onCheckedChange={(checked) =>
                      setNotificacoes({ ...notificacoes, email_resumos: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email_eventos">Eventos</Label>
                    <p className="text-sm text-muted-foreground">
                      Lembretes sobre seus eventos
                    </p>
                  </div>
                  <Switch
                    id="email_eventos"
                    checked={notificacoes.email_eventos}
                    onCheckedChange={(checked) =>
                      setNotificacoes({ ...notificacoes, email_eventos: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email_palestras">Palestras</Label>
                    <p className="text-sm text-muted-foreground">
                      Atualizações sobre suas palestras
                    </p>
                  </div>
                  <Switch
                    id="email_palestras"
                    checked={notificacoes.email_palestras}
                    onCheckedChange={(checked) =>
                      setNotificacoes({ ...notificacoes, email_palestras: checked })
                    }
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Notificações Push */}
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-1">Notificações Push</h3>
                <p className="text-sm text-muted-foreground">
                  Receba notificações no navegador
                </p>
              </div>

              <div className="space-y-4 pl-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="push_resumos">Novos Livebooks</Label>
                    <p className="text-sm text-muted-foreground">
                      Notificação quando um livebook for concluído
                    </p>
                  </div>
                  <Switch
                    id="push_resumos"
                    checked={notificacoes.push_resumos}
                    onCheckedChange={(checked) =>
                      setNotificacoes({ ...notificacoes, push_resumos: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="push_eventos">Lembretes de Eventos</Label>
                    <p className="text-sm text-muted-foreground">
                      Notificação antes do evento começar
                    </p>
                  </div>
                  <Switch
                    id="push_eventos"
                    checked={notificacoes.push_eventos}
                    onCheckedChange={(checked) =>
                      setNotificacoes({ ...notificacoes, push_eventos: checked })
                    }
                  />
                </div>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex justify-end">
              <Button 
                onClick={handleSaveNotifications} 
                className="w-full sm:w-auto"
                disabled={isSavingNotifs}
              >
                <Save className="w-4 h-4 mr-2" />
                {isSavingNotifs ? t('settings.notifications.saving') : t('settings.notifications.save')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Privacidade */}
        <Card>
          <CardHeader className="p-4 md:p-6">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-4 h-4 md:w-5 md:h-5 text-primary" />
              </div>
              <div className="min-w-0">
                <CardTitle className="text-base md:text-lg">{t('settings.privacy.title')}</CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  Gerencie suas configurações de privacidade
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 p-4 md:p-6">
            <div className="rounded-lg border border-muted p-4 space-y-3">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-medium">Seus dados estão seguros</h4>
                  <p className="text-sm text-muted-foreground">
                    Todos os seus dados são criptografados e armazenados com segurança. 
                    Nunca compartilhamos suas informações com terceiros sem seu consentimento.
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start" disabled>
                <Globe className="w-4 h-4 mr-2" />
                Exportar Meus Dados
              </Button>
              <p className="text-xs text-muted-foreground px-1">
                Em breve você poderá baixar uma cópia de todos os seus dados
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
  );
};

export default Configuracoes;
