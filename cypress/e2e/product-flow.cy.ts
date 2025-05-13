describe('Product management flow', () => {
  const inventoryId = '68119f5dded9460f037fda8b';

  beforeEach(() => {
    cy.visit(`/inventory/${inventoryId}/products`);
  });

  it('should create a new product', () => {
    cy.get('input[formControlName="name"]').type('Cypress Test Product');
    cy.get('input[formControlName="description"]').type('Producto de prueba');
    cy.get('input[formControlName="price"]').type('99.99');
    cy.get('input[formControlName="category"]').type('Testing');
    cy.get('textarea[formControlName="tags"]').type('cypress\ntesting');
    cy.get('input[formControlName="date_added"]').type('2025-05-13T12:00');
    cy.get('input[type="radio"][value="yes"]').click();
    cy.get('input[formControlName="stock"]').type('10');

    cy.get('input[type="file"]').selectFile('cypress/fixtures/sample.jpg');

    cy.get('.create-button').click();

    cy.on('window:alert', (str) => {
      expect(str).to.contain('Producto creado');
    });
  });

  it('should search a product by ID', () => {
    cy.get('input[name="searchId"]').type('ID_PRODUCTO_PRUEBA');
    cy.get('button.search-button').first().click();

    cy.get('#update-product').should('exist');
    cy.get('input[formControlName="name"]').should('have.value');
  });

  it('should update the product', () => {
    cy.get('input[formControlName="price"]').clear().type('199.99');
    cy.get('button.btn-primary').contains('Actualizar').click();

    cy.on('window:alert', (str) => {
      expect(str).to.contain('actualizado');
    });
  });

  it('should delete the product', () => {
    cy.get('button.btn-danger').contains('Eliminar').click();

    cy.on('window:confirm', () => true); // acepta confirmación
    cy.on('window:alert', (str) => {
      expect(str).to.contain('eliminado');
    });
  });
});
