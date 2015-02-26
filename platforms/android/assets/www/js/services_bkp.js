angular.module('starter.services', [])

/**
 * A simple example service that returns some data.
 */
.factory('clientes', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var clientes = [
    { id: 0, nome: 'Scruff McGruff' },
    { id: 1, nome: 'G.I. Joe' },
    { id: 2, nome: 'Miss Frizzle' },
    { id: 3, nome: 'Ash Ketchum' }
  ];

  return {
    all: function() {
      return clientes;
    },
    get: function(clienteId) {
      // Simple index lookup
      return clientes[clienteId];
    }
  }
});
