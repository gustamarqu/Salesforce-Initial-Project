@IsTest
private class AccountControllerTest {

    @IsTest
    static void testGetAccounts() {
        // Arrange
        List<Account> testAccounts = new List<Account>{
            new Account(
                Name = 'Conta Teste Get 1',
                Industry = 'Technology',
                AnnualRevenue = 100000,
                Phone = '11999990001'
            ),
            new Account(
                Name = 'Conta Teste Get 2',
                Industry = 'Technology',
                AnnualRevenue = 200000,
                Phone = '11999990002'
            )
        };

        insert testAccounts;

        // Act
        Test.startTest();
        List<Account> result = AccountController.getAccounts();
        Test.stopTest();

        // Assert
        System.assertNotEquals(null, result, 'A lista não deveria ser nula');
        System.assertEquals(2, result.size(), 'Deveria retornar 2 Accounts de teste');
    }

    @IsTest
    static void testInsertAccounts() {
        // Act
        Test.startTest();
        Account createdAcc = AccountController.insertAccounts(
            'Conta Criada pelo Teste',
            'Technology',
            500000,
            '11988887777'
        );
        Test.stopTest();

        // Assert
        System.assertNotEquals(null, createdAcc.Id, 'A Account deveria ter sido criada com Id');
        System.assertEquals('Conta Criada pelo Teste', createdAcc.Name);
        System.assertEquals('Technology', createdAcc.Industry);
        System.assertEquals(Decimal.valueOf(500000), createdAcc.AnnualRevenue);
        System.assertEquals('11988887777', createdAcc.Phone);

        Account accFromDb = [
            SELECT Id, Name, Industry, AnnualRevenue, Phone
            FROM Account
            WHERE Id = :createdAcc.Id
            LIMIT 1
        ];

        System.assertEquals('Conta Criada pelo Teste', accFromDb.Name);
    }

    @IsTest
    static void testUpdateAccount() {
        // Arrange
        Account acc = new Account(
            Name = 'Conta Antes Update',
            Industry = 'Technology',
            AnnualRevenue = 100000,
            Phone = '11911112222'
        );

        insert acc;

        // Act
        Test.startTest();
        Account updatedAcc = AccountController.updateAccount(
            acc.Id,
            'Conta Depois Update',
            'Retail',
            900000,
            '11933334444'
        );
        Test.stopTest();

        // Assert
        System.assertEquals(acc.Id, updatedAcc.Id);
        System.assertEquals('Conta Depois Update', updatedAcc.Name);
        System.assertEquals('Retail', updatedAcc.Industry);
        System.assertEquals(Decimal.valueOf(900000), updatedAcc.AnnualRevenue);
        System.assertEquals('11933334444', updatedAcc.Phone);

        Account accFromDb = [
            SELECT Id, Name, Industry, AnnualRevenue, Phone
            FROM Account
            WHERE Id = :acc.Id
            LIMIT 1
        ];

        System.assertEquals('Conta Depois Update', accFromDb.Name);
        System.assertEquals('Retail', accFromDb.Industry);
        System.assertEquals(Decimal.valueOf(900000), accFromDb.AnnualRevenue);
        System.assertEquals('11933334444', accFromDb.Phone);
    }

    @IsTest
    static void testDeleteAccount() {
        // Arrange
        Account acc = new Account(
            Name = 'Conta Para Deletar',
            Industry = 'Technology',
            AnnualRevenue = 300000,
            Phone = '11955556666'
        );

        insert acc;

        // Act
        Test.startTest();
        Boolean result = AccountController.deleteAccount(acc.Id);
        Test.stopTest();

        // Assert
        System.assertEquals(true, result, 'O método deveria retornar true');

        Integer countAccounts = [
            SELECT COUNT()
            FROM Account
            WHERE Id = :acc.Id
        ];

        System.assertEquals(0, countAccounts, 'A Account deveria ter sido deletada');
    }
}