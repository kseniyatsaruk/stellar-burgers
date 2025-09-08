const API_URL = Cypress.env('BURGER_API_URL');

const bunID = '643d69a5c3f7b9001cfa093c';
const mainID = '643d69a5c3f7b9001cfa0941';
const sauceID = '643d69a5c3f7b9001cfa0942';

const checkEmptyConstructor = () => {
  cy.get('[data-cy=no_bun_top]').contains('Выберите булки');
  cy.get('[data-cy=no_bun_bottom]').contains('Выберите булки');
  cy.get('[data-cy=no_ingredients]').contains('Выберите начинку');
};

const addIngredient = (id: string) => {
  cy.get(`[data-cy=ingredient_${id}]`).contains('Добавить').click();
};

beforeEach(() => {
  window.localStorage.setItem('refreshToken', 'testRefreshToken');
  cy.setCookie('accessToken', 'testAccessToken');

  cy.fixture('ingredients.json').then((ingredients) => {
    cy.intercept(
      { method: 'GET', url: `${API_URL}/ingredients` },
      { body: ingredients }
    ).as('getIngredients');
  });

  cy.fixture('order.json').then((orders) => {
    cy.intercept(
      { method: 'POST', url: `${API_URL}/orders` },
      { body: orders }
    ).as('postOrder');
  });

  cy.fixture('user.json').then((user) => {
    cy.intercept(
      { method: 'GET', url: `${API_URL}/auth/user` },
      { body: user }
    ).as('getUser');
  });

  cy.visit('/');
  cy.wait('@getIngredients');
});

afterEach(() => {
  cy.clearAllCookies();
  cy.clearAllLocalStorage();
});

describe("Burger Constructor tests", () => {
  it('сервис доступен по адресу localhost:4000', () => { });

  it("добавление булки и начинки в конструктор", () => {
    checkEmptyConstructor();
    addIngredient(bunID);

    cy.get("[data-cy=bun_top]").should("contain", "Краторная булка N-200i");
    cy.get("[data-cy=bun_bottom]").should("contain", "Краторная булка N-200i");

    addIngredient(mainID);

    cy.get("[data-cy=ingredient]").should("contain", "Биокотлета из марсианской Магнолии");
  });

  it("открытие и закрытие модалки ингредиента", () => {
    cy.get(`[data-cy=ingredient_${bunID}]`).click();
    cy.get("[data-cy=modal]").should("exist");
    cy.get("[data-cy=modal]").should("contain", "Краторная булка N-200i");

    cy.get("[data-cy=modal_close]").click();
    cy.get("[data-cy=modal]").should("not.exist");

    cy.get(`[data-cy=ingredient_${bunID}]`).click();
    cy.get("[data-cy=modal]").should("exist");
    cy.get("[data-cy=modal]").should("contain", "Краторная булка N-200i");

    cy.get("[data-cy=modal_overlay]").click({ force: true });
    cy.get("[data-cy=modal]").should("not.exist");
  });

  it("создание заказа", () => {
    addIngredient(bunID);
    addIngredient(mainID);
    addIngredient(sauceID);
    
    cy.get('[data-cy=new_order]').contains("Оформить заказ").click();
    cy.wait('@postOrder');
    cy.get("[data-cy=modal]").should("exist");
    cy.get("[data-cy=new_order_number]").should("contain", "87017");

    cy.get("[data-cy=modal_close]").click();
    cy.get("[data-cy=modal]").should("not.exist");

    checkEmptyConstructor();
  });
});
