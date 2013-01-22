OCEmber = Ember.Application.create({});

OCEmber.ApplicationView = Ember.View.extend({
  templateName: 'application'
});
OCEmber.ApplicationController = Ember.Controller.extend();

OCEmber.ContributorsController = Ember.ArrayController.extend();
OCEmber.ContributorsView = Ember.View.extend({
  templateName: 'contributors'
});

// OCEmber.ContributorView = Ember.View.extend({
//   templateName: 'contributor'
// });
// OCEmber.ContributorController = Ember.ObjectController.extend();

// OCEmber.DetailsView = Ember.View.extend({
//   templateName: 'contributor-details'
// });
// OCEmber.ReposView = Ember.View.extend({
//     templateName: 'repos'
// });

OCEmber.Contributor = Ember.Object.extend({
  loadMoreDetails: function(){
    $.ajax({
      url: 'https://api.github.com/users/%@'.fmt(this.get('login')),
      context: this,
      dataType: 'jsonp',
      success: function(response){
        this.setProperties(response.data);
      }
    })
  }, 
  loadRepos: function(){
      $.ajax({
        url: 'https://api.github.com/users/%@/repos'.fmt(this.get('login')),
        context: this,
        dataType: 'jsonp',
        success: function(response){
          this.set('repos',response.data);
        }
    });
  }
});
OCEmber.Contributor.reopenClass({
  allContributors: [],
  find: function(){
    $.ajax({
      url: 'https://api.github.com/repos/emberjs/ember.js/contributors',
      dataType: 'jsonp',
      context: this,
      success: function(response){
        console.log('grabbing datas');
        this.allContributors.addObjects(
            response.data.map(function(raw){
                return OCEmber.Contributor.create(raw);
            })
        );
      }
    })
    return this.allContributors;
    console.log("this " + allContributors);
  }, 
  findOne: function(username){
    var contributor = OCEmber.Contributor.create({
      login: username
    });

    $.ajax({
      url: 'https://api.github.com/repos/emberjs/ember.js/contributors',
      dataType: 'jsonp',
      context: contributor,
      success: function(response){
        this.setProperties(response.data.filterProperty('login', username));
      }
    });
    return contributor;
  } 
});


OCEmber.Router.map(function(){
	this.resource("contributors", {path: '/'});
	//this.resource('contributor', {path: '/:githubUserName'});//function(){
	// 	this.route('details');
	// 	this.route('repos');
	// });

});

OCEmber.ContributorsRoute = Ember.Route.extend({
  model: function(){
    console.log("i can haz contributors");
    return OCEmber.Contributor.find();
  }
});

// App.ContributorRoute = Ember.Route.extend({
// 	model: function(params){
// 		return App.Contributor.findOne(params.githubUserName); 
// 	},
//   setupController: function(controller, model) {
//     controller.set('content', model);
//   }
// });

// App.Router = Ember.Router.extend({
//     enableLogging: true,
//     root: Ember.Route.extend({
//         contributors: Ember.Route.extend({
//             route: '/',
//             //Events
//             showContributor: Ember.Route.transitionTo('aContributor'),

//             connectOutlets: function(router){
//                 router.get('applicationController').connectOutlet(
//                     'allContributors', App.Contributor.find());
//             }
//         }),
//         aContributor: Ember.Route.extend({
//             route: '/:githubUserName',
//             showAllContributors: Ember.Route.transitionTo('contributors'),
//             showDetails: Ember.Route.transitionTo('details'),
//             showRepos: Ember.Route.transitionTo('repos'),
//             connectOutlets: function(router, context){
//                 router.get('applicationController').connectOutlet(
//                     'oneContributor', context);        
//             },
//             serialize: function(router, context){
//                 return {githubUserName: context.get('login')};
//             },
//             deserialize: function(router, urlParams){
//                 return App.Contributor.findOne(urlParams.githubUserName);
//             }, 
//             // child states
//     initialState: 'details',
//     details: Ember.Route.extend({
//       route: '/',
//       connectOutlets: function(router){
//           router.get('oneContributorController.content').loadMoreDetails();
//           router.get('oneContributorController').connectOutlet('details');
//       }
//     }),
//     repos: Ember.Route.extend({
//       route: '/repos',
//       connectOutlets: function(router){
//         router.get('oneContributorController.content').loadRepos();  
//         router.get('oneContributorController').connectOutlet('repos');
//       }
//     })
//         })
//     })
// });

OCEmber.initialize();
