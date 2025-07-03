/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LinkingCode } from '../models/LinkingCode';
import type { PersonLinkProviderRequest } from '../models/PersonLinkProviderRequest';
import type { ProviderPersonLinkStatus } from '../models/ProviderPersonLinkStatus';
import type { ProviderRetrieve } from '../models/ProviderRetrieve';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PersonProviderLinkingService {
  /**
   * Unlink Person from Provider
   *
   * Remove a conexão entre um Person e Provider.
   *
   * **⚠️ OPERAÇÃO CRÍTICA - AFETA RELACIONAMENTOS DE SERVIÇO ⚠️**
   *
   * **REGRAS DE AUTORIZAÇÃO:**
   * - **Person**: Só pode desvincular a si mesmo de providers
   * - **Provider**: Só pode desvincular persons que estão vinculados a ele
   * - **Outros usuários**: Não têm autorização para fazer unlink
   *
   * **Processo de Desvinculação:**
   * 1. **Validação de Autorização**: Verifica se usuário pode fazer unlink
   * 2. **Validação de Relacionamento**: Confirma que relacionamento existe
   * 3. **Verificação de Dependência**: Garante remoção segura do relacionamento
   * 4. **Remoção de Relacionamento**: Deleta conexão Person-Provider
   * 5. **Log de Auditoria**: Registra todas as atividades de desvinculação com contexto completo
   *
   * @param personId
   * @param providerId
   * @returns any
   * @throws ApiError
   */
  public static personProviderUnlinkCreate(
    personId: number,
    providerId: number,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/person/{person_id}/provider/{provider_id}/unlink/',
      path: {
        person_id: personId,
        provider_id: providerId,
      },
    });
  }
  /**
   * Link Person to Provider
   *
   * Estabelece uma conexão entre Person e Provider usando um código de vinculação.
   *
   * **RESTRIÇÃO DE ACESSO:** Apenas usuários com perfil de Person podem usar esta funcionalidade.
   *
   * **Processo de Vinculação:**
   * 1. **Validação de Código**: Verifica se código existe e não expirou
   * 2. **Busca de Provider**: Identifica Provider associado com código
   * 3. **Criação de Relacionamento**: Cria relacionamento Person-Provider
   * 4. **Invalidação de Código**: Marca código como usado para prevenir reuso
   * 5. **Log de Auditoria**: Registra todas as atividades de vinculação
   *
   * @param requestBody
   * @returns ProviderPersonLinkStatus
   * @throws ApiError
   */
  public static personLinkCodeCreate(
    requestBody: PersonLinkProviderRequest,
  ): CancelablePromise<ProviderPersonLinkStatus> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/person/link-code/',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * Get Provider Information by Link Code
   *
   * Recupera informações do Provider usando um código de vinculação para preview antes da vinculação.
   *
   * **RESTRIÇÃO DE ACESSO:** Apenas usuários com perfil de Person podem usar esta funcionalidade.
   *
   * **Funcionalidade de Preview:**
   * - Permite que Person visualize detalhes do Provider antes de estabelecer conexão
   * - Valida código de vinculação sem consumi-lo
   * - Retorna informações abrangentes do perfil do Provider
   * - Permite tomada de decisão informada antes da vinculação
   *
   * @param requestBody
   * @returns ProviderRetrieve
   * @throws ApiError
   */
  public static providerByLinkCodeCreate(
    requestBody: PersonLinkProviderRequest,
  ): CancelablePromise<ProviderRetrieve> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/provider/by-link-code/',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * Generate Provider Link Code
   *
   * Gera um código temporário de 6 dígitos para vinculação Person-Provider.
   *
   * **RESTRIÇÃO DE ACESSO:** Apenas usuários com perfil de Provider podem usar esta funcionalidade.
   *
   * **Sistema de Código de Vinculação:**
   * - **Propósito**: Método seguro para Persons se conectarem com Providers
   * - **Formato**: Código alfanumérico de 6 caracteres (ex: 'A1B2C3')
   * - **Expiração**: Válido por 10 minutos a partir da geração
   * - **Uso**: Código de uso único que expira após Person vincular
   *
   * **Recursos de Segurança:**
   * - **Limitado por Tempo**: Códigos expiram automaticamente após 10 minutos
   * - **Uso Único**: Código se torna inválido após vinculação bem-sucedida
   * - **Específico do Provider**: Cada código é vinculado a um Provider específico
   * - **Trilha de Auditoria**: Toda geração e uso de código é registrado
   *
   * @returns LinkingCode
   * @throws ApiError
   */
  public static providerLinkCodeCreate(): CancelablePromise<LinkingCode> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/provider/link-code/',
    });
  }
}
