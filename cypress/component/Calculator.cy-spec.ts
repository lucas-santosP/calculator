import { mount } from '@cypress/vue'
import App from '../../src/App.vue'
import "tailwindcss/tailwind.css";

it('adds up', () => {
  mount(App)

  cy.get('button').contains('2').click()
  cy.get('button').contains('*').click()
  cy.get('button').contains('9').click()
  cy.get('button').contains('=').click()
  cy.get('div').contains('18')
})