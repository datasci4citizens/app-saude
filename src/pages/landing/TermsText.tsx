const TermsText = () => {
  return (
    <div className="space-y-6 text-desc-titulo font-inter leading-relaxed">
      {/* Título Principal */}
      <div className="text-center mb-8">
        <h2 className="text-titulo font-work-sans text-white mb-4 leading-tight">
          TERMO DE CONSENTIMENTO LIVRE E ESCLARECIDO
        </h2>
        <div className="w-16 h-1 bg-white/60 mx-auto rounded-full"></div>
      </div>

      {/* Projeto */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
        <h3 className="text-topicos2 font-work-sans text-white mb-3 leading-tight">
          Projeto SAÚDE!: Suporte Móvel para Facilitar o Engajamento com os
          Serviços, o Bem-Estar Físico e a Recuperação de Pessoas com Transtorno
          Mental Severo no Brasil
        </h3>
      </div>

      {/* Pesquisadores */}
      <div>
        <h4 className="text-topicos font-work-sans text-white mb-3 flex items-center">
          <span className="w-2 h-2 bg-accent1 rounded-full mr-2"></span>
          Pesquisadores Responsáveis:
        </h4>
        <div className="bg-white/5 rounded-lg p-4 space-y-2">
          <p className="text-white/90 font-inter text-campos-preenchimento2">
            • Dr. Carlos Treichel (USP)
          </p>
          <p className="text-white/90 font-inter text-campos-preenchimento2">
            • Dr. Mark Costa (Yale University)
          </p>
          <p className="text-white/90 font-inter text-campos-preenchimento2">
            • Profa. Dra. Heloísa Garcia Claro Fernandes (UNICAMP)
          </p>
          <p className="text-white/90 font-inter text-campos-preenchimento2">
            • Profa. Dra. Maria Giovana Borges Saidel (UNICAMP)
          </p>
        </div>
      </div>

      {/* CAAE */}
      <div className="bg-accent1/20 border border-accent1/30 rounded-lg p-4">
        <p className="text-topicos font-inter text-white">
          Número do CAAE:{" "}
          <span className="text-white/80 font-normal text-campos-preenchimento2">
            (inserir após aprovação pelo CEP)
          </span>
        </p>
      </div>

      {/* Introdução */}
      <div>
        <p className="text-white/90 font-inter text-campos-preenchimento leading-relaxed">
          Você está sendo convidado(a) a participar de uma pesquisa. Este
          documento, chamado Termo de Consentimento Livre e Esclarecido, visa
          assegurar seus direitos como participante da pesquisa. Ele é elaborado
          em duas vias, assinadas e rubricadas pelo pesquisador e pelo
          participante/responsável legal, sendo que uma via deverá ficar com
          você e outra com o pesquisador.
        </p>
      </div>

      {/* Justificativa e Objetivos */}
      <div>
        <h4 className="text-topicos font-work-sans text-white mb-3 flex items-center">
          <span className="w-2 h-2 bg-accent2 rounded-full mr-2"></span>
          Justificativa e objetivos:
        </h4>
        <div className="bg-white/5 rounded-lg p-4">
          <p className="text-white/90 font-inter text-campos-preenchimento leading-relaxed">
            Este estudo tem como objetivo desenvolver, testar e avaliar um
            aplicativo de celular chamado{" "}
            <strong className="text-white">SAÚDE!</strong>, voltado para apoiar
            o cuidado integral de pessoas com transtorno mental severo,
            promovendo o bem-estar físico, o autocuidado e o engajamento com os
            serviços da Rede de Atenção Psicossocial (RAPS) e da Atenção Básica.
          </p>
        </div>
      </div>

      {/* Procedimentos */}
      <div>
        <h4 className="text-topicos font-work-sans text-white mb-3 flex items-center">
          <span className="w-2 h-2 bg-yellow rounded-full mr-2"></span>
          Procedimentos:
        </h4>
        <p className="text-white/90 font-inter text-campos-preenchimento mb-3">
          Você poderá ser convidado(a) a:
        </p>
        <div className="bg-white/5 rounded-lg p-4">
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-accent1 rounded-full mr-3 mt-2 flex-shrink-0"></span>
              <span className="text-white/90 font-inter text-campos-preenchimento2">
                Utilizar o aplicativo SAÚDE! por um período definido (ex: 6
                semanas);
              </span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-accent1 rounded-full mr-3 mt-2 flex-shrink-0"></span>
              <span className="text-white/90 font-inter text-campos-preenchimento2">
                Responder a questionários sobre usabilidade, experiência de uso
                e impacto percebido;
              </span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-accent1 rounded-full mr-3 mt-2 flex-shrink-0"></span>
              <span className="text-white/90 font-inter text-campos-preenchimento2">
                Participar de grupos focais com usuários ou profissionais de
                saúde;
              </span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-accent1 rounded-full mr-3 mt-2 flex-shrink-0"></span>
              <span className="text-white/90 font-inter text-campos-preenchimento2">
                Participar de entrevistas com a equipe de pesquisa sobre a
                implementação e melhorias no app.
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Nota Importante */}
      <div className="bg-yellow/20 border border-yellow/40 rounded-lg p-4">
        <p className="text-white font-inter text-campos-preenchimento font-medium">
          ⚠️ A participação é voluntária e pode ser interrompida a qualquer
          momento, sem prejuízo ao seu atendimento nos serviços de saúde.
        </p>
      </div>

      {/* Riscos e Desconfortos */}
      <div>
        <h4 className="text-topicos font-work-sans text-white mb-3 flex items-center">
          <span className="w-2 h-2 bg-destructive rounded-full mr-2"></span>
          Riscos e desconfortos:
        </h4>
        <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
          <p className="text-white/90 font-inter text-campos-preenchimento leading-relaxed">
            Pode haver desconforto ao relatar experiências pessoais. As
            entrevistas e grupos serão realizados com privacidade. Se houver
            qualquer sofrimento emocional, o participante será orientado(a) a
            buscar suporte na equipe do CAPS ou UBS.
          </p>
        </div>
      </div>

      {/* Benefícios */}
      <div>
        <h4 className="text-topicos font-work-sans text-white mb-3 flex items-center">
          <span className="w-2 h-2 bg-success rounded-full mr-2"></span>
          Benefícios:
        </h4>
        <div className="bg-success/10 border border-success/30 rounded-lg p-4">
          <p className="text-white/90 font-inter text-campos-preenchimento leading-relaxed">
            Contribuir com o desenvolvimento de uma ferramenta de apoio à saúde
            mental e física. Embora não haja benefício direto imediato, o uso do
            app pode facilitar o autocuidado e a comunicação com serviços de
            saúde.
          </p>
        </div>
      </div>

      {/* Confidencialidade */}
      <div>
        <h4 className="text-topicos font-work-sans text-white mb-3 flex items-center">
          <span className="w-2 h-2 bg-accent2 rounded-full mr-2"></span>
          Confidencialidade:
        </h4>
        <div className="bg-white/5 rounded-lg p-4">
          <p className="text-white/90 font-inter text-campos-preenchimento leading-relaxed">
            Todas as informações serão codificadas, armazenadas em ambiente
            seguro e utilizadas apenas para fins desta pesquisa. Nenhuma
            informação identificada será divulgada.
          </p>
        </div>
      </div>

      {/* Ressarcimento */}
      <div>
        <h4 className="text-topicos font-work-sans text-white mb-3 flex items-center">
          <span className="w-2 h-2 bg-yellow rounded-full mr-2"></span>
          Ressarcimento:
        </h4>
        <div className="bg-white/5 rounded-lg p-4">
          <p className="text-white/90 font-inter text-campos-preenchimento leading-relaxed">
            Se houver deslocamentos para participação presencial em grupos ou
            entrevistas, será realizado ressarcimento de transporte mediante
            comprovantes ou declaração.
          </p>
        </div>
      </div>

      {/* Tratamento dos Dados */}
      <div>
        <h4 className="text-topicos font-work-sans text-white mb-3 flex items-center">
          <span className="w-2 h-2 bg-accent1 rounded-full mr-2"></span>
          Tratamento dos dados:
        </h4>
        <div className="bg-white/5 rounded-lg p-4">
          <p className="text-white/90 font-inter text-campos-preenchimento leading-relaxed">
            Os dados poderão ser armazenados em repositórios virtuais
            anonimizados, para fins de compartilhamento científico, conforme a
            legislação vigente e diretrizes éticas. Não será possível
            identificar o participante.
          </p>
        </div>
      </div>

      {/* Contato */}
      <div>
        <h4 className="text-topicos font-work-sans text-white mb-3 flex items-center">
          <span className="w-2 h-2 bg-accent2 rounded-full mr-2"></span>
          Contato:
        </h4>
        <div className="bg-accent2/10 border border-accent2/30 rounded-lg p-4 space-y-3">
          <div>
            <p className="text-white font-inter text-campos-preenchimento font-medium mb-2">
              📧 Pesquisadora Principal:
            </p>
            <p className="text-white/90 font-inter text-campos-preenchimento2 leading-relaxed">
              Profa. Dra. Heloísa Garcia Claro Fernandes
              <br />
              📍 R. Tessália Vieira de Camargo, 126 - Cidade Universitária,
              Campinas - SP, 13083-887
              <br />
              📞 +55(11)97692-9345
              <br />
              ✉️ clarohg@unicamp.br
            </p>
          </div>
          <div className="border-t border-white/20 pt-3">
            <p className="text-white font-inter text-campos-preenchimento font-medium mb-2">
              🏛️ Comitê de Ética:
            </p>
            <p className="text-white/90 font-inter text-campos-preenchimento2">
              📞 (19) 3521-8936 ou 3521-7187
              <br />
              ✉️ cep@unicamp.br
            </p>
          </div>
        </div>
      </div>

      {/* Consentimento Final */}
      <div className="bg-primary/20 border border-primary/40 rounded-lg p-6 text-center">
        <h4 className="text-topicos2 font-work-sans text-white mb-4">
          ✍️ Consentimento livre e esclarecido
        </h4>
        <p className="text-white/95 font-inter text-campos-preenchimento leading-relaxed font-medium">
          Após ter recebido esclarecimentos sobre a natureza da pesquisa, seus
          objetivos, métodos, riscos e benefícios, aceito participar
          voluntariamente.
        </p>
      </div>

      {/* Espaçamento final */}
      <div className="h-8"></div>
    </div>
  );
};

export default TermsText;
