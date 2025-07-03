/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FullPersonCreate } from '../models/FullPersonCreate';
import type { FullProviderCreate } from '../models/FullProviderCreate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CompleteOnboardingService {
  /**
   * Complete Person Onboarding
   *
   * Completa o processo de onboarding para perfis de Person com todas as informações necessárias.
   *
   * **RESTRIÇÕES DE SEGURANÇA:**
   * - **Autenticação Obrigatória**: Usuário deve estar autenticado
   * - **Perfil Único**: Usuário não pode ter perfil existente (Person ou Provider)
   * - **Validação Completa**: Todos os dados são validados antes da criação
   *
   * **Recursos Abrangentes de Onboarding:**
   * - Cria perfil completo de Person em uma única requisição
   * - Valida todas as informações pessoais necessárias
   * - Configura preferências e configurações iniciais
   * - Vincula à conta de usuário autenticada
   * - Realiza validação completa de dados e verificações de consistência
   *
   * **Regras de Negócio:**
   * - Usuário deve estar autenticado
   * - Usuário não pode já ter um perfil de Person
   * - Usuário não pode já ter um perfil de Provider
   * - Todos os campos obrigatórios devem ser fornecidos
   * - Validação de idade e consistência de data de nascimento
   * - Nome social deve ser único no sistema
   *
   * @param requestBody
   * @returns any
   * @throws ApiError
   */
  public static apiFullPersonCreate(requestBody: FullPersonCreate): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/full-person/',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * Complete Provider Registration
   *
   * Processo de registro completo para perfis de Provider com criação de conta de usuário.
   *
   * **RESTRIÇÕES DE SEGURANÇA:**
   * - **Email Único**: Email deve ser único no sistema
   * - **Registro Profissional Único**: Registro profissional deve ser único
   * - **Validação de Domínio**: Domínios de email suspeitos são bloqueados
   * - **Transação Atômica**: Criação de User e Provider em transação única
   *
   * **Recursos Abrangentes de Registro:**
   * - Cria tanto conta de User quanto perfil de Provider
   * - Valida credenciais profissionais
   * - Configura informações completas do provider
   * - Lida com ativação de conta e permissões
   * - Transação atômica garante consistência de dados
   *
   * **Processo de Criação de Conta:**
   * 1. **Validação de Usuário**: Validação de unicidade e formato de email
   * 2. **Validação Profissional**: Verificação de número de registro
   * 3. **Criação de Perfil**: Configuração completa do perfil do provider
   * 4. **Ativação de Conta**: Configuração da conta do usuário com permissões adequadas
   * 5. **Configuração de Relacionamento**: Vincula usuário ao perfil do provider
   *
   * @param requestBody
   * @returns any
   * @throws ApiError
   */
  public static apiFullProviderCreate(requestBody: FullProviderCreate): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/full-provider/',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
}
