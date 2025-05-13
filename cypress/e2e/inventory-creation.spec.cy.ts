/// <reference types="cypress" />

describe('Inventory creation', () => {
    beforeEach(() => {
      cy.intercept('POST', '**/users/login', {
        statusCode: 200,
        body: { authorization: 'mocked-auth-token' },
      }).as('loginRequest');
  
      cy.intercept('GET', '**/users/getInventories', {
        statusCode: 200,
        body: [],
      }).as('getInventories');
  
      cy.visit('/login');
      cy.get('input[formControlName="email"]').type('user@example.com');
      cy.get('input[formControlName="password"]').type('password123');
      cy.get('form').submit();
      cy.wait('@loginRequest');
      cy.url().should('include', '/inventories');
    });
  
    it('should create a new inventory and show success message', () => {
      cy.intercept('POST', '**/inventories/createInventory', {
        statusCode: 200,
        body: {},
      }).as('createInventory');
  
      cy.intercept('GET', '**/users/getInventories', {
        statusCode: 200,
        body: [
          { inventory: '1', name: 'Nuevo Inventario', role: 'admin' }
        ],
      }).as('getInventoriesAfter');
  
      cy.contains('button', 'Create inventory').click();
  
      cy.get('.swal2-input').type('Nuevo Inventario');
      cy.get('.swal2-confirm').click();
  
      cy.wait('@createInventory');
  
      cy.get('.swal2-title').should('contain', 'Inventory created successfully');
      cy.get('.swal2-confirm').click();
  
      cy.wait('@getInventoriesAfter');
      cy.contains('Nuevo Inventario').should('be.visible');
    });

    it('should not create inventory with empty name', () => {
        cy.intercept('POST', '**/inventories/createInventory').as('createInventory');
      
        cy.contains('button', 'Create inventory').click();
      
        cy.get('.swal2-confirm').click();
      
        cy.wait(500);
        cy.get('@createInventory.all').should('have.length', 0);
      
        cy.get('.swal2-title').should('contain', 'Invalid name');
        cy.get('.swal2-confirm').click();
      });
  });
  