import Backbone from 'backbone';

const Rental = Backbone.Model.extend({
  // defaults
  // validations
  // custom method
  url: () => `http://localhost:3000/rentals/`,
});

export default Rental;
