# Guia de Polimento - Fase 7

Este documento descreve os padrões e componentes criados na Fase 7 (Polimento) da refatoração frontend.

## 1. Animações e Transições

### Componentes Disponíveis

#### FadeInView
Animação de fade in com translateY opcional.

```tsx
import { FadeInView } from "@/components/ui";

<FadeInView delay={100} duration={300}>
  <YourComponent />
</FadeInView>
```

#### SlideInView
Animação de slide de diferentes direções.

```tsx
import { SlideInView } from "@/components/ui";

<SlideInView direction="up" distance={20} delay={0}>
  <YourComponent />
</SlideInView>
```

**Props:**
- `direction`: "left" | "right" | "up" | "down" (padrão: "up")
- `distance`: número de pixels (padrão: 20)
- `delay`: delay em ms (padrão: 0)
- `duration`: duração em ms (padrão: 400)

#### ScaleInView
Animação de escala com opção de spring.

```tsx
import { ScaleInView } from "@/components/ui";

<ScaleInView useSpring={true} initialScale={0.8}>
  <YourComponent />
</ScaleInView>
```

**Props:**
- `useSpring`: usar animação spring (padrão: false)
- `initialScale`: escala inicial (padrão: 0.8)
- `delay`: delay em ms (padrão: 0)
- `duration`: duração em ms (padrão: 300)

#### StaggerView
Anima múltiplos filhos com delay escalonado.

```tsx
import { StaggerView } from "@/components/ui";

<StaggerView delay={0} staggerDelay={50}>
  {items.map(item => <Item key={item.id} />)}
</StaggerView>
```

### Hook de Transição de Página

```tsx
import { usePageTransition } from "@/hooks/use-page-transition";

function MyComponent() {
  const { opacity, navigateWithTransition } = usePageTransition();

  return (
    <Animated.View style={{ opacity }}>
      <Button onPress={() => navigateWithTransition("/new-page")} />
    </Animated.View>
  );
}
```

## 2. Loading States e Skeletons

### Componentes Skeleton

#### Skeleton (Base)
```tsx
import { Skeleton } from "@/components/ui";

<Skeleton variant="default" className="h-4 w-full" />
<Skeleton variant="circular" className="h-10 w-10" />
<Skeleton variant="rectangular" className="h-20 w-full" />
```

#### SkeletonText
```tsx
import { SkeletonText } from "@/components/ui";

<SkeletonText lines={3} />
```

#### SkeletonCard
```tsx
import { SkeletonCard } from "@/components/ui";

<SkeletonCard 
  showHeader={true} 
  showFooter={false} 
  lines={3} 
/>
```

#### SkeletonTable
```tsx
import { SkeletonTable } from "@/components/ui";

<SkeletonTable 
  rows={5} 
  columns={4} 
  showHeader={true} 
/>
```

#### SkeletonList
```tsx
import { SkeletonList } from "@/components/ui";

<SkeletonList 
  items={5} 
  showAvatar={true} 
  showSubtitle={true} 
/>
```

#### SkeletonForm
```tsx
import { SkeletonForm } from "@/components/ui";

<SkeletonForm 
  fields={4} 
  showSubmit={true} 
/>
```

### LoadingOverlay

```tsx
import { LoadingOverlay } from "@/components/ui";

<LoadingOverlay 
  visible={isLoading}
  message="Carregando dados..."
  variant="default" // "default" | "minimal" | "fullscreen"
  transparent={true}
  dismissible={false}
/>
```

**Variantes:**
- `default`: Modal centralizado com card
- `minimal`: Overlay pequeno e discreto
- `fullscreen`: Tela cheia com loading

## 3. Error Handling

### ErrorState Component

```tsx
import { ErrorState } from "@/components/ui";

// Variante padrão (tela cheia)
<ErrorState
  title="Erro ao carregar"
  message="Não foi possível carregar os dados."
  onRetry={refetch}
/>

// Variante compacta
<ErrorState
  variant="compact"
  message="Erro ao carregar."
  onRetry={refetch}
/>

// Variante inline (dentro de um card)
<ErrorState
  variant="inline"
  title="Erro"
  message="Algo deu errado."
  onRetry={refetch}
/>
```

### ErrorBoundary

```tsx
import { ErrorBoundary } from "@/components/ui";

<ErrorBoundary
  onError={(error, errorInfo) => {
    // Log para serviço de monitoramento
    console.error(error, errorInfo);
  }}
>
  <YourApp />
</ErrorBoundary>
```

### Padrão de Uso com React Query

```tsx
import { useQuery } from "@tanstack/react-query";
import { ErrorState } from "@/components/ui";
import { SkeletonCard } from "@/components/ui";

function MyComponent() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["myData"],
    queryFn: fetchData,
  });

  if (isLoading) {
    return <SkeletonCard lines={3} />;
  }

  if (error) {
    return (
      <ErrorState
        variant="inline"
        title="Erro ao carregar"
        message="Não foi possível carregar os dados."
        onRetry={refetch}
      />
    );
  }

  return <YourContent data={data} />;
}
```

## 4. Responsividade

### ResponsiveContainer

```tsx
import { ResponsiveContainer } from "@/components/ui";

<ResponsiveContainer 
  maxWidth="lg" 
  padding="md"
>
  <YourContent />
</ResponsiveContainer>
```

**Props:**
- `maxWidth`: "sm" | "md" | "lg" | "xl" | "2xl" | "full"
- `padding`: "none" | "sm" | "md" | "lg"

### ResponsiveGrid

```tsx
import { ResponsiveGrid } from "@/components/ui";

<ResponsiveGrid
  columns={{ default: 1, sm: 2, md: 3, lg: 4 }}
  gap="md"
>
  {items.map(item => <Item key={item.id} />)}
</ResponsiveGrid>
```

### Breakpoints Tailwind

O projeto usa os breakpoints padrão do Tailwind:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

**Exemplo de uso:**
```tsx
<View className="flex-col md:flex-row gap-4">
  <View className="w-full md:w-1/2" />
  <View className="w-full md:w-1/2" />
</View>
```

## 5. Padrões de Uso

### Checklist para Novas Telas

- [ ] Usar `SkeletonCard` ou variações durante loading
- [ ] Usar `ErrorState` para erros de API
- [ ] Adicionar animações com `FadeInView` ou `SlideInView`
- [ ] Usar `ResponsiveContainer` para conteúdo principal
- [ ] Testar em diferentes tamanhos de tela
- [ ] Garantir acessibilidade (labels, contraste)

### Ordem de Renderização

1. **Loading State** → Skeleton
2. **Error State** → ErrorState
3. **Empty State** → EmptyState (se aplicável)
4. **Content** → Com animações

### Performance

- Use `FadeInView` para listas longas com delay escalonado
- Prefira `Skeleton` ao invés de spinners para melhor UX
- Use `LoadingOverlay` apenas para ações críticas
- Evite animações pesadas em listas muito longas

## 6. Exemplos Completos

### Lista com Loading e Error

```tsx
import { useQuery } from "@tanstack/react-query";
import { SkeletonList, ErrorState, FadeInView } from "@/components/ui";

export function MyList() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["items"],
    queryFn: fetchItems,
  });

  if (isLoading) {
    return <SkeletonList items={5} showAvatar={true} />;
  }

  if (error) {
    return (
      <ErrorState
        variant="inline"
        title="Erro ao carregar"
        message="Não foi possível carregar os itens."
        onRetry={refetch}
      />
    );
  }

  return (
    <View className="gap-2">
      {data.map((item, index) => (
        <FadeInView key={item.id} delay={index * 50}>
          <ItemCard item={item} />
        </FadeInView>
      ))}
    </View>
  );
}
```

### Formulário com Loading

```tsx
import { SkeletonForm, LoadingOverlay } from "@/components/ui";

export function MyForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data, isLoading } = useQuery({...});

  if (isLoading) {
    return <SkeletonForm fields={5} showSubmit={true} />;
  }

  return (
    <>
      <Form onSubmit={handleSubmit} />
      <LoadingOverlay 
        visible={isSubmitting} 
        variant="minimal"
        message="Salvando..."
      />
    </>
  );
}
```

---

**Última atualização:** 2025-01-27  
**Versão:** 1.0

