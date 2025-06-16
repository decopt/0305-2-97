import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { format, addDays, isAfter, isBefore, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { AlertCircle, Calendar as CalendarIcon, Check, Clock, MapPin, User, Mail, Phone, ArrowLeft } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { PhoneInput } from "@/components/ui/phone-input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Popover } from "@/components/ui/popover";
import { PopoverTrigger } from "@/components/ui/popover";
import { PopoverContent } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

interface Service {
  id: string;
  name: string;
  duration: number;
  price: number | null;
  description: string | null;
}

interface Staff {
  id: string;
  name: string;
  position: string | null;
  avatar_url: string | null;
}

interface AvailableHour {
  weekday: string;
  start_time: string;
  end_time: string;
  lunch_break_start: string | null;
  lunch_break_end: string | null;
  is_active: boolean;
}

interface CompanyProfile {
  id: string;
  company_name: string;
  responsible_name: string;
  custom_url: string;
  logo_url: string | null;
}

const BookingPage = () => {
  const { customUrl } = useParams<{ customUrl: string }>();
  const navigate = useNavigate();
  
  const [company, setCompany] = useState<CompanyProfile | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [staffMembers, setStaffMembers] = useState<Staff[]>([]);
  const [availableHours, setAvailableHours] = useState<AvailableHour[]>([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [companyLimit, setCompanyLimit] = useState(false);
  
  // Form values
  const [service, setService] = useState<string | null>(null);
  const [staff, setStaff] = useState<string | null>(null);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [timeSlot, setTimeSlot] = useState<string | null>(null);
  const [bookingComplete, setBookingComplete] = useState(false);

  // Add the form schema
  const formSchema = z.object({
    name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres." }),
    email: z.string().email({ message: "Por favor, insira um email válido." }),
    phone: z.string().min(10, { message: "Por favor, insira um telefone válido." }),
    notes: z.string().optional().or(z.literal("")),
  });

  // Initialize the form
  const bookingForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      notes: "",
    },
  });
  
  useEffect(() => {
    if (customUrl) {
      loadCompanyData();
    }
  }, [customUrl]);
  
  useEffect(() => {
    if (date && company) {
      generateAvailableTimeSlots(date);
    }
  }, [date, company]);
  
  const loadCompanyData = async () => {
    try {
      setLoading(true);
      
      // Find company by custom URL
      const { data: companyData, error: companyError } = await supabase
        .from("profiles")
        .select("id, company_name, responsible_name, custom_url, logo_url")
        .eq("custom_url", customUrl)
        .single();
      
      if (companyError || !companyData) {
        navigate("/not-found");
        return;
      }
      
      setCompany(companyData);
      
      // Check if company is on the free plan and has reached limit
      const { data: configData } = await supabase
        .from("company_config")
        .select("plan_type, monthly_limit")
        .eq("user_id", companyData.id)
        .single();
      
      if (configData && configData.plan_type === "free") {
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        
        const { count: appointmentCount } = await supabase
          .from("appointments")
          .select("id", { count: "exact", head: true })
          .eq("user_id", companyData.id)
          .gte("created_at", startOfMonth.toISOString());
        
        if (appointmentCount !== null && appointmentCount >= configData.monthly_limit) {
          setCompanyLimit(true);
        }
      }
      
      // Load services
      const { data: servicesData, error: servicesError } = await supabase
        .from("services")
        .select("*")
        .eq("user_id", companyData.id)
        .eq("active", true)
        .order("name");
      
      if (servicesError) throw servicesError;
      setServices(servicesData || []);
      
      // Load available hours - now handling the lunch_break fields correctly
      try {
        const { data: hoursData, error: hoursError } = await supabase
          .from("available_hours")
          .select("weekday, start_time, end_time, lunch_break_start, lunch_break_end, is_active")
          .eq("user_id", companyData.id);
        
        if (hoursError) throw hoursError;
        
        if (hoursData && hoursData.length > 0) {
          setAvailableHours(hoursData);
        } else {
          // Default hours if none set
          const defaultHours = [
            { weekday: "MONDAY", start_time: "09:00", end_time: "18:00", lunch_break_start: null, lunch_break_end: null, is_active: true },
            { weekday: "TUESDAY", start_time: "09:00", end_time: "18:00", lunch_break_start: null, lunch_break_end: null, is_active: true },
            { weekday: "WEDNESDAY", start_time: "09:00", end_time: "18:00", lunch_break_start: null, lunch_break_end: null, is_active: true },
            { weekday: "THURSDAY", start_time: "09:00", end_time: "18:00", lunch_break_start: null, lunch_break_end: null, is_active: true },
            { weekday: "FRIDAY", start_time: "09:00", end_time: "18:00", lunch_break_start: null, lunch_break_end: null, is_active: true },
          ];
          setAvailableHours(defaultHours);
        }
      } catch (hourError) {
        console.error("Error loading available hours:", hourError);
        // Fallback to default hours without lunch break fields
        const defaultHours = [
          { weekday: "MONDAY", start_time: "09:00", end_time: "18:00", lunch_break_start: null, lunch_break_end: null, is_active: true },
          { weekday: "TUESDAY", start_time: "09:00", end_time: "18:00", lunch_break_start: null, lunch_break_end: null, is_active: true },
          { weekday: "WEDNESDAY", start_time: "09:00", end_time: "18:00", lunch_break_start: null, lunch_break_end: null, is_active: true },
          { weekday: "THURSDAY", start_time: "09:00", end_time: "18:00", lunch_break_start: null, lunch_break_end: null, is_active: true },
          { weekday: "FRIDAY", start_time: "09:00", end_time: "18:00", lunch_break_start: null, lunch_break_end: null, is_active: true },
        ];
        setAvailableHours(defaultHours);
      }
    } catch (error) {
      console.error("Error loading company data:", error);
      toast.error("Erro ao carregar dados da empresa");
      navigate("/not-found");
    } finally {
      setLoading(false);
    }
  };
  
  const isInLunchBreak = (timeString: string, businessHours: AvailableHour): boolean => {
    if (!businessHours.lunch_break_start || !businessHours.lunch_break_end) {
      return false;
    }
    
    // Convert time strings to comparable values (minutes from midnight)
    const getMinutes = (time: string) => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    };
    
    const timeMinutes = getMinutes(timeString);
    const lunchStartMinutes = getMinutes(businessHours.lunch_break_start);
    const lunchEndMinutes = getMinutes(businessHours.lunch_break_end);
    
    return timeMinutes >= lunchStartMinutes && timeMinutes < lunchEndMinutes;
  };

  const generateAvailableTimeSlots = async (date: Date) => {
    try {
      if (!company || !staff) return;
      
      // Get the weekday of the selected date
      const weekdays = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
      const weekday = weekdays[date.getDay()];
      
      // Find the business hours for this weekday
      const businessHours = availableHours.find(hour => hour.weekday === weekday && hour.is_active !== false);
      
      if (!businessHours) {
        setAvailableTimeSlots([]);
        return;
      }
      
      // Get existing appointments for this date and staff member
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      
      const { data: existingAppointments, error } = await supabase
        .from("appointments")
        .select("scheduled_at, services (duration)")
        .eq("user_id", company.id)
        .eq("staff_id", staff)
        .gte("scheduled_at", startOfDay.toISOString())
        .lte("scheduled_at", endOfDay.toISOString())
        .eq("status", "confirmed");
      
      if (error) throw error;
      
      // Generate time slots with 30-minute intervals
      const [startHour, startMinute] = businessHours.start_time.split(":").map(Number);
      const [endHour, endMinute] = businessHours.end_time.split(":").map(Number);
      
      let currentTime = new Date(date);
      currentTime.setHours(startHour, startMinute, 0, 0);
      
      let endTime = new Date(date);
      endTime.setHours(endHour, endMinute, 0, 0);
      
      const slots: string[] = [];
      
      // Create 30-min slots
      while (currentTime < endTime) {
        const timeString = format(currentTime, "HH:mm");
        
        // Don't include past times for today
        const now = new Date();
        const slotDateTime = new Date(date);
        slotDateTime.setHours(currentTime.getHours(), currentTime.getMinutes());
        
        if (
          slotDateTime.getDate() === now.getDate() &&
          slotDateTime.getMonth() === now.getMonth() &&
          slotDateTime.getFullYear() === now.getFullYear() &&
          slotDateTime <= now
        ) {
          currentTime.setMinutes(currentTime.getMinutes() + 30);
          continue;
        }
        
        // Skip lunch break times
        if (isInLunchBreak(timeString, businessHours)) {
          currentTime.setMinutes(currentTime.getMinutes() + 30);
          continue;
        }
        
        // Check if this slot conflicts with existing appointments for this staff member
        const isAvailable = !existingAppointments?.some(apt => {
          const aptTime = new Date(apt.scheduled_at);
          const aptEndTime = new Date(aptTime);
          aptEndTime.setMinutes(aptTime.getMinutes() + (apt.services?.duration || 30));
          
          const slotTime = new Date(date);
          slotTime.setHours(currentTime.getHours(), currentTime.getMinutes());
          
          const slotEndTime = new Date(slotTime);
          slotEndTime.setMinutes(slotTime.getMinutes() + 30);
          
          return (
            (slotTime >= aptTime && slotTime < aptEndTime) || // Slot start during apt
            (slotEndTime > aptTime && slotEndTime <= aptEndTime) || // Slot end during apt
            (slotTime <= aptTime && slotEndTime >= aptEndTime) // Slot contains apt
          );
        });
        
        if (isAvailable) {
          slots.push(timeString);
        }
        
        // Move to next slot
        currentTime.setMinutes(currentTime.getMinutes() + 30);
      }
      
      setAvailableTimeSlots(slots);
    } catch (error) {
      console.error("Error generating time slots:", error);
      toast.error("Erro ao gerar horários disponíveis");
    }
  };
  
  const handleServiceSelect = async (serviceId: string) => {
    try {
      setLoading(true);
      setService(serviceId);
      
      // Load staff members for this service
      const { data: staffData, error: staffError } = await supabase
        .from("staff_services")
        .select(`
          staff:staff_id (
            id,
            name,
            position,
            avatar_url,
            active
          )
        `)
        .eq("service_id", serviceId)
        .eq("staff.active", true);
        
      if (staffError) throw staffError;
      
      if (staffData) {
        const staffList = staffData
          .map(item => item.staff)
          .filter(Boolean)
          .filter(staff => staff.active);
        setStaffMembers(staffList);
      }
      
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error("Error loading staff:", error);
      toast.error("Erro ao carregar profissionais disponíveis");
    } finally {
      setLoading(false);
    }
  };
  
  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    setTimeSlot(null);
  };
  
  const handleTimeSelect = (time: string) => {
    setTimeSlot(time);
    setStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);

      if (!company || !service || !staff || !date || !timeSlot) {
        toast.error("Por favor, preencha todos os campos obrigatórios");
        return;
      }

      // Criação do horário igual ao arquivo antigo
      const scheduledDate = new Date(date);
      const [hours, minutes] = timeSlot.split(":").map(Number);
      scheduledDate.setHours(hours, minutes, 0, 0);

      // Formatar para ISO string preservando o horário local
      const year = scheduledDate.getFullYear();
      const month = String(scheduledDate.getMonth() + 1).padStart(2, '0');
      const day = String(scheduledDate.getDate()).padStart(2, '0');
      const formattedHours = String(hours).padStart(2, '0');
      const formattedMinutes = String(minutes).padStart(2, '0');
      const isoString = `${year}-${month}-${day}T${formattedHours}:${formattedMinutes}:00`;

      // Insert no banco igual ao antigo
      const { data, error } = await supabase
        .from("appointments")
        .insert({
          user_id: company.id,
          service_id: service,
          staff_id: staff,
          client_name: values.name,
          client_email: values.email,
          client_phone: values.phone,
          scheduled_at: isoString,
          status: "confirmed",
          notes: values.notes
        })
        .select("id")
        .single();

      if (error) {
        if (error.message.includes("Limite de agendamentos")) {
          setCompanyLimit(true);
          throw new Error("Esta empresa atingiu o limite de agendamentos do plano gratuito");
        }
        throw error;
      }

      // Enviar notificação webhook para empresas com plano PRO (mantém igual)
      try {
        console.log('Enviando notificação para o webhook da página pública:', data.id, company.id);
        const webhookResponse = await fetch(`${window.location.origin}/api/send-appointment-notification`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            appointment_id: data.id,
            user_id: company.id
          })
        });
        const webhookResult = await webhookResponse.json();
        console.log('Resultado do webhook:', webhookResult);
      } catch (webhookError) {
        console.error("Erro ao enviar webhook:", webhookError);
        // Erro não bloqueante
      }

      setBookingComplete(true);
      setStep(4);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error: any) {
      console.error("Error creating appointment:", error);
      toast.error(error.message || "Erro ao criar agendamento");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackStep = () => {
    setStep(step - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const selectedService = service ? services.find(s => s.id === service) : null;
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-agendafacil-50 to-agendafacil-100/30 p-4">
        <div className="text-center">
          <div className="animate-pulse inline-flex items-center justify-center w-16 h-16 mb-3 rounded-full bg-agendafacil-500/20">
            <CalendarIcon className="h-8 w-8 text-agendafacil-600" />
          </div>
          <p className="text-lg font-medium mb-2">Carregando agendamento</p>
          <p className="text-sm text-gray-500">Aguarde enquanto preparamos tudo para você.</p>
        </div>
      </div>
    );
  }
  
  if (companyLimit) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-agendafacil-50 to-agendafacil-100/30 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Agendamentos indisponíveis</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Limite atingido</AlertTitle>
              <AlertDescription>
                Esta empresa atingiu o limite de agendamentos do plano gratuito.
              </AlertDescription>
            </Alert>
            <p className="text-center">
              Entre em contato diretamente com {company?.company_name} para agendar seu serviço.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (bookingComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-agendafacil-50 to-agendafacil-100/30 p-4">
        <Card className="w-full max-w-md overflow-hidden border-0 shadow-lg">
          <div className="bg-agendafacil-600 h-2 w-full"></div>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800">Agendamento confirmado!</CardTitle>
            <CardDescription className="text-gray-600">
              Seu horário foi reservado com sucesso.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm font-medium text-gray-700">Detalhes do agendamento:</p>
              <div className="mt-2 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CalendarIcon className="h-4 w-4 text-agendafacil-600" />
                  <span>{date && format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-agendafacil-600" />
                  <span>{timeSlot}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-agendafacil-600" />
                  <span>{bookingForm.getValues().name}</span>
                </div>
              </div>
            </div>
            
            <div className="rounded-lg border border-agendafacil-100 bg-agendafacil-50 p-4 text-center">
              <p className="text-sm text-gray-700">
                Você receberá uma confirmação do seu agendamento por email em breve.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => window.location.reload()}>
              Fazer novo agendamento
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const progressSteps = [
    { id: 1, name: "Serviço" },
    { id: 2, name: "Profissional" },
    { id: 3, name: "Dados" },
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-agendafacil-50 to-white">
      <div className="w-full bg-white shadow-sm">
        <div className="w-full px-0 py-0 flex justify-center items-center" style={{ minHeight: '100px', background: '#fff' }}>
          <img
            src={company?.logo_url || "/placeholder.svg"}
            alt={company?.company_name || "Logo"}
            className="w-full max-w-xs sm:max-w-4xl h-[80px] sm:h-[120px] object-contain"
            style={{ objectFit: 'contain', width: '100%', height: '80px' }}
          />
        </div>
      </div>
      
      <div className="max-w-full w-full mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div className="flex flex-col items-center mb-4 sm:mb-8">
          <h1 className="text-lg sm:text-2xl font-bold text-center mb-2 sm:mb-3">
            Agende seu horário
          </h1>
          <p className="text-gray-600 text-center max-w-md mb-4 sm:mb-6 text-sm sm:text-base">
            Escolha um serviço e horário disponível para agendar seu atendimento.
          </p>
          
          {/* Progress Steps */}
          <div className="w-full max-w-md mb-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full h-1 bg-gray-200 rounded"></div>
              </div>
              <div className="relative flex justify-between">
                {progressSteps.map((progressStep) => (
                  <div 
                    key={progressStep.id}
                    className="flex flex-col items-center"
                  >
                    <div className={`
                      w-8 h-8 flex items-center justify-center rounded-full 
                      ${step >= progressStep.id ? 'bg-agendafacil-600 text-white' : 'bg-gray-200 text-gray-400'}
                      ${step === progressStep.id ? 'ring-4 ring-agendafacil-100' : ''}
                    `}>
                      {progressStep.id}
                    </div>
                    <div className="mt-2 text-xs font-medium text-gray-500">
                      {progressStep.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Service Selection - Step 1 */}
        {step === 1 && (
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl font-semibold mb-6">Serviços disponíveis</h2>
            
            {services.length === 0 ? (
              <div className="text-center py-10 bg-gray-50 rounded-lg">
                <p className="text-gray-500">Nenhum serviço disponível no momento.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {services.map((serviceItem) => (
                  <div
                    key={serviceItem.id}
                    className={`relative overflow-hidden border rounded-lg p-5 cursor-pointer transition-all ${
                      selectedService?.id === serviceItem.id
                        ? 'border-agendafacil-600 bg-agendafacil-50 shadow-sm'
                        : 'hover:border-agendafacil-300 hover:bg-agendafacil-50/30'
                    }`}
                    onClick={() => handleServiceSelect(serviceItem.id)}
                  >
                    {selectedService?.id === serviceItem.id && (
                      <div className="absolute top-0 right-0 bg-agendafacil-600 text-white p-1 rounded-bl-lg">
                        <Check className="h-4 w-4" />
                      </div>
                    )}
                    <h3 className="font-medium text-lg">{serviceItem.name}</h3>
                    <div className="mt-2 flex items-center text-gray-600 text-sm">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{serviceItem.duration} minutos</span>
                    </div>
                    {serviceItem.price && (
                      <div className="mt-1 text-agendafacil-700 font-medium">
                        R$ {serviceItem.price.toFixed(2).replace('.', ',')}
                      </div>
                    )}
                    {serviceItem.description && (
                      <p className="mt-2 text-sm text-gray-500 line-clamp-2">{serviceItem.description}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Staff Selection - Step 2 */}
        {step === 2 && (
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center mb-6">
              <Button 
                variant="ghost" 
                size="sm" 
                className="mr-2" 
                onClick={handleBackStep}
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Voltar
              </Button>
              <h2 className="text-xl font-semibold">Escolha o profissional</h2>
            </div>
            
            <div className="bg-white rounded-lg border p-4 mb-4">
              <div className="flex items-center">
                <div className="bg-agendafacil-100 p-2 rounded-md">
                  <Check className="h-5 w-5 text-agendafacil-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">Serviço selecionado:</p>
                  <p className="font-medium">{selectedService?.name}</p>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Clock className="h-3.5 w-3.5 mr-1" />
                    {selectedService?.duration} minutos
                  </div>
                </div>
              </div>
            </div>
            
            {staffMembers.length === 0 ? (
              <div className="text-center py-10 bg-gray-50 rounded-lg">
                <p className="text-gray-500">Nenhum profissional disponível para este serviço.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {staffMembers.map((staffMember) => (
                  <div
                    key={staffMember.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      staff === staffMember.id
                        ? 'border-agendafacil-600 bg-agendafacil-50 shadow-sm'
                        : 'hover:border-agendafacil-300 hover:bg-agendafacil-50/30'
                    }`}
                    onClick={() => {
                      setStaff(staffMember.id);
                      setStep(3);
                    }}
                  >
                    <div className="flex items-center">
                      <Avatar className="h-12 w-12 border-2 border-gray-100">
                        {staffMember.avatar_url ? (
                          <AvatarImage src={staffMember.avatar_url} alt={staffMember.name} />
                        ) : (
                          <AvatarFallback className="bg-agendafacil-200 text-agendafacil-700">
                            {staffMember.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className="ml-4">
                        <p className="font-medium">{staffMember.name}</p>
                        {staffMember.position && (
                          <p className="text-sm text-gray-500">{staffMember.position}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Customer Form - Step 3 */}
        {step === 3 && (
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center mb-6">
              <Button 
                variant="ghost" 
                size="sm" 
                className="mr-2" 
                onClick={handleBackStep}
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Voltar
              </Button>
              <h2 className="text-xl font-semibold">Seus dados</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-lg border p-4">
                <p className="text-sm font-medium text-gray-700 mb-3">Detalhes do agendamento:</p>
                <div className="space-y-3">
                  <div className="flex">
                    <CalendarIcon className="h-5 w-5 text-agendafacil-600 mr-2" />
                    <div>
                      <p className="font-medium">{date ? format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : "Selecione uma data"}</p>
                      <p className="text-sm text-gray-500">{timeSlot || "Escolha um horário"}</p>
                    </div>
                  </div>
                  
                  {selectedService && (
                    <div className="flex">
                      <Clock className="h-5 w-5 text-agendafacil-600 mr-2" />
                      <div>
                        <p className="font-medium">{selectedService.name}</p>
                        <p className="text-sm text-gray-500">{selectedService.duration} minutos</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mt-4">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        {date ? (
                          format(date, "PPP", { locale: ptBR })
                        ) : (
                          <span>Selecione a data</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={handleDateSelect}
                        disabled={(date) => isBefore(date, new Date().setHours(0,0,0,0))}
                        initialFocus
                        className="bg-white shadow-lg rounded-md border-0"
                      />
                    </PopoverContent>
                  </Popover>
                  
                  {date && availableTimeSlots.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2">Horários disponíveis:</p>
                      <div className="grid grid-cols-3 gap-2">
                        {availableTimeSlots.map((time) => (
                          <Button
                            key={time}
                            variant={timeSlot === time ? "default" : "outline"}
                            className={timeSlot === time ? "bg-agendafacil-600 hover:bg-agendafacil-700" : ""}
                            size="sm"
                            onClick={() => handleTimeSelect(time)}
                          >
                            {time}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {date && availableTimeSlots.length === 0 && (
                    <div className="mt-4 p-3 bg-yellow-50 text-yellow-800 rounded-md text-sm">
                      Nenhum horário disponível nesta data. Por favor, selecione outro dia.
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-white rounded-lg border p-4">
                <Form {...bookingForm}>
                  <form onSubmit={bookingForm.handleSubmit(handleSubmit)} className="space-y-4">
                    <FormField
                      control={bookingForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome completo</FormLabel>
                          <FormControl>
                            <Input placeholder="Seu nome completo" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={bookingForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="seu@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={bookingForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefone</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="(55) 12345-6789" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={bookingForm.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Observações (opcional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Compartilhe informações adicionais sobre sua necessidade" 
                              className="min-h-[80px] resize-none"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      disabled={isSubmitting || !timeSlot} 
                      className="w-full bg-agendafacil-600 hover:bg-agendafacil-700"
                    >
                      {isSubmitting ? "Enviando..." : "Concluir agendamento"}
                    </Button>
                  </form>
                </Form>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} {company?.company_name || 'Agenda Fácil'}</p>
          <p className="mt-1">Agendamento online por <a href="/" className="text-agendafacil-600 hover:underline">Agenda Fácil</a></p>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;

