/// <reference types="Cypress" />
/* eslint-disable no-undef */
describe("Logged in", function() {
    before(function() {
        cy.setCookie("accessToken", "null")
        cy.setCookie("refreshToken", Cypress.env("refreshToken"))
        cy.visit("/")

        cy.get("h2").should("contain", "spotttm")
    })

    after(function() {
        cy.clearCookies()
    })

    beforeEach(function() {
        cy.visit("/")
        Cypress.Cookies.preserveOnce("accessToken", "refreshToken")
    })

    describe("Search", function() {
        beforeEach(function() {
            cy.get(
                "div > ul > a:nth-child(2) > div > div.MuiListItemText-root > span"
            ).click()

            cy.url().should("include", "/search")
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
            cy.visit("/")
            cy.get("h2").should("contain", "spotttm")

            cy.get(
                "div > ul > a:nth-child(3) > div > div.MuiListItemText-root > span"
            ).click()

            cy.url().should("include", "/about")

            cy.get("main > div > h1").should("contain", "About")
        })
    })

    describe("Recently played", function() {
        it("Can visit a recent played album", function() {
            cy.visit("/")
            cy.get("h2").should("contain", "spotttm")

            // Click the first album
            cy.get("div > div:nth-child(1) > a > img").click()

            cy.url().should("include", "/album/")

            cy.get("h2").should("contain", "Album")
        })
    })

    describe("Tabs", function() {
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

            // Close notification

            cy.get(
                "div:nth-child(3) > div > div > div.MuiSnackbarContent-action > button"
            ).click({ force: true })
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
                .should("contain", "2")
                .should("have.css", "background-color")
                .and("eq", "rgba(0, 0, 0, 0.6)")

            // Can click on first and see tab link
            cy.get("main > div:nth-child(2) > table > tbody > tr")
                .eq(0)
                .click()

            cy.get("#alert-dialog-title > h2").should("contain", "Rautasorkka")

            cy.get(
                "div.MuiDialogContent-root > a > span.MuiButton-label"
            ).should("contain", "Open")

            cy.get("div.MuiButtonBase-root:nth-child(3)").should(
                "contain",
                "Guitar"
            )

            cy.get(
                "div:nth-child(1) > div:nth-child(1) > ul:nth-child(1) > li:nth-child(1) > div:nth-child(1) > span:nth-child(1)"
            ).should("contain", "Difficulty")

            cy.get(
                "div:nth-child(1) > div:nth-child(1) > ul:nth-child(1) > li:nth-child(2) > div:nth-child(1)"
            ).should("contain", "Tuning")
        })

        it("Get tabs from a album", function() {
            cy.get("div > div:nth-child(1) > a > img").click()

            cy.url().should("include", "/album/")

            // Click Get Tabs
            cy.get(
                "button.MuiButtonBase-root:nth-child(4) > span:nth-child(1)"
            ).click()

            // Check that color changes
            cy.get("main > div:nth-child(2) > table > tbody > tr")
                .eq(0)
                .should("contain", "1")
                .should("have.css", "background-color")
                .and("match", /^rgba.(0, 0, 0, 0.6.)|rgba.(0, 220, 0, 0.5.)/)
        })
    })

    describe("Token refresh", function() {
        it("Refreshes old accesstoken", function() {
            cy.get("h2").should("contain", "spotttm")

            cy.window()
                .its("store")
                .invoke("dispatch", {
                    type: "SET_TOKEN",
                    data: { accessToken: "invalid" }
                })

            cy.clearCookie("accesstoken")

            cy.get("div > div:nth-child(1) > a > img").click()

            cy.url().should("include", "/album/")

            cy.get("h2").should("contain", "Album")
        })
    })

    describe("Logout", function() {
        it("Can logout", function() {
            cy.get("div > button > span.MuiButton-label").click()

            cy.reload()

            cy.url().should("include", "/login")

            cy.get("h1").should("contain", "Welcome to Songsterify")

            cy.get(
                "div.MuiGrid-root.MuiGrid-container.MuiGrid-spacing-xs-3.MuiGrid-justify-xs-center > div > a > span.MuiButton-label"
            ).should("contain", "Login via Spotify")
        })
    })
})
