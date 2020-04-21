/// <reference types="Cypress" />
/* eslint-disable no-undef */
describe("Logged in", function() {
    const Home =
        "div > div > ul > a:nth-child(1) > div > div.MuiListItemText-root"
    const Search =
        "div > div > ul > a:nth-child(2) > div > div.MuiListItemText-root"
    const About =
        "div > div > ul > a:nth-child(3) > div > div.MuiListItemText-root"
    const firstImage = "div > div:nth-child(1) > a > img"
    const notificationMessage =
        "div > div > div > div > div > div.MuiSnackbarContent-message"
    const playlistList = "div > div.scrollbar-container.ps.ps--active-y"

    before(function() {
        cy.setCookie("accessToken", "null")
        cy.setCookie("refreshToken", Cypress.env("refreshToken"))
    })

    beforeEach(function() {
        cy.visit("/")

        cy.get("h2").should("contain", "spotttm")

        cy.get(playlistList).should(
            "contain",
            "cypress"
        )

        Cypress.Cookies.preserveOnce("accessToken", "refreshToken")
    })

    after(function() {
        cy.clearCookies()
    })

    describe("Search", function() {
        beforeEach(function() {
            cy.get(Search)
                .eq(0)
                .click()

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
            cy.get("h2").should("contain", "spotttm")

            cy.get(About)
                .eq(0)
                .click()

            cy.url().should("include", "/about")

            cy.get("main > div > h1").should("contain", "About")
        })
    })

    describe("Recently played", function() {
        it("Can visit a recent played album", function() {
            cy.get("h2").should("contain", "spotttm")

            // Click the first album
            cy.get(firstImage).click()

            cy.url().should("include", "/album/")

            cy.get("h2").should("contain", "Album")
        })
    })

    describe("Playlist", function() {
        it("Can visit a album from playlist", function() {
            cy.get(playlistList)
            .contains("cypress_small")
            .click({ force: true })

            cy.url().should("include", "/playlist/")

            cy.get("table > tbody > tr:nth-child(1) > td:nth-child(4) > a").click()

            cy.url().should("include", "/album/")

            cy.get("h2").should("contain", "Album")
        })
    })

    describe("Tabs", function() {
        it("Cant get tabs if too many diff artists in playlist", function() {
            cy.get(playlistList)
                .contains("cypress_big")
                .click({ force: true })

            cy.url().should("include", "/playlist/")

            cy.get("div > div > button").should(
                "be.disabled"
            )
        })

        it("Returns tabs from a playlist", function() {
            cy.get(playlistList)
                .contains("cypress_small")
                .click({ force: true })

            cy.url().should("include", "/playlist/")

            // Click Get Tabs
            cy.get(
                "button.MuiButtonBase-root:nth-child(4) > span:nth-child(1)"
            ).click()

            cy.get(notificationMessage).should("contain", "Found")

            // First should be green
            cy.get("table > tbody > tr:nth-child(1)")
                .eq(0)
                .should("contain", "1")
                .should("have.css", "background-color")
                .and("eq", "rgba(0, 220, 0, 0.5)")

            // Can click on first and see tab link
            cy.get("table > tbody > tr:nth-child(1)")
                .eq(0)
                .click()

            cy.get("#alert-dialog-title > h2").should("contain", "Rautasorkka")

            cy.get(
                "div.MuiDialogContent-root > a > span.MuiButton-label"
            ).should("contain", "Open")
        })

        it("Get tabs from a album", function() {
            cy.get(firstImage).click()

            cy.url().should("include", "/album/")

            // Click Get Tabs
            cy.get(
                "button.MuiButtonBase-root:nth-child(4) > span:nth-child(1)"
            ).click()

            cy.get(notificationMessage).should("contain", "Found")

            // Check that color changes
            cy.get("table > tbody > tr:nth-child(1)")
                .eq(0)
                .should("contain", "1")
                .should("have.css", "background-color")
                .and("match", /^rgba.(0, 0, 0, 0.6.)|rgba.(0, 220, 0, 0.5.)/)
        })
    })

    describe("Notifications", function() {
        it("Disappears on unmount", function() {
            cy.get(playlistList)
                .contains("cypress_big")
                .click({ force: true })

            cy.url().should("include", "/playlist/")

            // Notification
            cy.get(notificationMessage).should("contain", "Sorry!")

            cy.get(About)
                .eq(0)
                .click()

            cy.url().should("include", "/about")

            cy.get(notificationMessage).should("not.exist")
        })

        it("Disappears on dismiss", function() {
            cy.get(playlistList)
                .contains("cypress_big")
                .click({ force: true })

            cy.url().should("include", "/playlist/")

            // Notification
            cy.get(notificationMessage).should("contain", "Sorry!")

            cy.get(
                "div > div > div > div > div > div.MuiSnackbarContent-action > button > span.MuiButton-label"
            ).click({ force: true })

            cy.get(notificationMessage).should("not.exist")
        })
    })

    describe("Responsive", function() {
        it("Appbar hides", function() {
            cy.viewport(599, 670)

            cy.get("header > div > button").eq(0).click()
        })
    })

    describe("Token refresh", function() {
        it("Refreshes old accesstoken", function() {
            cy.get("h2").should("contain", "spotttm")

            cy.get(playlistList).should(
                "contain",
                "cypress"
            )

            // // // // // // // // //

            cy.window()
                .its("store")
                .invoke("dispatch", {
                    type: "SET_TOKEN",
                    data: { accessToken: "invalid" }
                })

            cy.clearCookie("accesstoken")

            cy.reload()

            cy.get("h2").should("contain", "spotttm")

            cy.get(playlistList).should(
                "contain",
                "cypress"
            )

            // // // // // // // // //

            cy.window()
                .its("store")
                .invoke("dispatch", {
                    type: "SET_TOKEN",
                    data: { accessToken: "invalid" }
                })

            cy.clearCookie("accesstoken")

            cy.get(firstImage).click()

            cy.url().should("include", "/album/")

            cy.get("h2").should("contain", "Album")

            // // // // // // // // //

            cy.window()
                .its("store")
                .invoke("dispatch", {
                    type: "SET_TOKEN",
                    data: { accessToken: "invalid" }
                })

            cy.clearCookie("accesstoken")

            cy.get(playlistList)
                .contains("cypress_small")
                .click({ force: true })

            cy.url().should("include", "/playlist/")

            cy.get("h2").should("contain", "Playlist")

            cy.wait(1000)

            cy.get("h2").should("contain", "Playlist")
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
