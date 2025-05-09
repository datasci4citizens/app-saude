# Tailwind CSS Configuration

Este documento descreve a configuração do Tailwind CSS usada no projeto.

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
A seção `extend` adiciona ou sobrescreve valores padrão do Tailwind. As principais extensões incluem:

- **Fontes**: Adiciona fontes como `Inter` e `Work Sans`.
- **Pesos de Fonte**: Define pesos como `light`, `normal`, `medium`, `semibold` e `bold`.
- **Animações**: Adiciona keyframes e animações para comportamentos como `accordion-down` e `accordion-up`.
- **Opacidade**: Adiciona valores personalizados como `68` e `100`.
- **Cores**: Define uma paleta de cores personalizada, incluindo:
  - `orange`, `blue_page`, `yellow_select`, `blue_tittle`, `off_white`, `typography`, `gray_text`, `gray_buttons`, `allert_color`, `text_gray`, entre outras.
  - Cores para elementos como `card`, `popover`, `primary`, `secondary`, `muted`, `accent`, `destructive`, `success`, `warning` e `info`.

### 3. **Plugins**

O Tailwind CSS utiliza o plugin `tailwindcss-animate` para adicionar suporte a animações personalizadas.

## Satisfies Config

O arquivo utiliza o TypeScript com o tipo `Config` para garantir que a configuração esteja em conformidade com os tipos esperados pelo Tailwind CSS.