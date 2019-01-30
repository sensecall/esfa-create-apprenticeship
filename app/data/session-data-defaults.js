/*

Provide default values for user session data. These are automatically added
via the `autoStoreData` middleware. Values will only be added to the
session if a value doesn't already exist. This may be useful for testing
journeys where users are returning or logging in to an existing application.

============================================================================

Example usage:

"full-name": "Sarah Philips",

"options-chosen": [ "foo", "bar" ]

============================================================================

*/

var moment = require('moment');

module.exports = {
	"current-date": moment().format('D'),
	"current-month": moment().format('MMMM'),
	"current-year": moment().format('YYYY'),
	"employer": "Assurance Aerospace Engineering",
	"multiple-legal-entities": "false",
	"funding-restrictions": [],
	"reservation-startRange": moment().startOf('month').format('DD MMMM YYYY'),
	"reservation-endRange": moment().add(2,'month').endOf('month').format('DD MMMM YYYY'),
	"course-name": "Unknown"
}
