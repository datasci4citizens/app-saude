import { Button } from "@/components/forms/button";
import Header from "@/components/ui/header";

const TermsAndConditionsPage = () => {
  return (
    <div className="h-screen px-4 py-6">
  <Header title="Termos e condições" />
  <div className="h-[calc(100vh-86px-3rem)] flex justify-center items-center">
    <div className="text-typography py-4 px-6 h-full min-h-[200px] max-w-[1000px] overflow-y-auto bg-offwhite-foreground rounded">
          <p><strong>TERMO DE CONSENTIMENTO LIVRE E ESCLARECIDO</strong></p><br />
          <p><strong>Projeto SAÚDE!: Suporte Móvel para Facilitar o Engajamento com os Serviços, o Bem-Estar Físico e a Recuperação de Pessoas com Transtorno Mental Severo no Brasil</strong></p>
          <p><strong>Pesquisadores Responsáveis:</strong></p>
          <p>Dr. Carlos Treichel (USP)</p>
          <p>Dr. Mark Costa (Yale University)</p>
          <p>Profa. Dra. Heloísa Garcia Claro Fernandes (UNICAMP)</p>
          <p>Profa. Dra. Maria Giovana Borges Saidel (UNICAMP)</p>
          <p><strong>Número do CAAE:</strong> (inserir após aprovação pelo CEP)</p>
          <p>Você está sendo convidado(a) a participar de uma pesquisa. Este documento, chamado Termo de Consentimento Livre e Esclarecido, visa assegurar seus direitos como participante da pesquisa. Ele é elaborado em duas vias, assinadas e rubricadas pelo pesquisador e pelo participante/responsável legal, sendo que uma via deverá ficar com você e outra com o pesquisador.</p>
          <p><strong>Justificativa e objetivos:<br /></strong> Este estudo tem como objetivo desenvolver, testar e avaliar um aplicativo de celular chamado SAÚDE!, voltado para apoiar o cuidado integral de pessoas com transtorno mental severo, promovendo o bem-estar físico, o autocuidado e o engajamento com os serviços da Rede de Atenção Psicossocial (RAPS) e da Atenção Básica.</p>
          <p><strong>Procedimentos:<br /></strong> Você poderá ser convidado(a) a:</p>
          <ul>
            <li>
              <p>Utilizar o aplicativo SAÚDE! por um período definido (ex: 6 semanas);<br /></p>
            </li>
            <li>
              <p>Responder a questionários sobre usabilidade, experiência de uso e impacto percebido;<br /></p>
            </li>
            <li>
              <p>Participar de grupos focais com usuários ou profissionais de saúde;<br /></p>
            </li>
            <li>
              <p>Participar de entrevistas com a equipe de pesquisa sobre a implementação e melhorias no app.<br /><br /></p>
            </li>
          </ul>
          <p>A participação é voluntária e pode ser interrompida a qualquer momento, sem prejuízo ao seu atendimento nos serviços de saúde.</p>
          <p><strong>Riscos e desconfortos:<br /></strong> Pode haver desconforto ao relatar experiências pessoais. As entrevistas e grupos serão realizados com privacidade. Se houver qualquer sofrimento emocional, o participante será orientado(a) a buscar suporte na equipe do CAPS ou UBS.</p>
          <p><strong>Benefícios:<br /></strong> Contribuir com o desenvolvimento de uma ferramenta de apoio à saúde mental e física. Embora não haja benefício direto imediato, o uso do app pode facilitar o autocuidado e a comunicação com serviços de saúde.</p>
          <p><strong>Confidencialidade:<br /></strong> Todas as informações serão codificadas, armazenadas em ambiente seguro e utilizadas apenas para fins desta pesquisa. Nenhuma informação identificada será divulgada.</p>
          <p><strong>Ressarcimento:<br /></strong> Se houver deslocamentos para participação presencial em grupos ou entrevistas, será realizado ressarcimento de transporte mediante comprovantes ou declaração.</p>
          <p><strong>Tratamento dos dados:<br /></strong> Os dados poderão ser armazenados em repositórios virtuais anonimizados, para fins de compartilhamento científico, conforme a legislação vigente e diretrizes éticas. Não será possível identificar o participante.</p>
          <p><strong>Contato:<br /></strong> Dúvidas sobre a pesquisa podem ser esclarecidas com Profa. Dra. Heloísa Garcia Claro Fernandes, Rua R. Tessália Vieira de Camargo, 126 - Cidade Universitária, Campinas - SP, 13083-887, telefone +55(11)97692-9345, email: clarohg@unicamp.br</p>
          <p>Questões éticas podem ser encaminhadas ao Comitê de Ética em Pesquisa da UNICAMP, tel. (19) 3521-8936 ou 3521-7187, email: cep@unicamp.br</p>
          <p><strong>Consentimento livre e esclarecido:<br /></strong> Apos ter recebido esclarecimentos sobre a natureza da pesquisa, seus objetivos, métodos, riscos e benefícios, aceito participar voluntariamente.</p>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditionsPage;
