import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Plus, Edit2, XCircle, Phone, Calendar, Clock } from "lucide-react";
import { toast } from "sonner";
import AppointmentForm from "@/components/AppointmentForm";
import { useIsMobile } from "@/hooks/use-mobile";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface Service {
  id: string;
  name: string;
}

interface CompanyInfo {
  company_name: string | null;
  phone: string | null;
  plan_type: string;
}

interface Appointment {
  id: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  scheduled_at: string;
  service_id: string;
  services: Service;
  status: 'confirmed' | 'cancelled' | 'completed';
  company_info?: CompanyInfo;
  staff: {
    id: string;
    name: string;
  };
  notes?: string;
}

interface AppointmentsListProps {
  onAppointmentChanged?: () => void;
}

const AppointmentsList = ({ onAppointmentChanged }: AppointmentsListProps) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [monthlyLimit, setMonthlyLimit] = useState(60);
  const [monthlyCount, setMonthlyCount] = useState(0);
  const [planType, setPlanType] = useState("free");
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    fetchUserSession();
    fetchAppointments();
    fetchUserPlanInfo();
  }, [selectedDate]);
  
  const fetchUserSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUserId(session.user.id);
      }
    } catch (error) {
      console.error("Error fetching user session:", error);
    }
  };
  
  const fetchUserPlanInfo = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      
      const { data, error } = await supabase
        .from("company_config")
        .select("plan_type, monthly_limit")
        .eq("user_id", session.user.id)
        .single();
        
      if (error) throw error;
      
      if (data) {
        setPlanType(data.plan_type);
        setMonthlyLimit(data.monthly_limit);
      }
      
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      
      const { count, error: countError } = await supabase
        .from("appointments")
        .select("*", { count: 'exact' })
        .eq("user_id", session.user.id)
        .gte("created_at", startOfMonth.toISOString());
        
      if (countError) throw countError;
      
      setMonthlyCount(count || 0);
      
    } catch (error) {
      console.error("Error fetching user plan:", error);
    }
  };
  
  const fetchAppointments = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      let query = supabase
        .from("appointments")
        .select(`
          *,
          services (id, name),
          staff:staff_id (id, name)
        `)
        .eq("user_id", session.user.id)
        .eq("status", "confirmed")
        .order("scheduled_at", { ascending: true });
      
      if (selectedDate) {
        const startOfDay = new Date(selectedDate);
        startOfDay.setHours(0, 0, 0, 0);
        
        const endOfDay = new Date(selectedDate);
        endOfDay.setHours(23, 59, 59, 999);
        
        query = query
          .gte("scheduled_at", startOfDay.toISOString())
          .lte("scheduled_at", endOfDay.toISOString());
      } else {
        query = query.gte("scheduled_at", today.toISOString());
      }
      
      const { data, error } = await query.limit(10);
        
      if (error) throw error;
      
      if (data) {
        const { data: companyData, error: companyError } = await supabase
          .from("company_config")
          .select("company_name, phone, plan_type")
          .eq("user_id", session.user.id)
          .single();
        
        if (companyError) {
          console.error("Error fetching company info:", companyError);
        }
        
        const typedAppointments: Appointment[] = data.map(apt => ({
          ...apt,
          status: apt.status as 'confirmed' | 'cancelled' | 'completed',
          company_info: companyData || { 
            company_name: null, 
            phone: null, 
            plan_type: "free" 
          }
        }));
        
        setAppointments(typedAppointments);
      } else {
        setAppointments([]);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast.error("Erro ao carregar agendamentos");
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddAppointment = () => {
    if (planType === "free" && monthlyCount >= monthlyLimit) {
      toast.error(
        "Limite mensal de agendamentos atingido. Faça upgrade para o plano PRO para agendamentos ilimitados."
      );
      return;
    }
    
    if (planType === "free" && monthlyCount >= monthlyLimit * 0.8 && monthlyCount < monthlyLimit) {
      toast.warning(
        "Você está próximo do limite mensal de agendamentos. Considere fazer upgrade para o plano PRO para agendamentos ilimitados."
      );
    }
    
    setSelectedAppointment(null);
    setIsFormOpen(true);
  };
  
  const handleEditAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsFormOpen(true);
  };
  
  const handleCancelAppointment = async (id: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      
      const { error } = await supabase
        .from("appointments")
        .update({ status: "cancelled" })
        .eq("id", id)
        .eq("user_id", session.user.id);
        
      if (error) throw error;
      
      setAppointments(appointments.filter(apt => apt.id !== id));
      
      toast.success("Agendamento cancelado com sucesso");
      
      // Notify parent component about the change
      if (onAppointmentChanged) {
        onAppointmentChanged();
      }
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      toast.error("Erro ao cancelar agendamento");
    }
  };
  
  const handleFormClose = async (updated?: boolean) => {
    setIsFormOpen(false);
    if (updated) {
      await fetchAppointments();
      await fetchUserPlanInfo();
      
      // Notify parent component about the change
      if (onAppointmentChanged) {
        onAppointmentChanged();
      }
    }
  };
  
  const formatPhoneForCall = (phone: string) => {
    const numbers = phone.replace(/\D/g, '');
    return numbers;
  };
  
  const callPhone = (phone: string) => {
    const formattedPhone = formatPhoneForCall(phone);
    window.location.href = `tel:${formattedPhone}`;
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
          <p className="mt-4 text-gray-500">Carregando agendamentos...</p>
        </div>
      </div>
    );
  }
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Confirmado</Badge>;
      case "cancelled":
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">Cancelado</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">Concluído</Badge>;
      default:
        return null;
    }
  };

  const renderPlanLimitMessage = () => {
    if (planType !== "free") return null;
    
    if (monthlyCount >= monthlyLimit) {
      return (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-red-100 p-2">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h4 className="font-medium text-red-800">Limite de agendamentos atingido</h4>
                <p className="text-sm mt-1 text-red-700">
                  Você atingiu o limite de {monthlyLimit} agendamentos do plano gratuito para este mês.
                  Para continuar recebendo agendamentos, faça upgrade para o plano PRO.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }
    
    if (monthlyCount >= monthlyLimit * 0.5) {
      return (
        <Card className="mb-6 border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-yellow-100 p-2">
                <Calendar className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <h4 className="font-medium text-yellow-800">Limite de agendamentos se aproximando</h4>
                <p className="text-sm mt-1 text-yellow-700">
                  Você utilizou {monthlyCount} de {monthlyLimit} agendamentos disponíveis neste mês.
                  Considere fazer upgrade para o plano PRO para agendamentos ilimitados.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }
    
    return null;
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full sm:w-[240px] justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {selectedDate ? (
                  format(selectedDate, "PPP", { locale: ptBR })
                ) : (
                  <span>Selecione uma data</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarUI
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                initialFocus
                locale={ptBR}
              />
            </PopoverContent>
          </Popover>
          {selectedDate && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedDate(undefined)}
              className="w-full sm:w-auto"
            >
              Limpar filtro
            </Button>
          )}
        </div>
        <Button onClick={handleAddAppointment} className="w-full sm:w-auto bg-primary hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" />
          Novo agendamento
        </Button>
      </div>
      
      {renderPlanLimitMessage()}
      
      {appointments.length === 0 ? (
        <Card className="border-dashed border-gray-300 bg-gray-50">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-gray-100 p-6 mb-4">
              <Calendar className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">Nenhum agendamento encontrado</h3>
            <p className="text-gray-500 max-w-md">
              {selectedDate 
                ? `Nenhum agendamento para ${format(selectedDate, "dd/MM/yyyy", { locale: ptBR })}.`
                : "Nenhum agendamento para os próximos dias."}
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={handleAddAppointment}
            >
              <Plus className="mr-2 h-4 w-4" />
              Criar agendamento
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <Card key={appointment.id} className="overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row">
                  <div className="sm:w-2/3 p-4">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-medium text-base">{appointment.client_name}</h3>
                        {getStatusBadge(appointment.status)}
                      </div>
                      
                      <div className="space-y-2 mt-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <div className="w-24 font-semibold">Serviço:</div>
                          <div>{appointment.services.name}</div>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <div className="w-24 font-semibold">Profissional:</div>
                          <div>{appointment.staff.name}</div>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <div className="w-24 font-semibold">Telefone:</div>
                          <div>{appointment.client_phone}</div>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <div className="w-24 font-semibold">Observação:</div>
                          <div>{appointment.notes || "Nenhuma observação"}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 sm:w-1/3 p-4 flex flex-col">
                    <div className="text-center mb-3">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <Clock className="h-4 w-4 text-primary" />
                        <p className="text-sm font-medium text-gray-600">
                          {format(new Date(appointment.scheduled_at), "HH:mm", { locale: ptBR })}
                        </p>
                      </div>
                      <p className="font-medium">
                        {format(new Date(appointment.scheduled_at), "dd 'de' MMMM", { locale: ptBR })}
                      </p>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 justify-center mt-auto">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1 sm:flex-none text-green-600 hover:text-green-700 hover:bg-green-50"
                        onClick={() => callPhone(appointment.client_phone)}
                      >
                        <Phone className="h-3.5 w-3.5 mr-1" />
                        Ligar
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="flex-1 sm:flex-none"
                        onClick={() => handleEditAppointment(appointment)}
                      >
                        <Edit2 className="h-3.5 w-3.5 mr-1" />
                        Editar
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1 sm:flex-none text-red-500 hover:text-red-700"
                        onClick={() => handleCancelAppointment(appointment.id)}
                      >
                        <XCircle className="h-3.5 w-3.5 mr-1" />
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedAppointment ? "Editar agendamento" : "Novo agendamento"}
            </DialogTitle>
            <DialogDescription>
              {selectedAppointment
                ? "Altere os dados do agendamento e salve para atualizar."
                : "Preencha os dados para criar um novo agendamento."}
            </DialogDescription>
          </DialogHeader>
          {isFormOpen && (
            <AppointmentForm 
              appointment={selectedAppointment}
              isOpen={isFormOpen}
              onClose={handleFormClose}
              userId={userId}
              customUrl=""
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AppointmentsList;
