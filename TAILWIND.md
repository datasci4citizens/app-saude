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

#### Extend
A seção `extend` adiciona ou sobrescreve valores padrão do Tailwind. O projeto utiliza um sistema de cores baseado em CSS Custom Properties (variáveis CSS) que suportam temas claro e escuro automaticamente.

##### **Sistema de Cores Personalizadas**

O projeto implementa uma paleta de cores robusta usando CSS variables, permitindo troca de temas dinâmica:

###### **Cores de Interface Principal:**

<div style="display: flex; flex-wrap: wrap; gap: 16px; margin: 16px 0;">
  <div style="display: flex; flex-direction: column; align-items: center;">
    <div style="width: 60px; height: 60px; background-color: #fa6e5a; border-radius: 8px; border: 1px solid #ddd;"></div>
    <small><strong>selection</strong><br/>#fa6e5a</small>
  </div>
  <div style="display: flex; flex-direction: column; align-items: center;">
    <div style="width: 60px; height: 60px; background-color: #5a96fa; border-radius: 8px; border: 1px solid #ddd;"></div>
    <small><strong>homebg</strong> (claro)<br/>#5a96fa</small>
  </div>
  <div style="display: flex; flex-direction: column; align-items: center;">
    <div style="width: 60px; height: 60px; background-color: #25406d; border-radius: 8px; border: 1px solid #ddd;"></div>
    <small><strong>homebg</strong> (escuro)<br/>#25406d</small>
  </div>
  <div style="display: flex; flex-direction: column; align-items: center;">
    <div style="width: 60px; height: 60px; background-color: #cefa5a; border-radius: 8px; border: 1px solid #ddd;"></div>
    <small><strong>selected</strong> (claro)<br/>#cefa5a</small>
  </div>
  <div style="display: flex; flex-direction: column; align-items: center;">
    <div style="width: 60px; height: 60px; background-color: #97ce00; border-radius: 8px; border: 1px solid #ddd;"></div>
    <small><strong>selected</strong> (escuro)<br/>#97ce00</small>
  </div>
</div>

<div style="display: flex; flex-wrap: wrap; gap: 16px; margin: 16px 0;">
  <div style="display: flex; flex-direction: column; align-items: center;">
    <div style="width: 60px; height: 60px; background-color: #141b36; border-radius: 8px; border: 1px solid #ddd;"></div>
    <small><strong>typography</strong> (claro)<br/>#141b36</small>
  </div>
  <div style="display: flex; flex-direction: column; align-items: center;">
    <div style="width: 60px; height: 60px; background-color: #f9f9ff; border-radius: 8px; border: 1px solid #ddd;"></div>
    <small><strong>typography</strong> (escuro)<br/>#f9f9ff</small>
  </div>
  <div style="display: flex; flex-direction: column; align-items: center;">
    <div style="width: 60px; height: 60px; background-color: #f9f9ff; border-radius: 8px; border: 1px solid #ddd;"></div>
    <small><strong>offwhite</strong> (claro)<br/>#f9f9ff</small>
  </div>
  <div style="display: flex; flex-direction: column; align-items: center;">
    <div style="width: 60px; height: 60px; background-color: #737373; border-radius: 8px; border: 1px solid #ddd;"></div>
    <small><strong>offwhite</strong> (escuro)<br/>#737373</small>
  </div>
</div>

- **`selection`**: Cor de seleção - Usado para elementos selecionados
- **`homebg`**: Cor de fundo principal
- **`selected`**: Cor de elementos selecionados
- **`typography`**: Cor principal do texto
- **`offwhite`**: Cor off-white

###### **Escala de Cinzas:**

<div style="display: flex; flex-wrap: wrap; gap: 16px; margin: 16px 0;">
  <div style="display: flex; flex-direction: column; align-items: center;">
    <div style="width: 60px; height: 60px; background-color: #e6e6e6; border-radius: 8px; border: 1px solid #ddd;"></div>
    <small><strong>gray1</strong> (claro)<br/>#e6e6e6</small>
  </div>
  <div style="display: flex; flex-direction: column; align-items: center;">
    <div style="width: 60px; height: 60px; background-color: #a0a3b1; border-radius: 8px; border: 1px solid #ddd;"></div>
    <small><strong>gray1</strong> (escuro)<br/>#a0a3b1</small>
  </div>
  <div style="display: flex; flex-direction: column; align-items: center;">
    <div style="width: 60px; height: 60px; background-color: #a0a3b1; border-radius: 8px; border: 1px solid #ddd;"></div>
    <small><strong>gray2</strong> (claro)<br/>#a0a3b1</small>
  </div>
  <div style="display: flex; flex-direction: column; align-items: center;">
    <div style="width: 60px; height: 60px; background-color: #e6e6e6; border-radius: 8px; border: 1px solid #ddd;"></div>
    <small><strong>gray2</strong> (escuro)<br/>#e6e6e6</small>
  </div>
</div>

- **`gray1`**: Cinza claro
- **`gray2`**: Cinza médio - Usado para bordas e inputs

###### **Cores de Destaque:**

<div style="display: flex; flex-wrap: wrap; gap: 16px; margin: 16px 0;">
  <div style="display: flex; flex-direction: column; align-items: center;">
    <div style="width: 60px; height: 60px; background-color: #ffc97e; border-radius: 8px; border: 1px solid #ddd;"></div>
    <small><strong>accent1</strong> (claro)<br/>#ffc97e</small>
  </div>
  <div style="display: flex; flex-direction: column; align-items: center;">
    <div style="width: 60px; height: 60px; background-color: #082e91; border-radius: 8px; border: 1px solid #ddd;"></div>
    <small><strong>accent1</strong> (escuro)<br/>#082e91</small>
  </div>
  <div style="display: flex; flex-direction: column; align-items: center;">
    <div style="width: 60px; height: 60px; background-color: #464646; border-radius: 8px; border: 1px solid #ddd;"></div>
    <small><strong>accent2</strong> (claro)<br/>#464646</small>
  </div>
  <div style="display: flex; flex-direction: column; align-items: center;">
    <div style="width: 60px; height: 60px; background-color: #e6e6e6; border-radius: 8px; border: 1px solid #ddd;"></div>
    <small><strong>accent2</strong> (escuro)<br/>#e6e6e6</small>
  </div>
</div>

- **`accent1`**: Cor de destaque primária
- **`accent2`**: Cor de destaque secundária

###### **Cores do Sistema:**

<div style="display: flex; flex-wrap: wrap; gap: 16px; margin: 16px 0;">
  <div style="display: flex; flex-direction: column; align-items: center;">
    <div style="width: 60px; height: 60px; background-color: #ffffff; border-radius: 8px; border: 2px solid #ddd;"></div>
    <small><strong>primary</strong> (claro)<br/>#ffffff</small>
  </div>
  <div style="display: flex; flex-direction: column; align-items: center;">
    <div style="width: 60px; height: 60px; background-color: #212637; border-radius: 8px; border: 1px solid #ddd;"></div>
    <small><strong>primary</strong> (escuro)<br/>#212637</small>
  </div>
  <div style="display: flex; flex-direction: column; align-items: center;">
    <div style="width: 60px; height: 60px; background-color: #ff4d4f; border-radius: 8px; border: 1px solid #ddd;"></div>
    <small><strong>destructive</strong><br/>#ff4d4f</small>
  </div>
</div>

<div style="display: flex; flex-wrap: wrap; gap: 16px; margin: 16px 0;">
  <div style="display: flex; flex-direction: column; align-items: center;">
    <div style="width: 60px; height: 60px; background-color: #4288fe; border-radius: 8px; border: 1px solid #ddd;"></div>
    <small><strong>homeblob1</strong> (claro)<br/>#4288feff</small>
  </div>
  <div style="display: flex; flex-direction: column; align-items: center;">
    <div style="width: 60px; height: 60px; background-color: #1b4182; border-radius: 8px; border: 1px solid #ddd;"></div>
    <small><strong>homeblob1</strong> (escuro)<br/>#1b4182ff</small>
  </div>
  <div style="display: flex; flex-direction: column; align-items: center;">
    <div style="width: 60px; height: 60px; background-color: #2c78f9; border-radius: 8px; border: 1px solid #ddd;"></div>
    <small><strong>homeblob2</strong> (claro)<br/>#2c78f9ff</small>
  </div>
  <div style="display: flex; flex-direction: column; align-items: center;">
    <div style="width: 60px; height: 60px; background-color: #1f478c; border-radius: 8px; border: 1px solid #ddd;"></div>
    <small><strong>homeblob2</strong> (escuro)<br/>#1f478cff</small>
  </div>
</div>

- **`primary`**: Cor primária
- **`destructive`**: Cor para ações destrutivas
- **`success`**: Cor para indicar sucesso
- **`homeblob1`**: Gradiente blob 1
- **`homeblob2`**: Gradiente blob 2

##### **Estrutura das Cores**
Cada cor no sistema possui variantes:
- **`DEFAULT`**: Valor principal da cor
- **`foreground`**: Cor do texto sobre a cor base
- **`background`**: Cor de fundo (quando aplicável)
- **`border`**: Cor da borda (para gray2)
- **`input`**: Cor para inputs (para gray2)

##### **Uso das Classes CSS**
As cores podem ser usadas com as classes padrão do Tailwind:
- Texto: `text-typography`, `text-accent1`, `text-homeblob2`
- Fundo: `bg-homebg`, `bg-homeblob1`, `bg-primary`
- Bordas: `border-gray2`, `border-accent1`

## Paleta de Cores Completa

<div style="margin: 24px 0;">
  <h3>🎨 Visão Geral das Cores por Tema</h3>
  
  <h4>Tema Claro</h4>
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 12px; padding: 16px; background-color: #f8f9fa; border-radius: 8px; margin: 16px 0;">
    <div style="text-align: center;">
      <div style="width: 80px; height: 80px; background-color: #fa6e5a; border-radius: 12px; margin: 0 auto 8px; border: 2px solid #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.1);"></div>
      <small style="font-weight: 600;">selection</small>
    </div>
    <div style="text-align: center;">
      <div style="width: 80px; height: 80px; background-color: #5a96fa; border-radius: 12px; margin: 0 auto 8px; border: 2px solid #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.1);"></div>
      <small style="font-weight: 600;">homebg</small>
    </div>
    <div style="text-align: center;">
      <div style="width: 80px; height: 80px; background-color: #cefa5a; border-radius: 12px; margin: 0 auto 8px; border: 2px solid #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.1);"></div>
      <small style="font-weight: 600;">selected</small>
    </div>
    <div style="text-align: center;">
      <div style="width: 80px; height: 80px; background-color: #141b36; border-radius: 12px; margin: 0 auto 8px; border: 2px solid #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.1);"></div>
      <small style="font-weight: 600;">typography</small>
    </div>
    <div style="text-align: center;">
      <div style="width: 80px; height: 80px; background-color: #ffc97e; border-radius: 12px; margin: 0 auto 8px; border: 2px solid #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.1);"></div>
      <small style="font-weight: 600;">accent1</small>
    </div>
    <div style="text-align: center;">
      <div style="width: 80px; height: 80px; background-color: #2c78f9; border-radius: 12px; margin: 0 auto 8px; border: 2px solid #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.1);"></div>
      <small style="font-weight: 600;">homeblob2</small>
    </div>
  </div>

  <h4>Tema Escuro</h4>
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 12px; padding: 16px; background-color: #1a1a1a; border-radius: 8px; margin: 16px 0;">
    <div style="text-align: center;">
      <div style="width: 80px; height: 80px; background-color: #fa6e5a; border-radius: 12px; margin: 0 auto 8px; border: 2px solid #333; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>
      <small style="font-weight: 600; color: #fff;">selection</small>
    </div>
    <div style="text-align: center;">
      <div style="width: 80px; height: 80px; background-color: #25406d; border-radius: 12px; margin: 0 auto 8px; border: 2px solid #333; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>
      <small style="font-weight: 600; color: #fff;">homebg</small>
    </div>
    <div style="text-align: center;">
      <div style="width: 80px; height: 80px; background-color: #97ce00; border-radius: 12px; margin: 0 auto 8px; border: 2px solid #333; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>
      <small style="font-weight: 600; color: #fff;">selected</small>
    </div>
    <div style="text-align: center;">
      <div style="width: 80px; height: 80px; background-color: #f9f9ff; border-radius: 12px; margin: 0 auto 8px; border: 2px solid #333; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>
      <small style="font-weight: 600; color: #fff;">typography</small>
    </div>
    <div style="text-align: center;">
      <div style="width: 80px; height: 80px; background-color: #082e91; border-radius: 12px; margin: 0 auto 8px; border: 2px solid #333; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>
      <small style="font-weight: 600; color: #fff;">accent1</small>
    </div>
    <div style="text-align: center;">
      <div style="width: 80px; height: 80px; background-color: #1f478c; border-radius: 12px; margin: 0 auto 8px; border: 2px solid #333; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>
      <small style="font-weight: 600; color: #fff;">homeblob2</small>
    </div>
  </div>
</div>

### 3. **Plugins**

O Tailwind CSS utiliza o plugin `tailwindcss-animate` para adicionar suporte a animações personalizadas.

## Sistema de Temas

O projeto implementa um sistema de temas robusto através de CSS Custom Properties definidas em `src/globals.css`:

### Tema Claro (Padrão)
Aplicado automaticamente na raiz (`:root`)

### Tema Escuro
Aplicado através da classe `.theme-dark` no elemento body ou container principal

### Implementação de Cores
As cores são definidas usando variáveis CSS que se adaptam automaticamente ao tema:
```css
/* Exemplo de implementação */
:root {
  --homeblob2: #2c78f9ff;
}

.theme-dark {
  --homeblob2: #1f478cff;
}
```

## Fontes

O projeto utiliza duas fontes principais importadas via Google Fonts:

### **Work Sans** - Fonte Principal
Importada com pesos: 400, 500, 600, 700

<div style="font-family: 'Work Sans', sans-serif; margin: 20px 0; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">
  <h4 style="margin-top: 0; color: #333;">Demonstração Work Sans</h4>
  
  <div style="margin: 16px 0;">
    <div style="font-weight: 400; font-size: 16px; margin: 8px 0;">
      <strong>Regular (400):</strong> Aplicativo dedicado à sua saúde mental e tratamento
    </div>
    <div style="font-weight: 500; font-size: 16px; margin: 8px 0;">
      <strong>Medium (500):</strong> Aplicativo dedicado à sua saúde mental e tratamento
    </div>
    <div style="font-weight: 600; font-size: 16px; margin: 8px 0;">
      <strong>Semi-bold (600):</strong> Aplicativo dedicado à sua saúde mental e tratamento
    </div>
    <div style="font-weight: 700; font-size: 16px; margin: 8px 0;">
      <strong>Bold (700):</strong> Aplicativo dedicado à sua saúde mental e tratamento
    </div>
  </div>
  
  <div style="margin-top: 20px;">
    <h5 style="color: #666; margin-bottom: 12px;">Diferentes tamanhos:</h5>
    <div style="font-weight: 600; font-size: 24px; margin: 8px 0; color: #141b36;">SAÚDE</div>
    <div style="font-weight: 500; font-size: 18px; margin: 8px 0; color: #464646;">Título de Seção</div>
    <div style="font-weight: 400; font-size: 16px; margin: 8px 0; color: #a0a3b1;">Texto de corpo regular</div>
    <div style="font-weight: 400; font-size: 14px; margin: 8px 0; color: #a0a3b1;">Texto pequeno e labels</div>
  </div>
</div>

### **Inter** - Fonte Secundária  
Importada com pesos: 400, 500, 600

<div style="font-family: 'Inter', sans-serif; margin: 20px 0; padding: 20px; background-color: #f0f4ff; border-radius: 8px;">
  <h4 style="margin-top: 0; color: #333;">Demonstração Inter</h4>
  
  <div style="margin: 16px 0;">
    <div style="font-weight: 400; font-size: 16px; margin: 8px 0;">
      <strong>Regular (400):</strong> Interface de usuário moderna e legível
    </div>
    <div style="font-weight: 500; font-size: 16px; margin: 8px 0;">
      <strong>Medium (500):</strong> Interface de usuário moderna e legível
    </div>
    <div style="font-weight: 600; font-size: 16px; margin: 8px 0;">
      <strong>Semi-bold (600):</strong> Interface de usuário moderna e legível
    </div>
  </div>
  
  <div style="margin-top: 20px;">
    <h5 style="color: #666; margin-bottom: 12px;">Uso em componentes:</h5>
    <div style="font-weight: 500; font-size: 16px; margin: 8px 0; padding: 8px 16px; background-color: #2c78f9; color: white; border-radius: 6px; display: inline-block;">Botão Principal</div>
    <div style="font-weight: 400; font-size: 14px; margin: 8px 0; color: #666;">Labels de formulário</div>
    <div style="font-weight: 600; font-size: 12px; margin: 8px 0; color: #a0a3b1; text-transform: uppercase; letter-spacing: 0.5px;">BADGES E TAGS</div>
  </div>
</div>

### **Uso Recomendado**

| Elemento | Fonte | Peso | Tamanho |
|----------|-------|------|---------|
| **Títulos principais** | Work Sans | 700 (Bold) | 24px+ |
| **Subtítulos** | Work Sans | 600 (Semi-bold) | 18-20px |
| **Corpo do texto** | Work Sans | 400 (Regular) | 16px |
| **Botões** | Inter | 500 (Medium) | 14-16px |
| **Labels** | Inter | 400 (Regular) | 14px |
| **Navegação** | Inter | 500 (Medium) | 14-16px |

### **Implementação no Tailwind**

Com as fontes configuradas no `tailwind.config.ts`, você pode usar as seguintes classes:

```css
/* Classes Tailwind disponíveis */
.font-work-sans {
  font-family: 'Work Sans', sans-serif;
}

.font-inter {
  font-family: 'Inter', sans-serif;
}
```

**Exemplos de uso:**
```html
<!-- Títulos com Work Sans -->
<h1 class="font-work-sans font-bold text-2xl">SAÚDE</h1>
<h2 class="font-work-sans font-semibold text-lg">Subtítulo</h2>

<!-- Texto de interface com Inter -->
<button class="font-inter font-medium">Entrar</button>
<label class="font-inter text-sm">Email</label>

<!-- Texto de corpo com Work Sans -->
<p class="font-work-sans">Aplicativo dedicado à sua saúde mental</p>
```

**Pesos disponíveis:**
- `font-normal` (400)
- `font-medium` (500) 
- `font-semibold` (600)
- `font-bold` (700) - apenas Work Sans

## Satisfies Config

O arquivo utiliza o TypeScript com o tipo `Config` para garantir que a configuração esteja em conformidade com os tipos esperados pelo Tailwind CSS.