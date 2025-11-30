import { Ionicons } from "@expo/vector-icons";
import { Link, LinkProps, usePathname } from "expo-router";
import React, { ComponentProps } from "react";
import { Image, Pressable, ScrollView, View, useWindowDimensions } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuthStore } from "@/store/authStore";
import { useThemeStore } from "@/store/themeStore";
import { USER_ROLE } from "@/types/user-role";
import { isMasterRole, isProviderRole, isSubProviderRole } from "@/utils/user-role";
import { Logo } from "./logo";
import { ThemedText } from "./themed-text";

type IoniconName = ComponentProps<typeof Ionicons>["name"];

type NavItem = {
  label: string;
  icon: IoniconName;
  href: LinkProps["href"];
  badge?: number;
  group?: string;
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

const SIDEBAR_WIDTH_PERCENT = 0.25; // 25% da tela quando expandida
const SIDEBAR_COLLAPSED_WIDTH_PERCENT = 0.08; // 8% da tela quando colapsada (apenas ícones)

export function DashboardSidebar({
  isOpen,
  onClose,
  isCollapsed = false,
  onToggleCollapse,
}: {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}) {
  const { user, logout } = useAuthStore();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const colorScheme = useThemeStore((state) => state.colorScheme);
  const isMobile = width < 768;

  const progress = useSharedValue(isMobile ? (isOpen ? 1 : 0) : 1);
  const collapseProgress = useSharedValue(isCollapsed ? 1 : 0);

  React.useEffect(() => {
    if (isMobile) {
      progress.value = withTiming(isOpen ? 1 : 0, { duration: 300 });
    }
  }, [isOpen, isMobile, progress]);

  React.useEffect(() => {
    if (!isMobile) {
      collapseProgress.value = withTiming(isCollapsed ? 1 : 0, { duration: 300 });
    }
  }, [isCollapsed, isMobile, collapseProgress]);

  const sidebarWidth = width * SIDEBAR_WIDTH_PERCENT;
  const sidebarCollapsedWidth = width * SIDEBAR_COLLAPSED_WIDTH_PERCENT;

  const animatedSidebarStyle = useAnimatedStyle(() => {
    if (!isMobile) {
      // Anima a largura no desktop
      const animatedWidth = interpolate(
        collapseProgress.value,
        [0, 1],
        [sidebarWidth, sidebarCollapsedWidth]
      );
      return {
        width: animatedWidth,
      };
    }
    // Anima a posição no mobile
    return {
      transform: [
        {
          translateX: interpolate(
            progress.value,
            [0, 1],
            [-sidebarWidth, 0]
          ),
        },
      ],
    };
  });

  const animatedOverlayStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    pointerEvents: progress.value > 0 ? "auto" : "none",
  }));

  const userRole = user?.role;
  const isProvider = isProviderRole(userRole);
  const isClient = userRole === USER_ROLE.CLIENT;
  const isMaster = isMasterRole(userRole);
  const isSubProvider = isSubProviderRole(userRole);
  const hasOrganization = isMaster || isSubProvider;

  // Navegação Principal
  const mainNav: NavItem[] = [];

  if (isProvider) {
    mainNav.push(
      {
        label: "Serviços",
        icon: "briefcase-outline",
        href: "/(tabs)/(provider)/services",
      },
      {
        label: "Contratos",
        icon: "document-text-outline",
        href: "/(tabs)/(provider)/enrollments",
      },
      {
        label: "Cobranças",
        icon: "card-outline",
        href: "/(tabs)/(provider)/charges",
      }
    );
  }

  if (isClient) {
    mainNav.push(
      {
        label: "Dashboard",
        icon: "grid-outline",
        href: "/(tabs)/(client)/enrollments",
      },
      {
        label: "Meus Contratos",
        icon: "document-text-outline",
        href: "/(tabs)/(client)/enrollments",
      },
      {
        label: "Pagamentos",
        icon: "card-outline",
        href: "/(tabs)/(client)/payments",
      }
    );
  }

  // Navegação de Organização (apenas para MASTER/SUB_PROVIDER)
  const organizationNav: NavGroup | null = hasOrganization
    ? {
        label: "Organização",
        items: [
          {
            label: "Minha Organização",
            icon: "business-outline",
            href: "/(tabs)/(provider)/organization",
          },
          {
            label: "Membros",
            icon: "people-outline",
            href: "/(tabs)/(provider)/organization/members",
          },
          ...(isMaster
            ? [
                {
                  label: "Convidar",
                  icon: "person-add-outline",
                  href: "/(tabs)/(provider)/organization/invite",
                } as NavItem,
              ]
            : []),
        ],
      }
    : null;

  // Navegação Financeira (apenas para Provider)
  const financialNav: NavGroup | null = isProvider
    ? {
        label: "Financeiro",
        items: [
          {
            label: "Relatórios",
            icon: "bar-chart-outline",
            href: "/(tabs)/(provider)/analytics",
          },
          {
            label: "Disputas",
            icon: "alert-circle-outline",
            href: "/(tabs)/(provider)/disputes",
            badge: 0, // TODO: Implementar contagem real
          },
        ],
      }
    : null;

  const handleLogout = () => {
    onClose();
    logout();
  };

  const isActive = (href: string) => {
    return pathname.startsWith(href);
  };

  const NavItemComponent = ({ item }: { item: NavItem }) => {
    const active = isActive(item.href as string);
    return (
      <Link href={item.href} asChild>
        <Pressable
          onPress={isMobile ? onClose : undefined}
          className={`
            flex-row items-center ${isCollapsed ? "justify-center px-2" : "px-4"} py-3 mb-1 rounded-lg
            ${active ? "bg-primary/10" : ""}
            active:bg-primary/5
          `}
        >
          <Ionicons
            name={item.icon}
            size={22}
            className={active ? "text-primary" : "text-foreground/70"}
          />
          {!isCollapsed && (
            <>
              <ThemedText
                className={`ml-3 flex-1 ${
                  active ? "text-primary font-semibold" : "text-foreground"
                }`}
              >
                {item.label}
              </ThemedText>
              {item.badge !== undefined && item.badge > 0 && (
                <View className="ml-2 px-2 py-0.5 rounded-full bg-primary">
                  <ThemedText className="text-xs text-primary-foreground font-semibold">
                    {item.badge}
                  </ThemedText>
                </View>
              )}
            </>
          )}
        </Pressable>
      </Link>
    );
  };

  const NavGroupComponent = ({ group }: { group: NavGroup }) => {
    if (isCollapsed) {
      return (
        <View className="mb-4">
          {group.items.map((item) => (
            <NavItemComponent key={item.href as string} item={item} />
          ))}
        </View>
      );
    }

    return (
      <View className="mb-6">
        <ThemedText className="px-4 mb-2 text-xs font-semibold text-foreground/50 uppercase tracking-wider">
          {group.label}
        </ThemedText>
        {group.items.map((item) => (
          <NavItemComponent key={item.href as string} item={item} />
        ))}
      </View>
    );
  };

  const sidebarContent = (
    <Animated.View
      className={`
        bg-background border-r border-border
        ${isMobile ? "absolute top-0 bottom-0 left-0 z-50" : ""}
      `}
      style={[
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          flexShrink: 0,
          flexGrow: 0,
        },
        animatedSidebarStyle,
        isMobile && {
          width: sidebarWidth,
        },
      ]}
    >
      {/* Header */}
      <View className={`flex-row items-center ${isCollapsed ? "justify-center px-2" : "justify-between px-4"} py-4 border-b border-border`}>
        {isCollapsed ? (
          <View className="w-10 h-10 rounded-lg bg-primary items-center justify-center">
            <ThemedText className="text-primary-foreground text-xl font-bold">C</ThemedText>
          </View>
        ) : (
          <View className="flex-1">
            <Logo fontSize={20} hasMargin={false} />
          </View>
        )}
        {!isMobile && onToggleCollapse && (
          <Pressable onPress={onToggleCollapse} className="p-2">
            <Ionicons
              name={isCollapsed ? "chevron-forward" : "chevron-back"}
              size={20}
              className="text-foreground"
            />
          </Pressable>
        )}
        {isMobile && (
          <Pressable onPress={onClose} className="p-2">
            <Ionicons name="close" size={24} className="text-foreground" />
          </Pressable>
        )}
      </View>

      {/* Navigation */}
      <ScrollView className={`flex-1 ${isCollapsed ? "px-1" : "px-2"} py-4`} showsVerticalScrollIndicator={false}>
        {/* Main Navigation */}
        <View className="mb-4">
          {mainNav.map((item) => (
            <NavItemComponent key={item.href as string} item={item} />
          ))}
        </View>

        {/* Organization Navigation */}
        {organizationNav && <NavGroupComponent group={organizationNav} />}

        {/* Financial Navigation */}
        {financialNav && <NavGroupComponent group={financialNav} />}
      </ScrollView>

      {/* User Menu */}
      <View className={`border-t border-border ${isCollapsed ? "p-2" : "p-4"}`}>
        <Pressable
          onPress={() => {
            // TODO: Abrir menu de perfil
            console.log("Profile menu");
          }}
          className={`flex-row items-center ${isCollapsed ? "justify-center px-2" : "px-2"} py-2 rounded-lg active:bg-muted`}
        >
          {user?.image ? (
            <Image
              source={{ uri: user.image }}
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <View className="w-8 h-8 rounded-full bg-primary/20 items-center justify-center">
              <Ionicons
                name="person"
                size={18}
                className="text-primary"
              />
            </View>
          )}
          {!isCollapsed && (
            <>
              <View className="ml-3 flex-1">
                <ThemedText className="text-sm font-medium text-foreground">
                  {user?.username || "Usuário"}
                </ThemedText>
                <ThemedText className="text-xs text-foreground/60">
                  {isProvider ? "Prestador" : "Cliente"}
                </ThemedText>
              </View>
              <Ionicons
                name="chevron-down"
                size={18}
                className="text-foreground/60"
              />
            </>
          )}
        </Pressable>

        <Pressable
          onPress={handleLogout}
          className={`flex-row items-center ${isCollapsed ? "justify-center px-2" : "px-2"} py-2 mt-2 rounded-lg active:bg-muted`}
        >
          <Ionicons
            name="log-out-outline"
            size={20}
            className="text-foreground/70"
          />
          {!isCollapsed && (
            <ThemedText className="ml-3 text-sm text-foreground/70">
              Sair
            </ThemedText>
          )}
        </Pressable>
      </View>
    </Animated.View>
  );

  if (isMobile) {
    return (
      <>
        <Animated.View
          style={animatedOverlayStyle}
          className="absolute inset-0 bg-black/60 z-40"
        >
          <Pressable onPress={onClose} className="flex-1" />
        </Animated.View>
        {sidebarContent}
      </>
    );
  }

  return sidebarContent;
}

