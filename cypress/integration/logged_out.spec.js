/// <reference types="Cypress" />
/* eslint-disable no-undef */

describe("Logged out", function() {
    beforeEach(function() {
        cy.visit('/')
    })

    it("Prompts me to log in", function() {
        cy.get('h1').should('contain', 'Welcome to Songsterify')

        cy.get('div.MuiGrid-root.MuiGrid-container.MuiGrid-spacing-xs-3.MuiGrid-justify-xs-center > div > a > span.MuiButton-label').should('contain', 'Login via Spotify')
    })

    it("Can't visit search", function() {
        cy.visit("/search")
    
        cy.url().should('include', '/login')
    })

    it("Can visit about", function() {
        cy.get(
            "div > ul > a:nth-child(3) > div > div.MuiListItemText-root > span"
        ).eq(0).click()

        cy.url().should("include", "/about")

        cy.get("main > div > h1").should("contain", "About")
    })
    
})