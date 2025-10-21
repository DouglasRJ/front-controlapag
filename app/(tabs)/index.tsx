import { Logo } from "@/components/logo";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Ionicons } from "@expo/vector-icons";
import { Link, Stack } from "expo-router";
import React, { useRef, useState } from "react";
import {
  findNodeHandle,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  ScrollView,
  View,
} from "react-native";

interface CardComponentProps {
  children: React.ReactNode;
  className?: string;
}

interface FeatureIconWrapperProps {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  className?: string;
}

interface StatItemProps {
  value: string;
  label: string;
}

const NAV_LINKS = [
  { label: "Funcionalidades", id: "funcionalidades" },
  { label: "Benefícios", id: "beneficios" },
  { label: "Como Funciona", id: "como-funciona" },
];

const CardComponent: React.FC<CardComponentProps> = ({
  children,
  className = "",
}) => (
  <View className={`${className} rounded-xl bg-card shadow-md `}>
    {children}
  </View>
);

const FeatureIconWrapper: React.FC<FeatureIconWrapperProps> = ({
  icon,
  className = "",
}) => (
  <View
    className={`flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4 ${className}`}
  >
    <Ionicons name={icon} size={24} className="text-primary" />
  </View>
);

const StatItem: React.FC<StatItemProps> = ({ value, label }) => (
  <View className="text-center">
    <ThemedText className="text-2xl font-bold text-primary">{value}</ThemedText>
    <ThemedText className="text-sm text-foreground">{label}</ThemedText>
  </View>
);

export default function HomeScreen() {
  const scrollViewRef = useRef<ScrollView | null>(null);
  const sectionRefs = useRef<{ [key: string]: View | null }>({});
  const [showScrollButton, setShowScrollButton] = useState(false);
  const scrollThreshold = 400;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const yOffset = event.nativeEvent.contentOffset.y;
    if (yOffset > scrollThreshold) {
      if (!showScrollButton) setShowScrollButton(true);
    } else {
      if (showScrollButton) setShowScrollButton(false);
    }
  };

  const handleScrollToTop = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  const handleNavigate = (id: string) => {
    const targetRef = sectionRefs.current[id];
    const scrollNode = scrollViewRef.current;
    if (!targetRef || !scrollNode) return;

    const HEADER_OFFSET = 64;

    if (Platform.OS === "web") {
      const targetElement = targetRef as any as HTMLElement;
      const targetY = targetElement.offsetTop;
      scrollNode.scrollTo({
        y: targetY - HEADER_OFFSET,
        animated: true,
      });
    } else {
      const nodeHandle = findNodeHandle(scrollNode);
      if (nodeHandle) {
        targetRef.measureLayout(nodeHandle, (x: number, y: number) => {
          scrollNode.scrollTo({ y: y, animated: true });
        });
      }
    }
  };

  const STATS = [
    { value: "98%", label: "Satisfação" },
    { value: "50%", label: "Menos Inadimplência" },
    { value: "30h", label: "Economizadas/Mês" },
    { value: "24/7", label: "Disponível" },
  ];

  const FEATURES = [
    {
      icon: "calendar-outline",
      title: "Agenda Inteligente",
      description:
        "Configure horários de trabalho e permita que clientes agendem serviços automaticamente, sem conflitos.",
    },
    {
      icon: "card-outline",
      title: "Cobranças Automatizadas",
      description:
        "Crie cobranças recorrentes ou avulsas com lembretes automáticos para reduzir inadimplência.",
    },
    {
      icon: "bar-chart-outline",
      title: "Dashboard Financeiro",
      description:
        "Acompanhe em tempo real pagamentos recebidos e pendentes com visualizações claras.",
    },
    {
      icon: "people-outline",
      title: "Gestão de Clientes",
      description:
        "Mantenha cadastro completo de clientes com histórico de serviços e pagamentos.",
    },
    {
      icon: "notifications-outline",
      title: "Notificações Automáticas",
      description:
        "Seus clientes recebem lembretes de vencimento e confirmações de pagamento automaticamente.",
    },
    {
      icon: "trending-up-outline",
      title: "Relatórios Detalhados",
      description:
        "Tenha visão completa da saúde financeira do seu negócio com relatórios personalizados.",
    },
  ];

  const BENEFITS = [
    "Elimine controles manuais e erros de digitação",
    "Reduza inadimplência com lembretes automáticos",
    "Economize horas por semana em tarefas administrativas",
    "Ofereça experiência profissional aos seus clientes",
    "Tenha visão clara da saúde financeira do negócio",
    "Aceite pagamentos online com Pix e cartão",
  ];

  const HOW_IT_WORKS = [
    {
      step: "01",
      title: "Cadastre seus serviços",
      description:
        "Adicione os serviços que você oferece com preços e durações. Configure sua agenda de trabalho.",
    },
    {
      step: "02",
      title: "Convide seus clientes",
      description:
        "Envie convites para seus clientes acessarem o portal e visualizarem seus débitos e agendamentos.",
    },
    {
      step: "03",
      title: "Automatize e acompanhe",
      description:
        "Deixe a plataforma enviar lembretes e processar pagamentos. Acompanhe tudo pelo dashboard.",
    },
  ];

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <View className="px-4 lg:px-8">
          <View className="flex flex-row h-16 items-center justify-between">
            <View className="flex flex-row items-center gap-2">
              <View className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Ionicons
                  name="card-outline"
                  size={20}
                  className="text-primary-foreground"
                />
              </View>
              <Logo fontSize={20} />
            </View>
            <View className="hidden md:flex flex-row items-center gap-6">
              {NAV_LINKS.map((link) => (
                <Pressable
                  key={link.label}
                  onPress={() => handleNavigate(link.id)}
                >
                  <ThemedText className="text-sm font-medium text-card-foreground transition-colors">
                    {link.label}
                  </ThemedText>
                </Pressable>
              ))}
            </View>
            <View className="flex flex-row items-center gap-3">
              <Link href="/login" asChild>
                <Button
                  variant="link"
                  size="sm"
                  className="hidden sm:inline-flex"
                  title="Entrar"
                />
              </Link>
              <Link href="/register" asChild>
                <Button
                  size="sm"
                  className="bg-primary hover:bg-primary/90"
                  title="Começar Grátis"
                />
              </Link>
            </View>
          </View>
        </View>
      </View>

      <View className="flex-1">
        <ScrollView
          ref={scrollViewRef}
          className="flex-1 bg-background"
          contentContainerStyle={{ paddingBottom: 40 }}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          <View className="relative  py-12 sm:py-16 px-4">
            <View
              aria-hidden
              className="absolute top-[-80px] left-[-100px] h-[250px] w-[250px] rounded-full bg-primary/5 md:h-[400px] md:w-[400px]"
            />
            <View
              aria-hidden
              className="absolute bottom-[-100px] right-[-120px] h-[300px] w-[300px] rounded-full bg-accent/5 md:h-[500px] md:w-[500px]"
            />
            <View className="relative mx-auto max-w-4xl text-center">
              <ThemedText className="mb-4 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
                Gestão Inteligente para o Seu Negócio
              </ThemedText>
              <ThemedText className="mb-8 text-base sm:text-lg text-foreground text-balance leading-relaxed max-w-2xl mx-auto">
                Centralize agendamentos, automatize cobranças e controle
                pagamentos em uma única plataforma.
              </ThemedText>
              <View className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-base px-8 w-full sm:w-auto"
                  title="Começar Agora"
                />
                <Button
                  size="lg"
                  variant="outline"
                  className="text-base px-8 bg-transparent hover:bg-primary/20 w-full sm:w-auto"
                  title="Ver Demonstração"
                />
              </View>
              <View className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
                {STATS.map((stat) => (
                  <StatItem
                    key={stat.label}
                    value={stat.value}
                    label={stat.label}
                  />
                ))}
              </View>
            </View>
          </View>

          <View
            className="relative  py-12 sm:py-16 bg-muted/30 px-4"
            ref={(el) => {
              sectionRefs.current["funcionalidades"] = el;
            }}
          >
            <View
              aria-hidden
              className="absolute top-[15%] left-[-200px] h-[400px] w-[400px] lg:h-[700px] lg:w-[700px] rounded-full bg-primary/5 opacity-50"
            />
            <View className="relative mx-auto max-w-2xl text-center mb-10 sm:mb-12">
              <ThemedText className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-balance">
                Tudo que você precisa em um só lugar
              </ThemedText>
              <ThemedText className="text-base sm:text-lg text-foreground text-balance">
                Funcionalidades pensadas para simplificar sua rotina e
                profissionalizar seu negócio
              </ThemedText>
            </View>
            <View className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {FEATURES.map((feature, index) => (
                <CardComponent
                  key={index}
                  className="p-6 hover:shadow-lg transition-shadow"
                >
                  <FeatureIconWrapper icon={feature.icon as any} />
                  <ThemedText className="text-lg text-primary font-semibold mb-2">
                    {feature.title}
                  </ThemedText>
                  <ThemedText className="text-card-foreground leading-relaxed">
                    {feature.description}
                  </ThemedText>
                </CardComponent>
              ))}
            </View>
          </View>

          <View
            className="relative py-4 md:py-12 px-4"
            ref={(el) => {
              sectionRefs.current["beneficios"] = el;
            }}
          >
            <View
              aria-hidden
              className="absolute top-[50%] right-[-200px] lg:right-[-300px] h-[400px] w-[400px] lg:h-[600px] lg:w-[600px] rounded-full bg-accent/5 opacity-70"
              style={{ transform: [{ translateY: -200 }] }}
            />
            <View className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-6xl mx-auto">
              <View>
                <ThemedText className="text-3xl sm:text-4xl font-bold tracking-tight mb-6 text-balance">
                  Profissionalize sua gestão e aumente seus ganhos
                </ThemedText>
                <ThemedText className="text-base sm:text-lg text-foreground mb-8 leading-relaxed">
                  Deixe para trás os controles manuais. Com o ControlaPAG, você
                  economiza tempo e reduz perdas.
                </ThemedText>
                <View className="space-y-4">
                  {BENEFITS.map((benefit, index) => (
                    <View
                      key={index}
                      className="flex flex-row items-start gap-3"
                    >
                      <Ionicons
                        name="checkmark-circle"
                        size={24}
                        className="text-primary flex-shrink-0 mt-0.5"
                      />
                      <ThemedText className="text-foreground leading-relaxed flex-1">
                        {benefit}
                      </ThemedText>
                    </View>
                  ))}
                </View>
              </View>
              <CardComponent className="p-6 sm:p-8">
                <View className="space-y-6">
                  <View className="flex flex-row items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <View className="flex flex-row items-center gap-3">
                      <View className="h-10 w-10 hidden md:flex rounded-full bg-primary/20  items-center justify-center">
                        <Ionicons
                          name="time-outline"
                          size={20}
                          className="text-primary "
                        />
                      </View>
                      <View>
                        <ThemedText className="font-semibold text-sm md:text-lg   text-primary">
                          Pagamento Pendente
                        </ThemedText>
                        <ThemedText className="text-xs text-card-foreground">
                          Vence em 2 dias
                        </ThemedText>
                      </View>
                    </View>
                    <ThemedText className="md:text-lg font-bold text-card-foreground">
                      R$ 150,00
                    </ThemedText>
                  </View>
                  <View className="flex flex-row items-center justify-between p-1 md:p-4 bg-accent/10 rounded-lg border border-accent/20">
                    <View className="flex flex-row items-center md:gap-3">
                      <View className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center">
                        <Ionicons
                          name="checkmark-circle"
                          size={20}
                          className="text-primary"
                        />
                      </View>
                      <View>
                        <ThemedText className="font-semibold text-sm md:text-lg text-primary">
                          Pagamento Recebido
                        </ThemedText>
                        <ThemedText className="text-xs text-card-foreground">
                          Hoje às 14:30
                        </ThemedText>
                      </View>
                    </View>
                    <ThemedText className="md:text-lg font-bold text-accent">
                      R$ 200,00
                    </ThemedText>
                  </View>
                  <View className="pt-4 border-t border-border">
                    <View className="flex flex-row justify-between items-center mb-2">
                      <ThemedText className="text-sm text-card-foreground">
                        Total do Mês
                      </ThemedText>
                      <ThemedText className="text-2xl font-bold text-primary">
                        R$ 4.850,00
                      </ThemedText>
                    </View>
                    <View className="h-2 bg-muted rounded-full ">
                      <View
                        className="h-full bg-primary rounded-full"
                        style={{ width: "75%" }}
                      />
                    </View>
                    <ThemedText className="text-xs text-card-foreground mt-1">
                      75% da meta mensal
                    </ThemedText>
                  </View>
                </View>
              </CardComponent>
            </View>
          </View>

          <View
            className="relative  py-12 sm:py-16 bg-muted/30 px-4"
            ref={(el) => {
              sectionRefs.current["como-funciona"] = el;
            }}
          >
            <View
              aria-hidden
              className="absolute bottom-[-100px] left-[-150px] h-[300px] w-[300px] md:h-[500px] md:w-[500px] rounded-full bg-primary/5 opacity-70"
            />
            <View
              aria-hidden
              className="absolute top-[80px] right-[-180px] h-[250px] w-[250px] md:h-[400px] md:w-[400px] rounded-full bg-accent/5 opacity-60"
            />
            <View className="relative mx-auto max-w-2xl text-center mb-10 sm:mb-12">
              <ThemedText className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-balance">
                Simples de começar, fácil de usar
              </ThemedText>
              <ThemedText className="text-base sm:text-lg text-card-foreground text-balance">
                Em poucos minutos você está pronto para gerenciar seu negócio de
                forma profissional
              </ThemedText>
            </View>
            <View className="relative grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {HOW_IT_WORKS.map((step) => (
                <View key={step.step} className="relative">
                  <ThemedText className="text-5xl md:text-6xl font-bold text-primary/70 mb-4">
                    {step.step}
                  </ThemedText>
                  <ThemedText className="text-xl font-semibold mb-3">
                    {step.title}
                  </ThemedText>
                  <ThemedText className="text-foreground leading-relaxed">
                    {step.description}
                  </ThemedText>
                </View>
              ))}
            </View>
          </View>

          <View className="relative  py-12 sm:py-16 px-4">
            <View
              aria-hidden
              className="absolute top-[-80px] left-[50%] h-[300px] w-[300px] md:h-[500px] md:w-[500px] rounded-full bg-primary/5"
              style={{ transform: [{ translateX: -150 }] }}
            />
            <CardComponent className="relative max-w-4xl mx-auto p-6 sm:p-8 lg:p-12 text-center !bg-primary text-primary-foreground border-0 ">
              <View
                aria-hidden
                className="absolute top-[-50px] left-[-50px] h-[150px] w-[150px] rounded-full bg-white/5"
              />
              <View
                aria-hidden
                className="absolute bottom-[-60px] right-[-30px] h-[200px] w-[200px] rounded-full bg-white/5"
              />
              <View className="relative">
                <ThemedText className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-white text-balance">
                  Pronto para transformar sua gestão?
                </ThemedText>
                <ThemedText className="text-base sm:text-lg mb-8 text-white/90 text-balance max-w-2xl mx-auto">
                  Junte-se a centenas de MEIs que já profissionalizaram seus
                  negócios com o ControlaPAG
                </ThemedText>
                <View className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-base px-8 bg-white/90 dark:bg-white/90 w-full sm:w-auto"
                    title="Começar Gratuitamente"
                  />
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-base px-8 !bg-foreground !dark:bg-background w-full sm:w-auto"
                    title="Falar com Especialista"
                  />
                </View>
              </View>
            </CardComponent>
          </View>

          <View className="border-t border-border py-10 bg-muted/30 px-4">
            <View className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
              <View className="sm:col-span-2 md:col-span-1">
                <View className="flex flex-row items-center gap-2 mb-4">
                  <View className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                    <Ionicons
                      name="card-outline"
                      size={16}
                      className="text-primary-foreground"
                    />
                  </View>
                  <ThemedText className="font-bold">ControlaPAG</ThemedText>
                </View>
                <ThemedText className="text-sm text-foreground leading-relaxed">
                  Gestão inteligente para prestadores de serviços e MEIs
                </ThemedText>
              </View>
              {["Produto", "Recursos", "Empresa"].map((title) => (
                <View key={title}>
                  <ThemedText className="font-semibold mb-4">
                    {title}
                  </ThemedText>
                  <View className="space-y-2 text-sm text-foreground">
                    {[
                      "Funcionalidades",
                      "Preços",
                      "Integrações",
                      "Blog",
                      "Tutoriais",
                      "Suporte",
                      "Sobre",
                      "Contato",
                      "Privacidade",
                    ]
                      .filter(
                        (l) =>
                          (title === "Produto" &&
                            [
                              "Funcionalidades",
                              "Preços",
                              "Integrações",
                            ].includes(l)) ||
                          (title === "Recursos" &&
                            ["Blog", "Tutoriais", "Suporte"].includes(l)) ||
                          (title === "Empresa" &&
                            ["Sobre", "Contato", "Privacidade"].includes(l))
                      )
                      .map((link, index) => (
                        <Pressable key={index} className="py-0.5">
                          <ThemedText className="text-foreground hover:text-foreground transition-colors">
                            {link}
                          </ThemedText>
                        </Pressable>
                      ))}
                  </View>
                </View>
              ))}
            </View>
            <View className="mt-12 pt-8 border-t border-border text-center text-sm text-foreground">
              <ThemedText className="text-sm text-foreground">
                © 2025 ControlaPAG. Todos os direitos reservados.
              </ThemedText>
            </View>
          </View>
        </ScrollView>

        {showScrollButton && (
          <Pressable
            onPress={handleScrollToTop}
            className="absolute z-50 bottom-4 right-4 md:bottom-8 md:right-8 h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-full bg-primary shadow-lg"
          >
            <Ionicons
              name="arrow-up-outline"
              size={24}
              className="text-primary-foreground"
            />
          </Pressable>
        )}
      </View>
    </>
  );
}
