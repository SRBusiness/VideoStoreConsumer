import BackBone from 'backbone';
import $ from 'jquery';
import Rental from '../models/rental';

const RentalView = BackBone.View.extend({

initialize(params) {
  console.log('inside RentalView initalize');
  this.model = params.model;
  this.bus = params.bus;
  // this.allCustomers = params.allCustomers;
  this.listenTo(this.bus, 'pass_movie_name', this.addMovieTitleToCheckoutForm);
},
events: {
  'click input.btn-check-out': 'rentMovie',
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

addMovieTitleToCheckoutForm(title) {
  // now have title of movie
  console.log("Message recieved in addMovieToCheckout");
  console.log(title);

  //TODO: scroll up not working
  // this.$('#rental-view').animate({ scrollTop: 0 }, "slow");
  // this.$('#rental-view').scrollTop(0);

  this.$('#movie-title-selector').val(title)
},

rentMovie(event) {
  event.preventDefault();

  let modelAttributes = this.getFormDataMakeObj();
  console.log('model attributes');
  console.log(modelAttributes);



  // client side validation
  const newRental = new Rental(modelAttributes);
  if (!newRental.isValid()) {
    console.log(`trip is not valid!`);
    statusUpdate(newRental.validationError);
    return;
  }

  // tripList.add(trip);

  // server side validation

  //send post request to Rails API
  newRental.save({}, {
    success: (model, response) => {
      console.log('Successfully rented movie');
      this.statusUpdate(`Successfully checked out the movie ${model.attributes.title} to customer # ${model.attributes.customer_id}`)
    },
    error: (model, response) => {
      console.log('Failed to rent movie');
      this.statusUpdate(response.responseJSON['errors']['title']);
      console.log(response.responseJSON['errors']['title']);
    },
  });
},

// helper function to grab form data and return obj attributes
getFormDataMakeObj(){
  console.log('in getFormDataMakeObj method');
  // get customer ID and title out of form
  const customerID = this.$('form#check-out-form select').find(":selected").attr('data-id');
  console.log(customerID);
  const title = this.$('form#check-out-form input').val();
  console.log(title);

  //create new rental
  console.log('addMovieToCheckout model:');

  let dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 14);

  const modelAttributes = {
    title: title,
    customer_id: customerID,
    due_date: dueDate,
  };
  return modelAttributes
},

statusUpdate(message) {
  // clear messages
  console.log('inside statusUpdate');

  const formattedMessage = `<p>${message}</p>`;
  this.$('#rental-messages').append(formattedMessage);
},

clearStatus(){
  this.$('#rental-messages').html('');
},

});

export default RentalView;
