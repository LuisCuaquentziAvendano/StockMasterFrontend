/// <reference types="cypress" />

describe('Login Component', () => {
  beforeEach(() => {
    cy.intercept('POST', '**/users/login', (req) => {
      req.reply({
        statusCode: 200,
        body: {
          authorization: 'mocked-auth-token',
        },
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }).as('loginRequest');
  });

  it('should submit login form and redirect to dashboard on success', () => {
    cy.visit('/login');
    cy.get('input[formControlName="email"]').type('user@example.com');
    cy.get('input[formControlName="password"]').type('password123');
    cy.get('form').submit();
    cy.wait('@loginRequest');
    cy.url().should('include', '/inventories');
    cy.get('main').should('be.visible');
  });

  it('should show error on invalid login', () => {
    cy.intercept('POST', '**/users/login', (req) => {
      req.reply({
        statusCode: 401,
        body: { error: 'Invalid email or password' },
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }).as('loginRequest');
    cy.visit('/login');
    cy.get('input[formControlName="email"]').type('wronguser@example.com');
    cy.get('input[formControlName="password"]').type('wrongpassword');
    cy.get('form').submit();
    cy.wait('@loginRequest');
    cy.contains('Invalid email or password').should('be.visible');
  });
});
