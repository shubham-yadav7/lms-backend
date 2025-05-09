/*
------------------------------------
    : Custom - Form Selects js :
------------------------------------
*/
"use strict";
$(document).on( 'ready page:load', function() { 
    /* -- Form Select - Select2 -- */
    $('.select2-single').select2();
    $('.select2-multi-select').select2({
		placeholder: 'Choose',
    });
	$('.select2-multi-select').on("select2:select", function (evt) {
		var element = evt.params.data.element;
		var $element = $(element);
		
		$element.detach();
		$(this).append($element);
		$(this).trigger("change");
	});
    /* -- Form - Tags -- */
	var citynames = new Bloodhound({
		datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
		queryTokenizer: Bloodhound.tokenizers.whitespace,
		prefetch: {
			url: 'assets/plugins/bootstrap-tagsinput/citynames.json',
			filter: function(list) {
			  return $.map(list, function(cityname) {
			    return { name: cityname }; });
			}
		}
	});
	citynames.initialize();
	$('#tagsinput-typehead').tagsinput({
		typeaheadjs: {
			name: 'citynames',
			displayKey: 'name',
			valueKey: 'name',
			source: citynames.ttAdapter()
		}
	});
	var cities = new Bloodhound({
	  datumTokenizer: Bloodhound.tokenizers.obj.whitespace('text'),
	  queryTokenizer: Bloodhound.tokenizers.whitespace,
	  prefetch: 'assets/plugins/bootstrap-tagsinput/cities.json'
	});
	cities.initialize();
	var elt = $('#tagsinput-category');
	elt.tagsinput({
	  tagClass: function(item) {
	    switch (item.continent) {
	      case 'Europe'   : return 'label label-primary';
	      case 'America'  : return 'label label-danger label-important';
	      case 'Australia': return 'label label-success';
	      case 'Africa'   : return 'label label-default';
	      case 'Asia'     : return 'label label-warning';
	    }
	  },
	  itemValue: 'value',
	  itemText: 'text',
	  typeaheadjs: {
	    name: 'cities',
	    displayKey: 'text',
	    source: cities.ttAdapter()
	  }
	});
	elt.tagsinput('add', { "value": 1 , "text": "Amsterdam"   , "continent": "Europe"    });
	elt.tagsinput('add', { "value": 4 , "text": "Washington"  , "continent": "America"   });
	elt.tagsinput('add', { "value": 7 , "text": "Sydney"      , "continent": "Australia" });
	elt.tagsinput('add', { "value": 10, "text": "Beijing"     , "continent": "Asia"      });
	elt.tagsinput('add', { "value": 13, "text": "Cairo"       , "continent": "Africa"    });
});