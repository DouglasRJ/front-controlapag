# Padrões de Código - ControlaPAG Frontend

**Versão:** 1.0  
**Data:** 2025-01-27  
**Status:** ATIVO

> Guia de padrões e convenções para desenvolvimento do frontend ControlaPAG.

---

## 1. Componentes

### 1.1 Composição ao invés de Props Massivas

**❌ Evitar:**
```tsx
<Button
  title="Salvar"
  variant="primary"
  size="md"
  icon="save"
  iconPosition="left"
  loading={false}
  disabled={false}
  fullWidth={true}
  rounded="lg"
  shadow="md"
  // ... muitas outras props
/>
```

**✅ Preferir:**
```tsx
<Button variant="primary" size="md">
  <Button.Icon name="save" position="left" />
  <Button.Text>Salvar</Button.Text>
  {isLoading && <Button.Loading />}
</Button>
```

### 1.2 Compound Components

Use compound components quando um componente tem sub-componentes relacionados:

```tsx
// components/ui/card.tsx
export function Card({ children, className, ...props }) {
  return (
    <View className={cn("rounded-xl bg-card border border-border", className)} {...props}>
      {children}
    </View>
  );
}

Card.Header = function CardHeader({ children, className, ...props }) {
  return (
    <View className={cn("p-6 border-b border-border", className)} {...props}>
      {children}
    </View>
  );
};

Card.Content = function CardContent({ children, className, ...props }) {
  return (
    <View className={cn("p-6", className)} {...props}>
      {children}
    </View>
  );
};

Card.Footer = function CardFooter({ children, className, ...props }) {
  return (
    <View className={cn("p-6 border-t border-border", className)} {...props}>
      {children}
    </View>
  );
};

// Uso:
<Card>
  <Card.Header>
    <Text>Título</Text>
  </Card.Header>
  <Card.Content>
    <Text>Conteúdo</Text>
  </Card.Content>
  <Card.Footer>
    <Button>Salvar</Button>
  </Card.Footer>
</Card>
```

### 1.3 Forward Refs para Acessibilidade

Componentes que precisam receber refs devem usar `forwardRef`:

```tsx
import { forwardRef } from "react";
import { TextInput, TextInputProps } from "react-native";

export const Input = forwardRef<TextInput, TextInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <TextInput
        ref={ref}
        className={cn(
          "h-10 rounded-md border border-input bg-background px-3 py-2",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
```

**Quando usar forwardRef:**
- Componentes que encapsulam elementos nativos (TextInput, ScrollView, etc)
- Componentes que precisam ser focados programaticamente
- Componentes usados em bibliotecas de formulários (react-hook-form)

### 1.4 TypeScript Estrito

- Sempre use TypeScript estrito (`strict: true` no tsconfig.json)
- Defina tipos explícitos para props
- Use `type` para tipos simples, `interface` para objetos extensíveis
- Evite `any` - use `unknown` quando necessário

```tsx
// ✅ Bom
type ButtonVariant = "primary" | "secondary" | "destructive";

interface ButtonProps {
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

// ❌ Evitar
function Button(props: any) {
  // ...
}
```

---

## 2. Estilização

### 2.1 NativeWind (Tailwind) para Tudo

**Sempre use classes Tailwind ao invés de StyleSheet:**

```tsx
// ✅ Preferir
<View className="flex-1 bg-background p-4 rounded-lg">
  <Text className="text-foreground text-lg font-semibold">Título</Text>
</View>

// ❌ Evitar
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
  },
});
```

### 2.2 Variants com `cn()` Utility

Use a função `cn()` para combinar classes condicionalmente:

```tsx
import { cn } from "@/utils/cn";

const containerVariants: Record<ButtonVariant, string> = {
  primary: "bg-primary-500 text-primary-foreground",
  secondary: "bg-secondary-500 text-secondary-foreground",
  destructive: "bg-error-500 text-white",
};

export function Button({ variant = "primary", className, ...props }) {
  return (
    <Pressable
      className={cn(
        "px-4 py-2 rounded-lg", // base
        containerVariants[variant], // variant
        className // override
      )}
      {...props}
    />
  );
}
```

### 2.3 Dark Mode com Classes do Tailwind

Use a classe `dark:` para estilos de dark mode:

```tsx
<View className="bg-white dark:bg-neutral-900">
  <Text className="text-neutral-900 dark:text-neutral-100">
    Texto que muda de cor no dark mode
  </Text>
</View>
```

**Cores semânticas:**
- `bg-background` / `dark:bg-background` (já configurado no tailwind.config.js)
- `text-foreground` / `dark:text-foreground`
- `bg-card` / `dark:bg-card`
- `border-border` / `dark:border-border`

### 2.4 Animações com Reanimated

Use `react-native-reanimated` para animações:

```tsx
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

export function AnimatedButton() {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSpring(0.95, {}, () => {
      scale.value = withSpring(1);
    });
  };

  return (
    <Animated.View style={animatedStyle}>
      <Pressable onPress={handlePress}>
        <Text>Pressione</Text>
      </Pressable>
    </Animated.View>
  );
}
```

**Regras:**
- Use `withSpring` para animações naturais
- Use `withTiming` para animações lineares
- Evite animações pesadas (muitos elementos simultâneos)
- Prefira animações nativas (worklets) quando possível

---

## 3. Estado

### 3.1 TanStack Query para Server State

Use TanStack Query para dados do servidor:

```tsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";

// Query
export function useServices() {
  return useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const response = await api.get("/services");
      return response.data;
    },
  });
}

// Mutation
export function useCreateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateServiceDto) => {
      return api.post("/services", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
}
```

**Convenções:**
- Use `queryKey` consistentes: `["services"]`, `["services", id]`, `["charges", { status }]`
- Invalide queries relacionadas após mutations
- Use `queryClient.setQueryData` para atualizações otimistas quando apropriado

### 3.2 Zustand para Client State (Global)

Use Zustand para estado global do cliente:

```tsx
// store/authStore.ts
import { create } from "zustand";

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));

// Uso
function Profile() {
  const { user, logout } = useAuthStore();
  // ...
}
```

**Quando usar Zustand:**
- Estado global (auth, theme, sidebar)
- Estado compartilhado entre múltiplas telas
- Estado que precisa persistir (com persist middleware)

### 3.3 React State para Estado Local

Use `useState` para estado local do componente:

```tsx
function Form() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // ...
}
```

**Quando usar React State:**
- Estado que não precisa ser compartilhado
- Estado temporário (modals, dropdowns)
- Estado de formulário (ou use react-hook-form)

---

## 4. Cores da Marca

Sempre use as cores da marca definidas no `tailwind.config.js`:

```tsx
// ✅ Cores da marca
<View className="bg-primary-500">     // #FD5001
<View className="bg-secondary-500">   // #F29C11
<View className="bg-premium-500">     // #AF340B

// ✅ Cores semânticas
<View className="bg-success-500">     // Verde
<View className="bg-warning-500">    // Amarelo
<View className="bg-error-500">       // Vermelho
<View className="bg-info-500">        // Azul

// ❌ Evitar cores hardcoded
<View style={{ backgroundColor: "#FD5001" }}> // Não fazer isso
```

**Escalas disponíveis:**
- `primary-50` até `primary-900`
- `secondary-50` até `secondary-900`
- `premium-50` até `premium-900`
- `neutral-50` até `neutral-950`

---

## 5. Estrutura de Arquivos

### 5.1 Componentes

```
components/
├── ui/              # Componentes base reutilizáveis
│   ├── button.tsx
│   ├── card.tsx
│   └── input.tsx
├── forms/           # Componentes de formulário
│   ├── controlled-input.tsx
│   └── controlled-select.tsx
└── dashboard/       # Componentes específicos de features
    ├── metric-card.tsx
    └── revenue-chart.tsx
```

### 5.2 Hooks

```
hooks/
├── use-services.ts          # Hooks de features
├── use-charges.ts
└── use-auth-hydration.ts   # Hooks utilitários
```

### 5.3 Tipos

```
types/
├── service.ts
├── charge.ts
└── user.ts
```

---

## 6. Nomenclatura

### 6.1 Componentes

- **PascalCase** para componentes: `Button`, `MetricCard`, `ChargeList`
- **camelCase** para funções: `formatCurrency`, `parseDate`
- **UPPER_CASE** para constantes: `API_BASE_URL`, `MAX_RETRIES`

### 6.2 Arquivos

- **kebab-case** para arquivos: `charge-card.tsx`, `use-charges.ts`
- **PascalCase** apenas para componentes principais: `Button.tsx` (se for o único export)

### 6.3 Variáveis e Props

- **camelCase**: `isLoading`, `handleSubmit`, `onChange`
- Prefixos comuns:
  - `is` / `has` para booleanos: `isOpen`, `hasError`
  - `on` para handlers: `onClick`, `onChange`
  - `handle` para funções de handler: `handleSubmit`

---

## 7. Performance

### 7.1 Memoização

Use `useMemo` e `useCallback` quando apropriado:

```tsx
// ✅ Quando o cálculo é pesado
const filteredItems = useMemo(() => {
  return items.filter(item => item.status === filter);
}, [items, filter]);

// ✅ Quando a função é passada como prop
const handleClick = useCallback(() => {
  // ...
}, [dependencies]);
```

**Não memoize desnecessariamente:**
- Cálculos simples
- Funções que não são passadas como props
- Valores primitivos

### 7.2 Lazy Loading

Use `React.lazy` e `Suspense` para code splitting:

```tsx
const AnalyticsPage = React.lazy(() => import("./analytics"));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <AnalyticsPage />
    </Suspense>
  );
}
```

---

## 8. Acessibilidade

### 8.1 Labels e Aria

```tsx
<Pressable
  accessibilityLabel="Salvar formulário"
  accessibilityRole="button"
  accessibilityHint="Salva as alterações do formulário"
>
  <Text>Salvar</Text>
</Pressable>
```

### 8.2 Navegação por Teclado

- Use `Pressable` ao invés de `TouchableOpacity` (melhor suporte a teclado)
- Implemente navegação por Tab quando apropriado
- Forneça feedback visual para foco

---

## 9. Testes (Futuro)

Quando implementarmos testes:

- Use `@testing-library/react-native` para testes de componentes
- Teste comportamento, não implementação
- Mock APIs e serviços externos
- Mantenha testes simples e focados

---

## 10. Checklist de Revisão

Antes de fazer commit, verifique:

- [ ] TypeScript sem erros (`strict: true`)
- [ ] Componentes usam `cn()` para classes
- [ ] Cores da marca (não hardcoded)
- [ ] Dark mode implementado quando necessário
- [ ] forwardRef usado quando apropriado
- [ ] Estado gerenciado corretamente (Query/Zustand/State)
- [ ] Nomenclatura consistente
- [ ] Sem console.logs ou código comentado
- [ ] Performance considerada (memoização quando necessário)

---

**Referências:**
- [NativeWind Docs](https://www.nativewind.dev/)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Zustand Docs](https://zustand-demo.pmnd.rs/)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)

