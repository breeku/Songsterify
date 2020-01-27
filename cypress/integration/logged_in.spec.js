/// <reference types="Cypress" />
/* eslint-disable no-undef */
describe("Logged in", function() {
    before(function() {
        cy.setCookie("accessToken", "null")
        cy.setCookie("refreshToken", Cypress.env("refreshToken"))
        cy.visit("/")
    })

    after(function() {
        cy.clearCookies()
    })

    beforeEach(function() {
        Cypress.Cookies.preserveOnce("accessToken", "refreshToken")
    })

    it("Am logged in when cookies are set", function() {
        cy.url().should("include", "/")

        cy.get("h2").should("contain", "spotttm")
    })

    describe("Search", function() {
        this.beforeEach(function() {
            cy.visit("/search")
        })

        it("Can visit search", function() {
            cy.visit("/")
            cy.get(
                "div > ul > a:nth-child(2) > div > div.MuiListItemText-root > span"
            ).click()

            cy.url().should("include", "/search")
        })

        it("Can search", function() {
            cy.get("#filled-basic")
                .click()
                .type("Stam1na{enter}")

            //Albums

            cy.get(
                "#simple-tabpanel-0 > div > div > div:nth-child(1) > a > img"
            ).should("be.visible")

            // Artists

            cy.get("#simple-tab-1 > span.MuiTab-wrapper").click()

            cy.get("#simple-tabpanel-1 > div > div > div > div").should(
                "contain",
                "Stam1na"
            )

            // Playlists

            cy.get("#simple-tab-2 > span.MuiTab-wrapper").click()

            cy.get(
                "#simple-tabpanel-2 > div > div > div:nth-child(1) > div"
            ).should("contain", "Stam1na")
        })

        it("Can visit a album", function() {
            cy.get("#filled-basic")
                .click()
                .type("Stam1na{enter}")

            cy.get(
                "#simple-tabpanel-0 > div > div > div:nth-child(1) > a > img"
            ).click()

            cy.url().should("include", "/album/")

            cy.get("h1").should("contain", "Stam1na")
            cy.get("h2").should("contain", "Album")
        })

        it("Can visit a playlist", function() {
            cy.get("#filled-basic")
                .click()
                .type("Stam1na{enter}")

            cy.get("#simple-tab-2 > span.MuiTab-wrapper").click()

            cy.get(
                "#simple-tabpanel-2 > div > div > div:nth-child(1) > a > img"
            ).click()

            cy.url().should("include", "/playlist/")

            cy.get("h1").should("contain", "Stam1na")
            cy.get("h2").should("contain", "Playlist")
        })
    })

    describe("About", function() {
        it("Can visit about", function() {
            cy.get(
                "div > ul > a:nth-child(3) > div > div.MuiListItemText-root > span"
            ).click()

            cy.url().should("include", "/about")
        })
    })

    describe("Recently played", function() {
        it("Can visit a recent played album", function() {
            cy.get(
                "div > ul > a:nth-child(1) > div > div.MuiListItemText-root > span"
            ).click()

            cy.url().should("include", "/")

            // Click the first album
            cy.get("div > div:nth-child(1) > a > img").click()

            cy.url().should("include", "/album/")

            cy.get("h2").should("contain", "Album")
        })
    })

    describe("Tabs", function() {
        this.beforeAll(function() {
            cy.visit("/")
        })

        it("Cant get tabs if too many diff artists in playlist", function() {
            cy.get("div > div.scrollbar-container.ps.ps--active-y")
                .contains("cypress_big")
                .click({ force: true })

            cy.url().should("include", "/playlist/")

            // Notification
            cy.get("div:nth-child(3) > div").should("contain", "Sorry!")

            cy.get("div:nth-child(2) > div > div > button").should(
                "be.disabled"
            )
        })

        it("Returns tabs from a playlist", function() {
            cy.get("div > div.scrollbar-container.ps.ps--active-y")
                .contains("cypress_small")
                .click({ force: true })

            cy.url().should("include", "/playlist/")

            // Click Get Tabs
            cy.get(
                "button.MuiButtonBase-root:nth-child(4) > span:nth-child(1)"
            ).click()

            // First should be green
            cy.get("main > div:nth-child(2) > table > tbody > tr")
                .eq(0)
                .should("contain", "1")
                .should("have.css", "background-color")
                .and("eq", "rgba(0, 220, 0, 0.5)")

            // Second should be black
            cy.get("main > div:nth-child(2) > table > tbody > tr")
                .eq(1)
                .should("contain", "3")
                .should("have.css", "background-color")
                .and("eq", "rgba(0, 0, 0, 0.6)")

            // Can click on first and see tab link
            cy.get("main > div:nth-child(2) > table > tbody > tr")
                .eq(0)
                .click()

            cy.get("#alert-dialog-title > h2").should("contain", "Never Meant")

            cy.get(
                "div.MuiDialogContent-root > a > span.MuiButton-label"
            ).should("contain", "Open")
        })
    })
})