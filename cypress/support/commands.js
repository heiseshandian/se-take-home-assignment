// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Example custom command
Cypress.Commands.add("login", (username, password) => {
  // Custom login command implementation
});

// Example overwrite of existing command
Cypress.Commands.overwrite("visit", (originalFn, url, options) => {
  // Custom visit command implementation
  return originalFn(url, options);
});
