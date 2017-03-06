let url="https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json";
d3.json(url,function(data){draw(data.data);});
function draw(data){
	const margin = {top: 80, right: 100, bottom: 100, left: 100},width=1025-margin.left-margin.right,
	height=500-margin.top- margin.bottom,barWidth=width/data.length;

	//initiate the chart
	const chart = d3.select("svg")
								.attr("width",width+margin.left+margin.right)
								.attr("height",height+margin.top+margin.bottom)
								//.style("background-color","red")
							.append("g")
								.attr("transform","translate("+margin.left+","+margin.top+")");
	
	//set bar width and coordinates													
	const x=d3.scale.ordinal()
								.rangeRoundBands([0,width])
								.domain(data.map(function(d){return d[0];}));
								
	const y=d3.scale.linear()
								.domain([0, d3.max(data, function(d) { return d[1]; })])
								.range([height,0]);
	
	//append the bars
	const bar= chart.selectAll("g")			
				.data(data)
				.enter()
				.append("g")
				.attr("transform",function(d,i){return "translate("+x(d[0])+",0)";});
	
	//add mouseover event			
	bar.on("mouseover",function(d,i){
		console.log(d3.event);
		let xcoor=d3.event.offsetX-margin.left,ycoor=d3.event.offsetY-margin.top,hintHeight=50;
		chart.append("g")
					.attr("class","hint")
				.append("rect")
					.attr("x",xcoor)
					.attr("y",ycoor-hintHeight)
					.attr("width",100)
					.attr("height",hintHeight);
		d3.select(".hint")
				.append("text")
					.attr("x",xcoor+5)
					.attr("y",ycoor+20-hintHeight)
					.style("text-anchor", "start")
					.text(d[0]);
		d3.select(".hint")
				.append("text")
					.attr("x",xcoor+5)
					.attr("y",ycoor+40-hintHeight)
					.style("text-anchor", "start")
					.text(d[1]);
			
		});
		
	bar.on("mouseout",function(d,i){
			d3.select(".hint")
				.remove();
		});
		
	//add bars		
	bar.append("rect")	
		.attr("class","bar")
		.attr("y",function(d){return y(d[1])})
		.attr("width",x.rangeBand())
		.attr("height",function(d){return height-y(d[1]);});

	//add X axis
	var format = d3.time.format("%Y-%m-%d");
	const xticks=d3.time.scale()
											.domain([format.parse(data[0][0]),format.parse(data[data.length-1][0])])
											.rangeRound([0,width]);
	const axisx=d3.svg.axis()
									.scale(xticks)
									.ticks(20);									
	const xaxis=chart.append("g")
							.attr("class","x axis")
							.attr("transform","translate(0,"+height+")")
							.call(axisx);
							
	//add Y axis
	const axisy=d3.svg.axis()
									.scale(y)
									.orient("left")
									.ticks(10);
	const yaxis=chart.append("g")
										.attr("class","y axis")
										.call(axisy);
	//add Y axis captain
	chart.append("g")
				.append("text")
				.attr("x",-180)
				.attr("y",20)
				.attr("transform","rotate(-90)")
				.text("Units: Billions of Dollars");
				
	//add title and footer
	chart.append("g")
			.append("text")
				.attr("x",width/2)
				.attr("y",0)
				.attr("class","title")
				.style("text-anchor","middle")
				.text("Gross Domestic Product of USA");
	chart.append("g")
			.append("text")
				.attr("x",width/2)
				.attr("y",height+margin.bottom/2+20)
				.attr("class","footer")
				.style("text-anchor","middle")
				.text("Seasonal Adjustment: Seasonally Adjusted Annual Rate Notes: A Guide to the National Income and Product Accounts of the United States (NIPA) - ")
	chart.append("g")
			.append("text")
				.attr("x",width/2)
				.attr("y",height+margin.bottom/2+40)
				.attr("class","footer")
				.style("text-anchor","middle")	
				.text("(http://www.bea.gov/national/pdf/nipaguid.pdf)");
}