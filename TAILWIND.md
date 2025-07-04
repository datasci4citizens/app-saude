# Tailwind CSS Configuration

Este documento descreve a configuração do Tailwind CSS usada no projeto de saúde mental.

## Estrutura do Arquivo

O arquivo de configuração do Tailwind CSS está localizado em `tailwind.config.ts` e contém as seguintes seções principais:

### 1. **Content**

A propriedade `content` define os caminhos para os arquivos onde as classes do Tailwind CSS serão usadas. Isso ajuda a ferramenta a realizar a tree-shaking e remover classes não utilizadas. Os caminhos configurados incluem:

- `./pages/**/*.{ts,tsx}`
- `./components/**/*.{ts,tsx}`
- `./app/**/*.{ts,tsx}`
- `./src/**/*.{ts,tsx}`

### 2. **Theme**

A propriedade `theme` permite personalizar o design do projeto. As principais configurações incluem:

#### Container

- Centralizado (`center: true`)
- Padding padrão de `2rem`
- Largura máxima para telas `2xl` de `1400px`

#### Fontes Personalizadas

O projeto utiliza duas famílias de fontes principais, importadas do Google Fonts em `globals.css`:

- **`work-sans`**: 'Work Sans', 'sans-serif' (fonte principal)
- **`inter`**: 'Inter', 'sans-serif' (fonte secundária)

#### Tamanhos de Fonte Personalizados

O projeto define uma tipografia específica para diferentes elementos da interface:

- **`titulo`**: 28px, line-height 33.6px, font-weight 700
- **`desc-titulo`**: 14px, line-height 16.8px, font-weight 400
- **`topicos`**: 14px, line-height 16.8px, font-weight 700
- **`campos-preenchimento`**: 16px, line-height 19.2px, font-weight 300
- **`desc-campos`**: 10px, line-height 12px, font-weight 300
- **`campos-preenchimento2`**: 13px, line-height 15.6px, font-weight 300
- **`topicos2`**: 16px, line-height 17.6px, font-weight 600
- **`titulowindow`**: 18px, line-height 19.458px, font-weight 700
- **`button-primary`**: 16px, line-height 20px, letter-spacing 0.5px, font-weight 700
- **`button-compact`**: 14px, line-height 18px, letter-spacing 0.5px, font-weight 700

#### Sistema de Cores Personalizadas

O projeto implementa uma paleta de cores robusta usando CSS Custom Properties (variáveis CSS) que suportam temas claro e escuro. As cores são definidas em `src/globals.css` e referenciadas em `tailwind.config.ts`.

## 🎨 Visualização da Paleta de Cores

### Cores Principais da Interface

| Cor | Nome | Classe Tailwind | Tema Claro | Tema Escuro |
|-----|------|----------------|------------|-------------|
| <div style="width: 30px; height: 20px; background-color: #3b82f6; border: 1px solid #ccc; display: inline-block;"></div> | **Selection** | `bg-selection` | `#3b82f6` | `#60a5fa` |
| <div style="width: 30px; height: 20px; background-color: #3b82f6; border: 1px solid #ccc; display: inline-block;"></div> | **Home BG** | `bg-homebg` | `#3b82f6` | `#25406d` |
| <div style="width: 30px; height: 20px; background-color: #22c55e; border: 1px solid #ccc; display: inline-block;"></div> | **Selected** | `bg-selected` | `#22c55e` | `#22c55e` |
| <div style="width: 30px; height: 20px; background-color: #0f172a; border: 1px solid #ccc; display: inline-block;"></div> | **Typography** | `text-typography` | `#0f172a` | `#f8fafc` |
| <div style="width: 30px; height: 20px; background-color: #f8fafc; border: 1px solid #ccc; display: inline-block;"></div> | **Off White** | `bg-offwhite` | `#f8fafc` | `#f1f5f9` |

### Escala de Cinzas

| Cor | Nome | Classe Tailwind | Tema Claro | Tema Escuro |
|-----|------|----------------|------------|-------------|
| <div style="width: 30px; height: 20px; background-color: #e2e8f0; border: 1px solid #ccc; display: inline-block;"></div> | **Gray 1** | `bg-gray1` | `#e2e8f0` | `#475569` |
| <div style="width: 30px; height: 20px; background-color: #64748b; border: 1px solid #ccc; display: inline-block;"></div> | **Gray 2** | `bg-gray2` | `#64748b` | `#94a3b8` |

### Cores de Destaque

| Cor | Nome | Classe Tailwind | Tema Claro | Tema Escuro |
|-----|------|----------------|------------|-------------|
| <div style="width: 30px; height: 20px; background-color: #f59e0b; border: 1px solid #ccc; display: inline-block;"></div> | **Accent 1** | `bg-accent1` | `#f59e0b` | `#f59e0b` |
| <div style="width: 30px; height: 20px; background-color: #374151; border: 1px solid #ccc; display: inline-block;"></div> | **Accent 2** | `bg-accent2` | `#374151` | `#e2e8f0` |

### Cores do Sistema

| Cor | Nome | Classe Tailwind | Tema Claro | Tema Escuro |
|-----|------|----------------|------------|-------------|
| <div style="width: 30px; height: 20px; background-color: #3b82f6; border: 1px solid #ccc; display: inline-block;"></div> | **Primary** | `bg-primary` | `#3b82f6` | `#1e293b` |
| <div style="width: 30px; height: 20px; background-color: #ff4d4f; border: 1px solid #ccc; display: inline-block;"></div> | **Destructive** | `bg-destructive` | `#ff4d4f` | `#ef4444` |
| <div style="width: 30px; height: 20px; background-color: #16a34a; border: 1px solid #ccc; display: inline-block;"></div> | **Success** | `bg-success` | `#16a34a` | `#22c55e` |
| <div style="width: 30px; height: 20px; background-color: #f59e0b; border: 1px solid #ccc; display: inline-block;"></div> | **Yellow** | `bg-yellow` | `#f59e0b` | `#f59e0b` |

### Cores Especiais (Blobs/Gradientes)

| Cor | Nome | Classe Tailwind | Tema Claro | Tema Escuro |
|-----|------|----------------|------------|-------------|
| <div style="width: 30px; height: 20px; background-color: #1e40af; border: 1px solid #ccc; display: inline-block;"></div> | **Home Blob 1** | `bg-homeblob1` | `#1e40af` | `#1e40af` |
| <div style="width: 30px; height: 20px; background-color: #2563eb; border: 1px solid #ccc; display: inline-block;"></div> | **Home Blob 2** | `bg-homeblob2` | `#2563eb` | `#1e3a8a` |

### Cores de Interface Específicas

| Cor | Nome | Classe Tailwind | Tema Claro | Tema Escuro |
|-----|------|----------------|------------|-------------|
| <div style="width: 30px; height: 20px; background-color: #ffffff; border: 1px solid #ccc; display: inline-block;"></div> | **Card** | `bg-card` | `#ffffff` | `#1e293b` |
| <div style="width: 30px; height: 20px; background-color: #f1f5f9; border: 1px solid #ccc; display: inline-block;"></div> | **Bottom Nav** | `bg-bottom-nav` | `#f1f5f9` | `#1e293b` |
| <div style="width: 30px; height: 20px; background-color: #2563eb; border: 1px solid #ccc; display: inline-block;"></div> | **Button Primary** | `bg-button-primary` | `#2563eb` | (variável) |
| <div style="width: 30px; height: 20px; background-color: #fbbf24; border: 1px solid #ccc; display: inline-block;"></div> | **Button Accent** | `bg-button-accent` | `#fbbf24` | (variável) |

### Cores de Fundo

| Cor | Nome | Classe Tailwind | Tema Claro | Tema Escuro |
|-----|------|----------------|------------|-------------|
| <div style="width: 30px; height: 20px; background-color: #ffffff; border: 1px solid #ccc; display: inline-block;"></div> | **Background** | `bg-background` | `#ffffff` | (variável) |
| <div style="width: 30px; height: 20px; background-color: #eef4ff; border: 1px solid #ccc; display: inline-block;"></div> | **Background Hero** | `bg-background-hero` | `#eef4ff` | (variável) |
| <div style="width: 30px; height: 20px; background-color: #f1f5f9; border: 1px solid #ccc; display: inline-block;"></div> | **Muted** | `bg-muted` | `#f1f5f9` | (variável) |
| <div style="width: 30px; height: 20px; background-color: #f1f5f9; border: 1px solid #ccc; display: inline-block;"></div> | **Accent** | `bg-accent` | `#f1f5f9` | (variável) |

### Gradientes Disponíveis

| Gradiente | Classe Tailwind | Descrição |
|-----------|----------------|-----------|
| <div style="width: 60px; height: 20px; background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); border: 1px solid #ccc; display: inline-block;"></div> | `bg-gradient-interest-indicator` | Indicador de interesse |
| <div style="width: 60px; height: 20px; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); border: 1px solid #ccc; display: inline-block;"></div> | `bg-gradient-button-background` | Fundo de botão |
| <div style="width: 60px; height: 20px; background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); border: 1px solid #ccc; display: inline-block;"></div> | `bg-gradient-button-save` | Botão salvar |
| <div style="width: 60px; height: 20px; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); border: 1px solid #ccc; display: inline-block;"></div> | `bg-gradient-button-new` | Botão novo |
| <div style="width: 60px; height: 20px; background: linear-gradient(135deg, #e11d48 0%, #be185d 100%); border: 1px solid #ccc; display: inline-block;"></div> | `bg-gradient-button-edit` | Botão editar |

### Exemplo de Uso das Cores

```css
/* Cores básicas */
.text-typography      /* Texto principal */
.bg-homebg           /* Fundo principal */
.border-gray2        /* Bordas */
.text-success        /* Texto de sucesso */

/* Botões */
.bg-button-primary   /* Botão primário */
.hover:bg-button-primary-hover  /* Hover do botão */

/* Cards e containers */
.bg-card             /* Fundo do card */
.border-card-border  /* Borda do card */

/* Estados hover */
.hover:text-hover-primary    /* Hover em texto */
.hover:bg-hover-surface      /* Hover em superfície */
```
#### Timing Functions Personalizadas (`transitionTimingFunction`)

- **`hover`**: `cubic-bezier(0.4, 0, 0.2, 1)` - Suave
- **`bounce-soft`**: `cubic-bezier(0.68, -0.55, 0.265, 1.55)` - Bounce suave
- **`button-smooth`**: `cubic-bezier(0.4, 0, 0.2, 1)` - Botões suaves
- **`button-bounce`**: `cubic-bezier(0.68, -0.55, 0.265, 1.55)` - Botões com bounce

#### Backdrop Blur Personalizado (`backdropBlur`)

- **`hover`**: 8px - Blur para `hover`.
- **`button-glass`**: 12px - Blur para botões *glass*.

### 3. **Plugins**

#### Plugin Externo: `tailwindcss-animate`

Adiciona suporte a animações CSS prontas para uso, estendendo as animações padrão do Tailwind.

#### Plugin Personalizado

Um plugin customizado que adiciona utilitários específicos para o projeto:

##### **Utilitários de Hover**

- **`.hover-lift`**: Eleva o elemento em 2px com sombra no `hover`.
- **`.hover-glow`**: Adiciona efeito de brilho azul no `hover`.
- **`.hover-scale`**: Aumenta a escala do elemento em 2% no `hover`.
- **`.hover-rotate`**: Rotaciona o elemento em 2 graus no `hover`.

##### **Utilitários de Botão**

- **`.button-glass`**: Aplica efeito *glass* com gradiente, blur e borda.
- **`.button-press-effect`**: Aplica animação de pressão no estado `:active`.
- **`.button-hover-lift`**: Eleva o botão com sombra no `hover`.
- **`.button-glow-hover`**: Adiciona efeito de brilho no `hover` do botão.

## Sistema de Temas

O projeto implementa um sistema de temas robusto através de CSS Custom Properties definidas em `src/globals.css`:

### Estrutura de Variáveis CSS

Todas as cores são definidas usando a seguinte estrutura:

```css
:root {
    /* Tema claro - valores padrão */
    --selection: #3b82f6;
    --homebg: #3b82f6;
    /* ... outras variáveis */
}

.theme-dark {
    /* Tema escuro - valores alternativos */
    --selection: #60a5fa;
    --homebg: #25406d;
    /* ... outras variáveis */
}
```

### Aplicação de Temas

- **Tema Claro**: Aplicado automaticamente na raiz (`:root`)
- **Tema Escuro**: Aplicado através da classe `.theme-dark` no elemento body ou container principal

### Melhorias Implementadas

#### Inputs e Formulários

O sistema garante que inputs funcionem corretamente em ambos os temas:

```css
input, textarea {
    background-color: var(--input) !important;
    color: var(--input-foreground) !important;
    border: 1px solid var(--input-border) !important;
}

input::placeholder {
    color: var(--input-placeholder) !important;
}
```

#### Autofill do Browser

Suporte completo para estilização do autofill em ambos os temas:

```css
input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 30px var(--input) inset !important;
    -webkit-text-fill-color: var(--input-foreground) !important;
}
```
### Variantes de Cor

Cada cor principal possui variantes específicas:

- **`DEFAULT`**: Valor base da cor
- **`foreground`**: Cor do texto sobre a cor base
- **`background`**: Cor de fundo alternativa
- **`border`**: Cor para bordas (gray2, card)
- **`input`**: Cor específica para inputs (gray2)
- **`hover/active/disabled`**: Estados interativos (button-primary)

## Fontes

O projeto utiliza duas fontes principais importadas via Google Fonts:

### **Work Sans** - Fonte Principal

Importada com pesos: 400, 500, 600, 700

```css
@import url('https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;500;600;700&display=swap');
```

**Uso no Tailwind**: `font-work-sans`

### **Inter** - Fonte Secundária

Importada com pesos: 400, 500, 600

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
```

**Uso no Tailwind**: `font-inter`

### Tamanhos Tipográficos Específicos

O projeto define tamanhos específicos para diferentes elementos da interface, cada um com line-height, letter-spacing e font-weight otimizados:

```css
/* Exemplos de uso */
.text-titulo          /* 28px, bold, para títulos principais */
.text-topicos         /* 14px, bold, para tópicos */
.text-button-primary  /* 16px, bold, letter-spacing 0.5px */
```

## Classes Utilitárias Personalizadas

### Efeitos de Hover

O `globals.css` define classes utilitárias para efeitos avançados:

```css
.hover-lift           /* Elevação no hover */
.hover-glow           /* Brilho no hover */
.card-hover           /* Efeito completo para cards */
.btn-hover-primary    /* Gradiente para botões */
```

### Animações Especiais

```css
.animate-shimmer      /* Efeito shimmer */
.animate-progress-bar /* Barra de progresso */
.ripple               /* Efeito de ondulação */
```

### Estados de Botão

```css
.button-glass         /* Efeito glass */
.button-press-effect  /* Pressão no clique */
.button-hover-lift    /* Elevação no hover */
```

## Exemplo de Implementação

```tsx
// Exemplo de uso das cores e utilitários
<div className="bg-background text-typography">
  <button className="
    bg-button-primary hover:bg-button-primary-hover 
    text-button-primary font-button-primary
    shadow-button-soft hover:shadow-button-hover
    button-press-effect button-hover-lift
    transition-all duration-200 ease-button-smooth
  ">
    Botão Principal
  </button>
  
  <div className="bg-card border-card-border hover-lift card-hover">
    <p className="text-typography text-topicos2">Conteúdo do Card</p>
  </div>
</div>
```