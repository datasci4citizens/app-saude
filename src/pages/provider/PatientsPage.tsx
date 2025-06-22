return (
  <div className="flex flex-col h-screen bg-homebg">
    <Header
      title="Gerenciar Pacientes"
      subtitle={`${patients.length} ${patients.length === 1 ? "paciente" : "pacientes"} vinculados`}
    />

    <div className="flex-1 overflow-hidden bg-background rounded-t-3xl mt-4 relative z-10">
      <div className="h-full overflow-y-auto">
        <div className="px-4 py-6 pb-24"> {/* Added pb-24 for navigation space */}
          {/* Messages */}
          <div className="space-y-4 mb-6">
            {success && (
              <SuccessMessage
                message={success}
                onClose={clearSuccess}
                className="animate-in slide-in-from-top-2 duration-300"
              />
            )}

            {error && (
              <ErrorMessage
                message={error}
                onClose={clearError}
                onRetry={() => fetchPatients()}
                variant="destructive"
                className="animate-in slide-in-from-top-2 duration-300"
              />
            )}
          </div>
          
          {/* Quick Actions */}
          <div className="flex gap-3 mb-6">
            <Button
              variant="orange"
              size="sm"
              onClick={() => setShowLinkSection(!showLinkSection)}
              className="flex items-center gap-2"
            >
              <span className="text-lg">➕</span>
              Conectar paciente
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => fetchPatients()}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <span className="text-lg">🔄</span>
              {loading ? "Atualizando..." : "Atualizar"}
            </Button>
          </div>
          
          {/* Link Code Section */}
          {showLinkSection && (
            <div className="bg-card rounded-2xl p-5 border border-card-border mb-6 animate-in slide-in-from-top-2 duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-accent1/20 rounded-full flex items-center justify-center">
                  <span className="text-lg">🔗</span>
                </div>
                <div>
                  <h3 className="text-card-foreground font-semibold text-base">
                    Código de Vinculação
                  </h3>
                  <p className="text-gray2 text-sm">
                    Gere um código para o paciente se conectar
                  </p>
                </div>
              </div>
          
              {linkCode ? (
                <div className="space-y-4">
                  <div className="bg-selection/10 rounded-xl p-4 border border-selection/20">
                    <div className="text-center">
                      <p className="text-selection font-bold text-3xl font-mono tracking-wider mb-2">
                        {linkCode}
                      </p>
                      <p className="text-selection/80 text-sm">
                        ⏰ Expira em 10 minutos
                      </p>
                    </div>
                  </div>
              
                  <div className="flex gap-2">
                    <Button
                      onClick={copyToClipboard}
                      variant="orange"
                      className="flex-1"
                    >
                      📋 Copiar código
                    </Button>
                    <Button
                      onClick={() => setLinkCode(null)}
                      variant="ghost"
                      className="flex-1"
                    >
                      🔄 Novo código
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  onClick={generateLinkCode}
                  variant="orange"
                  size="full"
                  disabled={isGeneratingCode}
                  className="h-12"
                >
                  {isGeneratingCode ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white"></div>
                      Gerando código...
                    </div>
                  ) : (
                    "🎯 Gerar código de conexão"
                  )}
                </Button>
              )}
            </div>
          )}

          {/* Search */}
          <div className="mb-6">
            <TextField
              id="search"
              name="search"
              label="Buscar pacientes"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Digite o nome do paciente..."
              className="w-full"
            />
          </div>

          {/* Tabs */}
          <div className="flex bg-card rounded-xl p-1 mb-6 border border-card-border">
            <button
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === "todos"
                  ? "bg-selection text-white shadow-sm"
                  : "text-gray2 hover:text-card-foreground hover:bg-card-muted"
              }`}
              onClick={() => setActiveTab("todos")}
            >
              Todos ({patients.length})
            </button>
            <button
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 relative ${
                activeTab === "requer ajuda"
                  ? "bg-destructive text-white shadow-sm"
                  : "text-gray2 hover:text-card-foreground hover:bg-card-muted"
              }`}
              onClick={() => setActiveTab("requer ajuda")}
            >
              🚨 Requerem ajuda ({urgentCount})
              {urgentCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full animate-pulse"></span>
              )}
            </button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-selection/20 border-t-selection mb-4"></div>
              <p className="text-gray2 text-sm">Carregando pacientes...</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && sortedPatients.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-24 h-24 bg-gray2/10 rounded-full flex items-center justify-center mb-6">
                <span className="text-4xl">
                  {searchValue ? "🔍" : activeTab === "requer ajuda" ? "🚨" : "👥"}
                </span>
              </div>
              <h3 className="text-typography font-semibold text-lg mb-3">
                {searchValue
                  ? "Nenhum paciente encontrado"
                  : activeTab === "requer ajuda"
                    ? "Nenhum paciente precisa de ajuda"
                    : "Nenhum paciente vinculado"}
              </h3>
              <p className="text-gray2 text-sm mb-6 max-w-sm">
                {searchValue
                  ? `Não encontramos pacientes com "${searchValue}"`
                  : activeTab === "requer ajuda"
                    ? "Todos os pacientes estão bem no momento"
                    : "Você ainda não possui pacientes vinculados"}
              </p>
              {!searchValue && activeTab === "todos" && (
                <Button
                  variant="orange"
                  onClick={() => setShowLinkSection(true)}
                  className="px-8"
                >
                  <span className="mr-2">➕</span>
                  Conectar primeiro paciente
                </Button>
              )}
            </div>
          )}

          {/* Patients List */}
          {!loading && sortedPatients.length > 0 && (
            <div className="space-y-4">
              {sortedPatients.map((patient) => (
                <div
                  key={patient.id}
                  className={`bg-card rounded-2xl p-5 border transition-all duration-200 hover:shadow-sm cursor-pointer ${
                    patient.urgent
                      ? "border-destructive/30 bg-destructive/5"
                      : "border-card-border hover:border-selection/20"
                  }`}
                  onClick={() => navigate(`/provider/patient/${patient.id}`)}
                >
                  {/* ... existing patient card content ... */}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>

    {/* Fixed bottom navigation */}
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <BottomNavigationBar
        variant="acs"
        forceActiveId={getActiveNavId()}
        onItemClick={handleNavigationClick}
      />
    </div>
  </div>
);