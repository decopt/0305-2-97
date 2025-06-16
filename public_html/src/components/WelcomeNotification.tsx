import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const WELCOME_NOTIFICATION_KEY = 'welcome_notification_shown';

export function WelcomeNotification() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const hasSeenNotification = localStorage.getItem(WELCOME_NOTIFICATION_KEY);
    if (!hasSeenNotification) {
      setOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem(WELCOME_NOTIFICATION_KEY, 'true');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center text-[#2E86C1]">
            🎉 Bem-vindo ao Agenda Fácil!
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>Olá,</p>
          <p>
            É um prazer ter você com a gente! Com o <strong>Agenda Fácil</strong>, seus agendamentos ficarão mais organizados, automáticos e práticos para você e seus clientes.
          </p>
          <p>Para começar, siga este passo a passo de configuração inicial:</p>
          <ol className="list-decimal pl-6 space-y-2">
            <li>
              <strong>Acesse o painel:</strong>{' '}
              <a href="https://conectdigitalpro.com/dashboard" className="text-[#2E86C1] hover:underline">
                conectdigitalpro.com/dashboard
              </a>
            </li>
            <li>
              <strong>Vá até a aba:</strong> <em>Equipe</em>
              <br />
              <span className="text-gray-500">(Mesmo que atenda sozinho, é necessário adicionar um colaborador.)</span>
            </li>
            <li><strong>Adicione um colaborador</strong> – normalmente você mesmo.</li>
            <li><strong>Acesse a aba:</strong> <em>Serviços</em></li>
            <li><strong>Cadastre o serviço</strong> que você oferece.</li>
            <li><strong>Edite o serviço</strong> criado e vá em <em>Atribuir colaboradores</em>.</li>
            <li><strong>Selecione o colaborador</strong> vinculado ao serviço.</li>
            <li><strong>Acesse:</strong> <em>Configuração → Link personalizado</em></li>
            <li>
              <strong>Crie seu link de agendamento</strong> (exemplo: <code>suaempresa</code>) e clique em <strong>Salvar</strong>.
            </li>
          </ol>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-green-700 font-bold">Pronto!</p>
            <p className="text-green-700">
              Seu sistema de agendamento está ativo e pronto para ser compartilhado nas redes sociais ou enviado diretamente aos seus clientes.
            </p>
          </div>
          <p>Você pode continuar explorando as configurações e adaptar a plataforma conforme as necessidades da sua empresa.</p>
          <p className="mt-6">💬 Em caso de dúvidas, estamos à disposição!</p>
          <p><strong>Equipe Agenda Fácil</strong></p>
          <hr className="my-8 border-gray-200" />
          <div className="text-center">
            <h3 className="text-xl font-semibold text-[#2E86C1] mb-4">📌 Exemplo de como seus clientes verão o agendamento:</h3>
            <img
              src="https://s3.conectdigitalpro.com/agendafacil/6.jpg"
              alt="Demonstração do serviço de agendamento"
              className="max-w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <Button onClick={handleClose} className="bg-[#2E86C1] hover:bg-[#2E86C1]/90">
            Entendi, vamos começar!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 