# Documentação dos Componentes

## Diretório `/src/components`

### Componentes na raiz

#### EditInterestsDialog.tsx

- **Uso**: Diálogo para edição e seleção de áreas de interesse do usuário.
- **Props**:
    - `isOpen`: boolean - Define se o diálogo está visível.
    - `onClose`: () => void - Função chamada ao fechar o diálogo.
    - `onSave`: (interests: InterestAreaTrigger[]) => void - Função chamada ao salvar interesses.
    - `initialInterests`: InterestAreaTrigger[] - Interesses iniciais selecionados.
- **Exemplo**:
    ```tsx
    <EditInterestsDialog
        isOpen={true}
        onClose={() => setDialogOpen(false)}
        onSave={(interests) => console.log(interests)}
        initialInterests={userInterests}
    />
    ```

#### ProtectedRoute.tsx

- **Uso**: Componente para proteger rotas, garantindo que apenas usuários autenticados possam acessá-las.
- **Props**:
    - `children`: React.ReactNode - Elementos que serão renderizados se o usuário estiver autenticado.
    - `redirectTo`: string (opcional) - URL para redirecionar caso não esteja autenticado.
- **Exemplo**:
    ```tsx
    <ProtectedRoute redirectTo="/login">
        <Dashboard />
    </ProtectedRoute>
    ```

#### SplashScreen.tsx

- **Uso**: Tela de splash animada exibida durante o carregamento inicial da aplicação.
- **Props**:
    - `onComplete`: () => void - Função chamada quando a animação termina.
    - `duration`: number (opcional) - Duração em milissegundos (padrão: 2500ms).
- **Exemplo**:
    ```tsx
    <SplashScreen
        onComplete={() => setShowApp(true)}
        duration={3000}
    />
    ```

### Diretório `forms/`

#### button.tsx

- **Uso**: Botão reutilizável com múltiplas variantes de estilo e estados.
- **Props**:
    - `variant`: 'default' | 'orange' | 'white' | 'blue' | 'outlineWhite' | 'outlineOrange' | 'gradient' | 'gradientNew' | 'gradientSave' | 'gradientEdit' | 'success' | 'danger' | 'ghost' | 'glass'
    - `size`: 'default' | 'sm' | 'lg' | 'icon' | 'xl'
    - `onClick`: () => void - Função chamada ao clicar no botão.
    - `disabled`: boolean - Define se o botão está desabilitado.
    - `asChild`: boolean - Renderiza como Slot do Radix UI.
    - `children`: React.ReactNode - Conteúdo do botão.
- **Exemplo**:
    ```tsx
    <Button variant="gradientSave" size="lg" onClick={() => handleSave()}>
        Salvar
    </Button>
    ```

#### checkbox.tsx

- **Uso**: Caixa de seleção personalizada.
- **Props**:
    - `checked`: boolean - Estado atual do checkbox.
    - `onChange`: (checked: boolean) => void - Função chamada ao alterar o estado.
    - `disabled`: boolean (opcional) - Define se está desabilitado.
- **Exemplo**:
    ```tsx
    <Checkbox checked={isSelected} onChange={setIsSelected} />
    ```

#### date_input.tsx

- **Uso**: Campo de entrada para seleção de datas.
- **Props**:
    - `value`: string - Data atual no formato ISO.
    - `onChange`: (date: string) => void - Função chamada ao alterar a data.
    - `placeholder`: string (opcional) - Texto de placeholder.
- **Exemplo**:
    ```tsx
    <DateInput value="2025-07-04" onChange={setSelectedDate} />
    ```

#### dropdown-menu.tsx

- **Uso**: Menu suspenso para seleção de opções.
- **Props**:
    - `items`: Array<{label: string, value: any}> - Opções do menu.
    - `onSelect`: (value: any) => void - Função chamada ao selecionar um item.
    - `placeholder`: string (opcional) - Texto de placeholder.
- **Exemplo**:
    ```tsx
    <DropdownMenu
        items={[{label: 'Opção 1', value: 1}]}
        onSelect={handleSelect}
    />
    ```

#### form.tsx

- **Uso**: Componente de formulário com validação integrada.
- **Props**:
    - `onSubmit`: (data: FormData) => void - Função chamada ao enviar o formulário.
    - `children`: React.ReactNode - Campos do formulário.
- **Exemplo**:
    ```tsx
    <Form onSubmit={handleSubmit}>
        <Input name="email" />
        <Button type="submit">Enviar</Button>
    </Form>
    ```

#### input.tsx

- **Uso**: Campo de entrada de texto genérico.
- **Props**:
    - `value`: string - Valor atual do input.
    - `onChange`: (value: string) => void - Função chamada ao alterar o valor.
    - `type`: string - Tipo do input (text, email, password, etc.).
    - `placeholder`: string (opcional) - Texto de placeholder.
- **Exemplo**:
    ```tsx
    <Input
        value={email}
        onChange={setEmail}
        type="email"
        placeholder="Digite seu email"
    />
    ```

#### multi_select_custom.tsx

- **Uso**: Componente para seleção múltipla personalizada.
- **Props**:
    - `options`: Array<{label: string, value: any}> - Opções disponíveis.
    - `selectedValues`: any[] - Valores selecionados.
    - `onChange`: (values: any[]) => void - Função chamada ao alterar seleção.
- **Exemplo**:
    ```tsx
    <MultiSelectCustom
        options={[{label: 'Item 1', value: 1}]}
        selectedValues={selected}
        onChange={setSelected}
    />
    ```

#### progress_indicator.tsx

- **Uso**: Indicador de progresso para formulários.
- **Props**:
    - `currentStep`: number - Passo atual.
    - `totalSteps`: number - Total de passos.
    - `stepLabels`: string[] (opcional) - Rótulos para cada passo.
- **Exemplo**:
    ```tsx
    <ProgressIndicator
        currentStep={2}
        totalSteps={5}
        stepLabels={['Início', 'Dados', 'Confirmação']}
    />
    ```

#### radio-checkbox.tsx

- **Uso**: Componente híbrido de radio button e checkbox.
- **Props**:
    - `type`: 'radio' | 'checkbox' - Tipo do controle.
    - `checked`: boolean - Estado atual.
    - `onChange`: (checked: boolean) => void - Função de callback.
- **Exemplo**:
    ```tsx
    <RadioCheckbox type="radio" checked={selected} onChange={setSelected} />
    ```

#### radio-group.tsx

- **Uso**: Grupo de botões radio.
- **Props**:
    - `options`: Array<{label: string, value: any}> - Opções do grupo.
    - `value`: any - Valor selecionado.
    - `onChange`: (value: any) => void - Função chamada ao selecionar.
- **Exemplo**:
    ```tsx
    <RadioGroup
        options={[{label: 'Sim', value: true}, {label: 'Não', value: false}]}
        value={answer}
        onChange={setAnswer}
    />
    ```

#### select_input.tsx

- **Uso**: Campo de seleção estilizado.
- **Props**:
    - `options`: Array<{label: string, value: any}> - Opções disponíveis.
    - `value`: any - Valor selecionado.
    - `onChange`: (value: any) => void - Função de callback.
- **Exemplo**:
    ```tsx
    <SelectInput
        options={cityOptions}
        value={selectedCity}
        onChange={setSelectedCity}
    />
    ```

#### text_input.tsx

- **Uso**: Campo de entrada de texto com estilização personalizada.
- **Props**:
    - `value`: string - Valor atual.
    - `onChange`: (value: string) => void - Função de callback.
    - `multiline`: boolean (opcional) - Define se é textarea.
- **Exemplo**:
    ```tsx
    <TextInput
        value={description}
        onChange={setDescription}
        multiline={true}
    />
    ```

#### wheel-picker.tsx

- **Uso**: Seletor em formato de roda/cilindro.
- **Props**:
    - `options`: string[] - Opções disponíveis.
    - `selectedIndex`: number - Índice selecionado.
    - `onChange`: (index: number) => void - Função de callback.
- **Exemplo**:
    ```tsx
    <WheelPicker
        options={['Janeiro', 'Fevereiro', 'Março']}
        selectedIndex={currentMonth}
        onChange={setCurrentMonth}
    />
    ```

### Diretório `ui/`

#### accordion.tsx

- **Uso**: Componente de acordeão para exibir e ocultar conteúdo.
- **Props**:
    - `title`: string - Título do acordeão.
    - `isOpen`: boolean (opcional) - Define se está aberto por padrão.
    - `onToggle`: () => void (opcional) - Função chamada ao abrir/fechar.
    - `children`: React.ReactNode - Conteúdo do acordeão.
- **Exemplo**:
    ```tsx
    <Accordion title="Detalhes" isOpen={false}>
        <p>Conteúdo do acordeão</p>
    </Accordion>
    ```

#### alert-dialog.tsx

- **Uso**: Diálogo de alerta para confirmações e avisos importantes.
- **Props**:
    - `isOpen`: boolean - Define se o diálogo está visível.
    - `onClose`: () => void - Função chamada ao fechar.
    - `title`: string - Título do diálogo.
    - `description`: string - Descrição/mensagem.
    - `onConfirm`: () => void (opcional) - Função de confirmação.
- **Exemplo**:
    ```tsx
    <AlertDialog
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
        title="Confirmar exclusão"
        description="Esta ação não pode ser desfeita."
        onConfirm={handleDelete}
    />
    ```

#### alert.tsx

- **Uso**: Componente de alerta para exibir mensagens de status.
- **Props**:
    - `variant`: 'default' | 'destructive' | 'success' | 'warning' - Tipo do alerta.
    - `title`: string (opcional) - Título do alerta.
    - `children`: React.ReactNode - Conteúdo da mensagem.
- **Exemplo**:
    ```tsx
    <Alert variant="success" title="Sucesso">
        Operação realizada com sucesso!
    </Alert>
    ```

#### aux_icons.tsx

- **Uso**: Conjunto de ícones auxiliares personalizados para a aplicação.
- **Props**:
    - `name`: string - Nome do ícone.
    - `size`: number (opcional) - Tamanho do ícone.
    - `color`: string (opcional) - Cor do ícone.
- **Exemplo**:
    ```tsx
    <AuxIcon name="health" size={24} color="var(--primary)" />
    ```

#### avatar.tsx

- **Uso**: Componente para exibir avatares de usuários.
- **Props**:
    - `src`: string (opcional) - URL da imagem.
    - `alt`: string - Texto alternativo.
    - `fallback`: string - Texto de fallback (iniciais).
    - `size`: 'sm' | 'md' | 'lg' | 'xl' - Tamanho do avatar.
- **Exemplo**:
    ```tsx
    <Avatar
        src="/avatar.jpg"
        alt="João Silva"
        fallback="JS"
        size="lg"
    />
    ```

#### back_arrow.tsx

- **Uso**: Componente de seta para navegação de volta.
- **Props**:
    - `onClick`: () => void - Função chamada ao clicar.
    - `variant`: 'default' | 'light' | 'dark' - Estilo da seta.
- **Exemplo**:
    ```tsx
    <BackArrow onClick={() => navigate(-1)} variant="light" />
    ```

#### badge.tsx

- **Uso**: Componente de badge para exibir status ou contadores.
- **Props**:
    - `variant`: 'default' | 'secondary' | 'destructive' | 'outline' - Estilo do badge.
    - `children`: React.ReactNode - Conteúdo do badge.
- **Exemplo**:
    ```tsx
    <Badge variant="destructive">Urgente</Badge>
    ```

#### bottom-sheet.tsx

- **Uso**: Modal que desliza de baixo para cima.
- **Props**:
    - `isOpen`: boolean - Define se está visível.
    - `onClose`: () => void - Função de fechamento.
    - `title`: string (opcional) - Título do bottom sheet.
    - `children`: React.ReactNode - Conteúdo.
- **Exemplo**:
    ```tsx
    <BottomSheet isOpen={showSheet} onClose={() => setShowSheet(false)}>
        <p>Conteúdo do bottom sheet</p>
    </BottomSheet>
    ```

#### calendar.tsx

- **Uso**: Componente de calendário para seleção de datas.
- **Props**:
    - `selectedDate`: Date - Data selecionada.
    - `onDateSelect`: (date: Date) => void - Função de seleção.
    - `mode`: 'single' | 'multiple' | 'range' - Modo de seleção.
- **Exemplo**:
    ```tsx
    <Calendar
        selectedDate={new Date()}
        onDateSelect={setSelectedDate}
        mode="single"
    />
    ```

#### card.tsx

- **Uso**: Componente de cartão para agrupar conteúdo.
- **Props**:
    - `className`: string (opcional) - Classes CSS adicionais.
    - `children`: React.ReactNode - Conteúdo do cartão.
- **Exemplo**:
    ```tsx
    <Card className="p-4">
        <CardHeader>
            <CardTitle>Título</CardTitle>
        </CardHeader>
        <CardContent>Conteúdo</CardContent>
    </Card>
    ```

#### carousel.tsx

- **Uso**: Componente de carrossel para exibir múltiplos itens.
- **Props**:
    - `items`: React.ReactNode[] - Itens do carrossel.
    - `autoPlay`: boolean (opcional) - Reprodução automática.
    - `interval`: number (opcional) - Intervalo entre slides.
- **Exemplo**:
    ```tsx
    <Carousel
        items={[<div>Slide 1</div>, <div>Slide 2</div>]}
        autoPlay={true}
        interval={3000}
    />
    ```

#### confirmDialog.tsx

- **Uso**: Diálogo de confirmação para ações importantes.
- **Props**:
    - `isOpen`: boolean - Define se está visível.
    - `onClose`: () => void - Função de fechamento.
    - `onConfirm`: () => void - Função de confirmação.
    - `title`: string - Título do diálogo.
    - `message`: string - Mensagem de confirmação.
- **Exemplo**:
    ```tsx
    <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirm}
        title="Confirmar ação"
        message="Tem certeza que deseja continuar?"
    />
    ```

#### ContinueButton.tsx

- **Uso**: Botão estilizado para continuar fluxos.
- **Props**:
    - `onClick`: () => void - Função de clique.
    - `disabled`: boolean (opcional) - Estado desabilitado.
    - `children`: React.ReactNode - Texto do botão.
- **Exemplo**:
    ```tsx
    <ContinueButton onClick={handleNext} disabled={!isValid}>
        Continuar
    </ContinueButton>
    ```

#### dialog.tsx

- **Uso**: Componente de diálogo modal genérico.
- **Props**:
    - `isOpen`: boolean - Define se está visível.
    - `onClose`: () => void - Função de fechamento.
    - `children`: React.ReactNode - Conteúdo do diálogo.
- **Exemplo**:
    ```tsx
    <Dialog isOpen={showDialog} onClose={() => setShowDialog(false)}>
        <DialogContent>Conteúdo</DialogContent>
    </Dialog>
    ```

#### drawer.tsx

- **Uso**: Gaveta deslizante para navegação ou conteúdo adicional.
- **Props**:
    - `isOpen`: boolean - Define se está aberta.
    - `onClose`: () => void - Função de fechamento.
    - `side`: 'left' | 'right' | 'top' | 'bottom' - Lado de abertura.
    - `children`: React.ReactNode - Conteúdo da gaveta.
- **Exemplo**:
    ```tsx
    <Drawer isOpen={showDrawer} onClose={() => setShowDrawer(false)} side="left">
        <nav>Menu de navegação</nav>
    </Drawer>
    ```

#### error-message.tsx

- **Uso**: Componente para exibir mensagens de erro.
- **Props**:
    - `message`: string - Mensagem de erro.
    - `details`: string (opcional) - Detalhes adicionais.
- **Exemplo**:
    ```tsx
    <ErrorMessage
        message="Erro ao carregar dados"
        details="Verifique sua conexão"
    />
    ```

#### file-uploader.tsx

- **Uso**: Componente para upload de arquivos com drag & drop.
- **Props**:
    - `onUpload`: (files: File[]) => void - Função de upload.
    - `accept`: string (opcional) - Tipos de arquivo aceitos.
    - `multiple`: boolean (opcional) - Múltiplos arquivos.
    - `maxSize`: number (opcional) - Tamanho máximo em bytes.
- **Exemplo**:
    ```tsx
    <FileUploader
        onUpload={handleUpload}
        accept="image/*"
        multiple={false}
        maxSize={5000000}
    />
    ```

#### google-signin.tsx

- **Uso**: Botão de autenticação com Google integrado.
- **Props**:
    - `onSuccess`: (response: GoogleResponse) => void - Callback de sucesso.
    - `onError`: (error: string) => void - Callback de erro.
    - `disabled`: boolean (opcional) - Estado desabilitado.
- **Exemplo**:
    ```tsx
    <GoogleSignIn
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
    />
    ```

#### habit-card.tsx

- **Uso**: Cartão para exibir informações de hábitos.
- **Props**:
    - `habit`: Habit - Objeto do hábito.
    - `progress`: number - Progresso (0-100).
    - `onClick`: () => void (opcional) - Função de clique.
- **Exemplo**:
    ```tsx
    <HabitCard
        habit={dailyHabit}
        progress={75}
        onClick={() => navigate('/habit/details')}
    />
    ```

#### header.tsx

- **Uso**: Cabeçalho de página ou seção.
- **Props**:
    - `title`: string - Título principal.
    - `subtitle`: string (opcional) - Subtítulo.
    - `actions`: React.ReactNode (opcional) - Ações do cabeçalho.
- **Exemplo**:
    ```tsx
    <Header
        title="Dashboard"
        subtitle="Bem-vindo de volta"
        actions={<Button>Novo</Button>}
    />
    ```

#### home-banner.tsx

- **Uso**: Banner principal da página inicial.
- **Props**:
    - `title`: string - Título do banner.
    - `description`: string - Descrição.
    - `imageSrc`: string (opcional) - URL da imagem.
    - `onAction`: () => void (opcional) - Ação principal.
- **Exemplo**:
    ```tsx
    <HomeBanner
        title="Bem-vindo ao App Saúde"
        description="Cuide da sua saúde mental"
        onAction={() => navigate('/dashboard')}
    />
    ```

#### icon-button.tsx

- **Uso**: Botão circular apenas com ícone.
- **Props**:
    - `icon`: React.ReactNode - Ícone do botão.
    - `onClick`: () => void - Função de clique.
    - `variant`: 'default' | 'ghost' | 'outline' - Estilo.
    - `size`: 'sm' | 'md' | 'lg' - Tamanho.
- **Exemplo**:
    ```tsx
    <IconButton
        icon={<Plus />}
        onClick={handleAdd}
        variant="default"
        size="md"
    />
    ```

#### info-card.tsx

- **Uso**: Cartão informativo com ícone e texto.
- **Props**:
    - `title`: string - Título do cartão.
    - `description`: string - Descrição.
    - `icon`: React.ReactNode (opcional) - Ícone.
    - `onClick`: () => void (opcional) - Ação de clique.
- **Exemplo**:
    ```tsx
    <InfoCard
        title="Consultas Hoje"
        description="3 consultas agendadas"
        icon={<Calendar />}
        onClick={() => navigate('/appointments')}
    />
    ```

#### interests-selector.tsx

- **Uso**: Seletor de áreas de interesse em grid.
- **Props**:
    - `items`: ItemType[] - Lista de interesses disponíveis.
    - `onSelectionChange`: (selected: (string|number)[]) => void - Callback de seleção.
- **Exemplo**:
    ```tsx
    <InterestsSelector
        items={interestsList}
        onSelectionChange={setSelectedInterests}
    />
    ```

#### label.tsx

- **Uso**: Componente de rótulo para formulários.
- **Props**:
    - `htmlFor`: string (opcional) - ID do elemento associado.
    - `children`: React.ReactNode - Texto do rótulo.
- **Exemplo**:
    ```tsx
    <Label htmlFor="email">Email</Label>
    ```

#### labeled-switch.tsx

- **Uso**: Interruptor com rótulo integrado.
- **Props**:
    - `label`: string - Texto do rótulo.
    - `checked`: boolean - Estado atual.
    - `onChange`: (checked: boolean) => void - Função de mudança.
    - `disabled`: boolean (opcional) - Estado desabilitado.
- **Exemplo**:
    ```tsx
    <LabeledSwitch
        label="Receber notificações"
        checked={notifications}
        onChange={setNotifications}
    />
    ```

#### navigator-bar.tsx

- **Uso**: Barra de navegação inferior da aplicação.
- **Props**:
    - `items`: NavigationItem[] - Itens de navegação.
    - `activeIndex`: number - Índice do item ativo.
    - `onItemSelect`: (index: number) => void - Função de seleção.
- **Exemplo**:
    ```tsx
    <NavigatorBar
        items={navItems}
        activeIndex={currentTab}
        onItemSelect={setCurrentTab}
    />
    ```

#### patient-button.tsx

- **Uso**: Botão específico para ações relacionadas a pacientes.
- **Props**:
    - `patient`: Patient - Dados do paciente.
    - `action`: 'view' | 'edit' | 'delete' - Tipo da ação.
    - `onClick`: (patient: Patient) => void - Função de clique.
- **Exemplo**:
    ```tsx
    <PatientButton
        patient={patientData}
        action="view"
        onClick={handlePatientView}
    />
    ```

#### popover.tsx

- **Uso**: Popover para exibir conteúdo adicional.
- **Props**:
    - `trigger`: React.ReactNode - Elemento que ativa o popover.
    - `content`: React.ReactNode - Conteúdo do popover.
    - `side`: 'top' | 'right' | 'bottom' | 'left' - Posição.
- **Exemplo**:
    ```tsx
    <Popover
        trigger={<Button>Mais info</Button>}
        content={<div>Informações adicionais</div>}
        side="top"
    />
    ```

#### profile-banner.tsx

- **Uso**: Banner de perfil do usuário.
- **Props**:
    - `user`: User - Dados do usuário.
    - `onEdit`: () => void (opcional) - Função de edição.
- **Exemplo**:
    ```tsx
    <ProfileBanner
        user={currentUser}
        onEdit={() => navigate('/profile/edit')}
    />
    ```

#### ProgressIndicator.tsx

- **Uso**: Indicador de progresso circular ou linear.
- **Props**:
    - `progress`: number - Valor do progresso (0-100).
    - `type`: 'circular' | 'linear' - Tipo do indicador.
    - `size`: 'sm' | 'md' | 'lg' - Tamanho.
- **Exemplo**:
    ```tsx
    <ProgressIndicator
        progress={65}
        type="circular"
        size="md"
    />
    ```

#### reminder-card.tsx

- **Uso**: Cartão para exibir lembretes.
- **Props**:
    - `reminder`: Reminder - Dados do lembrete.
    - `onComplete`: (id: string) => void - Marcar como completo.
    - `onEdit`: (reminder: Reminder) => void (opcional) - Editar lembrete.
- **Exemplo**:
    ```tsx
    <ReminderCard
        reminder={dailyReminder}
        onComplete={markAsComplete}
        onEdit={handleEdit}
    />
    ```

#### select.tsx

- **Uso**: Componente select customizado.
- **Props**:
    - `options`: SelectOption[] - Opções disponíveis.
    - `value`: any - Valor selecionado.
    - `onChange`: (value: any) => void - Função de mudança.
    - `placeholder`: string (opcional) - Texto de placeholder.
- **Exemplo**:
    ```tsx
    <Select
        options={cityOptions}
        value={selectedCity}
        onChange={setSelectedCity}
        placeholder="Selecione uma cidade"
    />
    ```

#### select_habit.tsx

- **Uso**: Seletor específico para hábitos.
- **Props**:
    - `habits`: Habit[] - Lista de hábitos.
    - `selectedHabits`: string[] - Hábitos selecionados.
    - `onSelectionChange`: (habits: string[]) => void - Callback de seleção.
- **Exemplo**:
    ```tsx
    <SelectHabit
        habits={availableHabits}
        selectedHabits={userHabits}
        onSelectionChange={setUserHabits}
    />
    ```

#### selectable-button.tsx

- **Uso**: Botão que mantém estado de selecionado.
- **Props**:
    - `selected`: boolean - Estado de seleção.
    - `onClick`: () => void - Função de clique.
    - `children`: React.ReactNode - Conteúdo do botão.
- **Exemplo**:
    ```tsx
    <SelectableButton
        selected={isSelected}
        onClick={() => setIsSelected(!isSelected)}
    >
        Opção 1
    </SelectableButton>
    ```

#### skeleton.tsx

- **Uso**: Componente de carregamento skeleton.
- **Props**:
    - `className`: string (opcional) - Classes CSS.
    - `variant`: 'text' | 'circular' | 'rectangular' - Tipo.
- **Exemplo**:
    ```tsx
    <Skeleton variant="text" className="h-4 w-32" />
    ```

#### slider.tsx

- **Uso**: Controle deslizante para valores numéricos.
- **Props**:
    - `value`: number[] - Valor(es) atual(is).
    - `onChange`: (value: number[]) => void - Função de mudança.
    - `min`: number - Valor mínimo.
    - `max`: number - Valor máximo.
    - `step`: number (opcional) - Incremento.
- **Exemplo**:
    ```tsx
    <Slider
        value={[50]}
        onChange={setValue}
        min={0}
        max={100}
        step={1}
    />
    ```

#### success-message.tsx

- **Uso**: Componente para exibir mensagens de sucesso.
- **Props**:
    - `message`: string - Mensagem de sucesso.
    - `onClose`: () => void (opcional) - Função de fechamento.
- **Exemplo**:
    ```tsx
    <SuccessMessage
        message="Dados salvos com sucesso!"
        onClose={() => setShowSuccess(false)}
    />
    ```

#### switch.tsx

- **Uso**: Componente de interruptor (toggle).
- **Props**:
    - `checked`: boolean - Estado atual.
    - `onChange`: (checked: boolean) => void - Função de mudança.
    - `disabled`: boolean (opcional) - Estado desabilitado.
- **Exemplo**:
    ```tsx
    <Switch
        checked={isEnabled}
        onChange={setIsEnabled}
    />
    ```

#### tabs.tsx

- **Uso**: Componente de navegação por abas.
- **Props**:
    - `tabs`: TabItem[] - Lista de abas.
    - `activeTab`: string - Aba ativa.
    - `onTabChange`: (tabId: string) => void - Função de mudança.
- **Exemplo**:
    ```tsx
    <Tabs
        tabs={[
            {id: 'tab1', label: 'Aba 1', content: <div>Conteúdo 1</div>}
        ]}
        activeTab="tab1"
        onTabChange={setActiveTab}
    />
    ```

#### task-bar.tsx

- **Uso**: Barra de progresso para tarefas.
- **Props**:
    - `tasks`: Task[] - Lista de tarefas.
    - `onTaskToggle`: (taskId: string) => void - Alternar tarefa.
- **Exemplo**:
    ```tsx
    <TaskBar
        tasks={dailyTasks}
        onTaskToggle={handleTaskToggle}
    />
    ```

#### text_input_diary.tsx

- **Uso**: Campo de texto especial para entradas de diário.
- **Props**:
    - `value`: string - Conteúdo atual.
    - `onChange`: (value: string) => void - Função de mudança.
    - `placeholder`: string (opcional) - Texto de placeholder.
- **Exemplo**:
    ```tsx
    <TextInputDiary
        value={diaryEntry}
        onChange={setDiaryEntry}
        placeholder="Como foi seu dia hoje?"
    />
    ```

#### textarea.tsx

- **Uso**: Área de texto redimensionável.
- **Props**:
    - `value`: string - Valor atual.
    - `onChange`: (value: string) => void - Função de mudança.
    - `rows`: number (opcional) - Número de linhas.
    - `placeholder`: string (opcional) - Texto de placeholder.
- **Exemplo**:
    ```tsx
    <Textarea
        value={comment}
        onChange={setComment}
        rows={4}
        placeholder="Digite seu comentário"
    />
    ```

#### ViewButton.tsx

- **Uso**: Botão estilizado para ações de visualização.
- **Props**:
    - `onClick`: () => void - Função de clique.
    - `children`: React.ReactNode - Conteúdo do botão.
- **Exemplo**:
    ```tsx
    <ViewButton onClick={() => navigate('/view')}>
        Ver Detalhes
    </ViewButton>
    ```

## Padrões e Organização

### Estrutura de Arquivos

O diretório de componentes está organizado da seguinte forma:

```
src/components/
├── EditInterestsDialog.tsx     # Componentes específicos da aplicação
├── ProtectedRoute.tsx          # Utilitários de roteamento
├── SplashScreen.tsx            # Telas especiais
├── forms/                      # Componentes de formulário
│   ├── button.tsx
│   ├── input.tsx
│   ├── checkbox.tsx
│   └── ...
└── ui/                         # Componentes de interface
    ├── card.tsx
    ├── dialog.tsx
    ├── avatar.tsx
    └── ...
```

### Convenções de Nomenclatura

- **Arquivos**: kebab-case ou PascalCase dependendo do tipo
- **Componentes**: PascalCase
- **Props**: camelCase
- **Funções de callback**: padrão `on` + ação (ex: `onClick`, `onChange`)

### Padrões de Props

#### Props Comuns
- `className`: string (opcional) - Classes CSS adicionais
- `children`: React.ReactNode - Conteúdo filho
- `disabled`: boolean (opcional) - Estado desabilitado
- `onClick`: () => void - Função de clique

#### Props de Estado
- `isOpen`: boolean - Para modais e dialogs
- `checked`: boolean - Para inputs de seleção
- `selected`: boolean - Para elementos selecionáveis
- `value`: any - Valor atual do componente

#### Props de Callback
- `onChange`: (value: any) => void - Mudança de valor
- `onSelect`: (item: any) => void - Seleção de item
- `onClose`: () => void - Fechamento de modal/dialog
- `onSubmit`: (data: any) => void - Envio de formulário

### Variantes de Estilo

Muitos componentes seguem o padrão de variantes usando `class-variance-authority`:

```tsx
// Exemplo de variantes comuns
variant: 'default' | 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost'
size: 'sm' | 'md' | 'lg' | 'xl'
```

### Integração com Tailwind CSS

Todos os componentes utilizam as classes customizadas definidas no sistema de design:

- Cores: `bg-primary`, `text-typography`, `border-gray2`
- Tipografia: `text-titulo`, `text-button-primary`
- Sombras: `shadow-button-soft`, `shadow-hover`
- Animações: `animate-hover-float`, `transition-button-smooth`

### Dependências Principais

- **Radix UI**: Componentes base acessíveis
- **Lucide React**: Ícones
- **Class Variance Authority**: Variantes de estilo
- **React Hook Form**: Gerenciamento de formulários (onde aplicável)

### Exemplo de Uso Completo

```tsx
import { Button } from '@/components/forms/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

function UserProfile({ user, onEdit }) {
  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <Avatar
          src={user.avatar}
          alt={user.name}
          fallback={user.initials}
          size="lg"
        />
        <h2 className="text-titulo">{user.name}</h2>
        <Badge variant="secondary">{user.role}</Badge>
      </CardHeader>
      <CardContent>
        <Button
          variant="gradientSave"
          size="lg"
          onClick={onEdit}
          className="w-full"
        >
          Editar Perfil
        </Button>
      </CardContent>
    </Card>
  );
}
```
