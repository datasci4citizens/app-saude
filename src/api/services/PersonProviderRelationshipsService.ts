/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProviderPersonSummary } from '../models/ProviderPersonSummary';
import type { ProviderRetrieve } from '../models/ProviderRetrieve';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PersonProviderRelationshipsService {
  /**
   * Get Person's Linked Providers
   *
   * Recupera todos os Providers que estão atualmente vinculados ao Person autenticado.
   *
   * **RESTRIÇÃO DE ACESSO:** Apenas usuários com perfil de Person podem usar esta funcionalidade.
   *
   * **Consulta de Relacionamento:**
   * - Retorna todos os relacionamentos ativos de Provider para o Person
   * - Inclui informações completas do perfil do Provider
   * - Ordenado por vinculação mais recente primeiro
   * - Filtra perfis de Provider inativos ou deletados
   *
   * @returns ProviderRetrieve
   * @throws ApiError
   */
  public static personProvidersList(): CancelablePromise<Array<ProviderRetrieve>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/person/providers/',
    });
  }
  /**
   * Get Provider's Linked Persons
   *
   * Recupera todos os Persons atualmente vinculados ao Provider autenticado com informações de resumo abrangentes.
   *
   * **RESTRIÇÃO DE ACESSO:** Apenas usuários com perfil de Provider podem usar esta funcionalidade.
   *
   * **Informações Ampliadas do Person:**
   * - **Perfil Básico**: ID do Person, nome e detalhes de contato
   * - **Cálculo de Idade**: Calculado automaticamente a partir da data de nascimento ou ano
   * - **Data da Última Visita**: Consulta/visita mais recente com este provider
   * - **Data da Última Ajuda**: Solicitação de ajuda mais recente desta person
   * - **Histórico de Serviços**: Resumo de interações passadas
   *
   * @returns ProviderPersonSummary
   * @throws ApiError
   */
  public static providerPersonsList(): CancelablePromise<Array<ProviderPersonSummary>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/provider/persons/',
    });
  }
}
