# emailsignatures
Email Signatures is a javascript application that helps you create HTML signatures for your email clients


#Submit your own templates

To submit your own email signature html tempaltes, you need to create pull request with two new files:

1. `templateName.html` (Handlebars.js template)
2. `templateName.png`  (Your theme's thumbnail)

and update [templates.json](../blob/master/templates.json) file with your theme's and self information, in a schema like below:

```javascript
"Template Name": {
	"uri":"templateName",
	"url":"/templates/templateName.html",
    "description":"My professional, email signature templates",
    "socialnetworks":{ //Provide this property only if your theme supports social links
        "twitter":"fa fa-twitter-square",
        "facebook":"fa fa-facebook-square",
        "googleplus":"fa fa-google-plus-square"
    },
    "creator":{ //Developer's info go in here
        "name":"specktator",
        "site":"http://specktator.net",
        "socialmedia":{
            "twitter":"@specktator_",
            "gitHub":"@specktator",
            "facebook": "http://facebook.com/totallnoob"
        }
    }
}
```

## Template variables & Schema

In signature templates you can diplay any of the data below using this schema of user information.
In Ex. if you want to diplay user's name ("John Doe") you should use {{user.usersname.data}}

```javascript
	user:
	{
		greeting: {
			label: "Greeting",
			data: "Best regards",
			type: "text"
		},
		usersname : {
			label: "Full Name",
			data: "John Doe",
			type: "text"
		},
		jobtitle: {
			label: "Job Title",
			data: "CEO",
			type: "text"
		},
		logourl: {
			label: "Logo URL (Link to your logo)",
			data: "https://placehold.it/114x70?text=LOGO",
			type: "text"
		},
		company: {
			label: "Company Name",
			data: "My Company Name",
			type: "text"
		},
		address: {
			label: "Address",
			data: "Street 163 1512A",
			type: "text"
		},
		city: {
			label: "City",
			data: "Attica",
			type: "text"
		},
		stateprovince: {
			label: "State/Province",
			data: "Athens",
			type: "text"
		},
		postalcode: {
			label: "ZIP/Postal Code",
			data: "151 62",
			type: "text"
		},
		country: {
			label: "Country",
			data: "Greece",
			type: "text"
		},
		telephone: {
			label: "Telephone",
			data: "+30 123 123 123",
			text: "text"
		},
		mobile: {
			label: "Mobile",
			data: "+30 654 21 65 289",
			text: "text"
		},
		email: {
			label: "e-mail",
			data: "myMail@mycompany.com",
			type: "email"
		},
		website: {
			label: "website",
			data: "www.example.com",
			type: "text"
		},
		socialnetworks: { //Provide this property only if your theme supports social links 
			twitter: "http://twitter.com/specktator_",
			facebook: "http://twitter.com/specktator_",
			googleplus: "http://twitter.com/specktator_"
		},
		disclaimer: {
			label: "Disclaimer",
			data: "Important: This e-mail and its attachments are intended for the above named only and may be confidential. If they have come to you in error you must take no action based on them, nor must you copy or show them to anyone; please contact us immediately.",
			type: "text"
		}
	},
	modal:{
		socialmodal: {
		body: "",
		title: "Choose social network"
		}
	},
	socialicons:{ //default social icons using font awesome
		twitter:"fa fa-twitter-square",
		facebook:"fa fa-facebook-square",
		googleplus:"fa fa-google-plus-square"
	}
```