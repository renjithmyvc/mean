app.controller('CharityProfileCtrl', ['Charity', 'Donation', 'Auth', '$routeParams', '$sce', '$location',
    function(Charity, Donation, Auth, $routeParams, $sce, $location) {
  var currentActiveSlideIndex = 0;
  this.notEnoughYenomMessage = "You don't have enough Yenom to donate. Minimum Yenom Amount is 100";
  // charity donation step set to 1 initially
  this.step = 1;

  Charity.get({slug: $routeParams.slug}, function(res) {
    this.charity = res;
    this.mapUrl = this.getMapUrl();
    if (this.charity.images[0]) {
      this.charity.images[currentActiveSlideIndex]['active'] = true; 
    } 
  }.bind(this));

  this.getMapUrl = function() {
    return $sce.trustAsResourceUrl('https://maps.google.com/maps?q=' + this.charity.lat + ',' + this.charity.lng +'&hl=es;z=14&output=embed');
  };

  /** Carousel actions */
  this.next = function() {
    this.removeActive();
    currentActiveSlideIndex += 1;
    if (currentActiveSlideIndex >= this.charity.images.length) {
      currentActiveSlideIndex = 0;
    }
    this.charity.images[currentActiveSlideIndex]['active'] = true;  
  };

  this.prev = function() {
    this.removeActive();
    currentActiveSlideIndex -= 1;
    if (currentActiveSlideIndex < 0) {
      currentActiveSlideIndex = this.charity.images.length - 1;
    }
    this.charity.images[currentActiveSlideIndex]['active'] = true;
  };

  this.removeActive = function() {
    for (var i = 0; i < this.charity.images.length; i++) {
      delete this.charity.images[i]['active'];
    }
  };

  this.donate = function() {
    if (!Auth.currentUser()) {
      return;
    }
    if (this.amount < 100) {
      this.minAmountMessage = "Minimum Yenom Amount is 100";
      this.amount = 100;
      return;
    }
    var donation = {
      amount: this.amount,
      charityId: this.charity._id
    };
    Donation.save(donation, function(res) {
      Auth.saveToken(res.token);
      $location.path('donation/thankyou');
      return;
    });
  };

  this.validateDonationAmount = function() {
    this.minAmountMessage = "";
    if (!this.userCanDonate()) {
      this.minAmountMessage = this.notEnoughYenomMessage;
      return;
    }

    if (isNaN(this.amount)) {
      this.amount = null;
      return;
    }

    if (this.amount > Number(Auth.currentUser().approvedYenom)) {
      this.amount = Auth.currentUser().approvedYenom;
    }
  };

  this.userCanDonate = function() {
    if (!Auth.currentUser()) {
      return false;
    }
    return !(Number(Auth.currentUser().approvedYenom) < 100 ||
        isNaN(Number(Auth.currentUser().approvedYenom)))
  };

  this.goToStep2 = function() {
    if (this.amount < 100) {
      this.minAmountMessage = "Minimum Yenom Amount is 100";
      this.amount = 100;
      return;
    } else {
      this.step = 2;
    }
  };

}]);
