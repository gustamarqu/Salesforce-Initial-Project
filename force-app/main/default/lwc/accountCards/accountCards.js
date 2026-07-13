import { LightningElement, wire } from 'lwc';

import getAccounts from '@salesforce/apex/AccountController.getAccounts';
import insertAccounts from '@salesforce/apex/AccountController.insertAccounts';
import deleteAccount from '@salesforce/apex/AccountController.deleteAccount';
import updateAccount from '@salesforce/apex/AccountController.updateAccount';

export default class AccountCards extends LightningElement {
  accounts = [];
  error;

  filterStatus = 'All';
  filterName = '';

  selectedAccount = null;
  isModalOpen = false;

  isEditModalOpen = false;
  editingAccount = null;

  newAccountName = '';
  newAccountIndustry = '';
  newAccountAnnualRevenue = null;
  newAccountPhone = '';

  message = '';

  @wire(getAccounts)
  wiredAccounts({ data, error }) {
    if (data) {
      this.accounts = data.map(acc => this.mapAccount(acc));
      this.error = undefined;
    } else if (error) {
      console.log('ERROR DO APEX:', error);
      this.error = error;
      this.accounts = [];
    }
  }

  mapAccount(acc) {
    return {
      id: acc.Id,
      name: acc.Name,
      industry: acc.Industry,
      annualRevenue: acc.AnnualRevenue,
      phone: acc.Phone,
      status: this.getAccountStatus(acc)
    };
  }

  getAccountStatus(acc) {
    if (!acc.Phone) {
      return 'Critical';
    }

    if (acc.AnnualRevenue && acc.AnnualRevenue > 1000000) {
      return 'Attention';
    }

    return 'Healthy';
  }

  handleAccountsNew(event) {
    const field = event.target.name;
    let value = event.target.value;

    if (field === 'newAccountAnnualRevenue') {
      value = value ? Number(value) : null;
    }

    this[field] = value;
  }

  handleCreateAccount() {
    if (!this.newAccountName.trim()) {
      this.message = 'Nome da Account é obrigatório.';
      return;
    }

    insertAccounts({
      name: this.newAccountName,
      industry: this.newAccountIndustry,
      annualRevenue: this.newAccountAnnualRevenue,
      phone: this.newAccountPhone
    })
      .then(result => {
        const newAccount = this.mapAccount(result);

        this.accounts = [newAccount, ...this.accounts];

        this.newAccountName = '';
        this.newAccountIndustry = '';
        this.newAccountAnnualRevenue = null;
        this.newAccountPhone = '';

        this.message = 'Account criada com sucesso.';
        this.error = undefined;
      })
      .catch(error => {
        console.log('Erro ao criar Account:', JSON.stringify(error));
        this.message = error.body?.message || 'Erro ao criar Account.';
        this.error = error;
      });
  }

  deleteAccounts(event) {
    const idacc = event.currentTarget.dataset.id;

    deleteAccount({ idacc })
      .then(() => {
        this.accounts = this.accounts.filter(acc => acc.id !== idacc);
        this.message = 'Account deletada com sucesso.';
        this.error = undefined;
      })
      .catch(error => {
        console.log('Erro ao deletar Account:', JSON.stringify(error));
        this.message = error.body?.message || 'Erro ao deletar Account.';
        this.error = error;
      });
  }

  handleEditAccount(event) {
    const accountId = event.currentTarget.dataset.id;

    const account = this.accounts.find(acc => acc.id === accountId);

    this.editingAccount = { ...account };
    this.isEditModalOpen = true;
  }

  handleEditInputChange(event) {
    const field = event.target.name;
    let value = event.target.value;

    if (field === 'annualRevenue') {
      value = value ? Number(value) : null;
    }

    this.editingAccount = {
      ...this.editingAccount,
      [field]: value
    };
  }

  handleSaveEdit() {
    if (!this.editingAccount.name.trim()) {
      this.message = 'Nome da Account é obrigatório.';
      return;
    }

    updateAccount({
      accountId: this.editingAccount.id,
      name: this.editingAccount.name,
      industry: this.editingAccount.industry,
      annualRevenue: this.editingAccount.annualRevenue,
      phone: this.editingAccount.phone
    })
      .then(result => {
        const updatedAccount = this.mapAccount(result);

        this.accounts = this.accounts.map(acc => {
          if (acc.id === updatedAccount.id) {
            return updatedAccount;
          }

          return acc;
        });

        this.message = 'Account atualizada com sucesso.';
        this.error = undefined;

        this.hideEditModal();
      })
      .catch(error => {
        console.log('Erro ao editar Account:', JSON.stringify(error));
        this.message = error.body?.message || 'Erro ao editar Account.';
        this.error = error;
      });
  }

  hideEditModal() {
    this.isEditModalOpen = false;
    this.editingAccount = null;
  }

  filteredAcc(event) {
    this.filterStatus = event.currentTarget.value;
  }

  handleSearch(event) {
    this.filterName = event.currentTarget.value;
  }

  handleDetails(event) {
    const accountId = event.currentTarget.dataset.id;

    this.selectedAccount = this.accounts.find(acc => acc.id === accountId);

    this.isModalOpen = true;
  }

  hideModal() {
    this.isModalOpen = false;
    this.selectedAccount = null;
  }

  get accsFilter() {
    let filteredAccounts = this.accounts;

    if (this.filterStatus !== 'All') {
      filteredAccounts = filteredAccounts.filter(
        account => account.status === this.filterStatus
      );
    }

    if (this.filterName.trim() !== '') {
      filteredAccounts = filteredAccounts.filter(account =>
        account.name.toLowerCase().includes(this.filterName.toLowerCase())
      );
    }

    return filteredAccounts;
  }

  get accountCount() {
    return this.accounts.length;
  }

  get errorMessage() {
    return this.error ? JSON.stringify(this.error) : '';
  }
}