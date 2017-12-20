import BackBone from 'backbone';
import $ from 'jquery';
// import LibMovie from '../models/lib_movie';

const RentalView = BackBone.View.extend({

initialize(params) {
  console.log('inside RentalView initalize');
  this.bus = params.bus;
  // this.allCustomers = params.allCustomers;
  this.listenTo(this.bus, 'pass_movie_name', this.addMovieToCheckout);
},


render() {
  console.log('Getting all customers');
  $.get('http://localhost:3000/customers?sort=name', (data) => {
    console.log(data);

    const allCustomers = data;
    allCustomers.forEach((customer) => {
      this.$('select[name="customer-name"]').append(`<option data-id="${customer.id}">${customer.name}</option>`)
    });
  });
  return this;
},

addMovieToCheckout(title) {
  // now have title of movie
  console.log("Message recieved in addMovieToCheckout");
  console.log(title);
  // add movie title to rental form input
  // this.$('#movie-title-selector').autofill({
  //   "movie-title": title,
  });
  // append(`value="${title}"`)
  // console.log(test);
  // test.append(title);
},

});

export default RentalView;
