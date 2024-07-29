describe('Test Garage App', () => {
  it('Check access to the app', () => {
    cy.visit('http://localhost:5173')
  })

  it('Check Dashboard after connection', function() {

    cy.visit('http://localhost:5173/auth');
    cy.get('.auth-toggle > :nth-child(2)').click();
    cy.get('[type="email"]').clear('garagiste@vroumvroum.fr');
    cy.get('[type="email"]').type('garagiste@vroumvroum.fr');
    cy.get('[type="password"]').clear('Azerty@01');
    cy.get('[type="password"]').type('Azerty@01');
    cy.get('.signin-form > button').click();
    cy.get('p').should('be.visible');

  });

  it('Check add form presence after connection', function() {

    cy.visit('http://localhost:5173/auth');
    cy.get('.auth-toggle > :nth-child(2)').click();
    cy.get('[type="email"]').clear('garagiste@vroumvroum.fr');
    cy.get('[type="email"]').type('garagiste@vroumvroum.fr');
    cy.get('[type="password"]').clear('Azerty@01');
    cy.get('[type="password"]').type('Azerty@01');
    cy.get('.signin-form > button').click();

    cy.get('.admin-dashboard > :nth-child(5)').should('have.text', 'Ajouter un nouveau véhicule');

  });

  it('Check add car after connection', function() {

    cy.visit('http://localhost:5173/auth');
    cy.get('.auth-toggle > :nth-child(2)').click();
    cy.get('[type="email"]').clear('garagiste@vroumvroum.fr');
    cy.get('[type="email"]').type('garagiste@vroumvroum.fr');
    cy.get('[type="password"]').clear('Azerty@01');
    cy.get('[type="password"]').type('Azerty@01');
    cy.get('.signin-form > button').click();



    cy.get('[placeholder="Marque"]').clear('Toyota');
    cy.get('[placeholder="Marque"]').type('Toyota');
    cy.get('[placeholder="Modèle"]').clear('Corolla');
    cy.get('[placeholder="Modèle"]').type('Corolla');
    cy.get('[placeholder="Plaque"]').clear('AB-123-CD');
    cy.get('[placeholder="Plaque"]').type('AB-123-CD');
    cy.get('[type="number"]').clear('2020');
    cy.get('[type="number"]').type('2020');
    cy.get('select').select('3');
    cy.get('.admin-dashboard > :nth-child(11)').click();
    cy.get('ul > :nth-child(n)').last().should('have.text', 'Toyota Corolla (AB-123-CD, 2020) - Client ID: 3ModifierSupprimer');

  });
})