const Sentry = require("@sentry/node");
Sentry.init({
    dsn: "https://ff36add9428744bf98293d77593f1420@sentry.io/1806823",
});

module.exports = Sentry;
