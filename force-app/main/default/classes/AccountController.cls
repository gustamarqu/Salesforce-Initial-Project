public with sharing class AccountController {

    @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts() {
        return [
            SELECT Id, Name, Industry, AnnualRevenue, Phone
            FROM Account
            ORDER BY CreatedDate DESC
            LIMIT 10
        ];
    }

    @AuraEnabled
    public static Account insertAccounts(
        String name,
        String industry,
        Decimal annualRevenue,
        String phone
    ) {
        try {
            Account acc = new Account(
                Name = name,
                Industry = String.isBlank(industry) ? null : industry,
                AnnualRevenue = annualRevenue,
                Phone = String.isBlank(phone) ? null : phone
            );

            insert acc;

            return [
                SELECT Id, Name, Industry, AnnualRevenue, Phone
                FROM Account
                WHERE Id = :acc.Id
                LIMIT 1
            ];

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static Boolean deleteAccount(Id idacc) {
        try {
            Account acc = new Account(Id = idacc);
            delete acc;

            return true;

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static Account updateAccount(
        Id accountId,
        String name,
        String industry,
        Decimal annualRevenue,
        String phone
    ) {
        try {
            Account acc = new Account(
                Id = accountId,
                Name = name,
                Industry = String.isBlank(industry) ? null : industry,
                AnnualRevenue = annualRevenue,
                Phone = String.isBlank(phone) ? null : phone
            );

            update acc;

            return [
                SELECT Id, Name, Industry, AnnualRevenue, Phone
                FROM Account
                WHERE Id = :acc.Id
                LIMIT 1
            ];

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}