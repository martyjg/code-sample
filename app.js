Index = {

	jobs : Data.jobs,
	newJobs : [],

	sortField : "priority",
	isDescending: true,

	init : function() {
		this.attachSortListeners();
		this.sortJobs();
	},

	attachSortListeners: function() {
		$(".sort_option").each(function() {
			$(this).on("click", function() {
				Index.updateSortDirection($(this).children(".sort_direction"));
				Index.setSortField($(this).attr("id"));
				Index.sortJobs();
			});
		});
	},

	updateSortDirection : function(targetDirection) {
		if ($(targetDirection).hasClass("descending")) {
			$(".sort_direction").removeClass("descending ascending").empty();
			$(targetDirection).addClass("ascending").text("(descending)");
			Index.isDescending = false;
		} else {
			$(".sort_direction").removeClass("descending ascending").empty();
			$(targetDirection).removeClass("ascending").addClass("descending").text("(ascending)");
			Index.isDescending = true;
		}
	},

	setSortField : function(targetField) {
		this.sortField = targetField;
	},

	sortJobs : function() {

		this.jobs = this.jobs.sort(function(a, b) {
			if (Index.sortField === "priority") {
				return Index.sortByPriority(a, b);
			} else if (Index.sortField === "title") {
				return Index.sortByTitle(a, b);
			} else {
				let sortField = Index.sortField + "Order";
				return Index.sortByAnything(a, b, sortField);
			}
		});

		this.renderJobs();
	},

	sortByDate : function(a, b) {
        if (Index.isDescending) {
            return (b.createdAtTimestamp) - (a.createdAtTimestamp);
        } else {
            return (a.createdAtTimestamp) - (b.createdAtTimestamp);
        }
	},

	sortByPriority : function(a, b) {
		if (a.priorityOrder === b.priorityOrder) {
			return Index.sortByDate(a, b);
		} else if (Index.isDescending) {
			return a.priorityOrder - b.priorityOrder;
		} else {
			return b.priorityOrder - a.priorityOrder;
		}
	},

	sortByAnything : function(a, b, prop) {
		console.log(prop);
		if (a[prop] === b[prop]) {
			return Index.sortByPriority(a, b);
		} else if (Index.isDescending) {
			return a[prop] - b[prop];
		} else {
			return b[prop] - a[prop];
		}
	},

	sortByTitle : function(a, b) {
		var upperA = a.title.toUpperCase();
		var upperB = b.title.toUpperCase();
		if (upperA === upperB) {
			return Index.sortByPriority(a, b);
		} else if (Index.isDescending) {
			if (upperA < upperB) return -1;
			if (upperA > upperB) return 1;
			return 0;
		} else {
			if (upperA > upperB) return -1;
			if (upperA < upperB) return 1;
			return 0;
		}
	},

	renderJobs : function() {

		$(".jobs_index").empty();

		for (i = 0; i < this.jobs.length; i++) {

			$(".jobs_index").append(
				"<li>" + 
					"<div class='job_title_location_wrapper'>" +
						"<div class='job_title'>" + this.jobs[i].title + "</div>" +
						"<div>" + this.jobs[i].location + "</div>" +
					"</div>" +
					"<div class='job_priority_wrapper'>" + 
						"<div>" + this.jobs[i].priority + "</div>" +
						"<div class='job_priority_indicator " + this.jobs[i].priority + "'></div>" +
					"</div>"  +
				"</li>"
			)

		}
	}
}

$(document).ready(function(){Index.init()});