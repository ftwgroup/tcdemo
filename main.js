var pieChartsApp = function(myWindow) {
	if (typeof myWindow == "undefined")
		var myWindow = window;

	// returns data object formatted for use by d3
	function getDataset() {
		// TODO: abstracted to allow future XHR data retrieval from a server
		// now, just grabs the var defined in the main page.
		var dataset = tcDemoDataset;
		return dataset;
	}

	function buildBreadcrumb(frameIndex, dataset) {
		var txt = [], separator = " > ", i=0;
		do {
			txt.push(dataset.titles[i]);
		} while(i++ < frameIndex);

	    $("#breadcrumb-label").html(txt.join(separator));
	}

	function changePieGraph(clickData) {
		var dataset = getDataset();

		if (typeof dataset.titles[nClicks] == "undefined") {
			nClicks = 0;
		}
		frameIndex = nClicks;

//		clearTimeout(timeout);
		var frameValues = dataset.values[frameIndex],
			frameTitle = dataset.titles[frameIndex],
			frameLabels = dataset.labels[frameIndex];
		console.log(frameIndex, frameValues, frameTitle, frameLabels);

		// Build pie arcs from VALUES dataset
		var g = arc_group.selectAll("arc")
			.data(mainPie(frameValues))
			.enter()
			.append("g")
			.attr("class", "arc");
		g.append("path") //.transition().duration(0).attrTween("d", arcTween)
	        .attr("d", arc)
	        .style("fill", function(d, i) { return color(i); });
		//path.transition().duration(750).attrTween("d", arcTween);

		// Text labels e.g. "North America"
	    g.append("text")
	      .attr("transform", function(d) { return "translate(" + (arc.centroid(d)) + ")"; })
	      .attr("dy", ".25em")
	      .style("text-anchor", "middle")
	      .style("font-size", ".75em")
	      .text(function(d, i) {
	    	  //console.log(d, i);
	    	  var txt = frameLabels[i] ? frameLabels[i] + " " + d.value + "%" : "";
	    	  return txt;
    	  });

	    // Text Label values e.g. "15%"
	    // how to do?
//	    g.append("text")
//	      .attr("transform", function(d) {
//	    	  return "translate(" + (arc.centroid(d) + 14) + ")";
//	      })
//	      .attr("dy", ".25em")
//	      .style("text-anchor", "middle")
//	      .text(function(d, i) {
//	    	  console.log(d, i);
//	    	  return d.value + "%";
//	      });

	    buildBreadcrumb(frameIndex, dataset);

	    arc_group.selectAll(".arc")
			.on("click", changePieGraph);
	    nClicks++;
	}

	// Store the displayed angles in _current.
	// Then, interpolate from _current to the new angles.
	// During the transition, _current is updated in-place by d3.interpolate.
	function arcTween(a) {
		var i = d3.interpolate(this._current, a);
		this._current = i(0);
		return function(t) {
			return arc(i(t));
		};
	}

	function run() {
		changePieGraph(null);
	}

	/**
	 * Begin main routine
	 */
	var width = 960,
		height = 500,
		radius = Math.min(width, height) / 2;
	var color = d3.scale.category20();
	var mainPie = d3.layout.pie().sort(null);
	var nClicks = 0;

	var vis = d3.select("#pie-chart").append("svg")
		.attr("width", width)
		.attr("height", height);

	// GROUP FOR ARCS/PATHS
	var arc_group = vis.append("svg:g")
	  .attr("class", "arc")
	  .attr("transform", "translate(" + (width/2) + "," + (height/2) + ")");

	var arc = d3.svg.arc().innerRadius(radius - 100).outerRadius(0);

	// Public interface
	return {
		run : run
	};
};

/**
 * Page-specific code
 */
var tcDemoDataset = {
	titles: ["Geography", "Asset Class Exposure",
	 	"Sub-Asset Class Exposure", "Fund Exposure", "Portfolio Companies"],
	labels: [
	    ["Asia", "Europe", "North America"],
	    ["Venture Capital", "Special Situations", "Corporate Finance"],
		["Small Corporate Finance", "Medium Corporate Finance", "Large Corporate Finance" ],
		["EQT III", "Blackstone V", "Apollo IV", "NEA IX"],
		["Company 1", "Company 2", "Company 3", "Company 4", "Company 5",]
	],
	values: [
		[5, 15, 80,0,0],
		[15, 25, 60,0,0],
//        [{"Asia":5}, {"Europe":15}, {"North America":80}],
//        [{"Venture Capital":15, "Special Situations":25, "Corporate Finance":60}],
		[20, 30, 50,0,0],
		[30, 30, 35, 15],
		[10,10,10,30,20]
	/*
	  geography: [5,15,80,0,0,0], portfolioCompanies:
	  [15,12,20,15,16,22], assetClassExposure: [15,25,60,0,0,0],
	  subAssetClassExposure: [20,30,50,0,0,0], fundExposure:
	  [15,30,30,35,0,0]
	 */
	]
// TODO: (IF) need to amend arctween function to remove slices and
// append as needed (versus placeholder 0s)
};


var tcDemo = pieChartsApp();
tcDemo.run();
