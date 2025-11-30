# Design Tokens - ControlaPAG

**Versão:** 1.0  
**Data:** 2025-01-27  
**Status:** ATUALIZADO

> Documentação completa dos design tokens utilizados no projeto ControlaPAG.

---

## 1. Paleta de Cores

### 1.1 Cores da Marca

#### Primary (Laranja - #FD5001)
Cor principal da marca ControlaPAG, utilizada para ações primárias, botões principais e elementos de destaque.

```typescript
primary: {
  50: "#FFF4ED",   // Backgrounds muito claros
  100: "#FFE5D4",  // Backgrounds claros
  200: "#FFC7A8",  // Hover states
  300: "#FF9F71",  // Estados interativos
  400: "#FF6B3D",  // Acentos
  500: "#FD5001",  // Cor principal (DEFAULT)
  600: "#E64500",  // Hover de botões
  700: "#CC3C00",  // Estados ativos
  800: "#B33300",  // Textos em backgrounds claros
  900: "#992B00",  // Textos em backgrounds muito claros
}
```

**Uso:**
- Botões primários: `bg-primary` ou `bg-primary-500`
- Links e ações principais: `text-primary`
- Bordas de destaque: `border-primary`

#### Secondary (Amarelo - #F29C11)
Cor auxiliar da marca, utilizada para elementos secundários e destaques complementares.

```typescript
secondary: {
  50: "#FFFBEB",
  100: "#FEF3C7",
  200: "#FDE68A",
  300: "#FCD34D",
  400: "#FBBF24",
  500: "#F29C11",  // Cor auxiliar (DEFAULT)
  600: "#D97706",
  700: "#B45309",
  800: "#92400E",
  900: "#78350F",
}
```

**Uso:**
- Botões secundários: `bg-secondary`
- Badges e tags: `bg-secondary-100 text-secondary-700`
- Acentos em cards: `border-secondary`

#### Premium (Vermelho Escuro - #AF340B)
Cor premium da marca, utilizada para elementos especiais e features premium.

```typescript
premium: {
  50: "#FFF1F2",
  100: "#FFE4E6",
  200: "#FECDD3",
  300: "#FDA4AF",
  400: "#FB7185",
  500: "#AF340B",  // Cor premium (DEFAULT)
  600: "#9F2E0A",
  700: "#8F2809",
  800: "#7F2208",
  900: "#6F1C07",
}
```

**Uso:**
- Features premium: `bg-premium`
- Badges premium: `text-premium`
- Destaques especiais: `border-premium`

### 1.2 Cores Neutras

Escala completa de cinzas para textos, backgrounds e bordas.

```typescript
neutral: {
  50: "#FAFAFA",   // Backgrounds muito claros
  100: "#F5F5F5",  // Backgrounds claros
  200: "#E5E5E5",  // Bordas claras
  300: "#D4D4D4",  // Bordas médias
  400: "#A3A3A3",  // Textos secundários
  500: "#737373",  // Textos médios
  600: "#525252",  // Textos principais
  700: "#404040",  // Textos escuros
  800: "#262626",  // Backgrounds escuros
  900: "#171717",  // Backgrounds muito escuros
  950: "#0A0A0A",  // Backgrounds extremamente escuros
}
```

**Uso:**
- Backgrounds: `bg-neutral-50` (light) ou `bg-neutral-900` (dark)
- Textos: `text-neutral-600` (light) ou `text-neutral-300` (dark)
- Bordas: `border-neutral-200` (light) ou `border-neutral-700` (dark)

### 1.3 Cores Semânticas

Cores para feedback visual e status.

#### Success (Verde)
```typescript
success: {
  50: "#F0FDF4",   // Backgrounds de sucesso
  100: "#DCFCE7",  // Backgrounds claros
  500: "#22C55E",  // Cor principal
  600: "#16A34A",  // Hover/ativo
}
```

**Uso:**
- Status de sucesso: `bg-success-50 text-success-600`
- Ícones de sucesso: `text-success-500`
- Badges de sucesso: `border-success-200`

#### Warning (Amarelo/Laranja)
```typescript
warning: {
  50: "#FFFBEB",
  100: "#FEF3C7",
  500: "#F59E0B",
  600: "#D97706",
}
```

**Uso:**
- Avisos: `bg-warning-50 text-warning-600`
- Status pendente: `border-warning-200`
- Alertas: `text-warning-500`

#### Error (Vermelho)
```typescript
error: {
  50: "#FEF2F2",
  100: "#FEE2E2",
  500: "#EF4444",
  600: "#DC2626",
}
```

**Uso:**
- Erros: `bg-error-50 text-error-600`
- Validações: `border-error-200`
- Mensagens de erro: `text-error-500`

#### Info (Azul)
```typescript
info: {
  50: "#EFF6FF",
  100: "#DBEAFE",
  500: "#3B82F6",
  600: "#2563EB",
}
```

**Uso:**
- Informações: `bg-info-50 text-info-600`
- Tooltips: `border-info-200`
- Links informativos: `text-info-500`

---

## 2. Tipografia

### 2.1 Font Family

```typescript
fontFamily: {
  sans: ["Inter", "system-ui", "sans-serif"],  // Fonte principal
  mono: ["JetBrains Mono", "monospace"],       // Código e números
}
```

**Uso:**
- Textos gerais: `font-sans` (padrão)
- Código: `font-mono`

### 2.2 Font Size

```typescript
fontSize: {
  xs: "0.75rem",    // 12px - Textos pequenos, labels
  sm: "0.875rem",   // 14px - Textos secundários
  base: "1rem",     // 16px - Texto padrão
  lg: "1.125rem",   // 18px - Textos destacados
  xl: "1.25rem",    // 20px - Subtítulos
  "2xl": "1.5rem",  // 24px - Títulos de seção
  "3xl": "1.875rem", // 30px - Títulos principais
  "4xl": "2.25rem",  // 36px - Títulos grandes
}
```

**Uso:**
- Labels: `text-xs`
- Corpo: `text-base`
- Títulos: `text-2xl` ou `text-3xl`

### 2.3 Font Weight

```typescript
fontWeight: {
  regular: 400,   // Texto normal
  medium: 500,   // Texto médio
  semibold: 600, // Texto semi-negrito
  bold: 700,     // Texto negrito
}
```

**Uso:**
- Texto normal: `font-regular` ou sem classe
- Destaques: `font-medium`
- Títulos: `font-semibold` ou `font-bold`

---

## 3. Espaçamento

Sistema de espaçamento consistente baseado em múltiplos de 4px.

```typescript
spacing: {
  xs: "0.25rem",  // 4px - Espaçamentos mínimos
  sm: "0.5rem",   // 8px - Espaçamentos pequenos
  md: "1rem",     // 16px - Espaçamento padrão
  lg: "1.5rem",   // 24px - Espaçamentos médios
  xl: "2rem",     // 32px - Espaçamentos grandes
  "2xl": "3rem",  // 48px - Espaçamentos muito grandes
  "3xl": "4rem",  // 64px - Espaçamentos extremos
}
```

**Uso:**
- Padding: `p-4` (16px), `px-6` (24px horizontal)
- Margin: `mb-4` (16px bottom), `mt-8` (32px top)
- Gap: `gap-4` (16px entre itens)

---

## 4. Border Radius

Sistema de bordas arredondadas moderno.

```typescript
borderRadius: {
  none: "0",
  sm: "0.375rem",  // 6px - Bordas levemente arredondadas
  md: "0.5rem",    // 8px - Bordas médias
  lg: "0.75rem",   // 12px - Bordas grandes
  xl: "1rem",      // 16px - Bordas muito grandes
  "2xl": "1.5rem", // 24px - Bordas extremas
  full: "9999px",  // Círculo completo
}
```

**Uso:**
- Inputs: `rounded-lg`
- Cards: `rounded-xl`
- Botões: `rounded-lg` ou `rounded-full`
- Avatares: `rounded-full`

---

## 5. Sombras

Sistema de elevação através de sombras.

```typescript
boxShadow: {
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",  // Sombras pequenas
  md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",  // Sombras médias
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",  // Sombras grandes
  xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",  // Sombras muito grandes
}
```

**Uso:**
- Cards: `shadow-sm` ou `shadow-md`
- Modais: `shadow-xl`
- Elevação: `shadow-lg`

---

## 6. Tokens de UI

### 6.1 Background e Foreground

```typescript
// Light Mode
background: "#F5F5F5"      // bg-background
foreground: "#000000"      // text-foreground

// Dark Mode
background: "#000000"      // dark:bg-background
foreground: "#F5F5F5"     // dark:text-foreground
```

### 6.2 Card

```typescript
// Light Mode
card: "#FFFFFF"            // bg-card
cardForeground: "#000000"  // text-card-foreground

// Dark Mode
card: "#1C1C1E"            // dark:bg-card
cardForeground: "#FFFFFF"  // dark:text-card-foreground
```

### 6.3 Border e Input

```typescript
// Light Mode
border: "#E5E5E5"          // border-border
input: "#E5E5E5"           // border-input

// Dark Mode
border: "#AF340B"          // dark:border-border
input: "#1C1C1E"           // dark:border-input
```

---

## 7. Exemplos de Uso

### 7.1 Botão Primário

```tsx
<Button className="bg-primary text-primary-foreground rounded-lg px-6 py-3">
  Clique aqui
</Button>
```

### 7.2 Card Moderno

```tsx
<Card className="rounded-xl bg-card border border-border shadow-md p-6">
  <CardHeader>
    <CardTitle className="text-2xl font-bold text-card-foreground">
      Título
    </CardTitle>
  </CardHeader>
  <CardContent>
    <ThemedText className="text-base text-foreground/60">
      Conteúdo do card
    </ThemedText>
  </CardContent>
</Card>
```

### 7.3 Badge de Status

```tsx
<View className="px-3 py-1 rounded-full bg-success-50 border border-success-200">
  <ThemedText className="text-xs font-medium text-success-600">
    Sucesso
  </ThemedText>
</View>
```

### 7.4 Input Moderno

```tsx
<Input
  className="rounded-lg border border-input bg-background px-4 py-2 text-foreground focus:ring-2 focus:ring-primary"
  placeholder="Digite aqui..."
/>
```

---

## 8. Dark Mode

Todos os tokens suportam dark mode através da classe `dark:` do Tailwind.

**Exemplo:**
```tsx
<View className="bg-card dark:bg-dark-card border-border dark:border-dark-border">
  <ThemedText className="text-foreground dark:text-dark-foreground">
    Texto adaptável
  </ThemedText>
</View>
```

---

## 9. Acessibilidade

### 9.1 Contraste

- Textos principais: mínimo 4.5:1 de contraste
- Textos grandes: mínimo 3:1 de contraste
- Elementos interativos: mínimo 3:1 de contraste

### 9.2 Cores Semânticas

Sempre combine cores com ícones ou texto para garantir acessibilidade:
- ✅ Sucesso: Verde + ícone de check
- ⚠️ Aviso: Amarelo + ícone de alerta
- ❌ Erro: Vermelho + ícone de erro
- ℹ️ Info: Azul + ícone de informação

---

## 10. Referências

- **Tailwind Config:** `front-controlapag/tailwind.config.js`
- **Design System:** `docs/refatoracao-frontend.md`
- **Coding Standards:** `docs/coding-standards.md`

---

**Última atualização:** 2025-01-27

