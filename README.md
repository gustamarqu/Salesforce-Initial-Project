# Salesforce Initial Project - Account Cards CRUD

Projeto inicial de Salesforce Development utilizando **LWC + Apex**, com foco em construção de um componente para gerenciamento de registros de **Account**.

O projeto implementa um CRUD completo de contas, permitindo buscar, criar, editar, deletar, visualizar detalhes e filtrar registros diretamente pela interface do Lightning Web Component.

## Objetivo do projeto

O objetivo principal foi praticar os fundamentos de desenvolvimento Salesforce, conectando um componente LWC a uma classe Apex para manipular registros reais da org.

Este projeto cobre conceitos importantes como:

- Lightning Web Components
- Apex Controller
- SOQL
- `@AuraEnabled`
- `@wire`
- Apex imperativo
- Insert, Update e Delete de registros
- Renderização dinâmica no HTML
- Filtros com JavaScript
- Modais com SLDS
- Testes Apex
- Deploy via Salesforce CLI
- Versionamento com Git e GitHub

## Funcionalidades

### Buscar Accounts

O componente busca registros reais de Account na org utilizando Apex e `@wire`.

```js
@wire(getAccounts)
wiredAccounts({ data, error }) {
  if (data) {
    this.accounts = data.map(acc => this.mapAccount(acc));
    this.error = undefined;
  } else if (error) {
    this.error = error;
    this.accounts = [];
  }
}
