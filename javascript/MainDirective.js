app.directive('d3chart', function(){

    let chartConfig = () =>{
        const margin = {top: 10, right: 10, bottom: 20, left: 40};
        let width = 1000, height = 500,
        svg, duration = 2000,
        dispatch = d3.dispatch('barHover');
        
        let config = (elements) => {

            elements.each(function(data) {

                const WIDTH = width - margin.left - margin.right,
                    HEIGHT = height - margin.top - margin.bottom;

                const xScale = d3.scale.ordinal()
                    .domain(data.map((d, i) => i))
                    .rangeRoundBands([0, WIDTH], .1);

                const yScale = d3.scale.linear()
                    .domain([ 0, d3.max(data, (d,i) => d) ])
                    .range([HEIGHT, 0]);

                const xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient('bottom');

                const yAxis = d3.svg.axis()
                    .scale(yScale)
                    .orient('left');

                svg = svg || d3.select(this)
                    .append('svg')
                    .classed('chart', true);

                let container = svg.append('g').classed('container-group',true)
                container.append('g').classed('chart-group', true)
                container.append('g').classed('x-axis-group axis', true)
                container.append('g').classed('y-axis-group axis', true);
            

                svg.transition().duration(duration)
                    .attr({width: width, height: height});

                svg.select('.container-group')
                    .attr({transform: 'translate(' + margin.left + ',' + margin.top + ')'});

                svg.select('.x-axis-group.axis')
                    .transition()
                    .duration(duration)
                    .ease('quad-in-out')
                    .attr({transform: 'translate(0,' + (HEIGHT) + ')'})
                    .call(xAxis);

                svg.select('.y-axis-group.axis')
                    .transition()
                    .duration(duration)
                    .ease('quad-in-out')
                    .call(yAxis);

                const barWidth = xScale.rangeBand();

                let bars = svg.select('.chart-group')
                    .selectAll('.bar')
                    .data(data);

                bars.enter().append('rect')
                    .classed('bar', true)
                    .attr({
                        x: WIDTH,
                        y: (d, i) => yScale(d),
                        width: barWidth,
                        height: (d, i) => HEIGHT - yScale(d)
                    })
                    .on('mouseover', dispatch.barHover);

                bars.transition()
                    .duration(duration)
                    .ease('quad-in-out')
                    .attr({
                        x: (d, i) => xScale(i),
                        y: (d, i) => yScale(d),
                        width: barWidth,
                        height: (d, i) => HEIGHT - yScale(d)
                    });

                bars.exit().remove();    
            });
        }

        d3.rebind(config, dispatch, 'on');
        return config; 
    }
    
    var chart = chartConfig();

    return {
        restrict: 'E',
        replace: true,
        template: '<div class="chart"></div>',
        scope:{
            data: '=data',
            hovered: '&hovered'
        },
        link: (scope, element, attrs) => {
            
            let elem = d3.select( element[0] );

            scope.$watch('data', ( updatedVal, oldData ) => {
                if((updatedVal !== undefined && updatedVal !== oldData) || oldData ) {
                        elem.datum( updatedVal ).call( chart ) 
                }
            });

            chart.on('barHover', (d) =>  scope.hovered( { args:d } ) );
        
        }
    }

    
});

app.directive("d3chartfooter", function() {

    return {
        restrict: 'E',
        replace: true,
        template: '<div class="hover-item"> Hovered Bar Data: {{barHoveredData}} </div>'
    }
});
    