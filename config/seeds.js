var mongoose = require('mongoose');
var Store = mongoose.model('Store');
var Charity = mongoose.model('Charity');
var Invite = mongoose.model('Invite');

var createStores = function() {
  Store.count(function(err, count) {
    var stores = [
      {name: 'Flipkart', imageUrl: 'images/flipkart.png', bgColor: '#fad406', redirectUrl: '//flipkart.com/[user]'},
      //{name: 'Amazon', imageUrl: 'images/amazon.png', bgColor: '#ffffff', redirectUrl: '//amazon.com//[user]'},
      {name: 'Snapdeal', imageUrl: 'images/snapdeal.png', bgColor: '#50daff', redirectUrl: '//snapdeal.com/[user]'},
      //{name: 'Book my Show', imageUrl: 'images/bookmyshow.png', bgColor: '#ffffff', redirectUrl: '//bookmyshow.com/[user]'},
    ];
    if (count == 0) {
      for (var i = 0; i < stores.length; i++) {
        var store = new Store(stores[i]);
        store.save();
      }
    }
  });
};

createStores();


// charities
var createCharities = function() {
  Charity.count(function(err, count) {
    if (count == 0) {
      var charities = [
        {
          name: 'Make a Difference',
          abbreviation: 'MAD',
          slug: 'make-a-difference',
          description: 'Lorem ipsum dolor sit amet, summo blandit ei nam, ius percipit accusata conclusionem que ea, ancillae mediocrem eaLorem ipsum dolor sit amet, summo blandit ei nam, ius percipit accusata conclusionem que ea, ancillae mediocrem ea',
          imageUrl: 'images/md-logo.png',
          lat: '17.462210',
          lng: '78.356849',
          contact: '+91 776643213',
          website: 'www.makeadifference.org',
          images: [
            {url: 'images/carousel-img1.png', caption: 'Lorem Ipsum'},
            {url: 'images/carousel-img1.png', caption: 'Lorem Ipsum dolor'}
          ],
          persons: [
            {name: 'JOHN DOE', designation: 'ceo', email: 'johndoe@mad.org'},
            {name: 'JOHN DOE', designation: 'ceo', email: 'johndoe@mad.org'},
            {name: 'JOHN DOE', designation: 'ceo', email: 'johndoe@mad.org'}
          ]
        },
          {
          name: 'Child Rights and You',
          abbreviation: 'CRY',
          slug: 'child-rights-and-you',
          description: 'Lorem ipsum dolor sit amet, summo blandit ei nam, ius percipit accusata conclusionem que ea, ancillae mediocrem eaLorem ipsum dolor sit amet, summo blandit ei nam, ius percipit accusata conclusionem que ea, ancillae mediocrem ea',
          imageUrl: 'images/cry-logo.png',
          lat: '17.462210',
          lng: '78.356849',
          contact: '+91 776643213',
          website: 'www.cry.org',
          images: [
            {url: 'images/carousel-img1.png', caption: 'Lorem Ipsum'},
            {url: 'images/carousel-img1.png', caption: 'Lorem Ipsum dolor'}
          ],
          persons: [
            {name: 'JOHN DOE', designation: 'ceo', email: 'johndoe@mad.org'},
            {name: 'JOHN DOE', designation: 'ceo', email: 'johndoe@mad.org'},
            {name: 'JOHN DOE', designation: 'ceo', email: 'johndoe@mad.org'}
          ]
        },
        {
          name: 'Dandu Foundation',
          abbreviation: 'Dandu Foundation',
          slug: 'dandu-foundation',
          description: 'Lorem ipsum dolor sit amet, summo blandit ei nam, ius percipit accusata conclusionem que ea, ancillae mediocrem eaLorem ipsum dolor sit amet, summo blandit ei nam, ius percipit accusata conclusionem que ea, ancillae mediocrem ea',
          imageUrl: 'images/dandu-foundation.png',
          lat: '17.462210',
          lng: '78.356849',
          contact: '+91 776643213',
          website: 'www.facebook.com/Dandu-S-Foundation',
          images: [
            {url: 'images/carousel-img1.png', caption: 'Lorem Ipsum'},
            {url: 'images/carousel-img1.png', caption: 'Lorem Ipsum dolor'}
          ],
          persons: [
            {name: 'JOHN DOE', designation: 'ceo', email: 'johndoe@mad.org'},
            {name: 'JOHN DOE', designation: 'ceo', email: 'johndoe@mad.org'},
            {name: 'JOHN DOE', designation: 'ceo', email: 'johndoe@mad.org'}
          ]
        },
        {
          name: 'Samanvaya',
          abbreviation: 'samanvaya',
          slug: 'samanvaya',
          description: 'Lorem ipsum dolor sit amet, summo blandit ei nam, ius percipit accusata conclusionem que ea, ancillae mediocrem eaLorem ipsum dolor sit amet, summo blandit ei nam, ius percipit accusata conclusionem que ea, ancillae mediocrem ea',
          imageUrl: 'images/samanvaya.png',
          lat: '17.462210',
          lng: '78.356849',
          contact: '+91 776643213',
          website: 'www.samanvaya.org',
          images: [
            {url: 'images/carousel-img1.png', caption: 'Lorem Ipsum'},
            {url: 'images/carousel-img1.png', caption: 'Lorem Ipsum dolor'}
          ],
          persons: [
            {name: 'JOHN DOE', designation: 'ceo', email: 'johndoe@mad.org'},
            {name: 'JOHN DOE', designation: 'ceo', email: 'johndoe@mad.org'},
            {name: 'JOHN DOE', designation: 'ceo', email: 'johndoe@mad.org'}
          ]
        }
      ];
      for (var i = 0; i < charities.length; i++) {
        var charity = new Charity(charities[i]);
        charity.save();
      }
    }
  });
};

createCharities();

// Create Invite
var createInvite = function() {
  Invite.count(function(err, count) {
    if (count == 0) {
      var invite = new Invite({});
      invite.setInviteCode();
      console.log("INVITE Invite Code: " + invite.inviteCode);
      invite.save();
    }
  });
};

createInvite();
