# Documentação dos Componentes

## Diretório `/src/components`

### Componentes na raiz

#### ProtectedRoute.jsx
- **Uso**: Componente para proteger rotas, garantindo que apenas usuários autenticados possam acessá-las.
- **Props**:
  - `children`: Elementos React que serão renderizados se o usuário estiver autenticado.
  - `redirectTo`: (Opcional) URL para redirecionar caso o usuário não esteja autenticado.
- **Exemplo**:
  ```jsx
  <ProtectedRoute redirectTo="/login">
    <Dashboard />
  </ProtectedRoute>
  ```

#### ProtectedRoute.tsx
- **Uso**: Versão TypeScript do `ProtectedRoute.jsx` com tipagem para as props.
- **Props**:
  - `children`: React.ReactNode.
  - `redirectTo`: string (opcional).
- **Exemplo**:
  ```tsx
  <ProtectedRoute redirectTo="/login">
    <Dashboard />
  </ProtectedRoute>
  ```

### Diretório `forms/`

#### autocomplete_input.tsx
- **Uso**: Campo de entrada com preenchimento automático.
- **Props**:
  - `options`: Array de strings ou objetos para sugerir valores.
  - `onSelect`: Função chamada quando um item é selecionado.
- **Exemplo**:
  ```tsx
  <AutocompleteInput 
    options={["Opção 1", "Opção 2"]} 
    onSelect={(value) => console.log(value)} 
  />
  ```

#### button.tsx
- **Uso**: Botão reutilizável.
- **Props**:
  - `onClick`: Função chamada ao clicar no botão.
  - `disabled`: Booleano para desativar o botão.
- **Exemplo**:
  ```tsx
  <Button onClick={() => alert('Clicado!')} disabled={false}>
    Clique aqui
  </Button>
  ```

#### checkbox.tsx
- **Uso**: Caixa de seleção.
- **Props**:
  - `checked`: Estado atual do checkbox.
  - `onChange`: Função chamada ao alterar o estado.
- **Exemplo**:
  ```tsx
  <Checkbox checked={true} onChange={(e) => console.log(e.target.checked)} />
  ```

#### date_input.tsx
- **Uso**: Campo de entrada para datas.
- **Props**:
  - `value`: Data atual no formato ISO.
  - `onChange`: Função chamada ao alterar a data.
- **Exemplo**:
  ```tsx
  <DateInput value="2025-05-08" onChange={(date) => console.log(date)} />
  ```

#### dropdown-menu.tsx
- **Uso**: Menu suspenso para seleção de opções.
- **Props**:
  - `items`: Array de objetos com `label` e `value`.
  - `onSelect`: Função chamada ao selecionar um item.
- **Exemplo**:
  ```tsx
  <DropdownMenu 
    items={[{ label: 'Opção 1', value: 1 }, { label: 'Opção 2', value: 2 }]} 
    onSelect={(item) => console.log(item)} 
  />
  ```

#### form.tsx
- **Uso**: Componente de formulário genérico.
- **Props**:
  - `onSubmit`: Função chamada ao enviar o formulário.
- **Exemplo**:
  ```tsx
  <Form onSubmit={(data) => console.log(data)}>
    <Input name="nome" />
    <Button type="submit">Enviar</Button>
  </Form>
  ```

### Diretório `ui/`

#### accordion.tsx
- **Uso**: Componente de acordeão para exibir e ocultar conteúdo.
- **Props**:
  - `title`: Título do acordeão.
  - `isOpen`: (Opcional) Define se o acordeão está aberto por padrão.
  - `onToggle`: (Opcional) Função chamada ao abrir ou fechar o acordeão.
- **Exemplo**:
  ```tsx
  <Accordion title="Detalhes" isOpen={false} onToggle={() => console.log('Toggled!')}>
    <p>Conteúdo do acordeão</p>
  </Accordion>
  ```

#### alert-dialog.tsx
- **Uso**: Componente de diálogo de alerta para exibir mensagens importantes.
- **Props**:
  - `isOpen`: Define se o diálogo está visível.
  - `onClose`: Função chamada ao fechar o diálogo.
  - `title`: Título do diálogo.
  - `message`: Mensagem exibida no corpo do diálogo.
- **Exemplo**:
  ```tsx
  <AlertDialog isOpen={true} onClose={() => console.log('Fechado')} title="Atenção" message="Esta é uma mensagem importante." />
  ```

#### alert.tsx
- **Uso**: Componente de alerta para exibir mensagens rápidas.
- **Props**:
  - `type`: Tipo do alerta (`success`, `error`, `warning`, `info`).
  - `message`: Mensagem exibida no alerta.
- **Exemplo**:
  ```tsx
  <Alert type="success" message="Operação realizada com sucesso!" />
  ```

#### aux_icons.tsx
- **Uso**: Conjunto de ícones auxiliares para uso em outros componentes.
- **Props**: Depende do ícone específico utilizado.
- **Exemplo**:
  ```tsx
  <AuxIcon name="check" size={24} color="green" />
  ```

#### avatar.tsx
- **Uso**: Componente para exibir avatares de usuários.
- **Props**:
  - `src`: URL da imagem do avatar.
  - `alt`: Texto alternativo para a imagem.
  - `size`: Tamanho do avatar (pequeno, médio, grande).
- **Exemplo**:
  ```tsx
  <Avatar src="/path/to/image.jpg" alt="Avatar do usuário" size="médio" />
  ```

#### back_arrow.tsx
- **Uso**: Componente de seta para voltar, geralmente usado em navegação.
- **Props**:
  - `onClick`: Função chamada ao clicar na seta.
- **Exemplo**:
  ```tsx
  <BackArrow onClick={() => console.log('Voltar')} />
  ```

#### badge.tsx
- **Uso**: Componente de badge para exibir contadores ou status.
- **Props**:
  - `content`: Texto ou número exibido no badge.
  - `color`: Cor do badge.
- **Exemplo**:
  ```tsx
  <Badge content="Novo" color="red" />
  ```

#### calendar.tsx
- **Uso**: Componente de calendário para seleção de datas.
- **Props**:
  - `selectedDate`: Data atualmente selecionada.
  - `onDateChange`: Função chamada ao alterar a data.
- **Exemplo**:
  ```tsx
  <Calendar selectedDate="2025-05-08" onDateChange={(date) => console.log(date)} />
  ```

#### card.tsx
- **Uso**: Componente de cartão para agrupar informações.
- **Props**:
  - `title`: Título do cartão.
  - `content`: Conteúdo exibido no cartão.
- **Exemplo**:
  ```tsx
  <Card title="Informações" content={<p>Detalhes importantes</p>} />
  ```

#### carousel.tsx
- **Uso**: Componente de carrossel para exibir itens em rotação.
- **Props**:
  - `items`: Array de itens a serem exibidos.
  - `onItemChange`: Função chamada ao mudar o item visível.
- **Exemplo**:
  ```tsx
  <Carousel items={["Item 1", "Item 2", "Item 3"]} onItemChange={(item) => console.log(item)} />
  ```

#### dialog.tsx
- **Uso**: Componente de diálogo genérico para exibir conteúdo modal.
- **Props**:
  - `isOpen`: Define se o diálogo está visível.
  - `onClose`: Função chamada ao fechar o diálogo.
  - `title`: (Opcional) Título do diálogo.
  - `children`: Conteúdo exibido dentro do diálogo.
- **Exemplo**:
  ```tsx
  <Dialog isOpen={true} onClose={() => console.log('Fechado')} title="Título do Diálogo">
    <p>Conteúdo do diálogo</p>
  </Dialog>
  ```

#### drawer.tsx
- **Uso**: Componente de gaveta para exibir menus ou informações adicionais.
- **Props**:
  - `isOpen`: Define se a gaveta está visível.
  - `onClose`: Função chamada ao fechar a gaveta.
  - `position`: (Opcional) Posição da gaveta (`left`, `right`, `top`, `bottom`).
  - `children`: Conteúdo exibido dentro da gaveta.
- **Exemplo**:
  ```tsx
  <Drawer isOpen={true} onClose={() => console.log('Fechado')} position="right">
    <p>Conteúdo da gaveta</p>
  </Drawer>
  ```

#### file-uploader.tsx
- **Uso**: Componente para upload de arquivos.
- **Props**:
  - `onUpload`: Função chamada ao fazer upload de um arquivo.
  - `accept`: (Opcional) Tipos de arquivos aceitos (ex.: `image/*`, `.pdf`).
  - `multiple`: (Opcional) Permite seleção de múltiplos arquivos.
- **Exemplo**:
  ```tsx
  <FileUploader onUpload={(files) => console.log(files)} accept="image/*" multiple={true} />
  ```

#### google-signin.tsx
- **Uso**: Botão para autenticação com Google.
- **Props**:
  - `onSuccess`: Função chamada ao autenticar com sucesso.
  - `onFailure`: Função chamada ao falhar na autenticação.
- **Exemplo**:
  ```tsx
  <GoogleSignIn onSuccess={(data) => console.log('Autenticado', data)} onFailure={(error) => console.error('Erro', error)} />
  ```

#### habit-card.tsx
- **Uso**: Componente para exibir informações sobre hábitos.
- **Props**:
  - `habitName`: Nome do hábito.
  - `progress`: Progresso do hábito (0 a 100).
  - `onClick`: (Opcional) Função chamada ao clicar no cartão.
- **Exemplo**:
  ```tsx
  <HabitCard habitName="Exercício" progress={75} onClick={() => console.log('Hábito clicado')} />
  ```

#### header.tsx
- **Uso**: Cabeçalho para páginas ou seções.
- **Props**:
  - `title`: Título exibido no cabeçalho.
  - `subtitle`: (Opcional) Subtítulo exibido abaixo do título.
- **Exemplo**:
  ```tsx
  <Header title="Bem-vindo" subtitle="Subtítulo opcional" />
  ```

#### home-banner.tsx
- **Uso**: Banner para a página inicial.
- **Props**:
  - `imageSrc`: URL da imagem exibida no banner.
  - `title`: Título exibido no banner.
  - `description`: (Opcional) Descrição exibida abaixo do título.
- **Exemplo**:
  ```tsx
  <HomeBanner imageSrc="/path/to/image.jpg" title="Bem-vindo" description="Descrição opcional" />
  ```

#### info-card.tsx
- **Uso**: Cartão para exibir informações resumidas.
- **Props**:
  - `title`: Título do cartão.
  - `content`: Conteúdo exibido no cartão.
  - `onClick`: (Opcional) Função chamada ao clicar no cartão.
- **Exemplo**:
  ```tsx
  <InfoCard title="Informações" content={<p>Detalhes importantes</p>} onClick={() => console.log('Clicado')} />
  ```

#### label.tsx
- **Uso**: Componente para exibir rótulos de texto.
- **Props**:
  - `text`: Texto exibido no rótulo.
  - `htmlFor`: (Opcional) ID do elemento associado ao rótulo.
- **Exemplo**:
  ```tsx
  <Label text="Nome" htmlFor="nome" />
  ```

#### labeled-switch.tsx
- **Uso**: Componente de interruptor com rótulo.
- **Props**:
  - `label`: Texto exibido ao lado do interruptor.
  - `checked`: Estado atual do interruptor.
  - `onChange`: Função chamada ao alterar o estado.
- **Exemplo**:
  ```tsx
  <LabeledSwitch label="Ativar notificações" checked={true} onChange={(e) => console.log(e.target.checked)} />
  ```

#### navigator-bar.tsx
- **Uso**: Barra de navegação para a aplicação.
- **Props**:
  - `items`: Array de objetos representando os itens de navegação, com `label` e `onClick`.
- **Exemplo**:
  ```tsx
  <NavigatorBar items={[{ label: 'Home', onClick: () => console.log('Home') }, { label: 'Perfil', onClick: () => console.log('Perfil') }]} />
  ```

#### patient-button.tsx
- **Uso**: Botão estilizado para ações relacionadas a pacientes.
- **Props**:
  - `label`: Texto exibido no botão.
  - `onClick`: Função chamada ao clicar no botão.
- **Exemplo**:
  ```tsx
  <PatientButton label="Ver Paciente" onClick={() => console.log('Paciente clicado')} />
  ```

#### popover.tsx
- **Uso**: Componente para exibir informações adicionais em um popover.
- **Props**:
  - `content`: Conteúdo exibido no popover.
  - `trigger`: Elemento que ativa o popover ao ser clicado.
- **Exemplo**:
  ```tsx
  <Popover content={<p>Informações adicionais</p>} trigger={<button>Mais informações</button>} />
  ```

#### reminder-card.tsx
- **Uso**: Cartão para exibir lembretes.
- **Props**:
  - `title`: Título do lembrete.
  - `description`: Descrição do lembrete.
  - `onClick`: (Opcional) Função chamada ao clicar no cartão.
- **Exemplo**:
  ```tsx
  <ReminderCard title="Consulta Médica" description="Dia 10 de maio às 14h" onClick={() => console.log('Lembrete clicado')} />
  ```

#### select.tsx
- **Uso**: Componente de seleção de opções.
- **Props**:
  - `options`: Array de objetos com `label` e `value` representando as opções.
  - `onChange`: Função chamada ao selecionar uma opção.
- **Exemplo**:
  ```tsx
  <Select options={[{ label: 'Opção 1', value: 1 }, { label: 'Opção 2', value: 2 }]} onChange={(value) => console.log(value)} />
  ```

#### select_habit.tsx
- **Uso**: Componente para selecionar hábitos.
- **Props**:
  - `habits`: Array de hábitos disponíveis.
  - `onSelect`: Função chamada ao selecionar um hábito.
- **Exemplo**:
  ```tsx
  <SelectHabit habits={["Correr", "Ler"]} onSelect={(habit) => console.log(habit)} />
  ```

#### selectable-button.tsx
- **Uso**: Botão que pode ser selecionado.
- **Props**:
  - `label`: Texto exibido no botão.
  - `selected`: Define se o botão está selecionado.
  - `onClick`: Função chamada ao clicar no botão.
- **Exemplo**:
  ```tsx
  <SelectableButton label="Selecionar" selected={true} onClick={() => console.log('Botão clicado')} />
  ```

#### skeleton.tsx
- **Uso**: Componente de esqueleto para indicar carregamento.
- **Props**:
  - `width`: Largura do esqueleto.
  - `height`: Altura do esqueleto.
- **Exemplo**:
  ```tsx
  <Skeleton width="100px" height="20px" />
  ```

#### slider.tsx
- **Uso**: Controle deslizante para selecionar valores.
- **Props**:
  - `min`: Valor mínimo.
  - `max`: Valor máximo.
  - `value`: Valor atual.
  - `onChange`: Função chamada ao alterar o valor.
- **Exemplo**:
  ```tsx
  <Slider min={0} max={100} value={50} onChange={(value) => console.log(value)} />
  ```

#### switch.tsx
- **Uso**: Componente de interruptor.
- **Props**:
  - `checked`: Estado atual do interruptor.
  - `onChange`: Função chamada ao alterar o estado.
- **Exemplo**:
  ```tsx
  <Switch checked={true} onChange={(e) => console.log(e.target.checked)} />
  ```

#### tabs.tsx
- **Uso**: Componente de abas para navegação.
- **Props**:
  - `tabs`: Array de objetos com `label` e `content` representando as abas.
  - `activeTab`: Aba atualmente ativa.
  - `onTabChange`: Função chamada ao mudar de aba.
- **Exemplo**:
  ```tsx
  <Tabs tabs={[{ label: 'Aba 1', content: <p>Conteúdo 1</p> }, { label: 'Aba 2', content: <p>Conteúdo 2</p> }]} activeTab={0} onTabChange={(index) => console.log(index)} />
  ```

#### task-bar.tsx
- **Uso**: Barra de tarefas para exibir progresso ou ações.
- **Props**:
  - `tasks`: Array de objetos representando as tarefas, com `label` e `completed`.
- **Exemplo**:
  ```tsx
  <TaskBar tasks={[{ label: 'Tarefa 1', completed: true }, { label: 'Tarefa 2', completed: false }]} />
  ```

#### text_input_diary.tsx
- **Uso**: Campo de entrada de texto para diários.
- **Props**:
  - `value`: Texto atual.
  - `onChange`: Função chamada ao alterar o texto.
- **Exemplo**:
  ```tsx
  <TextInputDiary value="Hoje foi um bom dia" onChange={(e) => console.log(e.target.value)} />
  ```

#### textarea.tsx
- **Uso**: Área de texto para entradas maiores.
- **Props**:
  - `value`: Texto atual.
  - `onChange`: Função chamada ao alterar o texto.
- **Exemplo**:
  ```tsx
  <Textarea value="Texto longo" onChange={(e) => console.log(e.target.value)} />
  ```

#### toast.tsx
- **Uso**: Componente de notificação (toast).
- **Props**:
  - `message`: Mensagem exibida no toast.
  - `type`: Tipo do toast (`success`, `error`, `info`, `warning`).
  - `onClose`: Função chamada ao fechar o toast.
- **Exemplo**:
  ```tsx
  <Toast message="Operação realizada com sucesso!" type="success" onClose={() => console.log('Toast fechado')} />
  ```